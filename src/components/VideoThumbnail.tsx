"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { KataSample } from "@/lib/types";
import { formatViews } from "@/lib/data";

interface VideoThumbnailProps {
  sample: KataSample;
  priority?: boolean;
  sizes?: string;
  className?: string;
  showMeta?: boolean;
  onPreview?: (sample: KataSample) => void;
}

export function VideoThumbnail({
  sample,
  priority = false,
  sizes = "200px",
  className = "",
  showMeta = false,
  onPreview,
}: VideoThumbnailProps) {
  const reduceMotion = useReducedMotion();

  return (
    <figure className={className}>
      <motion.button
        type="button"
        onClick={() => onPreview?.(sample)}
        className="group relative block w-full overflow-hidden text-left"
        whileHover={reduceMotion ? undefined : { scale: 1.015 }}
        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        aria-label={`${sample.title} をプレビュー`}
      >
        <div className="relative aspect-[9/16] bg-surface">
          <Image
            src={sample.thumbnailUrl}
            alt={sample.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={sizes}
          />
          <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-canvas/90 opacity-90 transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:opacity-100">
              <PlayIcon className="ml-0.5 h-4 w-4 text-ink transition-colors group-hover:text-white" />
            </span>
          </div>
          <span className="absolute bottom-2 right-2 rounded-sm border border-line bg-canvas/90 px-1.5 py-0.5 font-en text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
            Shorts
          </span>
        </div>
      </motion.button>

      {showMeta ? (
        <figcaption className="border-t border-line px-3 py-2">
          <p className="truncate text-xs text-ink">{sample.title}</p>
          <p className="font-en text-[11px] tabular-nums text-ink-faint">
            {formatViews(sample.views)} views · {sample.channelName}
          </p>
        </figcaption>
      ) : null}
    </figure>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
