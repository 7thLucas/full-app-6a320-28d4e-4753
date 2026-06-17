import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { modelOptions as mo } from "@typegoose/typegoose";

export type InterestLevel = "hot" | "warm" | "cold";
export type LeadVertical = "Interior Designers" | "Restaurants" | "Fashion Boutiques";

export class LeadNote {
  @prop({ type: String, required: true })
  text!: string;

  @prop({ type: Date, required: true, default: () => new Date() })
  createdAt!: Date;
}

@modelOptions({
  schemaOptions: {
    collection: "tbl_leads",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Lead extends TimeStamps {
  @prop({ type: String, required: true })
  name!: string;

  @prop({ type: String, required: true })
  vertical!: string;

  @prop({ type: String, required: true, enum: ["hot", "warm", "cold"], default: "warm" })
  interestLevel!: InterestLevel;

  @prop({ type: String, required: false, default: "" })
  contactInfo?: string;

  @prop({ type: String, required: false, default: "" })
  company?: string;

  @prop({ type: Date, required: false })
  lastContactedAt?: Date;

  @prop({ type: Date, required: false })
  nextFollowUpAt?: Date;

  @prop({ type: () => [LeadNote], required: false, default: [] })
  notes?: LeadNote[];

  @prop({ type: Boolean, required: false, default: false })
  archived?: boolean;
}

export const LeadModel = getModelForClass(Lead);
