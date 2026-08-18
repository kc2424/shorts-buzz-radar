import type { KataStats } from "@/lib/types";
import { formatNumber } from "@/lib/data";
import { CountUp } from "./motion/Motion";

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
      {items.map(({ label, value, accent }, index) => (
        <div key={label} className="animate-slide-in" style={{ animationDelay: `${index * 80}ms` }}>
          <p className="eyebrow mb-1">{label}</p>
          <CountUp
            value={value}
            className={accent ? "stat-value-accent" : "stat-value"}
          />
        </div>
      ))}
    </div>
  );
}
