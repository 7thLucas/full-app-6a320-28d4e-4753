import path from "node:path";
import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { createLogger } from "~/lib/logger";

const logger = createLogger("Models");
const modelFilePattern = /\.model\.(ts|tsx|js|mjs|cjs)$/;

async function discoverModelFiles(): Promise<string[]> {
  const appPath = path.join(process.cwd(), "app");
  const modelFilesSet = new Set<string>();

  // Scan app/modules/* (existing convention)
  const modulesPath = path.join(appPath, "modules");
  const moduleEntries = await readdir(modulesPath, { withFileTypes: true }).catch((error) => {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  });

  for (const entry of moduleEntries) {
    if (!entry.isDirectory()) continue;
    const modulePath = path.join(modulesPath, entry.name);
    const scanPaths = [modulePath, path.join(modulePath, "src", "models")];
    for (const scanPath of scanPaths) {
      const files = await readdir(scanPath, { withFileTypes: true }).catch(() => []);
      for (const file of files) {
        if (file.isFile() && modelFilePattern.test(file.name)) {
          modelFilesSet.add(path.join(scanPath, file.name));
        }
      }
    }
  }

  // Scan app/leads/src/models (app-level modules outside app/modules/)
  const extraScanRoots = [
    path.join(appPath, "leads", "src", "models"),
  ];

  for (const scanPath of extraScanRoots) {
    const files = await readdir(scanPath, { withFileTypes: true }).catch(() => []);
    for (const file of files) {
      if (file.isFile() && modelFilePattern.test(file.name)) {
        modelFilesSet.add(path.join(scanPath, file.name));
      }
    }
  }

  return [...modelFilesSet].sort();
}

/**
 * Initialize all discovered models by importing them.
 * This ensures that Typegoose/Mongoose models are registered.
 */
export async function initializeModels(): Promise<void> {
  const modelFiles = await discoverModelFiles();

  for (const modelFile of modelFiles) {
    logger.info(`Initializing model from ${path.relative(process.cwd(), modelFile)}`);
    await import(pathToFileURL(modelFile).href);
  }
}
