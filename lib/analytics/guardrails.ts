export interface GuardrailViolation {
  rule: string;
  field: string;
  evidence: string;
}

const MEDICAL_CLAIM_PATTERNS: { pattern: RegExp; rule: string }[] = [
  { pattern: /\b(รักษา|cure|heal|treat)\s*(โรค|disease|cancer|มะเร็ง)/i, rule: "disease_treatment_claim" },
  { pattern: /\b(ปลอดภัย\s*100|100\s*%\s*safe|guaranteed|รับประกันผล)\b/i, rule: "safety_guarantee" },
  { pattern: /\b(ลดน้ำหนัก\s*\d+\s*(kg|กก|กิโล))\b/i, rule: "weight_loss_claim" },
  { pattern: /\b(FDA\s*approved|อย\.?\s*รับรอง)\b/i, rule: "regulatory_claim" },
  { pattern: /\b(ไม่มีผลข้างเคียง|no\s*side\s*effects)\b/i, rule: "no_side_effects" },
];

const ALLOWED_FIELDS = new Set([
  "headline",
  "subheadline",
  "cta_text",
  "hero_copy",
  "value_prop",
  "social_proof",
]);

const MAX_TEXT_LENGTH: Record<string, number> = {
  headline: 80,
  subheadline: 160,
  cta_text: 30,
  hero_copy: 400,
  value_prop: 280,
  social_proof: 200,
};

export interface ProposalChange {
  field: string;
  new_value: string;
  rationale?: string;
}

export interface Proposal {
  summary: string;
  changes: ProposalChange[];
  confidence: number;
  risk_level: "low" | "medium" | "high";
}

export function validateProposal(proposal: Proposal): {
  ok: boolean;
  violations: GuardrailViolation[];
  safeChanges: ProposalChange[];
} {
  const violations: GuardrailViolation[] = [];
  const safeChanges: ProposalChange[] = [];

  for (const change of proposal.changes) {
    if (!ALLOWED_FIELDS.has(change.field)) {
      violations.push({
        rule: "field_not_allowed",
        field: change.field,
        evidence: `field "${change.field}" not in allowlist`,
      });
      continue;
    }

    const max = MAX_TEXT_LENGTH[change.field];
    if (max && change.new_value.length > max) {
      violations.push({
        rule: "exceeds_max_length",
        field: change.field,
        evidence: `${change.new_value.length} > ${max}`,
      });
      continue;
    }

    let clean = true;
    for (const { pattern, rule } of MEDICAL_CLAIM_PATTERNS) {
      if (pattern.test(change.new_value)) {
        violations.push({ rule, field: change.field, evidence: change.new_value });
        clean = false;
        break;
      }
    }
    if (clean) safeChanges.push(change);
  }

  return {
    ok: violations.length === 0,
    violations,
    safeChanges,
  };
}
