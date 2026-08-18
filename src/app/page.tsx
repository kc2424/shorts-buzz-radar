import { HomeContent } from "@/components/HomeContent";
import { getKatas, getPeriodMetaFor, parsePeriod } from "@/lib/data";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const period = parsePeriod(params.period);
  const [katas, meta] = await Promise.all([
    getKatas(period),
    getPeriodMetaFor(period),
  ]);

  return (
    <div className="container-main">
      <HomeContent period={period} meta={meta} katas={katas} />
    </div>
  );
}
