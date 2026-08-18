export interface CloudflareEnv {
  DB: D1Database;
  THUMBNAILS?: R2Bucket;
  YOUTUBE_API_KEY?: string;
  GEMINI_API_KEY?: string;
  CRON_SECRET?: string;
}

export type AppEnv = CloudflareEnv;
