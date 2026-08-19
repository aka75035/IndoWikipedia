export function getGoogleDriveFileId(
  source: string
): string | null {
  try {
    const url = new URL(source);

    const hostname = url.hostname
      .toLowerCase()
      .replace(/^www\./, "");

    if (hostname !== "drive.google.com") {
      return null;
    }

    const fileMatch =
      url.pathname.match(
        /\/file\/d\/([^/]+)/
      );

    if (fileMatch?.[1]) {
      return fileMatch[1];
    }

    const id =
      url.searchParams.get("id");

    return id || null;
  } catch {
    return null;
  }
}

export function getImageUrl(
  source: string
): string {
  const fileId =
    getGoogleDriveFileId(source);

  if (!fileId) {
    return source;
  }

  return `/api/media/google-drive?url=${encodeURIComponent(
    source
  )}`;
}