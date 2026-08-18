-- Buzz Style D1 schema

CREATE TABLE IF NOT EXISTS poll_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  period TEXT NOT NULL CHECK (period IN ('week', 'today', '24h')),
  started_at TEXT NOT NULL,
  completed_at TEXT,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  channel_name TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  thumbnail_r2_key TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  published_at TEXT NOT NULL,
  duration_seconds INTEGER,
  fetched_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS katas (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rank INTEGER NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('week', 'today', '24h')),
  video_count INTEGER NOT NULL DEFAULT 0,
  avg_views INTEGER NOT NULL DEFAULT 0,
  growth_rate REAL NOT NULL DEFAULT 0,
  tags_json TEXT NOT NULL DEFAULT '[]',
  mimic_points_json TEXT NOT NULL DEFAULT '[]',
  checklist_json TEXT NOT NULL DEFAULT '[]',
  genre_breakdown_json TEXT NOT NULL DEFAULT '[]',
  related_slugs_json TEXT NOT NULL DEFAULT '[]',
  poll_run_id INTEGER REFERENCES poll_runs(id) ON DELETE SET NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (slug, period)
);

CREATE TABLE IF NOT EXISTS kata_samples (
  kata_id TEXT NOT NULL REFERENCES katas(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (kata_id, video_id)
);

CREATE INDEX IF NOT EXISTS idx_katas_period_rank ON katas(period, rank);
CREATE INDEX IF NOT EXISTS idx_katas_slug_period ON katas(slug, period);
CREATE INDEX IF NOT EXISTS idx_poll_runs_period ON poll_runs(period, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_fetched_at ON videos(fetched_at DESC);
