import type { Request, Response } from "express";
import { LeadService } from "../services/lead.service";

export async function getLeads(req: Request, res: Response) {
  try {
    const { vertical, interestLevel } = req.query;
    const leads = await LeadService.getAll({
      vertical: vertical as string | undefined,
      interestLevel: interestLevel as string | undefined,
    });
    return res.json({ success: true, data: leads });
  } catch (error) {
    console.error("getLeads error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch leads" });
  }
}

export async function getFollowUpQueue(req: Request, res: Response) {
  try {
    const days = req.query.days ? parseInt(req.query.days as string) : 7;
    const leads = await LeadService.getFollowUpQueue(days);
    return res.json({ success: true, data: leads });
  } catch (error) {
    console.error("getFollowUpQueue error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch follow-up queue" });
  }
}

export async function getLead(req: Request, res: Response) {
  try {
    const lead = await LeadService.getById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    return res.json({ success: true, data: lead });
  } catch (error) {
    console.error("getLead error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch lead" });
  }
}

export async function createLead(req: Request, res: Response) {
  try {
    const { name, vertical, interestLevel, contactInfo, company, lastContactedAt, nextFollowUpAt } = req.body;
    if (!name || !vertical || !interestLevel) {
      return res.status(400).json({ success: false, message: "name, vertical, and interestLevel are required" });
    }
    const lead = await LeadService.create({
      name,
      vertical,
      interestLevel,
      contactInfo,
      company,
      lastContactedAt: lastContactedAt ? new Date(lastContactedAt) : undefined,
      nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt) : undefined,
    });
    return res.status(201).json({ success: true, data: lead });
  } catch (error) {
    console.error("createLead error:", error);
    return res.status(500).json({ success: false, message: "Failed to create lead" });
  }
}

export async function updateLead(req: Request, res: Response) {
  try {
    const { name, vertical, interestLevel, contactInfo, company, lastContactedAt, nextFollowUpAt, archived } = req.body;
    const lead = await LeadService.update(req.params.id, {
      name,
      vertical,
      interestLevel,
      contactInfo,
      company,
      lastContactedAt: lastContactedAt ? new Date(lastContactedAt) : undefined,
      nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt) : undefined,
      archived,
    });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    return res.json({ success: true, data: lead });
  } catch (error) {
    console.error("updateLead error:", error);
    return res.status(500).json({ success: false, message: "Failed to update lead" });
  }
}

export async function addNote(req: Request, res: Response) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "text is required" });
    const lead = await LeadService.addNote(req.params.id, { text });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    return res.json({ success: true, data: lead });
  } catch (error) {
    console.error("addNote error:", error);
    return res.status(500).json({ success: false, message: "Failed to add note" });
  }
}

export async function deleteLead(req: Request, res: Response) {
  try {
    await LeadService.delete(req.params.id);
    return res.json({ success: true, message: "Lead deleted" });
  } catch (error) {
    console.error("deleteLead error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete lead" });
  }
}

export async function getStats(_req: Request, res: Response) {
  try {
    const stats = await LeadService.getStats();
    return res.json({ success: true, data: stats });
  } catch (error) {
    console.error("getStats error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
}
