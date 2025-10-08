"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  id: number;
  username: string;
  profilePic: string;
  videoUrl: string;
  likes: number;
  caption: string;
};

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/mokedata/db.json")
      .then((res) => res.json())
      .then((data) => {
        const shuffled = data.sort(() => Math.random() - 0.5);
        setPosts(shuffled);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="lg:w-[1000px] md:w-[650px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
  <div className="columns-2 xs-columns-2 sm:columns-3 gap-0 sm:gap-3 md:gap-4">
    {posts.map((post) => {
    const randomHeight = Math.floor(Math.random() * (400 - 200 + 1)) + 200;

      return (
        <Link 
          key={post.id} 
          href={`/reels/${post.id}`}
          className="block mb-2 sm:mb-3 md:mb-4 break-inside-avoid"
        >
          <div
            className="bg-black rounded-md overflow-hidden cursor-pointer group"
            style={{
              height: `${randomHeight}px`,
            }}
          >
            <video
              src={post.videoUrl}
              muted
              loop
              playsInline
              className="w-full md:w-[300px] h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          </div>
        </Link>
      );
    })}
  </div>
</div>

  );
}
