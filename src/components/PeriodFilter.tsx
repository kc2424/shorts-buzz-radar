import Link from "next/link";
import type { Period } from "@/lib/types";

const periods: { value: Period; label: string }[] = [
  { value: "week", label: "今週" },
  { value: "today", label: "今日" },
  { value: "24h", label: "24h" },
];

interface PeriodFilterProps {
  active: Period;
}

export function PeriodFilter({ active }: PeriodFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="期間フィルタ">
      {periods.map(({ value, label }) => (
        <Link
          key={value}
          href={value === "week" ? "/" : `/?period=${value}`}
          className={active === value ? "btn-pill-active" : "btn-pill-outline"}
          aria-current={active === value ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
