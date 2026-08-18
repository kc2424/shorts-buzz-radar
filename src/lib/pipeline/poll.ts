import type { AppEnv } from "@/lib/env";
import type { Period } from "@/lib/types";
import {
  finishPollRun,
  replacePeriodKatas,
  startPollRun,
  upsertVideo,
} from "@/lib/db/queries";
import { analyzeVideosIntoKatas } from "@/lib/gemini/analyze";
import { cacheThumbnailToR2 } from "@/lib/r2/thumbnails";
import { fetchTrendingShorts } from "@/lib/youtube/client";

const PERIODS: Period[] = ["week", "today", "24h"];

export interface PollResult {
  period: Period;
  pollRunId: number;
  videoCount: number;
  kataCount: number;
  status: "completed" | "failed";
  error?: string;
}

export async function runPollForPeriod(
  env: AppEnv,
  period: Period,
): Promise<PollResult> {
  const pollRunId = await startPollRun(env.DB, period);

  try {
    if (!env.YOUTUBE_API_KEY || !env.GEMINI_API_KEY) {
      throw new Error("YOUTUBE_API_KEY and GEMINI_API_KEY must be configured");
    }

    const videos = await fetchTrendingShorts(env.YOUTUBE_API_KEY, period, 50);

    for (const video of videos) {
      const r2Key = await cacheThumbnailToR2(
        env.THUMBNAILS,
        video.id,
        video.thumbnailUrl,
      );

      await upsertVideo(env, {
        id: video.id,
        title: video.title,
        channelId: video.channelId,
        channelName: video.channelName,
        thumbnailUrl: video.thumbnailUrl,
        thumbnailR2Key: r2Key,
        viewCount: video.viewCount,
        publishedAt: video.publishedAt,
        durationSeconds: video.durationSeconds,
      });
    }

    const drafts = await analyzeVideosIntoKatas(env.GEMINI_API_KEY, videos);

    await replacePeriodKatas(
      env,
      period,
      drafts.map((draft, index) => ({
        id: `${period}-${draft.slug}`,
        slug: draft.slug,
        title: draft.title,
        description: draft.description,
        rank: index + 1,
        videoCount: draft.videoCount,
        avgViews: draft.avgViews,
        growthRate: draft.growthRate,
        tags: draft.tags,
        mimicPoints: draft.mimicPoints,
        checklist: draft.checklist,
        genreBreakdown: draft.genreBreakdown,
        relatedSlugs: draft.relatedSlugs,
        sampleVideoIds: draft.sampleVideoIds,
      })),
      pollRunId,
    );

    await finishPollRun(env.DB, pollRunId, "completed");

    return {
      period,
      pollRunId,
      videoCount: videos.length,
      kataCount: drafts.length,
      status: "completed",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown poll error";
    await finishPollRun(env.DB, pollRunId, "failed", message);

    return {
      period,
      pollRunId,
      videoCount: 0,
      kataCount: 0,
      status: "failed",
      error: message,
    };
  }
}

export async function runPollPipeline(env: AppEnv): Promise<PollResult[]> {
  const results: PollResult[] = [];

  for (const period of PERIODS) {
    results.push(await runPollForPeriod(env, period));
  }

  return results;
}

export function isAuthorizedCronRequest(
  request: Request,
  secret: string | undefined,
): boolean {
  if (!secret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) {
    return true;
  }

  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}
