import {
  isAuthorizedCronRequest,
  runPollPipeline,
} from "../../src/lib/pipeline/poll";

export interface Env {
  DB: D1Database;
  THUMBNAILS: R2Bucket;
  YOUTUBE_API_KEY: string;
  GEMINI_API_KEY: string;
  CRON_SECRET: string;
}

export default {
  async scheduled(
    _controller: ScheduledController,
    env: Env,
    _ctx: ExecutionContext,
  ) {
    await runPollPipeline(env);
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ ok: true, service: "buzz-style-poll" });
    }

    if (url.pathname === "/trigger" && request.method === "POST") {
      if (!isAuthorizedCronRequest(request, env.CRON_SECRET)) {
        return new Response("Unauthorized", { status: 401 });
      }

      const results = await runPollPipeline(env);
      return Response.json({ ok: true, results });
    }

    return new Response("Buzz Style poll worker", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
