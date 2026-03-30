interface SubjectData {
  name_th: string;
  icon: string;
  correct: number;
  total: number;
  accuracy_pct: number;
}

interface ReportData {
  userName: string;
  overall: {
    total_attempts: number;
    correct_count: number;
    accuracy_pct: number;
    total_sessions: number;
  };
  subjects: SubjectData[];
  weakAreas: SubjectData[];
}

export function generateReportEmailHtml(data: ReportData): string {
  const { userName, overall, subjects, weakAreas } = data;

  const subjectRows = subjects
    .map(
      (s) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">${s.icon} ${s.name_th}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${s.correct}/${s.total}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">
        <span style="color:${s.accuracy_pct >= 60 ? "#16a34a" : "#dc2626"};font-weight:bold;">${s.accuracy_pct}%</span>
      </td>
    </tr>`
    )
    .join("");

  const weakAreasList = weakAreas
    .map((s) => `<li style="margin-bottom:4px;">${s.icon} ${s.name_th} — <strong style="color:#dc2626;">${s.accuracy_pct}%</strong></li>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#0d9488;color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="margin:0;font-size:24px;">💊 PharmRoo ภ.รู้</h1>
      <p style="margin:8px 0 0;opacity:0.9;">รายงานผลการทำข้อสอบ PLE</p>
    </div>

    <div style="background:white;padding:24px;border-radius:0 0 12px 12px;">
      <p style="font-size:16px;margin-bottom:20px;">สวัสดีคุณ <strong>${userName}</strong>,</p>
      <p style="color:#666;margin-bottom:24px;">นี่คือสรุปผลการทำข้อสอบของคุณจาก PharmRoo ภ.รู้</p>

      <!-- Overall Stats -->
      <div style="display:flex;gap:12px;margin-bottom:24px;">
        <div style="flex:1;background:#f0fdfa;padding:16px;border-radius:8px;text-align:center;">
          <p style="font-size:28px;font-weight:bold;margin:0;color:#0d9488;">${overall.total_attempts}</p>
          <p style="font-size:12px;color:#666;margin:4px 0 0;">ข้อที่ทำ</p>
        </div>
        <div style="flex:1;background:${overall.accuracy_pct >= 60 ? "#f0fdf4" : "#fef2f2"};padding:16px;border-radius:8px;text-align:center;">
          <p style="font-size:28px;font-weight:bold;margin:0;color:${overall.accuracy_pct >= 60 ? "#16a34a" : "#dc2626"};">${overall.accuracy_pct}%</p>
          <p style="font-size:12px;color:#666;margin:4px 0 0;">ถูกต้อง</p>
        </div>
        <div style="flex:1;background:#eff6ff;padding:16px;border-radius:8px;text-align:center;">
          <p style="font-size:28px;font-weight:bold;margin:0;color:#2563eb;">${overall.total_sessions}</p>
          <p style="font-size:12px;color:#666;margin:4px 0 0;">ครั้งที่สอบ</p>
        </div>
      </div>

      ${
        weakAreas.length > 0
          ? `
      <!-- Weak Areas -->
      <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin-bottom:24px;">
        <h3 style="margin:0 0 8px;color:#92400e;font-size:14px;">⚠️ หมวดที่ควรเน้นทบทวน</h3>
        <ul style="margin:0;padding-left:20px;color:#78350f;">${weakAreasList}</ul>
      </div>`
          : ""
      }

      <!-- Subject Breakdown -->
      <h3 style="margin:0 0 12px;font-size:16px;">คะแนนแยกตามวิชา</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:8px 12px;text-align:left;font-size:13px;color:#666;">วิชา</th>
            <th style="padding:8px 12px;text-align:center;font-size:13px;color:#666;">คะแนน</th>
            <th style="padding:8px 12px;text-align:center;font-size:13px;color:#666;">%</th>
          </tr>
        </thead>
        <tbody>${subjectRows}</tbody>
      </table>

      <!-- CTA -->
      <div style="text-align:center;margin-top:32px;">
        <a href="https://pharma.morroo.com/ple" style="display:inline-block;background:#0d9488;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">
          ฝึกทำข้อสอบเพิ่ม →
        </a>
      </div>

      <p style="color:#999;font-size:12px;text-align:center;margin-top:32px;">
        ส่งจาก PharmRoo ภ.รู้ — แพลตฟอร์มข้อสอบเภสัชกรรม<br>
        <a href="https://pharma.morroo.com" style="color:#0d9488;">pharma.morroo.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}
