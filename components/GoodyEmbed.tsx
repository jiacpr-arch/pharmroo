"use client";

import { useEffect, useState } from "react";

const GOODY_ORIGIN = "https://goody-bay.vercel.app";

interface Props {
  site: string;
  type: string;
  title?: string;
  className?: string;
  initialHeight?: number;
}

interface GoodyMessage {
  source?: string;
  height?: number;
}

export default function GoodyEmbed({
  site,
  type,
  title,
  className,
  initialHeight = 320,
}: Props) {
  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.origin !== GOODY_ORIGIN) return;
      const data = e.data as GoodyMessage | null;
      if (data?.source !== "goody" || typeof data.height !== "number") return;
      setHeight(data.height);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const src = `${GOODY_ORIGIN}/?site=${encodeURIComponent(site)}&type=${encodeURIComponent(type)}`;

  return (
    <iframe
      src={src}
      title={title ?? `goody-${site}-${type}`}
      loading="lazy"
      scrolling="no"
      style={{ width: "100%", border: 0, display: "block", height }}
      className={className}
    />
  );
}
