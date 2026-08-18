import type { Kata, Period, PeriodMeta } from "@/lib/types";
import { PeriodFilter } from "./PeriodFilter";
import { LeadStory } from "./LeadStory";
import { KataRow } from "./KataRow";

interface HomeContentProps {
  period: Period;
  meta: PeriodMeta;
  katas: Kata[];
}

export function HomeContent({ period, meta, katas }: HomeContentProps) {
  const [lead, ...rest] = katas;

  if (!lead) {
    return (
      <p className="text-ink-soft">
        データがありません。ポーリング実行後に再度お試しください。
      </p>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Weekly Format Radar</p>
          <h1 className="text-[clamp(28px,4.4vw,42px)] font-medium tracking-tight text-ink">
            今バズってるShortsの
            <span className="highlight-pill">型</span>
            一覧
          </h1>
        </div>
        <PeriodFilter active={period} />
      </div>

      <p className="mb-8 text-xs text-ink-faint">
        {meta.label}のデータ · 最終更新 {meta.updatedAt}
      </p>

      <LeadStory kata={lead} />

      <section className="mt-12">
        <h2 className="eyebrow mb-2">#02 — #10</h2>
        <div>
          {rest.map((kata) => (
            <KataRow
              key={kata.slug}
              rank={kata.rank}
              title={kata.title}
              slug={kata.slug}
              tags={kata.tags}
              stats={kata.stats}
              samples={kata.samples}
            />
          ))}
        </div>
      </section>
    </>
  );
}
