"use client";

import { useState } from "react";

interface LeadFormProps {
  campaign?: string;
  adSet?: string;
  reward?: string;
}

export default function LeadForm({ campaign, adSet, reward }: LeadFormProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setLoading(true);
    setError("");

    const body = {
      name: data.get("name") as string,
      email: data.get("email") as string,
      phone: data.get("phone") as string,
      status_year: data.get("status_year") as string,
      exam_target: data.get("exam_target") as string,
      reward_choice: reward ?? "monthly_1m",
      campaign: campaign ?? undefined,
      ad_set: adSet ?? undefined,
      consent_pdpa: true,
    };

    try {
      const res = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = (await res.json()) as {
        ok?: boolean;
        code?: string;
        expiresAt?: string;
        error?: string;
      };

      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }

      setCode(json.code ?? null);
      setExpiresAt(json.expiresAt ?? null);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-lg text-center space-y-4">
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-bold text-gray-900">สมัครสำเร็จแล้ว!</h2>
        {code ? (
          <>
            <p className="text-gray-600">โค้ดทดลองใช้ PharmRoo ของคุณคือ:</p>
            <div className="rounded-xl bg-violet-50 py-4 px-6">
              <p className="text-3xl font-bold tracking-widest text-violet-700">{code}</p>
              {expiresAt && (
                <p className="mt-1 text-sm text-gray-500">หมดอายุ {expiresAt.slice(0, 10)}</p>
              )}
            </div>
            <p className="text-sm text-gray-500">
              เราส่งโค้ดไปที่อีเมลของคุณแล้วด้วยครับ 📧
            </p>
            <a
              href="https://pharmroo.com/pricing"
              className="mt-2 inline-block rounded-full bg-violet-600 px-8 py-3 font-semibold text-white hover:bg-violet-700 transition-colors"
            >
              ใช้โค้ดเลย →
            </a>
          </>
        ) : (
          <>
            <p className="text-gray-600">ทีมงานได้รับข้อมูลของคุณแล้วครับ จะติดต่อกลับเร็ว ๆ นี้</p>
            <a
              href="https://pharmroo.com"
              className="inline-block rounded-full bg-violet-600 px-8 py-3 font-semibold text-white hover:bg-violet-700 transition-colors"
            >
              ไปหน้าแรก
            </a>
          </>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อ-นามสกุล <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          placeholder="สมชาย ใจดี"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          อีเมล <span className="text-red-500">*</span>
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="example@email.com"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          เบอร์โทร (ไม่บังคับ)
        </label>
        <input
          name="phone"
          type="tel"
          placeholder="08x-xxx-xxxx"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ชั้นปีหรือสถานะ
        </label>
        <select
          name="status_year"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none bg-white"
        >
          <option value="">-- เลือก --</option>
          <option value="5">ปี 5 (เภสัช)</option>
          <option value="6">ปี 6 (เภสัช)</option>
          <option value="graduated">จบแล้ว</option>
          <option value="nursing">นักศึกษาพยาบาล</option>
          <option value="other">อื่น ๆ</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          เตรียมสอบอะไร?
        </label>
        <select
          name="exam_target"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none bg-white"
        >
          <option value="PLE">PLE (เภสัชศาสตร์)</option>
          <option value="NLE">NLE (พยาบาล)</option>
          <option value="both">ทั้ง PLE และ NLE</option>
        </select>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        การกดปุ่มด้านล่าง ถือว่าคุณยินยอมให้ PharmRoo เก็บและใช้ข้อมูลของคุณเพื่อการติดต่อและนำเสนอบริการ
        ตามนโยบายความเป็นส่วนตัว
      </p>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-violet-600 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "กำลังดำเนินการ..." : "รับโค้ดทดลองฟรี 🎁"}
      </button>
    </form>
  );
}
