import { LeadModel } from "../models/lead.model";
import type { InterestLevel } from "../models/lead.model";

export interface CreateLeadDto {
  name: string;
  vertical: string;
  interestLevel: InterestLevel;
  contactInfo?: string;
  company?: string;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
}

export interface UpdateLeadDto {
  name?: string;
  vertical?: string;
  interestLevel?: InterestLevel;
  contactInfo?: string;
  company?: string;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
  archived?: boolean;
}

export interface AddNoteDto {
  text: string;
}

export class LeadService {
  static async getAll(filters: {
    vertical?: string;
    interestLevel?: string;
    archived?: boolean;
  } = {}) {
    const query: Record<string, any> = {};

    if (filters.vertical && filters.vertical !== "All") {
      query.vertical = filters.vertical;
    }
    if (filters.interestLevel) {
      query.interestLevel = filters.interestLevel;
    }
    // Default: not archived
    query.archived = filters.archived ?? false;

    const leads = await LeadModel.find(query).sort({ updatedAt: -1 }).lean();
    return leads;
  }

  static async getFollowUpQueue(overdueDays: number = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - overdueDays);

    // Overdue: lastContactedAt is older than cutoff and not archived
    const overdue = await LeadModel.find({
      archived: { $ne: true },
      $or: [
        { lastContactedAt: { $lt: cutoff } },
        { lastContactedAt: { $exists: false } },
        { lastContactedAt: null },
      ],
    })
      .sort({ interestLevel: 1, lastContactedAt: 1 })
      .lean();

    return overdue;
  }

  static async getById(id: string) {
    return LeadModel.findById(id).lean();
  }

  static async create(dto: CreateLeadDto) {
    const lead = new LeadModel({
      ...dto,
      notes: [],
      archived: false,
    });
    return lead.save();
  }

  static async update(id: string, dto: UpdateLeadDto) {
    return LeadModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean();
  }

  static async addNote(id: string, dto: AddNoteDto) {
    return LeadModel.findByIdAndUpdate(
      id,
      {
        $push: {
          notes: {
            text: dto.text,
            createdAt: new Date(),
          },
        },
        $set: {
          lastContactedAt: new Date(),
        },
      },
      { new: true }
    ).lean();
  }

  static async delete(id: string) {
    return LeadModel.findByIdAndDelete(id);
  }

  static async archive(id: string) {
    return LeadModel.findByIdAndUpdate(id, { $set: { archived: true } }, { new: true }).lean();
  }

  static async getStats() {
    const total = await LeadModel.countDocuments({ archived: false });
    const hot = await LeadModel.countDocuments({ archived: false, interestLevel: "hot" });
    const warm = await LeadModel.countDocuments({ archived: false, interestLevel: "warm" });
    const cold = await LeadModel.countDocuments({ archived: false, interestLevel: "cold" });

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const overdue = await LeadModel.countDocuments({
      archived: false,
      $or: [
        { lastContactedAt: { $lt: cutoff } },
        { lastContactedAt: { $exists: false } },
        { lastContactedAt: null },
      ],
    });

    return { total, hot, warm, cold, overdue };
  }
}
