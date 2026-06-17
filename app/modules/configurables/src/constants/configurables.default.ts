/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  primary: string;
  secondary: string;
  accent: string;
};

export type TStatusColors = {
  hot: string;
  warm: string;
  cold: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  brandColor: TBrandColor;
  tagline?: string;
  followUpDaysThreshold?: number;
  verticals?: string[];
  statusColors?: TStatusColors;
  emptyStateMessage?: string;
  welcomeMessage?: string;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "The Curated Co",
  logoUrl: "FILL_LOGO_URL_HERE",
  brandColor: {
    primary: "#1A1A1A",
    secondary: "#C9A96E",
    accent: "#FAFAF8",
  },
  tagline: "Your outreach, organized.",
  followUpDaysThreshold: 7,
  verticals: ["Interior Designers", "Restaurants", "Fashion Boutiques"],
  statusColors: {
    hot: "#D94F3D",
    warm: "#E8944A",
    cold: "#9BAFB8",
  },
  emptyStateMessage: "No leads yet. Add your first one.",
  welcomeMessage: "Here's who to reach out to next.",
};
