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

export { formatNumber, formatViews };

export function parsePeriod(value: string | undefined): Period {
  return isValidPeriod(value) ? value : "week";
}

export async function getKatas(period: Period = "week"): Promise<Kata[]> {
  const rows = await withDb((db) => getKatasByPeriod(db, period));
  if (rows && rows.length > 0) {
    return rows;
  }

  return mockKatas;
}

export async function getKataBySlug(
  slug: string,
  period: Period = "week",
): Promise<Kata | undefined> {
  const row = await withDb((db) => getKataBySlugAndPeriod(db, slug, period));
  if (row) {
    return row;
  }

  return getMockKataBySlug(slug);
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

  return getMockRelatedKatas(slugs);
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
