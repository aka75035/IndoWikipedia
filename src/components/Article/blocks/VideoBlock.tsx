"use client";

import { useEffect, useRef, useState } from "react";

import type {
  VideoBlockContent,
} from "@/types/article-editor";

type Props = {
  content: VideoBlockContent;
};

type VideoSource =
  | {
      type: "file";
      url: string;
    }
  | {
      type: "youtube";
      url: string;
    }
  | {
      type: "vimeo";
      url: string;
    }
  | {
      type: "dailymotion";
      url: string;
    }
  | {
      type: "embed";
      url: string;
    };

function getVideoSource(
  source: string
): VideoSource {
  try {
    const url = new URL(source);

    const hostname = url.hostname
      .toLowerCase()
      .replace(/^www\./, "");

    
    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com"
    ) {
      const videoId =
        url.searchParams.get("v");

      if (videoId) {
        return {
          type: "youtube",
          url: `https://www.youtube.com/embed/${videoId}`,
        };
      }

      const shortsMatch =
        url.pathname.match(
          /^\/shorts\/([^/?]+)/
        );

      if (shortsMatch?.[1]) {
        return {
          type: "youtube",
          url: `https://www.youtube.com/embed/${shortsMatch[1]}`,
        };
      }

      const embedMatch =
        url.pathname.match(
          /^\/embed\/([^/?]+)/
        );

      if (embedMatch?.[1]) {
        return {
          type: "youtube",
          url: `https://www.youtube.com/embed/${embedMatch[1]}`,
        };
      }
    }

    
    if (hostname === "youtu.be") {
      const videoId =
        url.pathname.split("/")[1];

      if (videoId) {
        return {
          type: "youtube",
          url: `https://www.youtube.com/embed/${videoId}`,
        };
      }
    }

    
    if (
      hostname === "vimeo.com" ||
      hostname === "player.vimeo.com"
    ) {
      const match =
        url.pathname.match(
          /\/(?:video\/)?(\d+)/
        );

      if (match?.[1]) {
        return {
          type: "vimeo",
          url: `https://player.vimeo.com/video/${match[1]}`,
        };
      }
    }

    
    if (
      hostname === "dailymotion.com" ||
      hostname === "geo.dailymotion.com"
    ) {
      const match =
        url.pathname.match(
          /\/video\/([^_/?]+)/
        );

      if (match?.[1]) {
        return {
          type: "dailymotion",
          url: `https://geo.dailymotion.com/player.html?video=${match[1]}`,
        };
      }
    }

    
    const pathname =
      url.pathname.toLowerCase();

    if (
      pathname.endsWith(".mp4") ||
      pathname.endsWith(".webm") ||
      pathname.endsWith(".ogg") ||
      pathname.endsWith(".ogv") ||
      pathname.endsWith(".mov") ||
      pathname.endsWith(".m4v")
    ) {
      return {
        type: "file",
        url: source,
      };
    }

    
    return {
      type: "embed",
      url: source,
    };
  } catch {
    return {
      type: "embed",
      url: source,
    };
  }
}

function addAutoplayParams(
  source: VideoSource
): string {
  const url = new URL(source.url);

  url.searchParams.set(
    "autoplay",
    "1"
  );

  
  url.searchParams.set(
    "mute",
    "1"
  );

  return url.toString();
}

function EmbeddedVideo({
  source,
  isVisible,
}: {
  source: VideoSource;
  isVisible: boolean;
}) {
  const iframeRef =
    useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe =
      iframeRef.current;

    if (!iframe) {
      return;
    }

    
    if (source.type === "youtube") {
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: isVisible
            ? "playVideo"
            : "pauseVideo",
          args: [],
        }),
        "*"
      );
    }

    
    if (source.type === "vimeo") {
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          method: isVisible
            ? "play"
            : "pause",
        }),
        "*"
      );
    }
  }, [isVisible, source]);

  const src =
    source.type === "youtube"
      ? `${addAutoplayParams(source)}&enablejsapi=1`
      : addAutoplayParams(source);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title="Embedded video"
      loading="lazy"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      className="aspect-video w-full border-0"
    />
  );
}

function DirectVideo({
  url,
  isVisible,
}: {
  url: string;
  isVisible: boolean;
}) {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video =
      videoRef.current;

    if (!video) {
      return;
    }

    if (isVisible) {
      void video.play().catch(() => {})
    } else {
      video.pause();
    }
  }, [isVisible]);

  return (
    <video
      ref={videoRef}
      src={url}
      controls
      muted
      playsInline
      preload="metadata"
      className="aspect-video w-full bg-black object-contain"
    >
      Your browser does not support video playback.
    </video>
  );
}

export default function VideoBlock({
  content,
}: Props) {
  const containerRef =
    useRef<HTMLElement>(null);

  const [isVisible, setIsVisible] =
    useState(false);

  const source = getVideoSource(
    content.url
  );

  useEffect(() => {
    const element =
      containerRef.current;

    if (!element) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setIsVisible(
            entry.isIntersecting
          );
        },
        {
          
          threshold: 0.3,
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <figure
      ref={containerRef}
      className="my-8 max-w-4xl"
    >
      <div className="overflow-hidden border border-slate-200 bg-black">
        {source.type === "file" ? (
          <DirectVideo
            url={source.url}
            isVisible={isVisible}
          />
        ) : (
          <EmbeddedVideo
            source={source}
            isVisible={isVisible}
          />
        )}
      </div>

      {(content.title ||
        content.caption) && (
        <figcaption className="mt-2 text-sm leading-6 text-slate-500">
          {content.title && (
            <span className="font-medium text-slate-700">
              {content.title}
            </span>
          )}

          {content.caption && (
            <span>
              {content.title
                ? " — "
                : ""}
              {content.caption}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}