import { NextRequest } from "next/server";

function getGoogleDriveFileId(
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

    if (id) {
      return id;
    }

    return null;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest
) {
  const source =
    request.nextUrl.searchParams.get("url");

  if (!source) {
    return new Response(
      "Missing image URL",
      {
        status: 400,
      }
    );
  }

  const fileId =
    getGoogleDriveFileId(source);

  if (!fileId) {
    return new Response(
      "Invalid Google Drive URL",
      {
        status: 400,
      }
    );
  }

  const driveUrl =
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;

  try {
    const response =
      await fetch(driveUrl, {
        cache: "no-store",
      });

    if (!response.ok) {
      return new Response(
        "Unable to fetch Google Drive image",
        {
          status: response.status,
        }
      );
    }

    const contentType =
      response.headers.get(
        "content-type"
      ) || "image/jpeg";

    const body =
      await response.arrayBuffer();

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,

        "Cache-Control":
          "public, max-age=3600",
      },
    });
  } catch {
    return new Response(
      "Failed to fetch Google Drive image",
      {
        status: 500,
      }
    );
  }
}