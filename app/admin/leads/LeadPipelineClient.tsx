"use client";

import { useState } from "react";
import type { Lead } from "@/lib/db/schema";

const STAGES = [
  "new",
  "contacted",
  "code_issued",
  "registered",
  "redeemed",
  "paid",
  "dropped",
] as const;

type Stage = (typeof STAGES)[number];

const STAGE_COLORS: Record<Stage, string> = {
  new: "bg-gray-100 text-gray-700",
  contacted: "bg-blue-100 text-blue-700",
  code_issued: "bg-yellow-100 text-yellow-700",
  registered: "bg-indigo-100 text-indigo-700",
  redeemed: "bg-purple-100 text-purple-700",
  paid: "bg-green-100 text-green-700",
  dropped: "bg-red-100 text-red-700",
};

interface Props {
  leads: Lead[];
  codesByLead: Record<string, string>;
}

export default function LeadPipelineClient({ leads: initialLeads, codesByLead }: Props) {
  const [leads, setLeads] = useState(initialLeads);
  const [filter, setFilter] = useState<Stage | "all">("all");
  const [issuingId, setIssuingId] = useState<string | null>(null);

  const filtered = filter === "all" ? leads : leads.filter((l) => l.stage === filter);

  async function changeStage(leadId: string, stage: Stage) {
    const res = await fetch(`/api/admin/leads/${leadId}/stage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    if (res.ok) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, stage } : l))
      );
    }
  }

  async function issueCode(leadId: string) {
    setIssuingId(leadId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/issue-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = (await res.json()) as { code?: string };
      if (json.code) {
        alert(`โค้ด: ${json.code}`);
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, stage: "code_issued" } : l))
        );
      }
    } finally {
      setIssuingId(null);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lead Pipeline</h1>
        <div className="text-sm text-gray-500">{leads.length} leads ทั้งหมด</div>
      </div>

      {/* Stage filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${filter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          ทั้งหมด ({leads.length})
        </button>
        {STAGES.map((s) => {
          const count = leads.filter((l) => l.stage === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${filter === s ? "bg-gray-900 text-white" : `${STAGE_COLORS[s]} hover:opacity-80`}`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">ชื่อ / อีเมล</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Source</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Stage</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">โค้ด</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">วันที่</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{lead.name ?? "—"}</p>
                  <p className="text-xs text-gray-500">{lead.email ?? lead.fb_psid ?? lead.line_user_id ?? "—"}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{lead.source}</td>
                <td className="px-4 py-3">
                  <select
                    value={lead.stage}
                    onChange={(e) => changeStage(lead.id, e.target.value as Stage)}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer border-0 ${STAGE_COLORS[lead.stage as Stage] ?? "bg-gray-100"}`}
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  {codesByLead[lead.id] ? (
                    <span className="font-mono text-xs bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded">
                      {codesByLead[lead.id]}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {lead.created_at.slice(0, 10)}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => issueCode(lead.id)}
                    disabled={issuingId === lead.id}
                    className="rounded px-2 py-1 text-xs bg-violet-50 text-violet-700 hover:bg-violet-100 disabled:opacity-50 transition-colors"
                  >
                    {issuingId === lead.id ? "..." : "ออกโค้ด"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  ไม่พบ lead
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
