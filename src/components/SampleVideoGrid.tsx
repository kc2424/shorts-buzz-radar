"use client";

import { useState } from "react";
import type { KataSample } from "@/lib/types";
import { VideoPreviewModal } from "./VideoPreviewModal";
import { VideoThumbnail } from "./VideoThumbnail";

interface SampleVideoGridProps {
  samples: KataSample[];
  variant?: "lead" | "grid";
}

export function SampleVideoGrid({
  samples,
  variant = "grid",
}: SampleVideoGridProps) {
  const [activeSample, setActiveSample] = useState<KataSample | null>(null);

  if (variant === "lead") {
    const [main, ...rest] = samples;
    if (!main) return null;

    return (
      <>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[2fr_1fr]">
          <div className="thumb-border sm:row-span-2">
            <VideoThumbnail
              sample={main}
              priority
              sizes="(max-width: 640px) 50vw, 400px"
              onPreview={setActiveSample}
            />
          </div>
          {rest.slice(0, 2).map((sample) => (
            <div key={sample.id} className="thumb-border">
              <VideoThumbnail
                sample={sample}
                sizes="200px"
                onPreview={setActiveSample}
              />
            </div>
          ))}
        </div>
        <VideoPreviewModal
          sample={activeSample}
          onClose={() => setActiveSample(null)}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {samples.map((sample) => (
          <div key={sample.id} className="thumb-border">
            <VideoThumbnail
              sample={sample}
              showMeta
              sizes="(max-width: 640px) 50vw, 33vw"
              onPreview={setActiveSample}
            />
          </div>
        ))}
      </div>
      <VideoPreviewModal
        sample={activeSample}
        onClose={() => setActiveSample(null)}
      />
    </>
  );
}

export function MiniVideoThumbs({ samples }: { samples: KataSample[] }) {
  const [activeSample, setActiveSample] = useState<KataSample | null>(null);

  return (
    <>
      <div className="mini-thumbs hidden shrink-0 gap-1.5 sm:flex">
        {samples.slice(0, 3).map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => setActiveSample(sample)}
            className="thumb-border group h-16 w-9 overflow-hidden"
            aria-label={`${sample.title} をプレビュー`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sample.thumbnailUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      <VideoPreviewModal
        sample={activeSample}
        onClose={() => setActiveSample(null)}
        />
    </>
  );
}
