export interface YouTubeVideo {
  id: string;
  title: string;
  channelId: string;
  channelName: string;
  thumbnailUrl: string;
  viewCount: number;
  publishedAt: string;
  durationSeconds: number | null;
}

interface YouTubeSearchItem {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    channelId?: string;
    channelTitle?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      medium?: { url?: string };
      default?: { url?: string };
    };
  };
}

interface YouTubeVideoItem {
  id?: string;
  snippet?: YouTubeSearchItem["snippet"];
  statistics?: { viewCount?: string };
  contentDetails?: { duration?: string };
}

function parseIsoDuration(duration: string | undefined): number | null {
  if (!duration) return null;

  const match =
    /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(duration) ?? undefined;
  if (!match) return null;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  return hours * 3600 + minutes * 60 + seconds;
}

function periodToPublishedAfter(period: "week" | "today" | "24h"): string {
  const now = new Date();

  if (period === "24h") {
    now.setHours(now.getHours() - 24);
  } else if (period === "today") {
    now.setHours(0, 0, 0, 0);
  } else {
    now.setDate(now.getDate() - 7);
  }

  return now.toISOString();
}

export async function fetchTrendingShorts(
  apiKey: string,
  period: "week" | "today" | "24h",
  maxResults = 50,
): Promise<YouTubeVideo[]> {
  const publishedAfter = periodToPublishedAfter(period);
  const searchParams = new URLSearchParams({
    part: "snippet",
    type: "video",
    videoDuration: "short",
    order: "viewCount",
    publishedAfter,
    q: "shorts",
    maxResults: String(Math.min(maxResults, 50)),
    key: apiKey,
    relevanceLanguage: "ja",
    regionCode: "JP",
  });

  const searchResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${searchParams.toString()}`,
  );

  if (!searchResponse.ok) {
    const body = await searchResponse.text();
    throw new Error(`YouTube search failed (${searchResponse.status}): ${body}`);
  }

  const searchData = (await searchResponse.json()) as {
    items?: YouTubeSearchItem[];
  };

  const videoIds = (searchData.items ?? [])
    .map((item) => item.id?.videoId)
    .filter((id): id is string => Boolean(id));

  if (videoIds.length === 0) {
    return [];
  }

  const detailsParams = new URLSearchParams({
    part: "snippet,statistics,contentDetails",
    id: videoIds.join(","),
    key: apiKey,
  });

  const detailsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?${detailsParams.toString()}`,
  );

  if (!detailsResponse.ok) {
    const body = await detailsResponse.text();
    throw new Error(
      `YouTube videos.list failed (${detailsResponse.status}): ${body}`,
    );
  }

  const detailsData = (await detailsResponse.json()) as {
    items?: YouTubeVideoItem[];
  };

  return (detailsData.items ?? [])
    .map((item) => {
      const durationSeconds = parseIsoDuration(item.contentDetails?.duration);
      if (durationSeconds !== null && durationSeconds > 60) {
        return null;
      }

      const snippet = item.snippet;
      const thumbnailUrl =
        snippet?.thumbnails?.high?.url ??
        snippet?.thumbnails?.medium?.url ??
        snippet?.thumbnails?.default?.url ??
        "";

      if (!item.id || !snippet?.title || !thumbnailUrl) {
        return null;
      }

      return {
        id: item.id,
        title: snippet.title,
        channelId: snippet.channelId ?? "",
        channelName: snippet.channelTitle ?? "Unknown",
        thumbnailUrl,
        viewCount: Number(item.statistics?.viewCount ?? 0),
        publishedAt: snippet.publishedAt ?? new Date().toISOString(),
        durationSeconds,
      } satisfies YouTubeVideo;
    })
    .filter((video): video is YouTubeVideo => video !== null)
    .sort((a, b) => b.viewCount - a.viewCount);
}
