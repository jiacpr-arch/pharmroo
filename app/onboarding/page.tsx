"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAM_TYPES = [
  { value: "PLE-PC", label: "PLE-PC (สภาเภสัชกรรม ขั้น 1)" },
  { value: "PLE-CC1", label: "PLE-CC1 (สภาเภสัชกรรม ขั้น 2)" },
  { value: "NLE", label: "NLE (สภาการพยาบาล)" },
];

const DAILY_GOALS = [
  { value: 10, label: "10 ข้อ/วัน" },
  { value: 20, label: "20 ข้อ/วัน (แนะนำ)" },
  { value: 30, label: "30 ข้อ/วัน" },
];

const PHARMACY_SUBJECTS = [
  "Pharmacotherapy",
  "เทคโนโลยีเภสัชกรรม",
  "เภสัชเคมี",
  "เภสัชวิเคราะห์",
  "เภสัชจลนศาสตร์",
  "กฎหมายยา",
  "สมุนไพร",
];

const NURSING_SUBJECTS = [
  "การพยาบาลมารดา ทารก และการผดุงครรภ์",
  "การพยาบาลเด็กและวัยรุ่น",
  "การพยาบาลผู้ใหญ่",
  "การพยาบาลผู้สูงอายุ",
  "การพยาบาลสุขภาพจิตและจิตเวช",
  "การพยาบาลอนามัยชุมชน",
  "การรักษาโรคเบื้องต้น",
  "กฎหมายและจรรยาบรรณวิชาชีพ",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [targetExam, setTargetExam] = useState("");
  const [dailyGoal, setDailyGoal] = useState(20);
  const [weakSubjects, setWeakSubjects] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const subjects = targetExam === "NLE" ? NURSING_SUBJECTS : PHARMACY_SUBJECTS;

  const toggleSubject = (subject: string) => {
    setWeakSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetExam, dailyGoal, weakSubjects }),
      });
      router.push("/dashboard");
    } catch {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full ${
                s <= step ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Target Exam */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">สอบอะไร?</h2>
            <p className="text-gray-500 mb-6">
              เลือกการสอบที่คุณเตรียมตัว
            </p>
            <div className="space-y-3">
              {EXAM_TYPES.map((exam) => (
                <button
                  key={exam.value}
                  onClick={() => {
                    setTargetExam(exam.value);
                    setWeakSubjects([]);
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    targetExam === exam.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {exam.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!targetExam}
              className="w-full mt-6 py-3 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition"
            >
              ถัดไป
            </button>
          </div>
        )}

        {/* Step 2: Daily Goal */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">เป้าหมายรายวัน</h2>
            <p className="text-gray-500 mb-6">
              อยากทำข้อสอบวันละกี่ข้อ?
            </p>
            <div className="space-y-3">
              {DAILY_GOALS.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => setDailyGoal(goal.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    dailyGoal === goal.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-300 transition"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Weak Subjects */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">วิชาที่อ่อน</h2>
            <p className="text-gray-500 mb-6">
              เลือกวิชาที่ต้องฝึกเพิ่ม (เลือกได้หลายข้อ)
            </p>
            <div className="space-y-2">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  className={`w-full p-3 rounded-xl border-2 text-left text-sm transition ${
                    weakSubjects.includes(subject)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {weakSubjects.includes(subject) ? "✓ " : ""}
                  {subject}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-300 transition"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={handleComplete}
                disabled={saving}
                className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-600 transition"
              >
                {saving ? "กำลังบันทึก..." : "เริ่มเลย!"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
