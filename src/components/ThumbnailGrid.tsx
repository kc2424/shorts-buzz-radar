import Image from "next/image";
import type { KataSample } from "@/lib/types";
import { formatViews } from "@/lib/data";

interface ThumbnailGridProps {
  samples: KataSample[];
  variant?: "lead" | "grid";
}

export function ThumbnailGrid({
  samples,
  variant = "grid",
}: ThumbnailGridProps) {
  if (variant === "lead") {
    const [main, ...rest] = samples;
    if (!main) return null;

    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-[2fr_1fr]">
        <div className="thumb-border aspect-[9/16] sm:row-span-2">
          <Image
            src={main.thumbnailUrl}
            alt={main.title}
            width={400}
            height={711}
            className="h-full w-full object-cover"
          />
        </div>
        {rest.slice(0, 2).map((sample) => (
          <div key={sample.id} className="thumb-border aspect-[9/16]">
            <Image
              src={sample.thumbnailUrl}
              alt={sample.title}
              width={200}
              height={356}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {samples.map((sample) => (
        <figure key={sample.id} className="thumb-border">
          <div className="relative aspect-[9/16]">
            <Image
              src={sample.thumbnailUrl}
              alt={sample.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </div>
          <figcaption className="border-t border-line px-3 py-2">
            <p className="truncate text-xs text-ink">{sample.title}</p>
            <p className="font-en text-[11px] tabular-nums text-ink-faint">
              {formatViews(sample.views)} views · {sample.channelName}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function MiniThumbs({ samples }: { samples: KataSample[] }) {
  return (
    <div className="mini-thumbs hidden shrink-0 gap-1.5 sm:flex">
      {samples.slice(0, 3).map((sample) => (
        <div
          key={sample.id}
          className="thumb-border h-16 w-9 overflow-hidden"
        >
          <Image
            src={sample.thumbnailUrl}
            alt=""
            width={36}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
