"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import type { KataSample } from "@/lib/types";

interface VideoPreviewModalProps {
  sample: KataSample | null;
  onClose: () => void;
}

export function VideoPreviewModal({ sample, onClose }: VideoPreviewModalProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!sample) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [sample, onClose]);

  return (
    <AnimatePresence>
      {sample ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <button
            type="button"
            aria-label="閉じる"
            className="absolute inset-0 bg-ink/40"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${sample.title} のプレビュー`}
            className="relative z-10 w-full max-w-sm border border-line-strong bg-canvas"
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.98 }
            }
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="min-w-0 pr-3">
                <p className="truncate text-sm font-semibold text-ink">
                  {sample.title}
                </p>
                <p className="truncate text-xs text-ink-faint">
                  {sample.channelName}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn-pill-outline shrink-0 px-3 py-1 text-xs"
              >
                閉じる
              </button>
            </div>

            <div className="relative aspect-[9/16] bg-surface">
              <iframe
                src={getYouTubeEmbedUrl(sample.id, true)}
                title={sample.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="border-t border-line px-4 py-3">
              <a
                href={sample.shortsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-primary inline-flex w-full justify-center text-sm"
              >
                YouTube Shorts で開く
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
