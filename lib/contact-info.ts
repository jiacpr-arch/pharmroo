/** Single source of truth for public contact channels shown on the site. */
export const CONTACT_INFO = {
  /** LINE Official Account add-friend link (lin.ee short link). */
  lineUrl: process.env.NEXT_PUBLIC_LINE_OA_URL || "https://lin.ee/YGVb4ae",
  /** Label used everywhere we link to LINE — no ID shown on purpose. */
  lineLabel: "แอด LINE ฟาร์มรู้",
  /** QR code for the same LINE OA link, served from /public. */
  lineQrSrc: "/line-qr.png",
  /** Support email — shown only on legal pages (PDPA / refund). */
  email: "jiacpr@gmail.com",
} as const;
