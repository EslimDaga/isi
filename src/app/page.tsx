"use client";

import { Toaster, toast } from "sonner";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [musicInfo, setMusicInfo] = useState({
    videoId: "",
    title: "",
    description: "",
    channelTitle: "",
    audioUrl: "",
    thumbnail: {
      url: "",
      width: 0,
      height: 0,
    },
  });

  const handleConvert = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/.test(
      e.target.value
    );

    if (!regex) {
      setMusicInfo({
        videoId: "",
        title: "",
        description: "",
        channelTitle: "",
        audioUrl: "",
        thumbnail: {
          url: "",
          width: 0,
          height: 0,
        },
      });

      toast.error("Invalid URL", {
        position: "bottom-center",
        duration: 3000,
      });
      return;
    }

    setUrl(e.target.value);
    setLoading(true);

    fetch("/api/converter-to-mp3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: e.target.value }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMusicInfo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className="flex-col items-center justify-between w-full h-screen p-24">
      <section className="flex flex-col items-center h-full gap-4">
        <Image src="/logo.png" alt="logo" width={60} height={60} />
        <div className="flex gap-4">
          <input
            className="h-12 w-[25rem] rounded-lg border-[#ff8989] indent-4 text-black shadow-lg focus:outline-none focus:ring focus:ring-[#ff8989]"
            type="text"
            placeholder="Url here..."
            onChange={handleConvert}
            value={url}
          />
        </div>
        {loading && (
          <div className="w-10 h-10 border-[8px] border-gray-300 rounded-full animate-spin border-t-[#ff8989] mt-10"></div>
        )}
        {musicInfo.title.length > 0 && (
          <div className="flex flex-row border-2 border-black rounded-xl w-[35rem] p-4 gap-4">
            <Image
              src={musicInfo.thumbnail.url}
              alt={musicInfo.title}
              width={150}
              height={75}
              className="rounded-xl"
            />
            <div className="flex flex-col gap-4">
              <p className="text-sm">{musicInfo.title}</p>
              <button className="bg-[#ff8989] rounded-lg p-2 text-white w-auto">
                Download
              </button>
            </div>
          </div>
        )}
      </section>
      <Toaster richColors />
    </main>
  );
}
