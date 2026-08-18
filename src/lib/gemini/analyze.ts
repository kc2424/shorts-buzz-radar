import type { YouTubeVideo } from "@/lib/youtube/client";

export interface GeminiKataDraft {
  slug: string;
  title: string;
  tags: string[];
  description: string;
  mimicPoints: string[];
  checklist: string[];
  genreBreakdown: Array<{ genre: string; percentage: number }>;
  relatedSlugs: string[];
  sampleVideoIds: string[];
  videoCount: number;
  avgViews: number;
  growthRate: number;
}

interface GeminiResponse {
  katas?: GeminiKataDraft[];
}

function buildPrompt(videos: YouTubeVideo[]): string {
  const payload = videos.map((video) => ({
    id: video.id,
    title: video.title,
    channel: video.channelName,
    views: video.viewCount,
    publishedAt: video.publishedAt,
    durationSeconds: video.durationSeconds,
  }));

  return `You are analyzing trending YouTube Shorts in Japan.
Given the following video metadata (no video download), cluster them into up to 10 distinct "formats" (型) — reusable content patterns creators can mimic.

Rules:
- Use Japanese for titles, descriptions, mimicPoints, checklist, tags, and genre names.
- slug must be lowercase kebab-case English.
- Each kata needs 3-6 sampleVideoIds from the input list.
- relatedSlugs must reference other slugs in your output (1-3 each).
- genreBreakdown percentages must sum to 100 per kata.
- growthRate is an estimated momentum score (50-400), not a literal percentage from API.
- Focus on composition patterns detectable from title/thumbnail/metadata only.

Return ONLY valid JSON in this shape:
{
  "katas": [
    {
      "slug": "example-format",
      "title": "日本語タイトル",
      "tags": ["tag1", "tag2"],
      "description": "特徴の説明",
      "mimicPoints": ["ポイント1", "ポイント2"],
      "checklist": ["項目1", "項目2"],
      "genreBreakdown": [{"genre": "ジャンル", "percentage": 50}],
      "relatedSlugs": ["other-slug"],
      "sampleVideoIds": ["videoId1", "videoId2"],
      "videoCount": 120,
      "avgViews": 1500000,
      "growthRate": 180
    }
  ]
}

Videos:
${JSON.stringify(payload, null, 2)}`;
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return text.slice(start, end + 1);
  }

  return text.trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

function normalizeKata(
  draft: GeminiKataDraft,
  index: number,
  validVideoIds: Set<string>,
): GeminiKataDraft | null {
  const sampleVideoIds = draft.sampleVideoIds.filter((id) =>
    validVideoIds.has(id),
  );

  if (sampleVideoIds.length === 0) {
    return null;
  }

  const slug = slugify(draft.slug || draft.title) || `kata-${index + 1}`;

  return {
    slug,
    title: draft.title,
    tags: draft.tags.slice(0, 6),
    description: draft.description,
    mimicPoints: draft.mimicPoints.slice(0, 5),
    checklist: draft.checklist.slice(0, 6),
    genreBreakdown: draft.genreBreakdown.slice(0, 5),
    relatedSlugs: draft.relatedSlugs.map(slugify).filter(Boolean).slice(0, 3),
    sampleVideoIds: sampleVideoIds.slice(0, 6),
    videoCount: Math.max(draft.videoCount || sampleVideoIds.length, 1),
    avgViews: Math.max(draft.avgViews || 0, 1),
    growthRate: Math.max(Math.min(draft.growthRate || 100, 500), 1),
  };
}

export async function analyzeVideosIntoKatas(
  apiKey: string,
  videos: YouTubeVideo[],
): Promise<GeminiKataDraft[]> {
  if (videos.length === 0) {
    return [];
  }

  const prompt = buildPrompt(videos.slice(0, 40));
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned empty response");
  }

  const parsed = JSON.parse(extractJson(text)) as GeminiResponse;
  const validVideoIds = new Set(videos.map((video) => video.id));

  const normalized = (parsed.katas ?? [])
    .map((draft, index) => normalizeKata(draft, index, validVideoIds))
    .filter((draft): draft is GeminiKataDraft => draft !== null)
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, 10);

  return normalized.map((draft, index) => {
    const slugSet = new Set(normalized.map((item) => item.slug));
    return {
      ...draft,
      relatedSlugs: draft.relatedSlugs.filter(
        (slug) => slug !== draft.slug && slugSet.has(slug),
      ),
      rank: index + 1,
    };
  });
}
