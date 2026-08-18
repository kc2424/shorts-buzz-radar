import type { AppEnv } from "@/lib/env";
import type { Kata, Period, PeriodMeta } from "@/lib/types";
import {
  parseJsonArray,
  type DbKata,
  type DbKataSample,
} from "@/lib/db/schema";

const periodLabels: Record<Period, string> = {
  week: "今週",
  today: "今日",
  "24h": "24h",
};

function toThumbnailUrl(
  videoId: string,
  thumbnailUrl: string,
  r2Key: string | null,
): string {
  if (r2Key) {
    return `/api/thumbnails/${encodeURIComponent(r2Key)}`;
  }
  return thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function mapKataRow(
  row: DbKata,
  samples: DbKataSample[],
): Kata {
  return {
    id: row.id,
    slug: row.slug,
    rank: row.rank,
    title: row.title,
    tags: parseJsonArray<string>(row.tags_json),
    stats: {
      videoCount: row.video_count,
      avgViews: row.avg_views,
      growthRate: Math.round(row.growth_rate),
    },
    mimicPoints: parseJsonArray<string>(row.mimic_points_json),
    description: row.description,
    checklist: parseJsonArray<string>(row.checklist_json),
    samples: samples.map((sample) => ({
      id: sample.video_id,
      title: sample.title,
      thumbnailUrl: toThumbnailUrl(
        sample.video_id,
        sample.thumbnail_url,
        sample.thumbnail_r2_key,
      ),
      views: sample.view_count,
      channelName: sample.channel_name,
      shortsUrl: "",
    })),
    genreBreakdown: parseJsonArray(row.genre_breakdown_json),
    relatedSlugs: parseJsonArray<string>(row.related_slugs_json),
  };
}

export async function getLatestUpdatedAt(
  db: D1Database,
  period: Period,
): Promise<string | null> {
  const result = await db
    .prepare(
      `SELECT MAX(updated_at) AS updated_at
       FROM katas
       WHERE period = ?`,
    )
    .bind(period)
    .first<{ updated_at: string | null }>();

  return result?.updated_at ?? null;
}

export async function getPeriodMeta(
  db: D1Database,
  period: Period,
): Promise<PeriodMeta> {
  const updatedAt = await getLatestUpdatedAt(db, period);
  const formatted = updatedAt
    ? formatJstTimestamp(updatedAt)
    : "—";

  return {
    label: periodLabels[period],
    updatedAt: formatted,
  };
}

export async function getKatasByPeriod(
  db: D1Database,
  period: Period,
): Promise<Kata[]> {
  const rows = await db
    .prepare(
      `SELECT *
       FROM katas
       WHERE period = ?
       ORDER BY rank ASC
       LIMIT 10`,
    )
    .bind(period)
    .all<DbKata>();

  const katas: Kata[] = [];

  for (const row of rows.results ?? []) {
    const samples = await getKataSamples(db, row.id);
    katas.push(mapKataRow(row, samples));
  }

  return katas;
}

export async function getKataBySlugAndPeriod(
  db: D1Database,
  slug: string,
  period: Period = "week",
): Promise<Kata | null> {
  const row = await db
    .prepare(
      `SELECT *
       FROM katas
       WHERE slug = ? AND period = ?
       LIMIT 1`,
    )
    .bind(slug, period)
    .first<DbKata>();

  if (!row) return null;

  const samples = await getKataSamples(db, row.id);
  return mapKataRow(row, samples);
}

export async function getAllKataSlugs(db: D1Database): Promise<string[]> {
  const rows = await db
    .prepare(
      `SELECT DISTINCT slug
       FROM katas
       WHERE period = 'week'
       ORDER BY rank ASC`,
    )
    .all<{ slug: string }>();

  return (rows.results ?? []).map((row) => row.slug);
}

async function getKataSamples(
  db: D1Database,
  kataId: string,
): Promise<DbKataSample[]> {
  const result = await db
    .prepare(
      `SELECT
         ks.kata_id,
         ks.video_id,
         ks.sort_order,
         v.title,
         v.thumbnail_url,
         v.thumbnail_r2_key,
         v.view_count,
         v.channel_name
       FROM kata_samples ks
       INNER JOIN videos v ON v.id = ks.video_id
       WHERE ks.kata_id = ?
       ORDER BY ks.sort_order ASC`,
    )
    .bind(kataId)
    .all<DbKataSample>();

  return result.results ?? [];
}

export async function replacePeriodKatas(
  env: AppEnv,
  period: Period,
  katas: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    rank: number;
    videoCount: number;
    avgViews: number;
    growthRate: number;
    tags: string[];
    mimicPoints: string[];
    checklist: string[];
    genreBreakdown: Array<{ genre: string; percentage: number }>;
    relatedSlugs: string[];
    sampleVideoIds: string[];
  }>,
  pollRunId: number,
): Promise<void> {
  const now = new Date().toISOString();

  await env.DB.prepare(`DELETE FROM katas WHERE period = ?`).bind(period).run();

  for (const kata of katas) {
    await env.DB.prepare(
      `INSERT INTO katas (
         id, slug, title, description, rank, period,
         video_count, avg_views, growth_rate,
         tags_json, mimic_points_json, checklist_json,
         genre_breakdown_json, related_slugs_json,
         poll_run_id, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        kata.id,
        kata.slug,
        kata.title,
        kata.description,
        kata.rank,
        period,
        kata.videoCount,
        kata.avgViews,
        kata.growthRate,
        JSON.stringify(kata.tags),
        JSON.stringify(kata.mimicPoints),
        JSON.stringify(kata.checklist),
        JSON.stringify(kata.genreBreakdown),
        JSON.stringify(kata.relatedSlugs),
        pollRunId,
        now,
      )
      .run();

    for (const [index, videoId] of kata.sampleVideoIds.entries()) {
      await env.DB.prepare(
        `INSERT OR IGNORE INTO kata_samples (kata_id, video_id, sort_order)
         VALUES (?, ?, ?)`,
      )
        .bind(kata.id, videoId, index)
        .run();
    }
  }
}

export async function upsertVideo(
  env: AppEnv,
  video: {
    id: string;
    title: string;
    channelId: string;
    channelName: string;
    thumbnailUrl: string;
    thumbnailR2Key?: string | null;
    viewCount: number;
    publishedAt: string;
    durationSeconds?: number | null;
  },
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO videos (
       id, title, channel_id, channel_name, thumbnail_url,
       thumbnail_r2_key, view_count, published_at, duration_seconds, fetched_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       title = excluded.title,
       channel_name = excluded.channel_name,
       thumbnail_url = excluded.thumbnail_url,
       thumbnail_r2_key = COALESCE(excluded.thumbnail_r2_key, videos.thumbnail_r2_key),
       view_count = excluded.view_count,
       fetched_at = excluded.fetched_at`,
  )
    .bind(
      video.id,
      video.title,
      video.channelId,
      video.channelName,
      video.thumbnailUrl,
      video.thumbnailR2Key ?? null,
      video.viewCount,
      video.publishedAt,
      video.durationSeconds ?? null,
      new Date().toISOString(),
    )
    .run();
}

export async function startPollRun(
  db: D1Database,
  period: Period,
): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO poll_runs (period, started_at, status)
       VALUES (?, ?, 'running')`,
    )
    .bind(period, new Date().toISOString())
    .run();

  return Number(result.meta.last_row_id);
}

export async function finishPollRun(
  db: D1Database,
  pollRunId: number,
  status: "completed" | "failed",
  errorMessage?: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE poll_runs
       SET completed_at = ?, status = ?, error_message = ?
       WHERE id = ?`,
    )
    .bind(new Date().toISOString(), status, errorMessage ?? null, pollRunId)
    .run();
}

function formatJstTimestamp(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(/\//g, "-")
    .concat(" JST");
}
