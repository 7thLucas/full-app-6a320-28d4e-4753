import { Router } from "express";
import {
  getLeads,
  getFollowUpQueue,
  getLead,
  createLead,
  updateLead,
  addNote,
  deleteLead,
  getStats,
} from "../controllers/lead.controller";

const router = Router();

router.get("/api/leads/stats", getStats);
router.get("/api/leads/follow-up", getFollowUpQueue);
router.get("/api/leads", getLeads);
router.get("/api/leads/:id", getLead);
router.post("/api/leads", createLead);
router.put("/api/leads/:id", updateLead);
router.post("/api/leads/:id/notes", addNote);
router.delete("/api/leads/:id", deleteLead);

export default router;
