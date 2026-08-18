export async function cacheThumbnailToR2(
  bucket: R2Bucket,
  videoId: string,
  sourceUrl: string,
): Promise<string | null> {
  const key = `thumbnails/${videoId}.jpg`;

  const existing = await bucket.head(key);
  if (existing) {
    return key;
  }

  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      return null;
    }

    const bytes = await response.arrayBuffer();
    await bucket.put(key, bytes, {
      httpMetadata: {
        contentType: response.headers.get("content-type") ?? "image/jpeg",
        cacheControl: "public, max-age=604800",
      },
    });

    return key;
  } catch {
    return null;
  }
}

export async function getThumbnailFromR2(
  bucket: R2Bucket,
  key: string,
): Promise<R2ObjectBody | null> {
  return bucket.get(key);
}
