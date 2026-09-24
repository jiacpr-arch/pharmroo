/** True while a time-boxed trial (e.g. the link-LINE Premium trial) is running. */
export function isTrialActive(
  trialExpiresAt: string | null | undefined,
  now: Date = new Date()
): boolean {
  if (!trialExpiresAt) return false;
  const end = new Date(trialExpiresAt);
  return !Number.isNaN(end.getTime()) && end > now;
}
