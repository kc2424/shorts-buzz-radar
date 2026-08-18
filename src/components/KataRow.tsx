import Link from "next/link";
import type { KataSample } from "@/lib/types";
import { formatViews } from "@/lib/data";
import { TagList } from "./TagList";
import { MiniThumbs } from "./ThumbnailGrid";

interface KataRowProps {
  rank: number;
  title: string;
  slug: string;
  tags: string[];
  stats: { avgViews: number; growthRate: number };
  samples: KataSample[];
}

export function KataRow({
  rank,
  title,
  slug,
  tags,
  stats,
  samples,
}: KataRowProps) {
  return (
    <Link
      href={`/kata/${slug}`}
      className="kata-row group flex items-center gap-4 border-b border-line py-5 transition-colors sm:gap-6"
    >
      <span className="font-en w-8 shrink-0 text-lg font-semibold tabular-nums text-ink-faint">
        {String(rank).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[17px] font-semibold tracking-tight text-ink transition-colors group-hover:text-accent-ink">
          {title}
        </h3>
        <TagList tags={tags} />
      </div>
      <MiniThumbs samples={samples} />
      <div className="hidden shrink-0 text-right sm:block">
        <p className="font-en text-sm font-semibold tabular-nums text-ink">
          {formatViews(stats.avgViews)}
        </p>
        <p className="font-en text-xs tabular-nums text-accent">
          +{stats.growthRate}%
        </p>
      </div>
    </Link>
  );
}
