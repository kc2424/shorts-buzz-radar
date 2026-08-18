import { NextResponse } from "next/server";
import { getThumbnailFromR2 } from "@/lib/r2/thumbnails";
import { getAppEnv } from "@/lib/runtime";

interface RouteProps {
  params: Promise<{ key: string[] }>;
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { key: keyParts } = await params;
  const key = decodeURIComponent(keyParts.join("/"));
  const env = await getAppEnv();

  if (!env?.THUMBNAILS) {
    return NextResponse.json({ error: "R2 binding unavailable" }, { status: 503 });
  }

  const object = await getThumbnailFromR2(env.THUMBNAILS, key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=604800");

  return new Response(object.body, { headers });
}
