import { CONTACT_INFO } from "@/lib/contact-info";
import LineIcon from "@/components/LineIcon";

const SIZES = {
  sm: { px: 112, qr: "h-28 w-28" },
  md: { px: 160, qr: "h-40 w-40" },
} as const;

type Props = {
  size?: keyof typeof SIZES;
  className?: string;
  /** Text tone for the caption; "light" is for dark backgrounds like the footer. */
  tone?: "light" | "dark";
};

/**
 * LINE OA contact block: QR code + add-friend button. Server-safe, used in
 * the footer and anywhere we ask the user to reach us on LINE.
 */
export default function LineContactCard({ size = "sm", className = "", tone = "dark" }: Props) {
  const { px, qr } = SIZES[size];
  const caption = tone === "light" ? "text-white/60" : "text-muted-foreground";

  return (
    <div className={`flex flex-col items-start gap-3 ${className}`}>
      <a
        href={CONTACT_INFO.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={CONTACT_INFO.lineLabel}
        className="rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-black/5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={CONTACT_INFO.lineQrSrc}
          alt="QR code สำหรับแอด LINE ฟาร์มรู้"
          width={px}
          height={px}
          className={`${qr} rounded-lg`}
        />
      </a>
      <a
        href={CONTACT_INFO.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#06C755] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#05b34c]"
      >
        <LineIcon className="h-5 w-5" />
        {CONTACT_INFO.lineLabel}
      </a>
      <p className={`text-xs ${caption}`}>สแกนหรือกดเพื่อแอดเพื่อน</p>
    </div>
  );
}
