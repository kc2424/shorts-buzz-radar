export type Period = "week" | "today" | "24h";

export interface KataStats {
  videoCount: number;
  avgViews: number;
  growthRate: number;
}

export interface KataSample {
  id: string;
  title: string;
  thumbnailUrl: string;
  views: number;
  channelName: string;
}

export interface GenreBreakdown {
  genre: string;
  percentage: number;
}

export interface Kata {
  id: string;
  slug: string;
  rank: number;
  title: string;
  tags: string[];
  stats: KataStats;
  mimicPoints: string[];
  description: string;
  checklist: string[];
  samples: KataSample[];
  genreBreakdown: GenreBreakdown[];
  relatedSlugs: string[];
}

export interface PeriodMeta {
  label: string;
  updatedAt: string;
}
