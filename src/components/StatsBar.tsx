import type { KataStats } from "@/lib/types";
import { formatNumber } from "@/lib/data";

interface StatsBarProps {
  stats: KataStats;
  compact?: boolean;
}

export function StatsBar({ stats, compact = false }: StatsBarProps) {
  const items = [
    { label: "該当動画", value: formatNumber(stats.videoCount), accent: false },
    { label: "平均再生", value: formatNumber(stats.avgViews), accent: false },
    {
      label: "伸び率",
      value: `+${stats.growthRate}%`,
      accent: true,
    },
  ];

  return (
    <div
      className={`flex flex-wrap border-b border-line ${
        compact ? "gap-6 py-3" : "gap-8 py-5 sm:gap-12"
      }`}
    >
      {items.map(({ label, value, accent }) => (
        <div key={label}>
          <p className="eyebrow mb-1">{label}</p>
          <p className={accent ? "stat-value-accent" : "stat-value"}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
