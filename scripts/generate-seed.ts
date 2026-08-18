import { writeFileSync } from "node:fs";
import { mockKatas } from "../src/lib/mock-data";

const periods = ["week", "today", "24h"] as const;

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}

const statements: string[] = [
  "DELETE FROM kata_samples;",
  "DELETE FROM katas;",
  "DELETE FROM videos;",
  "DELETE FROM poll_runs;",
];

for (const period of periods) {
  const pollRunId = periods.indexOf(period) + 1;
  statements.push(
    `INSERT INTO poll_runs (id, period, started_at, completed_at, status) VALUES (${pollRunId}, '${period}', datetime('now'), datetime('now'), 'completed');`,
  );

  for (const kata of mockKatas) {
    const kataId = `${period}-${kata.slug}`;

    for (const [index, sample] of kata.samples.entries()) {
      statements.push(
        `INSERT OR REPLACE INTO videos (id, title, channel_id, channel_name, thumbnail_url, thumbnail_r2_key, view_count, published_at, duration_seconds, fetched_at)
         VALUES ('${escapeSql(sample.id)}', '${escapeSql(sample.title)}', 'channel-${index}', '${escapeSql(sample.channelName)}', '${escapeSql(sample.thumbnailUrl)}', NULL, ${sample.views}, datetime('now'), 15, datetime('now'));`,
      );
    }

    statements.push(
      `INSERT INTO katas (
         id, slug, title, description, rank, period,
         video_count, avg_views, growth_rate,
         tags_json, mimic_points_json, checklist_json,
         genre_breakdown_json, related_slugs_json,
         poll_run_id, updated_at
       ) VALUES (
         '${escapeSql(kataId)}',
         '${escapeSql(kata.slug)}',
         '${escapeSql(kata.title)}',
         '${escapeSql(kata.description)}',
         ${kata.rank},
         '${period}',
         ${kata.stats.videoCount},
         ${kata.stats.avgViews},
         ${kata.stats.growthRate},
         '${escapeSql(JSON.stringify(kata.tags))}',
         '${escapeSql(JSON.stringify(kata.mimicPoints))}',
         '${escapeSql(JSON.stringify(kata.checklist))}',
         '${escapeSql(JSON.stringify(kata.genreBreakdown))}',
         '${escapeSql(JSON.stringify(kata.relatedSlugs))}',
         ${pollRunId},
         datetime('now')
       );`,
    );

    for (const [index, sample] of kata.samples.entries()) {
      statements.push(
        `INSERT OR REPLACE INTO kata_samples (kata_id, video_id, sort_order)
         VALUES ('${escapeSql(kataId)}', '${escapeSql(sample.id)}', ${index});`,
      );
    }
  }
}

writeFileSync("scripts/seed.sql", statements.join("\n"));
console.log(`Wrote ${statements.length} SQL statements to scripts/seed.sql`);
