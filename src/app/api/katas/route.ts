import { NextResponse } from "next/server";
import { getKatas, getPeriodMetaFor, parsePeriod } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = parsePeriod(searchParams.get("period") ?? undefined);
  const [katas, meta] = await Promise.all([
    getKatas(period),
    getPeriodMetaFor(period),
  ]);

  return NextResponse.json({ period, meta, katas });
}
