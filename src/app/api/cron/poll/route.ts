import { NextResponse } from "next/server";
import { getAppEnv } from "@/lib/runtime";
import {
  isAuthorizedCronRequest,
  runPollPipeline,
} from "@/lib/pipeline/poll";

export async function POST(request: Request) {
  const env = await getAppEnv();

  if (!env?.DB) {
    return NextResponse.json(
      { error: "Cloudflare DB binding is not available" },
      { status: 503 },
    );
  }

  if (!isAuthorizedCronRequest(request, env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await runPollPipeline(env);
  return NextResponse.json({ ok: true, results });
}
