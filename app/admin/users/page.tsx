"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Shield, ArrowLeft, Users, Crown, Search, Save, UserCheck, UserX, BarChart3 } from "lucide-react";
import UserStatsPanel from "@/components/admin/UserStatsPanel";

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  membership_type: string;
  membership_expires_at: string | null;
  created_at: string;
}

const membershipLabels: Record<string, string> = {
  free: "ฟรี", monthly: "รายเดือน", yearly: "รายปี",
};
const membershipColors: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  monthly: "bg-blue-100 text-blue-700",
  yearly: "bg-purple-100 text-purple-700",
};

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState<UserRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, { membership_type: string; membership_expires_at: string; role: string }>>({});
  const [expandedStatsId, setExpandedStatsId] = useState<string | null>(null);

  const user = session?.user as { role?: string } | undefined;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    const data: UserRow[] = await res.json();
    setUserList(data);
    const initialEdits: typeof edits = {};
    for (const u of data) {
      initialEdits[u.id] = {
        membership_type: u.membership_type || "free",
        membership_expires_at: u.membership_expires_at ? u.membership_expires_at.slice(0, 10) : "",
        role: u.role || "user",
      };
    }
    setEdits(initialEdits);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin, loadUsers]);

  const handleSave = async (userId: string) => {
    const edit = edits[userId];
    if (!edit) return;
    setSavingId(userId);
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...edit }),
    });
    setUserList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, ...edit, membership_expires_at: edit.membership_expires_at ? new Date(edit.membership_expires_at).toISOString() : null }
          : u
      )
    );
    setSavingId(null);
  };

  const hasChanges = (u: UserRow) => {
    const edit = edits[u.id];
    if (!edit) return false;
    return (
      edit.membership_type !== (u.membership_type || "free") ||
      edit.membership_expires_at !== (u.membership_expires_at ? u.membership_expires_at.slice(0, 10) : "") ||
      edit.role !== (u.role || "user")
    );
  };

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold">ไม่มีสิทธิ์เข้าถึง</h1>
      </div>
    );
  }

  const filtered = userList.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.email?.toLowerCase().includes(q) || u.name?.toLowerCase().includes(q);
  });

  const paidMembers = userList.filter((u) => u.membership_type !== "free").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-brand mb-2">
          <ArrowLeft className="h-4 w-4" /> Admin Dashboard
        </Link>
        <h1 className="text-2xl font-bold">จัดการสมาชิก</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><Users className="h-6 w-6 text-blue-600" /></div><div><p className="text-2xl font-bold">{userList.length}</p><p className="text-sm text-muted-foreground">สมาชิกทั้งหมด</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center"><UserCheck className="h-6 w-6 text-brand" /></div><div><p className="text-2xl font-bold">{paidMembers}</p><p className="text-sm text-muted-foreground">สมาชิกชำระเงิน</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center"><UserX className="h-6 w-6 text-gray-600" /></div><div><p className="text-2xl font-bold">{userList.length - paidMembers}</p><p className="text-sm text-muted-foreground">สมาชิกฟรี</p></div></div></CardContent></Card>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="ค้นหาด้วยอีเมลหรือชื่อ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <div className="space-y-4">
        {filtered.map((u) => {
          const edit = edits[u.id];
          if (!edit) return null;
          const changed = hasChanges(u);
          return (
            <Card key={u.id} className={changed ? "border-brand/40" : ""}>
              <CardContent className="py-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold">{u.name || "(ไม่มีชื่อ)"}</h3>
                        {u.role === "admin" && <Badge className="bg-red-100 text-red-700 text-xs"><Crown className="h-3 w-3 mr-1" />แอดมิน</Badge>}
                        <Badge className={`text-xs ${membershipColors[u.membership_type] || membershipColors.free}`}>
                          {membershipLabels[u.membership_type] || u.membership_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-3 flex-wrap">
                    <div className="flex-1 min-w-[140px]">
                      <label className="text-xs text-muted-foreground mb-1 block">ประเภทสมาชิก</label>
                      <select className="w-full rounded-md border px-3 py-2 text-sm" value={edit.membership_type} onChange={(e) => setEdits((p) => ({ ...p, [u.id]: { ...p[u.id], membership_type: e.target.value } }))}>
                        <option value="free">ฟรี</option>
                        <option value="monthly">รายเดือน</option>
                        <option value="yearly">รายปี</option>
                      </select>
                    </div>
                    <div className="flex-1 min-w-[160px]">
                      <label className="text-xs text-muted-foreground mb-1 block">วันหมดอายุ</label>
                      <Input type="date" value={edit.membership_expires_at} onChange={(e) => setEdits((p) => ({ ...p, [u.id]: { ...p[u.id], membership_expires_at: e.target.value } }))} />
                    </div>
                    <div className="min-w-[120px]">
                      <label className="text-xs text-muted-foreground mb-1 block">สิทธิ์</label>
                      <select className="w-full rounded-md border px-3 py-2 text-sm" value={edit.role} onChange={(e) => setEdits((p) => ({ ...p, [u.id]: { ...p[u.id], role: e.target.value } }))}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </div>
                    <Button className="bg-brand hover:bg-brand-light text-white gap-1" size="sm" disabled={!changed || savingId === u.id} onClick={() => handleSave(u.id)}>
                      {savingId === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} บันทึก
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setExpandedStatsId(expandedStatsId === u.id ? null : u.id)}>
                      <BarChart3 className="h-4 w-4" /> {expandedStatsId === u.id ? "ซ่อนสถิติ" : "ดูสถิติ"}
                    </Button>
                  </div>
                </div>
                {expandedStatsId === u.id && (
                  <div className="mt-4">
                    <UserStatsPanel userId={u.id} userName={u.name} userEmail={u.email} onClose={() => setExpandedStatsId(null)} />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
