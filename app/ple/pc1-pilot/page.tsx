export const dynamic="force-dynamic";
import {auth} from "@/lib/auth";
import {gateQuestionsForSession} from "@/lib/credits-gate";
import {getPlayAllowance} from "@/lib/play-limit";
import {PC1_ALL,PC1_CASE_COUNT} from "@/lib/pc1-bank";
import McqPractice from "@/components/McqPractice";
import Link from "next/link";
import {ArrowLeft,HeartPulse} from "lucide-react";
export default async function Page(){
 const session=await auth();
 const gated=await gateQuestionsForSession(session,PC1_ALL);
 const allowance=await getPlayAllowance(session);
 return <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
  <Link href="/ple/practice?track=pc1" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4"/> กลับ PC1</Link>
  <div className="mb-6 rounded-2xl border bg-gradient-to-r from-rose-50 to-white p-6">
   <div className="flex items-center gap-2 text-2xl font-bold"><HeartPulse className="h-7 w-7 text-rose-500"/>PC1 บริบาลเภสัชกรรม</div>
   <p className="mt-2 text-sm text-muted-foreground">{PC1_CASE_COUNT} สถานการณ์ · {PC1_ALL.length} ข้อ · Medium–Hard</p>
   <p className="mt-1 text-xs text-muted-foreground">Cardiorenal · ACS · AF · Asthma · Infection · CKD/Electrolyte · Rheumatology · Hepatology · Warfarin/Digoxin · TB/HIV · Vancomycin · Phenytoin · DKA · Pediatric AOM · STEMI/DAPT · PE/Heparin/HIT · Aortic dissection · HFrEF GDMT · Dyslipidemia/SAMS · VTE in pregnancy · Septic shock/Aminoglycoside · Meningitis · ESBL pyelonephritis in pregnancy · Candidemia/Azole DDI · C. difficile · HCV/HBV DAA · AKI/Renal dosing · SIADH/Hyponatremia · T2DM GLP-1/Insulin · Graves in pregnancy · CKD anemia/MBD · Adrenal crisis/GIOP</p>
  </div>
  <Link href="/ple/pc1-mock/1" className="mb-6 flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/60 p-4 text-sm font-semibold hover:bg-rose-50">⏱️ จำลองสอบ PC1 Mock Set 1 · 120 ข้อ 12 หมวด จับเวลา<span className="text-rose-600">เริ่มสอบ →</span></Link>
  <McqPractice questions={gated.questions} initialCreditBalance={gated.creditBalance} playAllowance={allowance}/>
 </div>
}