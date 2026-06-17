import { useState, useEffect, useCallback } from "react";
import { useConfigurables } from "~/modules/configurables";
import type { Lead, LeadStats, InterestLevel } from "~/leads/types";
import {
  Plus,
  RefreshCw,
  ChevronRight,
  Clock,
  Flame,
  Thermometer,
  Snowflake,
  X,
  Check,
} from "lucide-react";

// ─── Utility ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "Never";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isOverdue(dateStr?: string | null, thresholdDays = 7): boolean {
  if (!dateStr) return true;
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= thresholdDays;
}

// ─── Interest Badge ────────────────────────────────────────────────────────────

const interestConfig: Record<InterestLevel, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  hot: {
    label: "Hot",
    bg: "bg-[#D94F3D]/10",
    text: "text-[#D94F3D]",
    icon: <Flame size={10} strokeWidth={2.5} />,
  },
  warm: {
    label: "Warm",
    bg: "bg-[#E8944A]/10",
    text: "text-[#E8944A]",
    icon: <Thermometer size={10} strokeWidth={2.5} />,
  },
  cold: {
    label: "Cold",
    bg: "bg-[#9BAFB8]/10",
    text: "text-[#9BAFB8]",
    icon: <Snowflake size={10} strokeWidth={2.5} />,
  },
};

function InterestBadge({ level }: { level: InterestLevel }) {
  const cfg = interestConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[10px] font-semibold tracking-[0.08em] uppercase",
        cfg.bg,
        cfg.text
      )}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── Lead Card ────────────────────────────────────────────────────────────────

