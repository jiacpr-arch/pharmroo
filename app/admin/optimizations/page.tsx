"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Sparkles, Shield } from "lucide-react";

interface Flag {
  metric: string;
  observed: number | null;
  threshold: number;
  severity: "warn" | "critical";
}

interface Aggregate {
  impressions?: number;
  clicks?: number;
  ctr?: number;
  spend_thb?: number;
  conversions?: number;
  cpa_thb?: number | null;
}

interface Reason {
  flags?: Flag[];
  aggregate?: Aggregate;
  detected_at?: string;
}

interface ProposalChange {
  field: string;
  new_value: string;
  rationale?: string;
}

interface Proposal {
  summary?: string;
  changes?: ProposalChange[];
  confidence?: number;
  risk_level?: string;
  guardrail_violations?: { rule: string; field: string; evidence: string }[];
}

interface Run {
  id: string;
  status: string;
  trigger: string;
  reason: Reason | null;
  proposal: Proposal | null;
  applied_variant_id: string | null;
  error: string | null;
  created_at: string;
  completed_at: string | null;
  landing_path: string;
  landing_name: string;
  auto_optimize: boolean;
}

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  proposed: "bg-blue-100 text-blue-800",
  applied: "bg-emerald-100 text-emerald-800",
  rejected: "bg-gray-200 text-gray-700",
  rolled_back: "bg-orange-100 text-orange-800",
  failed: "bg-red-100 text-red-800",
};

export default function OptimizationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAdmin = role === "admin";

  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    fetch("/api/admin/optimizations")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setRuns(data.runs ?? []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAdmin, reloadKey]);

  const refresh = () => setReloadKey((k) => k + 1);

  async function act(runId: string, action: "approve" | "reject" | "rollback") {
    setActing(runId);
    await fetch("/api/admin/optimizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ run_id: runId, action }),
    });
    setActing(null);
    refresh();
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold">ไม่มีสิทธิ์เข้าถึง</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand" /> Ad-driven Optimizations
          </h1>
          <p className="text-muted-foreground mt-1">
            ระบบ auto-optimize landing page ตามผลโฆษณา
          </p>
        </div>
        <Button onClick={refresh} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : runs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            ยังไม่มี optimization runs — รอ cron จับ underperformer
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {runs.map((run) => (
            <Card key={run.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{run.landing_name}</h3>
                      <Badge variant="outline">{run.landing_path}</Badge>
                      {run.auto_optimize && (
                        <Badge className="bg-purple-100 text-purple-700">auto</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {run.trigger} · {run.created_at}
                    </p>
                  </div>
                  <Badge className={STATUS_COLOR[run.status] ?? ""}>{run.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {run.reason?.flags && run.reason.flags.length > 0 && (
                  <div>
                    <div className="font-medium mb-1">Flags</div>
                    <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                      {run.reason.flags.map((f, i) => (
                        <li key={i}>
                          <span className="font-mono">{f.metric}</span>
                          {" = "}
                          {f.observed !== null ? f.observed.toFixed(4) : "?"}
                          {" (threshold "}
                          {f.threshold}, {f.severity})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {run.reason?.aggregate && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-xs">
                    <Metric label="imp" value={run.reason.aggregate.impressions} />
                    <Metric label="clicks" value={run.reason.aggregate.clicks} />
                    <Metric label="ctr" value={run.reason.aggregate.ctr?.toFixed(4)} />
                    <Metric label="spend฿" value={run.reason.aggregate.spend_thb?.toFixed(0)} />
                    <Metric label="conv" value={run.reason.aggregate.conversions} />
                    <Metric label="cpa฿" value={run.reason.aggregate.cpa_thb?.toFixed(0)} />
                  </div>
                )}

                {run.proposal && (
                  <div>
                    <div className="font-medium mb-1">Proposal</div>
                    <p className="text-muted-foreground mb-2">{run.proposal.summary}</p>
                    {run.proposal.changes?.map((c, i) => (
                      <div key={i} className="border-l-2 border-brand pl-3 py-1 mb-2">
                        <div className="text-xs font-mono text-muted-foreground">{c.field}</div>
                        <div className="font-medium">{c.new_value}</div>
                        {c.rationale && (
                          <div className="text-xs text-muted-foreground mt-0.5">{c.rationale}</div>
                        )}
                      </div>
                    ))}
                    {run.proposal.guardrail_violations &&
                      run.proposal.guardrail_violations.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded p-2 text-xs">
                          <div className="font-semibold text-red-800 mb-1">
                            Guardrail violations
                          </div>
                          {run.proposal.guardrail_violations.map((v, i) => (
                            <div key={i} className="text-red-700">
                              {v.rule} on {v.field}: {v.evidence}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                )}

                {run.error && (
                  <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">
                    {run.error}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {run.status === "proposed" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => act(run.id, "approve")}
                        disabled={acting === run.id}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Approve & deploy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => act(run.id, "reject")}
                        disabled={acting === run.id}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {run.status === "applied" && run.applied_variant_id && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => act(run.id, "rollback")}
                      disabled={acting === run.id}
                    >
                      Rollback variant
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string | null | undefined }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-mono font-medium">{value ?? "-"}</div>
    </div>
  );
}
