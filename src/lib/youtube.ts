import { poolIndex, SAMPLE_VIDEO_POOL, type SampleVideo } from "./sample-videos";

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

export function isYouTubeVideoId(id: string): boolean {
  return YOUTUBE_ID_RE.test(id);
}

export function getYouTubeThumbnail(
  videoId: string,
  quality: "hq" | "max" | "oar" = "oar",
): string {
  const file =
    quality === "max"
      ? "maxresdefault.jpg"
      : quality === "oar"
        ? "oardefault.jpg"
        : "hqdefault.jpg";

  return `https://i.ytimg.com/vi/${videoId}/${file}`;
}

export function getYouTubeShortsUrl(videoId: string): string {
  return `https://www.youtube.com/shorts/${videoId}`;
}

export function getYouTubeEmbedUrl(videoId: string, autoplay = false): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });

  if (autoplay) {
    params.set("autoplay", "1");
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function resolveSampleVideo(
  id: string,
  seed = 0,
  offset = 0,
): SampleVideo {
  if (isYouTubeVideoId(id)) {
    const pooled = SAMPLE_VIDEO_POOL.find((video) => video.id === id);
    return (
      pooled ?? {
        id,
        title: "YouTube Shorts",
        channelName: "YouTube",
        views: 0,
      }
    );
  }

  const index = poolIndex(Number.isFinite(seed) ? seed : hashString(id), offset);
  return SAMPLE_VIDEO_POOL[index]!;
}

export function enrichSample(input: {
  id: string;
  title: string;
  thumbnailUrl: string;
  views: number;
  channelName: string;
  seed?: number;
  offset?: number;
}) {
  const resolved = resolveSampleVideo(
    input.id,
    input.seed ?? hashString(input.id),
    input.offset ?? 0,
  );

  const videoId = isYouTubeVideoId(input.id) ? input.id : resolved.id;
  const usePooledMeta =
    !isYouTubeVideoId(input.id) ||
    input.title.startsWith("サンプル動画") ||
    input.channelName.startsWith("チャンネル");

  return {
    id: videoId,
    title: usePooledMeta ? resolved.title : input.title,
    channelName: usePooledMeta ? resolved.channelName : input.channelName,
    views: usePooledMeta ? resolved.views : input.views,
    thumbnailUrl: getYouTubeThumbnail(videoId, "oar"),
    shortsUrl: getYouTubeShortsUrl(videoId),
  };
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