function LeadCard({
  lead,
  overdueDays,
  onSelect,
}: {
  lead: Lead;
  overdueDays: number;
  onSelect: (lead: Lead) => void;
}) {
  const overdue = isOverdue(lead.lastContactedAt, overdueDays);
  const latestNote = lead.notes && lead.notes.length > 0 ? lead.notes[lead.notes.length - 1] : null;

  return (
    <button
      onClick={() => onSelect(lead)}
      className={cn(
        "w-full text-left bg-white border rounded-[8px] px-4 py-3.5 flex items-start gap-3 transition-all duration-150",
        "hover:border-[#C9A96E]/60 hover:shadow-sm active:scale-[0.99]",
        overdue ? "border-[#D94F3D]/30" : "border-[#E5E5E0]"
      )}
    >
      {/* Overdue indicator dot */}
      <div className="mt-1.5 flex-shrink-0">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            overdue ? "bg-[#D94F3D]" : "bg-[#E5E5E0]"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-[#1A1A1A] truncate">{lead.name}</span>
          <InterestBadge level={lead.interestLevel} />
        </div>

        {lead.company && lead.company !== lead.name && (
          <p className="text-xs text-[#6B6B6B] mb-1 truncate">{lead.company}</p>
        )}

        {latestNote && (
          <p className="text-xs text-[#6B6B6B] truncate leading-relaxed">{latestNote.text}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-[#9B9B96] uppercase tracking-wide">{lead.vertical}</span>
          <span
            className={cn(
              "text-[10px]",
              overdue ? "text-[#D94F3D] font-medium" : "text-[#9B9B96]"
            )}
          >
            {overdue && "! "}
            {formatDate(lead.lastContactedAt)}
          </span>
        </div>
      </div>

      <div className="self-center text-[#C9A96E] flex-shrink-0">
        <ChevronRight size={14} />
      </div>
    </button>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ stats }: { stats: LeadStats }) {
  return (
    <div className="flex items-center gap-4 text-xs text-[#6B6B6B]">
      <span className="font-semibold text-[#1A1A1A] text-sm">{stats.total}</span>
      <span>leads</span>
      {stats.overdue > 0 && (
        <>
          <span className="text-[#E5E5E0]">·</span>
          <span className="text-[#D94F3D] font-medium flex items-center gap-1">
            <Clock size={11} />
            {stats.overdue} overdue
          </span>
        </>
      )}
      <span className="text-[#E5E5E0]">·</span>
      <span className="text-[#D94F3D]">{stats.hot} hot</span>
      <span className="text-[#E8944A]">{stats.warm} warm</span>
      <span className="text-[#9BAFB8]">{stats.cold} cold</span>
    </div>
  );
}

// ─── Add Lead Modal ────────────────────────────────────────────────────────────

const defaultFormState = {
  name: "",
  company: "",
  vertical: "Interior Designers",
  interestLevel: "warm" as InterestLevel,
  contactInfo: "",
};

function AddLeadModal({
  open,
  onClose,
  onSave,
  verticals,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: typeof defaultFormState) => Promise<void>;
  verticals: string[];
}) {
  const [form, setForm] = useState(defaultFormState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm({ ...defaultFormState, vertical: verticals[0] || "Interior Designers" });
  }, [open, verticals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-[12px] border border-[#E5E5E0] w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#E5E5E0]">
          <h2 className="text-sm font-semibold text-[#1A1A1A] tracking-tight">New Lead</h2>
          <button onClick={onClose} className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B] mb-1.5 font-semibold">Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Contact name"
              required
              className="w-full text-sm text-[#1A1A1A] border border-[#E5E5E0] rounded-[6px] px-3 py-2.5 outline-none focus:border-[#C9A96E] placeholder-[#C4C4C0] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B] mb-1.5 font-semibold">Company</label>
            <input
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              placeholder="Business name (optional)"
              className="w-full text-sm text-[#1A1A1A] border border-[#E5E5E0] rounded-[6px] px-3 py-2.5 outline-none focus:border-[#C9A96E] placeholder-[#C4C4C0] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B] mb-1.5 font-semibold">Vertical *</label>
              <select
                value={form.vertical}
                onChange={(e) => setForm((f) => ({ ...f, vertical: e.target.value }))}
                className="w-full text-sm text-[#1A1A1A] border border-[#E5E5E0] rounded-[6px] px-3 py-2.5 outline-none focus:border-[#C9A96E] bg-white appearance-none"
              >
                {verticals.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B] mb-1.5 font-semibold">Interest *</label>
              <select
                value={form.interestLevel}
                onChange={(e) => setForm((f) => ({ ...f, interestLevel: e.target.value as InterestLevel }))}
                className="w-full text-sm text-[#1A1A1A] border border-[#E5E5E0] rounded-[6px] px-3 py-2.5 outline-none focus:border-[#C9A96E] bg-white appearance-none"
              >
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B] mb-1.5 font-semibold">Contact Info</label>
            <input
              value={form.contactInfo}
              onChange={(e) => setForm((f) => ({ ...f, contactInfo: e.target.value }))}
              placeholder="Email, phone, or @handle"
              className="w-full text-sm text-[#1A1A1A] border border-[#E5E5E0] rounded-[6px] px-3 py-2.5 outline-none focus:border-[#C9A96E] placeholder-[#C4C4C0] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !form.name.trim()}
            className="w-full bg-[#1A1A1A] text-white text-sm font-semibold rounded-[8px] py-3 disabled:opacity-50 hover:bg-[#333] active:scale-[0.99] transition-all"
          >
            {saving ? "Adding..." : "Add Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Lead Detail Modal ─────────────────────────────────────────────────────────

function LeadDetailModal({
  lead,
  onClose,
  onUpdate,
  onDelete,
  verticals,
}: {
  lead: Lead;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Lead> & { newNote?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  verticals: string[];
}) {
  const [noteText, setNoteText] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: lead.name,
    company: lead.company || "",
    vertical: lead.vertical,
    interestLevel: lead.interestLevel,
    contactInfo: lead.contactInfo || "",
  });

  const handleLogNote = async () => {
    if (!noteText.trim()) return;
    setSaving(true);
    try {
      await onUpdate(lead._id, { newNote: noteText });
      setNoteText("");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await onUpdate(lead._id, editForm);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-[12px] border border-[#E5E5E0] w-full max-w-md shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[#E5E5E0] flex-shrink-0">
          <div className="flex-1 min-w-0 pr-3">
            {editing ? (
              <input
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="text-base font-semibold text-[#1A1A1A] w-full border-b border-[#C9A96E] outline-none pb-0.5"
              />
            ) : (
              <h2 className="text-base font-semibold text-[#1A1A1A] truncate">{lead.name}</h2>
            )}
            {!editing && lead.company && lead.company !== lead.name && (
              <p className="text-xs text-[#6B6B6B] mt-0.5">{lead.company}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-[#C9A96E] font-medium hover:text-[#a88650] transition-colors"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="text-xs text-[#1A1A1A] font-semibold hover:text-[#C9A96E] transition-colors"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
                >
                  <X size={14} />
                </button>
              </>
            )}
            <button onClick={onClose} className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B] font-semibold mb-1.5">Vertical</p>
              {editing ? (
                <select
                  value={editForm.vertical}
                  onChange={(e) => setEditForm((f) => ({ ...f, vertical: e.target.value }))}
                  className="text-sm text-[#1A1A1A] border border-[#E5E5E0] rounded-[6px] px-2 py-1.5 w-full outline-none focus:border-[#C9A96E] bg-white appearance-none"
                >
                  {verticals.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              ) : (
                <p className="text-sm text-[#1A1A1A]">{lead.vertical}</p>
              )}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B] font-semibold mb-1.5">Interest</p>
              {editing ? (
                <select
                  value={editForm.interestLevel}
                  onChange={(e) => setEditForm((f) => ({ ...f, interestLevel: e.target.value as InterestLevel }))}
                  className="text-sm text-[#1A1A1A] border border-[#E5E5E0] rounded-[6px] px-2 py-1.5 w-full outline-none focus:border-[#C9A96E] bg-white appearance-none"
                >
                  <option value="hot">Hot</option>
                  <option value="warm">Warm</option>
                  <option value="cold">Cold</option>
                </select>
              ) : (
                <InterestBadge level={lead.interestLevel} />
              )}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B] font-semibold mb-1.5">Contact</p>
            {editing ? (
              <input
                value={editForm.contactInfo}
                onChange={(e) => setEditForm((f) => ({ ...f, contactInfo: e.target.value }))}
                placeholder="Email, phone, or @handle"
                className="text-sm text-[#1A1A1A] border border-[#E5E5E0] rounded-[6px] px-3 py-2 w-full outline-none focus:border-[#C9A96E] placeholder-[#C4C4C0]"
              />
            ) : (
              <p className="text-sm text-[#1A1A1A]">{lead.contactInfo || <span className="text-[#C4C4C0]">—</span>}</p>
            )}
          </div>

          {/* Last contacted */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B] font-semibold mb-1.5">Last Contacted</p>
            <p className="text-sm text-[#1A1A1A]">{formatDate(lead.lastContactedAt)}</p>
          </div>

          {/* Log a touchpoint */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B] font-semibold mb-1.5">Log Touchpoint</p>
            <div className="flex gap-2">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleLogNote()}
                placeholder="What happened? Updates last contacted date."
                className="flex-1 text-sm text-[#1A1A1A] border border-[#E5E5E0] rounded-[6px] px-3 py-2.5 outline-none focus:border-[#C9A96E] placeholder-[#C4C4C0] transition-colors"
              />
              <button
                onClick={handleLogNote}
                disabled={saving || !noteText.trim()}
                className="bg-[#1A1A1A] text-white text-xs font-semibold rounded-[6px] px-3 py-2.5 disabled:opacity-40 hover:bg-[#333] transition-all flex-shrink-0"
              >
                Log
              </button>
            </div>
          </div>

          {/* Notes history */}
          {lead.notes && lead.notes.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#6B6B6B] font-semibold mb-2">History</p>
              <div className="space-y-2">
                {[...lead.notes].reverse().map((note, i) => (
                  <div key={i} className="bg-[#FAFAF8] border border-[#E5E5E0] rounded-[6px] px-3 py-2.5">
                    <p className="text-sm text-[#1A1A1A] leading-relaxed">{note.text}</p>
                    <p className="text-[10px] text-[#9B9B96] mt-1">
                      {new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 pb-5 pt-3 border-t border-[#E5E5E0] flex-shrink-0">
          <button
            onClick={() => onDelete(lead._id)}
            className="w-full text-xs text-[#D94F3D] font-medium hover:bg-[#D94F3D]/5 rounded-[6px] py-2 transition-colors"
          >
            Archive Lead
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

function FilterTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-px" style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
      {["All", ...tabs].map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-[6px] transition-all whitespace-nowrap",
            active === tab
              ? "bg-[#1A1A1A] text-white"
              : "text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#E5E5E0]/60"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function IndexPage() {
  const { config, loading: configLoading } = useConfigurables();

  const appName = config?.appName || "The Curated Co";
  const tagline = config?.tagline || "Your outreach, organized.";
  const logoUrl = config?.logoUrl;
  const verticals = config?.verticals || ["Interior Designers", "Restaurants", "Fashion Boutiques"];
  const overdueDays = config?.followUpDaysThreshold || 7;
  const emptyMsg = config?.emptyStateMessage || "No leads yet. Add your first one.";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats>({ total: 0, hot: 0, warm: 0, cold: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeTab !== "All" ? `?vertical=${encodeURIComponent(activeTab)}` : "";
      const [leadsRes, statsRes] = await Promise.all([
        fetch(`/api/leads${params}`),
        fetch("/api/leads/stats"),
      ]);
      const leadsData = await leadsRes.json();
      const statsData = await statsRes.json();
      if (leadsData.success) setLeads(leadsData.data);
      if (statsData.success) setStats(statsData.data);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleAddLead = async (form: {
    name: string;
    company: string;
    vertical: string;
    interestLevel: InterestLevel;
    contactInfo: string;
  }) => {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    await fetchLeads();
  };

  const handleUpdateLead = async (id: string, data: Partial<Lead> & { newNote?: string }) => {
    const { newNote, ...rest } = data;
    if (newNote) {
      await fetch(`/api/leads/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newNote }),
      });
    } else {
      await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rest),
      });
    }
    // Refresh and update selected lead
    const res = await fetch(`/api/leads/${id}`);
    const updated = await res.json();
    if (updated.success) {
      setSelectedLead(updated.data);
      setLeads((prev) => prev.map((l) => (l._id === id ? updated.data : l)));
    }
    await fetchLeads();
  };

  const handleDeleteLead = async (id: string) => {
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setSelectedLead(null);
    await fetchLeads();
  };

  // Sort: hot first, then warm, then cold; overdue first within each group
  const sortedLeads = [...leads].sort((a, b) => {
    const order: Record<InterestLevel, number> = { hot: 0, warm: 1, cold: 2 };
    const aOverdue = isOverdue(a.lastContactedAt, overdueDays) ? 0 : 1;
    const bOverdue = isOverdue(b.lastContactedAt, overdueDays) ? 0 : 1;
    if (aOverdue !== bOverdue) return aOverdue - bOverdue;
    return order[a.interestLevel] - order[b.interestLevel];
  });

  if (configLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-[#6B6B6B] text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E5E0] sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {logoUrl && logoUrl !== "FILL_LOGO_URL_HERE" && (
              <img src={logoUrl} alt={appName} className="h-7 w-7 object-contain rounded" />
            )}
            <div>
              <h1 className="text-base font-semibold text-[#1A1A1A] tracking-tight leading-tight">{appName}</h1>
              <p className="text-[10px] text-[#9B9B96] leading-none">{tagline}</p>
            </div>
          </div>
          <button
            onClick={fetchLeads}
            className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors p-1"
            aria-label="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Stats */}
        {!loading && stats.total > 0 && <StatsBar stats={stats} />}

        {/* Filter tabs */}
        <FilterTabs tabs={verticals} active={activeTab} onChange={setActiveTab} />

        {/* Leads list */}
        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-[#E5E5E0] rounded-[8px] px-4 py-3.5 h-20 animate-pulse" />
              ))}
            </div>
          ) : sortedLeads.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#6B6B6B] text-sm">{emptyMsg}</p>
            </div>
          ) : (
            sortedLeads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                overdueDays={overdueDays}
                onSelect={setSelectedLead}
              />
            ))
          )}
        </div>
      </main>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#1A1A1A] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-[#333] active:scale-95 transition-all"
          aria-label="Add lead"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddLead}
        verticals={verticals}
      />

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleUpdateLead}
          onDelete={handleDeleteLead}
          verticals={verticals}
        />
      )}
    </div>
  );
}
