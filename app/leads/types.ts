export type InterestLevel = "hot" | "warm" | "cold";

export type LeadNote = {
  text: string;
  createdAt: string; // ISO date string from JSON
};

export type Lead = {
  _id: string;
  name: string;
  vertical: string;
  interestLevel: InterestLevel;
  contactInfo?: string;
  company?: string;
  lastContactedAt?: string | null;
  nextFollowUpAt?: string | null;
  notes?: LeadNote[];
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type LeadStats = {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  overdue: number;
};
