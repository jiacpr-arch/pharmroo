export const dynamic="force-dynamic";
import {auth} from "@/lib/auth";
import {gateQuestionsForSession} from "@/lib/credits-gate";
import {getPlayAllowance} from "@/lib/play-limit";
import {PC1_PILOT_032} from "@/lib/pc1-pilot-032";
import McqPractice from "@/components/McqPractice";
import Link from "next/link";
import {ArrowLeft,HeartPulse} from "lucide-react";
export default async function Page(){
 const session=await auth();
 const gated=await gateQuestionsForSession(session,PC1_PILOT_032);
 const allowance=await getPlayAllowance(session);
 return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
  <Link href="/ple/practice?track=pc1" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4"/> กลับ PC1</Link>
  <div className="mb-6 rounded-2xl border bg-gradient-to-r from-rose-50 to-white p-6">
   <div className="flex items-center gap-2 text-2xl font-bold"><HeartPulse className="h-7 w-7 text-rose-500"/>PC1 Pilot 032</div>
   <p className="mt-2 text-sm text-muted-foreground">8 ระบบ/สถานการณ์ × 4 ข้อ = 32 ข้อ · Medium–Hard</p>
   <p className="mt-1 text-xs text-muted-foreground">Cardiorenal · ACS · AF · Asthma · Infection · CKD/Electrolyte · Rheumatology · Hepatology</p>
   <Link href="/ple/pc1-scenario" className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white">ลองชุดแนวสถานการณ์ (Scenario Set 001) →</Link>
  </div>
  <McqPractice questions={gated.questions} initialCreditBalance={gated.creditBalance} playAllowance={allowance}/>
 </div>
}