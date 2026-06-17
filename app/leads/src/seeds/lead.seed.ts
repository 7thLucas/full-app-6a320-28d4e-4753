import { LeadModel } from "../models/lead.model";

export async function seedLeads() {
  const count = await LeadModel.countDocuments();
  if (count > 0) {
    console.log("[LeadSeed] Leads already seeded, skipping.");
    return;
  }

  const now = new Date();
  const daysAgo = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d;
  };

  const sampleLeads = [
    {
      name: "Lena Hartmann",
      company: "Hartmann Interiors",
      vertical: "Interior Designers",
      interestLevel: "hot",
      contactInfo: "lena@hartmanninteriors.com",
      lastContactedAt: daysAgo(2),
      notes: [
        { text: "Had a great intro call. Very interested in our textile line. Following up with samples.", createdAt: daysAgo(2) },
      ],
    },
    {
      name: "Marcus Reyes",
      company: "Studio Forme",
      vertical: "Interior Designers",
      interestLevel: "warm",
      contactInfo: "@studioforme",
      lastContactedAt: daysAgo(5),
      notes: [
        { text: "Opened my DM, asked about minimum order quantities.", createdAt: daysAgo(5) },
      ],
    },
    {
      name: "Café Solano",
      company: "Café Solano",
      vertical: "Restaurants",
      interestLevel: "hot",
      contactInfo: "hi@cafesolano.com",
      lastContactedAt: daysAgo(1),
      notes: [
        { text: "Owner loved the table linen samples. Asked for pricing sheet.", createdAt: daysAgo(1) },
      ],
    },
    {
      name: "The Verdant Table",
      company: "The Verdant Table",
      vertical: "Restaurants",
      interestLevel: "warm",
      contactInfo: "info@verdanttable.co",
      lastContactedAt: daysAgo(9),
      notes: [
        { text: "Left voicemail. They seemed interested last time we met at the market.", createdAt: daysAgo(9) },
      ],
    },
    {
      name: "Nour Al-Rashid",
      company: "Maison Nour",
      vertical: "Restaurants",
      interestLevel: "cold",
      contactInfo: "nour@maisonnour.com",
      lastContactedAt: daysAgo(21),
      notes: [
        { text: "Not ready to commit yet. Said to check back in Q3.", createdAt: daysAgo(21) },
      ],
    },
    {
      name: "Fleur Boutique",
      company: "Fleur Boutique",
      vertical: "Fashion Boutiques",
      interestLevel: "hot",
      contactInfo: "hello@fleurboutique.com",
      lastContactedAt: daysAgo(3),
      notes: [
        { text: "Placed a small test order. Great sign — follow up on reorder next week.", createdAt: daysAgo(3) },
      ],
    },
    {
      name: "Atelier Mira",
      company: "Atelier Mira",
      vertical: "Fashion Boutiques",
      interestLevel: "warm",
      contactInfo: "@ateliermira",
      lastContactedAt: daysAgo(12),
      notes: [
        { text: "Responded positively to the lookbook. Slow to commit — send a gentle nudge.", createdAt: daysAgo(12) },
      ],
    },
    {
      name: "Sophie Leclair",
      company: "Leclair Studio",
      vertical: "Interior Designers",
      interestLevel: "cold",
      contactInfo: "sophie@leclairistudio.fr",
      lastContactedAt: null as unknown as Date,
      notes: [],
    },
  ];

  await LeadModel.insertMany(sampleLeads);
  console.log(`[LeadSeed] Seeded ${sampleLeads.length} sample leads.`);
}
