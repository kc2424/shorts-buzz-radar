import Link from "next/link";
import type { GenreBreakdown, Kata } from "@/lib/types";

interface GenreChartProps {
  breakdown: GenreBreakdown[];
}

export function GenreChart({ breakdown }: GenreChartProps) {
  return (
    <div className="space-y-3">
      {breakdown.map(({ genre, percentage }) => (
        <div key={genre}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-ink-soft">{genre}</span>
            <span className="font-en tabular-nums text-ink-faint">
              {percentage}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-line">
            <div
              className="h-full bg-accent"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface SidebarProps {
  genreBreakdown: GenreBreakdown[];
  relatedKatas: Kata[];
}

export function Sidebar({ genreBreakdown, relatedKatas }: SidebarProps) {
  return (
    <aside className="space-y-10">
      <section>
        <h2 className="eyebrow mb-4">ジャンル内訳</h2>
        <GenreChart breakdown={genreBreakdown} />
      </section>

      <section>
        <h2 className="eyebrow mb-4">関連する型</h2>
        <ul>
          {relatedKatas.map((kata) => (
            <li key={kata.slug} className="row-divider">
              <Link
                href={`/kata/${kata.slug}`}
                className="group block py-3 transition-colors"
              >
                <p className="text-sm font-semibold text-ink transition-colors group-hover:text-accent-ink">
                  {kata.title}
                </p>
                <p className="font-en text-xs tabular-nums text-accent">
                  +{kata.stats.growthRate}%
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
