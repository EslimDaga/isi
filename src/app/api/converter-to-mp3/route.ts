import { NextRequest, NextResponse } from "next/server";

import ytdl from "ytdl-core";

interface RequestBody {
  url: string;
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface VideoDetails {
  videoId: string;
  title: string;
  description: string | null;
  channelTitle: string;
  publishedAt: string;
  thumbnail: Thumbnail;
  audioUrl: string;
}

const getVideoDetails = async (url: string): Promise<VideoDetails> => {
  const info = await ytdl.getInfo(url);
  const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });

  // Encontrar la miniatura con la resolución más alta
  const bestThumbnail = info.videoDetails.thumbnails.reduce((prev, current) => {
    return current.width * current.height > prev.width * prev.height
      ? current
      : prev;
  });

  return {
    videoId: info.videoDetails.videoId,
    title: info.videoDetails.title,
    description: info.videoDetails.description,
    channelTitle: info.videoDetails.author.name,
    publishedAt: info.videoDetails.publishDate,
    thumbnail: {
      url: bestThumbnail.url,
      width: bestThumbnail.width,
      height: bestThumbnail.height,
    },
    audioUrl: format.url,
  };
};

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body: RequestBody = await req.json();

    if (!body.url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const videoDetails = await getVideoDetails(body.url);

    return NextResponse.json(videoDetails, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching video details:", error);
    return NextResponse.json(
      { error: "Failed to fetch video details" },
      { status: 500 }
    );
  }
};
