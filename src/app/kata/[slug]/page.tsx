import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getKataBySlug,
  getRelatedKatas,
  parsePeriod,
} from "@/lib/data";
import { StatsBar } from "@/components/StatsBar";
import { TagList } from "@/components/TagList";
import { ThumbnailGrid } from "@/components/ThumbnailGrid";
import { Sidebar } from "@/components/Sidebar";
import { ShareButton } from "@/components/ShareButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ period?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const kata = await getKataBySlug(slug);
  if (!kata) return { title: "型が見つかりません" };
  return {
    title: kata.title,
    description: kata.description,
  };
}

export default async function KataDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const period = parsePeriod(query.period);
  const kata = await getKataBySlug(slug, period);

  if (!kata) {
    notFound();
  }

  const relatedKatas = await getRelatedKatas(kata.relatedSlugs, period);

  return (
    <div className="container-main">
      <nav className="mb-6 text-sm" aria-label="パンくず">
        <ol className="flex flex-wrap items-center gap-2 text-ink-faint">
          <li>
            <Link
              href={period === "week" ? "/" : `/?period=${period}`}
              className="hover:text-accent-ink"
            >
              型一覧
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink-soft">{kata.title}</li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
        <article>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow mb-2">
                #{String(kata.rank).padStart(2, "0")} — Format Detail
              </p>
              <h1 className="text-[clamp(26px,3.2vw,36px)] font-semibold tracking-tight text-ink">
                {kata.title}
              </h1>
            </div>
            <ShareButton title={kata.title} />
          </div>

          <div className="mb-6">
            <TagList tags={kata.tags} />
          </div>

          <StatsBar stats={kata.stats} />

          <section className="mt-8">
            <h2 className="eyebrow mb-3">この型の特徴</h2>
            <p className="accent-border-left text-ink-soft">{kata.description}</p>
          </section>

          <section className="mt-10">
            <h2 className="eyebrow mb-3">真似チェックリスト</h2>
            <ul>
              {kata.checklist.map((item, i) => (
                <li
                  key={item}
                  className="flex gap-3 border-t border-line py-3 first:border-t-0 first:pt-0"
                >
                  <span className="font-en shrink-0 text-xs tabular-nums text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="eyebrow mb-4">サンプル動画</h2>
            <ThumbnailGrid samples={kata.samples} variant="grid" />
          </section>
        </article>

        <Sidebar
          genreBreakdown={kata.genreBreakdown}
          relatedKatas={relatedKatas}
        />
      </div>
    </div>
  );
}
