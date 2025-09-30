"use client"

import React, { useEffect, useRef, useState } from "react";
import '@/app/globals.css'
import { Bookmark, ChevronsLeft, ChevronsRight, Ellipsis, EllipsisVertical, Heart, Key, MessageCircle, Pause, Play, Share2 } from 'lucide-react';
import { number } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";


type Story = {
  id: number;
  user: string;
  avatar: string;
  items: Array<{ type: string; src: string; duration: number }>;
}
type Post = {
  id: number;
  username: string;
  profilePic: string;
  videoUrl: string;
  likes: number;
  caption: string;
  comments: Array<{ user: string; text: string }>;
};


// Instagram-style Stories Component (Readable + Mock Data)
export default function Home() {
  const [open, setOpen] = useState(false);
  const [activeStory, setActiveStory] = useState({ userIndex: 0, itemIndex: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const progressRef = useRef(null);
  const timerRef = useRef<null | NodeJS.Timeout>(null);
  const scrollRef = useRef(null);
  const [showFull, setShowFull] = useState<{ [Key: number]: boolean }>({});
  const [saved, setSaved] = useState<{ [key: number]: boolean }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});
const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);

  const [post, setPost] = useState<Post[]>([]);


  useEffect(() => {

    fetch("/mokedata/stories.json")
      .then((res) => res.json())      
      .then((data) => setStories(data))
      .catch((err) => console.error(err));
  }, []);

  console.log(stories);
  
  
  if (!stories) {
    return <div className="text-white">Loading...</div>;
  }

  useEffect(() => {

    fetch("/mokedata/db.json")
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error(err));
  }, []);

  if (!post) {
    return <div className="text-white">Loading...</div>;
  }
  
  const toggleLike = (id: number) => {
    setLikedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSave = (id: number) => {
    setSaved((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const text =
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laudantium odit quod modi hic temporibus nam quibusdam nihil fugit culpa nemo!";

  // Split text into words
  const words = text.split(" ");
  const shortText = words.slice(0, 6).join(" ");

  const toggleShow = (id: number) => {
    setShowFull((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  function openStory(story: any, index: number) {
    setActiveStory({ userIndex: index, itemIndex: 0 });
    setOpen(true);
    setIsPlaying(true);
     const lowercaseUser = story.user.toLowerCase();
  const lowercaseId = story.id.toString().toLowerCase();
  router.push(`/story/${lowercaseUser}/${lowercaseId}`);
      router.push(`/story/${story.user}/${story.id}`);
  }


  function scrollLeft() {
    if (scrollRef.current) {
      (scrollRef.current as HTMLDivElement).scrollBy({ left: -150, behavior: 'smooth' });
    }
  }

  function scrollRight() {
    if (scrollRef.current) {
      (scrollRef.current as HTMLDivElement).scrollBy({ left: 150, behavior: 'smooth' });
    }
  }

  return (
    <div className="w-full justify-items-center ">

      <div className="relative w-[450px]">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/4 z-10 w-6  h-6 rounded-full shadow text-black bg-white ">
          <ChevronsLeft />
        </button>

        {/* Stories Row */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto py-3 px-4  no-scrollbar"
        >
          {stories.map((story, index) => (
            <button
              key={story.id}
              onClick={() => openStory(story , index)}
              className="flex flex-col items-center min-w-[76px]"
            >
              <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-yellow-400 to-red-500">
                <img
                  src={story.avatar}
                  alt={story.user}
                  className="w-full h-full object-cover rounded-full border-2 border-white"
                />
              </div>
              <span className="text-xs mt-2 truncate w-20">{story.user}</span>
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-3 top-1/4 z-10 h-6 w-6 rounded-full shadow text-black bg-white ">
          <ChevronsRight />
        </button>
      </div>

      
      
      {post.map(p => (
        <div key={p.id} className="w-[370px] mt-6">
          {/* userId */}
          <div className="flex items-center justify-between">
            <div className="userId flex items-center gap-1">
              <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-yellow-400 to-red-500">
                <img src={p.profilePic} alt={p.profilePic} className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="username text-white">{p.username}</div>
            </div>
            <div className="dotted text-white">
              <Ellipsis />
            </div>
          </div>

          {/* post */}
          <div className="post mt-1">
            <img src={p.profilePic} alt="" className="w-[370px] h-[450px]" />
          </div>

          {/* like, comment, share*/}
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-2">
              <div
                className="like cursor-pointer"
                onClick={() => toggleLike(p.id)}
              >
                <Heart className={`transition-all duration-300 ${likedPosts[p.id] ? "text-red scale-125" : "text-white scale-100"}`} size={24}
                  fill={likedPosts[p.id] ? "red" : "none"}
                />
              </div>
              <div className="comment text-white"><MessageCircle /></div>
              <div className="share text-white"><Share2 /></div>
            </div>

            {/* save */}
            <div
              className="save text-white cursor-pointer"
              onClick={() => toggleSave(p.id)}
            >
              <Bookmark
                size={24}
                className={`transition-all duration-300 ${saved[p.id] ? "fill-white text-white" : "fill-none text-white"
                  }`}
              />
            </div>
          </div>

          {/* totale like and descptions */}
          <div className="mt-2">
            <div className="totalLike text-white">{p.likes} likes</div>
            <div className="discrptions text-white mt-1">
              {showFull[p.id] ? text : shortText + (words.length > 5 ? "..." : "")}
              {words.length > 5 && (
                <span onClick={() => toggleShow(p.id)} className="text-white/50  cursor-pointer ml-1">
                  {showFull ? "less" : "more"}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function renderItem(item: any) {
  if (!item) return null;
  if (item.type === "image") return <img src={item.src} alt="story" className="h-full w-full object-cover" />;
  if (item.type === "video") return <video src={item.src} className="h-full w-full object-cover" autoPlay muted playsInline />;
  return null;
}
