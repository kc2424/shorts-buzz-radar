import type { Period } from "../types";

export interface DbPollRun {
  id: number;
  period: Period;
  started_at: string;
  completed_at: string | null;
  status: "running" | "completed" | "failed";
  error_message: string | null;
}

export interface DbVideo {
  id: string;
  title: string;
  channel_id: string;
  channel_name: string;
  thumbnail_url: string;
  thumbnail_r2_key: string | null;
  view_count: number;
  published_at: string;
  duration_seconds: number | null;
  fetched_at: string;
}

export interface DbKata {
  id: string;
  slug: string;
  title: string;
  description: string;
  rank: number;
  period: Period;
  video_count: number;
  avg_views: number;
  growth_rate: number;
  tags_json: string;
  mimic_points_json: string;
  checklist_json: string;
  genre_breakdown_json: string;
  related_slugs_json: string;
  poll_run_id: number | null;
  updated_at: string;
}

export interface DbKataSample {
  kata_id: string;
  video_id: string;
  sort_order: number;
  title: string;
  thumbnail_url: string;
  thumbnail_r2_key: string | null;
  view_count: number;
  channel_name: string;
}

export function parseJsonArray<T>(value: string, fallback: T[] = []): T[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}
