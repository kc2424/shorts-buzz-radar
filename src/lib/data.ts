import type { Period, PeriodMeta, Kata } from "@/lib/types";
import {
  getAllKataSlugs,
  getKataBySlugAndPeriod,
  getKatasByPeriod,
  getPeriodMeta,
} from "@/lib/db/queries";
import {
  formatNumber,
  formatViews,
  getMockKataBySlug,
  getMockRelatedKatas,
  mockKatas,
  periodMeta as mockPeriodMeta,
} from "@/lib/mock-data";
import { isValidPeriod, withDb } from "@/lib/runtime";
import { enrichSample } from "@/lib/youtube";

export { formatNumber, formatViews };

function enrichKata(kata: Kata): Kata {
  return {
    ...kata,
    samples: kata.samples.map((sample, index) =>
      enrichSample({
        id: sample.id,
        title: sample.title,
        thumbnailUrl: sample.thumbnailUrl,
        views: sample.views,
        channelName: sample.channelName,
        seed: kata.rank,
        offset: index,
      }),
    ),
  };
}

export function parsePeriod(value: string | undefined): Period {
  return isValidPeriod(value) ? value : "week";
}

export async function getKatas(period: Period = "week"): Promise<Kata[]> {
  const rows = await withDb((db) => getKatasByPeriod(db, period));
  if (rows && rows.length > 0) {
    return rows.map(enrichKata);
  }

  return mockKatas.map(enrichKata);
}

export async function getKataBySlug(
  slug: string,
  period: Period = "week",
): Promise<Kata | undefined> {
  const row = await withDb((db) => getKataBySlugAndPeriod(db, slug, period));
  if (row) {
    return enrichKata(row);
  }

  const mock = getMockKataBySlug(slug);
  return mock ? enrichKata(mock) : undefined;
}

export async function getRelatedKatas(
  slugs: string[],
  period: Period = "week",
): Promise<Kata[]> {
  const results = await Promise.all(
    slugs.map((slug) => getKataBySlug(slug, period)),
  );

  const fromDb = results.filter((kata): kata is Kata => kata !== undefined);
  if (fromDb.length > 0) {
    return fromDb;
  }

  return getMockRelatedKatas(slugs).map(enrichKata);
}

export async function getPeriodMetaFor(period: Period): Promise<PeriodMeta> {
  const meta = await withDb((db) => getPeriodMeta(db, period));
  if (meta && meta.updatedAt !== "—") {
    return meta;
  }

  return mockPeriodMeta[period];
}

export async function getAllSlugs(): Promise<string[]> {
  const slugs = await withDb((db) => getAllKataSlugs(db));
  if (slugs && slugs.length > 0) {
    return slugs;
  }

  return mockKatas.map((kata) => kata.slug);
}
