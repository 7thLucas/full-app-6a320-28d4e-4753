# Product Overview — The Curated Co

## Product Identity

- **Name**: The Curated Co
- **Tagline**: Your outreach command center
- **Brand tone**: Clean, editorial, refined — understated and professional

## What It Is

A solo-founder lead tracking app for direct outreach to creative businesses. The owner identifies and contacts potential clients across three categories; the app records each contact's interest level, surfaces who to follow up with next, and keeps the outreach pipeline clear and actionable.

This is **not** a team CRM — it's one person's outreach nerve centre: minimal, focused, and action-first.

## Users

- **Primary user**: Solo founder / operator running their own outreach
- **Role**: Single user — does all prospecting, outreach, follow-up, and closing themselves

## Target Clients (the leads tracked in the app)

- **Interior designers** — independent design studios and freelance designers
- **Restaurants** — independent and local restaurant operators
- **Fashion boutiques** — independent retail clothing and accessory boutiques

These are local, independent creative businesses the founder approaches directly.

## Brand Palette

| Role | Hex | Usage |
|---|---|---|
| Deep brown | `#2d2420` | Primary CTA, dark panels, header accents |
| Taupe | `#7c6b52` | Section labels, secondary text, borders |
| Gold | `#c9a87c` | Highlight accents, interest indicators |
| Warm off-white | `#FAFAF8` | App background |
| Parchment | `#f5ede0` | Icon backgrounds, soft fills |

## Built Feature Set (MVP — shipped)

### Lead Model
Each lead stores: name, company, vertical (interior designer / restaurant / fashion boutique), interest level (Hot / Warm / Cold), contact info, last contacted date, timestamped notes array, and an archived flag.

### Core Views
- **Vertical filter tabs** — All / Interior Designers / Restaurants / Fashion Boutiques; each vertical is filtered and worked separately
- **Lead cards** — name, interest badge (Hot / Warm / Cold), last contacted date, latest note snippet; overdue leads surface a red dot
- **Sort order** — overdue leads first, then Hot → Warm → Cold within each group
- **Stats bar** — total leads, overdue count, per-interest breakdown at a glance

### Actions
- **Add lead** — floating "+" button opens a modal; new lead added in ~10 seconds
- **Log touchpoint** — inline note entry on the lead detail modal; auto-updates last contacted date
- **Inline edit** — all lead fields editable in-modal
- **Archive** — removes a lead from the active pipeline without deletion

### API Surface
- `GET/POST /api/leads` — list and create
- `GET/PUT/DELETE /api/leads/:id` — read, update, archive
- `GET /api/leads/stats` — pipeline summary counts
- `GET /api/leads/follow-up` — overdue / due-today queue
- `POST /api/leads/:id/notes` — append a touchpoint note

### Seed Data
8 pre-loaded leads across all three verticals so the pipeline is non-empty on first boot.

## Positioning

- **For**: Solo outreach operators in the creative and lifestyle business space
- **Not for**: Sales teams, enterprise CRM workflows, marketing automation
- **Scope boundary**: Single user, three lead categories, action-oriented views only
- **Design feel**: Editorial, refined, curated — matches the aesthetic of the client businesses served

## Strategic Principles

1. **Always surface the next action** — the founder should know their #1 follow-up at a glance
2. **Three buckets, not one pile** — interior designers, restaurants, and boutiques behave differently; keep them separated
3. **Interest over volume** — quality of signal matters more than number of contacts logged
4. **Reduce decision fatigue** — never show a full undifferentiated list when a ranked priority view will do
