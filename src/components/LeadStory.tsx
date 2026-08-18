import Link from "next/link";
import type { Kata } from "@/lib/types";
import { StatsBar } from "./StatsBar";
import { TagList } from "./TagList";
import { ThumbnailGrid } from "./ThumbnailGrid";

interface LeadStoryProps {
  kata: Kata;
}

export function LeadStory({ kata }: LeadStoryProps) {
  return (
    <article className="section-divider pt-8">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="eyebrow">#01 — 今週のトップ型</span>
      </div>

      <Link href={`/kata/${kata.slug}`} className="group block">
        <h2 className="mb-3 text-[clamp(26px,3.2vw,36px)] font-semibold tracking-tight text-ink transition-colors group-hover:text-accent-ink">
          {kata.title}
        </h2>
      </Link>

      <div className="mb-5">
        <TagList tags={kata.tags} />
      </div>

      <StatsBar stats={kata.stats} />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">真似ポイント</p>
          <ul className="accent-border-left space-y-2">
            {kata.mimicPoints.map((point) => (
              <li key={point} className="text-ink-soft">
                {point}
              </li>
            ))}
          </ul>
          <Link
            href={`/kata/${kata.slug}`}
            className="btn-pill-primary mt-6 inline-flex"
          >
            型の詳細を見る
          </Link>
        </div>
        <ThumbnailGrid samples={kata.samples} variant="lead" />
      </div>
    </article>
  );
}
