"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Shield, ArrowLeft, Users, Search, Save, Crown } from "lucide-react";

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  membership_type: string;
  membership_expires_at: string | null;
  target_exam: string | null;
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

export default function NursingAdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState<UserRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, { membership_type: string; membership_expires_at: string }>>({});

  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAuthorized = role === "nursing_admin" || role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/nursing/admin/users");
  }, [status, router]);

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/nursing-admin/users");
    const data: UserRow[] = await res.json();
    setUserList(Array.isArray(data) ? data : []);
    const initialEdits: typeof edits = {};
    for (const u of Array.isArray(data) ? data : []) {
      initialEdits[u.id] = {
        membership_type: u.membership_type || "free",
        membership_expires_at: u.membership_expires_at ? u.membership_expires_at.slice(0, 10) : "",
      };
    }
    setEdits(initialEdits);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthorized) loadUsers();
  }, [isAuthorized, loadUsers]);

  const handleSave = async (userId: string) => {
    const edit = edits[userId];
    if (!edit) return;
    setSavingId(userId);
    await fetch("/api/nursing-admin/users", {
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
      edit.membership_expires_at !== (u.membership_expires_at ? u.membership_expires_at.slice(0, 10) : "")
    );
  };

  if (status === "loading" || (loading && isAuthorized)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  if (!isAuthorized) {
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
        <Link href="/nursing/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-rose-600 mb-2">
          <ArrowLeft className="h-4 w-4" /> Nursing Admin Dashboard
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-rose-100 text-rose-700">NLE Admin</Badge>
        </div>
        <h1 className="text-2xl font-bold">จัดการสมาชิกสายพยาบาล</h1>
        <p className="text-sm text-muted-foreground mt-1">
          แสดงเฉพาะผู้ใช้ที่เลือก NLE · แก้ไขได้เฉพาะประเภทสมาชิกและวันหมดอายุ
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userList.length}</p>
                <p className="text-sm text-muted-foreground">สมาชิกสายพยาบาลทั้งหมด</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{paidMembers}</p>
                <p className="text-sm text-muted-foreground">สมาชิกชำระเงิน</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="ค้นหาด้วยอีเมลหรือชื่อ..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            ยังไม่มีสมาชิกสายพยาบาล
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filtered.map((u) => {
          const edit = edits[u.id];
          if (!edit) return null;
          const changed = hasChanges(u);
          const isPrivileged = u.role === "admin" || u.role === "nursing_admin";
          return (
            <Card key={u.id} className={changed ? "border-rose-400" : ""}>
              <CardContent className="py-4">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold">{u.name || "(ไม่มีชื่อ)"}</h3>
                        {u.role === "admin" && <Badge className="bg-red-100 text-red-700 text-xs">แอดมิน</Badge>}
                        {u.role === "nursing_admin" && <Badge className="bg-rose-100 text-rose-700 text-xs">Nursing Admin</Badge>}
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
                      <select
                        className="w-full rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                        value={edit.membership_type}
                        disabled={isPrivileged}
                        onChange={(e) => setEdits((p) => ({ ...p, [u.id]: { ...p[u.id], membership_type: e.target.value } }))}
                      >
                        <option value="free">ฟรี</option>
                        <option value="monthly">รายเดือน</option>
                        <option value="yearly">รายปี</option>
                      </select>
                    </div>
                    <div className="flex-1 min-w-[160px]">
                      <label className="text-xs text-muted-foreground mb-1 block">วันหมดอายุ</label>
                      <Input
                        type="date"
                        value={edit.membership_expires_at}
                        disabled={isPrivileged}
                        onChange={(e) => setEdits((p) => ({ ...p, [u.id]: { ...p[u.id], membership_expires_at: e.target.value } }))}
                      />
                    </div>
                    <Button
                      className="bg-rose-600 hover:bg-rose-700 text-white gap-1"
                      size="sm"
                      disabled={!changed || savingId === u.id || isPrivileged}
                      onClick={() => handleSave(u.id)}
                    >
                      {savingId === u.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} บันทึก
                    </Button>
                  </div>
                  {isPrivileged && (
                    <p className="text-xs text-muted-foreground">
                      * ไม่สามารถแก้ไขสมาชิกที่เป็น admin ได้
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
