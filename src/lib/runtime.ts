import type { AppEnv } from "@/lib/env";

export async function getAppEnv(): Promise<AppEnv | null> {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return null;
  }

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });

    if (env && "DB" in env && env.DB) {
      return env as AppEnv;
    }
  } catch {
    // Local Next dev without Cloudflare bindings
  }

  return null;
}

export function isValidPeriod(value: string | undefined): value is "week" | "today" | "24h" {
  return value === "week" || value === "today" || value === "24h";
}

async function withDb<T>(fn: (db: D1Database) => Promise<T>): Promise<T | null> {
  const env = await getAppEnv();
  if (!env?.DB) {
    return null;
  }

  try {
    return await fn(env.DB);
  } catch {
    return null;
  }
}

export { withDb };
