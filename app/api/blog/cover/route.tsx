import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

// Brand palette (matches PharmRu logo + Facebook cover)
const GREEN_DARK = "#0E5C3F";
const GREEN_MID = "#1F9D6E";
const MINT = "#7AD6AD";
const LOGO_GREEN = "#1D7A52";

function pickTitleSize(len: number): number {
  if (len <= 34) return 66;
  if (len <= 60) return 54;
  if (len <= 90) return 44;
  return 38;
}

/**
 * Branded blog cover card (1200x630) generated on the fly.
 * Usage: /api/blog/cover?title=...&cat=...&e=💊
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const title = (sp.get("title") || "ความรู้สุขภาพและยา").slice(0, 120);
  const category = (sp.get("cat") || "สุขภาพทั่วไป").slice(0, 40);
  const emoji = (sp.get("e") || "💊").slice(0, 4);

  try {
    const [bold, semibold] = await Promise.all([
      readFile(join(process.cwd(), "public/fonts/Kanit-Bold.ttf")),
      readFile(join(process.cwd(), "public/fonts/Kanit-SemiBold.ttf")),
    ]);

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            padding: "72px",
            backgroundColor: GREEN_DARK,
            backgroundImage: `linear-gradient(135deg, ${GREEN_DARK} 0%, ${GREEN_MID} 100%)`,
            fontFamily: "Kanit",
            overflow: "hidden",
          }}
        >
          {/* decorative soft circles */}
          <div
            style={{
              position: "absolute",
              top: "-160px",
              right: "-120px",
              width: "460px",
              height: "460px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-200px",
              left: "-140px",
              width: "420px",
              height: "420px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />
          {/* decorative capsule */}
          <div
            style={{
              position: "absolute",
              top: "120px",
              right: "90px",
              width: "300px",
              height: "120px",
              borderRadius: "9999px",
              display: "flex",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                width: "150px",
                height: "120px",
                backgroundColor: "#EAFBF2",
                borderTopLeftRadius: "9999px",
                borderBottomLeftRadius: "9999px",
              }}
            />
            <div
              style={{
                width: "150px",
                height: "120px",
                backgroundColor: LOGO_GREEN,
                borderTopRightRadius: "9999px",
                borderBottomRightRadius: "9999px",
              }}
            />
          </div>

          {/* category chip */}
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "rgba(255,255,255,0.95)",
                color: GREEN_DARK,
                fontSize: "30px",
                fontWeight: 600,
                padding: "12px 28px",
                borderRadius: "9999px",
              }}
            >
              <span style={{ fontSize: "34px" }}>{emoji}</span>
              <span>{category}</span>
            </div>
          </div>

          {/* title */}
          <div
            style={{
              display: "flex",
              maxWidth: "780px",
              fontSize: `${pickTitleSize(title.length)}px`,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.18,
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </div>

          {/* brand footer */}
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                display: "flex",
                width: "62px",
                height: "62px",
                borderRadius: "9999px",
                backgroundColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
                color: LOGO_GREEN,
                fontSize: "40px",
                fontWeight: 700,
              }}
            >
              R
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "32px", fontWeight: 700, color: "#FFFFFF" }}>
                PharmRu ฟาร์มรู้
              </span>
              <span style={{ fontSize: "22px", fontWeight: 600, color: MINT }}>
                ความรู้สุขภาพและยา เข้าใจง่าย
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Kanit", data: bold, weight: 700, style: "normal" },
          { name: "Kanit", data: semibold, weight: 600, style: "normal" },
        ],
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      }
    );
  } catch (err) {
    console.error("[blog-cover] error:", err);
    return new Response("Failed to generate cover", { status: 500 });
  }
}
