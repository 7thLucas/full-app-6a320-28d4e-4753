# Design Guidelines — The Curated Co

## Visual Identity
- Aesthetic: Editorial minimalism — think a luxury brand's internal tool
- Clean whitespace, tight typography, subtle borders
- No gradients, no shadows heavy — just structure and clarity

## Color Palette
- Background: #FAFAF8 (warm off-white)
- Surface / Card: #FFFFFF
- Primary Accent: #1A1A1A (near black — for headings, CTAs)
- Secondary Accent: #C9A96E (warm gold — for highlights, interest badges)
- Muted Text: #6B6B6B
- Border: #E5E5E0
- Status Colors:
  - Hot: #D94F3D (warm red)
  - Warm: #E8944A (amber)
  - Cold: #9BAFB8 (cool slate blue)
  - Follow-up Overdue: #D94F3D with subtle background tint

## Typography
- Font: Inter (clean, neutral, readable)
- Headings: 600 weight, tight tracking
- Body: 400 weight, comfortable line-height
- Labels/Tags: uppercase, 0.08em letter-spacing, small size

## Elevation & Structure
- Minimal elevation — flat cards with 1px borders (#E5E5E0)
- Section dividers via spacing, not lines
- Rounded corners: 8px on cards, 6px on tags/badges

## Components
- Lead Card: compact, shows name, vertical, interest badge, last contact date, and a one-line note
- Interest Badge: colored pill (Hot / Warm / Cold) with label
- Follow-up Queue: sorted list of who to contact next — overdue flagged prominently
- Vertical Filter Tabs: Interior Designers / Restaurants / Fashion Boutiques / All
- Quick Log Modal: tap a lead → log a note + update status in under 10 seconds
- Empty States: simple, encouraging — "No leads yet. Add your first one."

## Anti-references
- Not Salesforce, HubSpot, or any CRM with dashboards overload
- No dark mode for now
- No charts or analytics — just actionable lists
