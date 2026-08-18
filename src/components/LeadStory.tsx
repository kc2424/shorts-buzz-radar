import Link from "next/link";
import type { Kata } from "@/lib/types";
import { FadeIn } from "./motion/Motion";
import { StatsBar } from "./StatsBar";
import { TagList } from "./TagList";
import { SampleVideoGrid } from "./SampleVideoGrid";

interface LeadStoryProps {
  kata: Kata;
}

export function LeadStory({ kata }: LeadStoryProps) {
  return (
    <FadeIn>
      <article className="section-divider pt-8">
        <div className="mb-4 flex items-baseline gap-3">
          <span className="eyebrow animate-fade-in">#01 — 今週のトップ型</span>
        </div>

        <Link href={`/kata/${kata.slug}`} className="group block">
          <h2 className="mb-3 text-[clamp(26px,3.2vw,36px)] font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent-ink">
            {kata.title}
          </h2>
        </Link>

        <div className="mb-5">
          <TagList tags={kata.tags} />
        </div>

        <StatsBar stats={kata.stats} />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <div>
              <p className="eyebrow mb-3">真似ポイント</p>
              <ul className="accent-border-left space-y-2">
                {kata.mimicPoints.map((point, index) => (
                  <li
                    key={point}
                    className="text-ink-soft animate-slide-in"
                    style={{ animationDelay: `${120 + index * 70}ms` }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={`/kata/${kata.slug}`}
                className="btn-pill-primary mt-6 inline-flex transition-transform duration-300 hover:scale-[1.02]"
              >
                型の詳細を見る
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <SampleVideoGrid samples={kata.samples} variant="lead" />
          </FadeIn>
        </div>
      </article>
    </FadeIn>
  );
}
