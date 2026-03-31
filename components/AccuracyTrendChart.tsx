"use client";

interface TrendPoint {
  week_start: string;
  total_attempts: number;
  correct_count: number;
  accuracy: number;
}

interface Props {
  data: TrendPoint[];
}

export function AccuracyTrendChart({ data }: Props) {
  if (data.length < 2) return null;

  const W = 600;
  const H = 160;
  const padL = 40;
  const padR = 16;
  const padT = 12;
  const padB = 32;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const minAcc = 0;
  const maxAcc = 100;

  const xScale = (i: number) => padL + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => padT + chartH - ((v - minAcc) / (maxAcc - minAcc)) * chartH;

  // Build SVG path
  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i).toFixed(1)} ${yScale(d.accuracy).toFixed(1)}`)
    .join(" ");

  const areaPath =
    linePath +
    ` L ${xScale(data.length - 1).toFixed(1)} ${(padT + chartH).toFixed(1)}` +
    ` L ${padL.toFixed(1)} ${(padT + chartH).toFixed(1)} Z`;

  // Y gridlines at 0, 25, 50, 75, 100
  const gridLines = [0, 25, 50, 75, 100];

  const formatWeek = (w: string) => {
    const d = new Date(w);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  // Show fewer x labels if many points
  const labelStep = data.length > 6 ? Math.ceil(data.length / 6) : 1;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: "300px", maxHeight: "180px" }}
        aria-label="Accuracy trend chart"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand, #6366f1)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-brand, #6366f1)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((v) => (
          <g key={v}>
            <line
              x1={padL}
              y1={yScale(v)}
              x2={W - padR}
              y2={yScale(v)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <text
              x={padL - 6}
              y={yScale(v) + 4}
              textAnchor="end"
              fontSize="10"
              fill="#9ca3af"
            >
              {v}%
            </text>
          </g>
        ))}

        {/* 60% threshold line */}
        <line
          x1={padL}
          y1={yScale(60)}
          x2={W - padR}
          y2={yScale(60)}
          stroke="#f59e0b"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.7"
        />

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-brand, #6366f1)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots + tooltips */}
        {data.map((d, i) => (
          <g key={i}>
            <circle
              cx={xScale(i)}
              cy={yScale(d.accuracy)}
              r="4"
              fill={d.accuracy >= 60 ? "var(--color-brand, #6366f1)" : "#ef4444"}
              stroke="white"
              strokeWidth="1.5"
            />
            {/* invisible wider hit area for tooltip */}
            <title>{`สัปดาห์ ${formatWeek(d.week_start)}: ${d.accuracy}% (${d.correct_count}/${d.total_attempts})`}</title>
          </g>
        ))}

        {/* X axis labels */}
        {data.map((d, i) =>
          i % labelStep === 0 ? (
            <text
              key={i}
              x={xScale(i)}
              y={H - 6}
              textAnchor="middle"
              fontSize="10"
              fill="#9ca3af"
            >
              {formatWeek(d.week_start)}
            </text>
          ) : null
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground justify-end">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-0.5 bg-amber-400 rounded" style={{ borderTop: "2px dashed #f59e0b" }} />
          เป้าหมาย 60%
        </span>
      </div>
    </div>
  );
}
