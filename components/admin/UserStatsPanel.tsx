"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Target, TrendingUp, Clock, AlertTriangle, Send, Loader2, CheckCircle } from "lucide-react";

interface Props {
  userId: string;
  userName: string;
  userEmail: string;
  onClose: () => void;
}

interface StatsData {
  overall: {
    total_attempts: number;
    correct_count: number;
    accuracy_pct: number;
    total_time_seconds: number;
    total_sessions: number;
  };
  subjects: Array<{
    subject_id: string;
    name_th: string;
    icon: string;
    total: number;
    correct: number;
    accuracy_pct: number;
  }>;
  weakAreas: Array<{
    subject_id: string;
    name_th: string;
    icon: string;
    accuracy_pct: number;
  }>;
  recentSessions: Array<{
    id: string;
    mode: string;
    total_questions: number;
    correct_count: number;
    pct: number;
    created_at: string;
    subject_name_th: string | null;
    subject_icon: string | null;
  }>;
}

export default function UserStatsPanel({ userId, userName, userEmail, onClose }: Props) {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/users/${userId}/stats`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSendReport = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/admin/report/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userEmail, userName }),
      });
      if (res.ok) setSent(true);
    } catch {
      // fail silently
    }
    setSending(false);
  };

  if (loading) {
    return (
      <Card className="border-brand/30 bg-brand/5">
        <CardContent className="p-6 text-center text-muted-foreground">
          กำลังโหลดสถิติ...
        </CardContent>
      </Card>
    );
  }

  if (!data || data.overall.total_attempts === 0) {
    return (
      <Card className="border-brand/30 bg-brand/5">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold">สถิติ: {userName}</h4>
            <Button size="sm" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
          </div>
          <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูลการทำข้อสอบ</p>
        </CardContent>
      </Card>
    );
  }

  const { overall, subjects, weakAreas, recentSessions } = data;

  return (
    <Card className="border-brand/30 bg-brand/5">
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-lg">สถิติ: {userName}</h4>
          <Button size="sm" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        {/* Overall */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <Target className="h-4 w-4 text-brand mx-auto mb-1" />
            <p className="text-xl font-bold">{overall.total_attempts}</p>
            <p className="text-[10px] text-muted-foreground">ข้อที่ทำ</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
            <p className={`text-xl font-bold ${overall.accuracy_pct >= 60 ? "text-green-600" : "text-red-600"}`}>
              {overall.accuracy_pct}%
            </p>
            <p className="text-[10px] text-muted-foreground">ถูกต้อง</p>
          </div>
          <div className="text-center">
            <Clock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-bold">{overall.total_sessions}</p>
            <p className="text-[10px] text-muted-foreground">ครั้งสอบ</p>
          </div>
        </div>

        {/* Weak Areas */}
        {weakAreas.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-800">จุดอ่อน</span>
            </div>
            {weakAreas.map((s) => (
              <div key={s.subject_id} className="text-sm text-amber-900">
                {s.icon} {s.name_th} — <span className="text-red-600 font-medium">{s.accuracy_pct}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Subject Breakdown */}
        <div>
          <h5 className="text-sm font-bold mb-2">แยกตามวิชา</h5>
          <div className="space-y-2">
            {subjects.map((s) => (
              <div key={s.subject_id} className="flex items-center gap-2 text-sm">
                <span className="w-5">{s.icon}</span>
                <span className="flex-1 truncate">{s.name_th}</span>
                <span className="font-medium">{s.correct}/{s.total}</span>
                <div className="w-16 bg-muted rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${s.accuracy_pct >= 60 ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${s.accuracy_pct}%` }}
                  />
                </div>
                <Badge variant="secondary" className={`text-[10px] w-10 justify-center ${s.accuracy_pct >= 60 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {s.accuracy_pct}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Recent */}
        {recentSessions.length > 0 && (
          <div>
            <h5 className="text-sm font-bold mb-2">ล่าสุด</h5>
            {recentSessions.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className={`text-[10px] ${s.mode === "mock" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {s.mode === "mock" ? "Mock" : "Practice"}
                  </Badge>
                  <span className="text-muted-foreground text-xs">{s.subject_icon} {s.subject_name_th ?? "ทุกวิชา"}</span>
                </div>
                <Badge variant="secondary" className={`text-[10px] ${s.pct >= 60 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {s.correct_count}/{s.total_questions} ({s.pct}%)
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Send Report Button */}
        <Button
          onClick={handleSendReport}
          disabled={sending || sent}
          className={`w-full gap-2 ${sent ? "bg-green-600 hover:bg-green-600" : "bg-brand hover:bg-brand-light"} text-white`}
        >
          {sent ? (
            <><CheckCircle className="h-4 w-4" /> ส่งแล้ว!</>
          ) : sending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> กำลังส่ง...</>
          ) : (
            <><Send className="h-4 w-4" /> ส่งรายงานทาง Email ({userEmail})</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
