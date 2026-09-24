export const dynamic="force-dynamic";
import {auth} from "@/lib/auth";
import {gateQuestionsForSession} from "@/lib/credits-gate";
import {getPlayAllowance} from "@/lib/play-limit";
import {PC1_SCENARIO_001} from "@/lib/pc1-scenario-001";
import McqPractice from "@/components/McqPractice";
import Link from "next/link";
import {ArrowLeft,ClipboardList} from "lucide-react";
export default async function Page(){
 const session=await auth();
 const gated=await gateQuestionsForSession(session,PC1_SCENARIO_001);
 const allowance=await getPlayAllowance(session);
 return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
  <Link href="/ple/pc1-pilot" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4"/> กลับ PC1</Link>
  <div className="mb-6 rounded-2xl border bg-gradient-to-r from-rose-50 to-white p-6">
   <div className="flex items-center gap-2 text-2xl font-bold"><ClipboardList className="h-7 w-7 text-rose-500"/>PC1 Scenario Set 001</div>
   <p className="mt-2 text-sm text-muted-foreground">แนวข้อสอบสถานการณ์ (1 เคส หลายข้อ) · 6 สถานการณ์ · {PC1_SCENARIO_001.length} ข้อ · Hard</p>
   <p className="mt-1 text-xs text-muted-foreground">Warfarin/Digoxin DDI · TB/HIV · Vancomycin AUC · Phenytoin PK · DKA · Pediatric AOM</p>
  </div>
  <McqPractice questions={gated.questions} initialCreditBalance={gated.creditBalance} playAllowance={allowance}/>
 </div>
}
