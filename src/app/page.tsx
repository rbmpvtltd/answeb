"use client"

import React, { useEffect, useRef, useState } from "react";
import '@/app/globals.css'
import { Bookmark, ChevronsLeft, ChevronsRight, Ellipsis, Heart, MessageCircle, Share2, Volume2, VolumeOff } from 'lucide-react';
import { useRouter } from "next/navigation";

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

export default function Home() {
  const [open, setOpen] = useState(false);
  const [activeStory, setActiveStory] = useState({ userIndex: 0, itemIndex: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVolumeBtn, setShowVolumeBtn] = useState(false);
  const [showFull, setShowFull] = useState<{ [Key: number]: boolean }>({});
  const [saved, setSaved] = useState<{ [key: number]: boolean }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});
  const [mutedVideos, setMutedVideos] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Data fetching
  useEffect(() => {
    fetch("/mokedata/stories.json")
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch((err) => console.error(err));

    fetch("/mokedata/db.json")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, []);

  // Improved Auto-play on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const postId = parseInt(video.dataset.postId || '0');

          if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
            // Video visible - play it
            video.play().catch(err => {
              console.log("Auto-play prevented:", err);
            });
          } else {
            // Video not visible - pause it
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      {
        threshold: [0.3, 0.7, 1.0],
        rootMargin: '0px 0px -10% 0px' // Trigger when 10% from center
      }
    );

    // Observe all videos
    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [posts]);

  // Handle video click for mute/unmute
  const handleVideoClick = (postId: number) => {
    setShowVolumeBtn(true);

    // Toggle mute for specific video
    setMutedVideos(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    setTimeout(() => setShowVolumeBtn(false), 2000);
  }

  // Toggle play/pause for specific video
  const togglePlayPause = (postId: number) => {
    const video = videoRefs.current[postId];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
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
    router.push(`/story/${story.user.toLowerCase()}/${story.id}`);
  }

  function scrollLeft() {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  }

  function scrollRight() {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  }

  // Text
  const truncateText = (text: string, maxWords: number = 6) => {
    const words = text.split(" ");
    const shortText = words.slice(0, maxWords).join(" ");
    return {
      shortText: shortText + (words.length > maxWords ? "..." : ""),
      isTruncated: words.length > maxWords
    };
  };

  if (!stories || !posts) {
    return <div className="text-white flex justify-center items-center h-20">Loading...</div>;
  }

  return (
    <div className="w-full justify-items-center bg-black min-h-screen">

      {/* Stories Section */}
      <div className="relative w-[450px] bg-black py-4">
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-15 transform -translate-y-1/2 z-10 w-8 h-8 rounded-full shadow text-black bg-white flex items-center justify-center"
        >
          <ChevronsLeft size={20} />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto py-3 px-4 no-scrollbar"
        >
          {stories.map((story, index) => (
            <button
              key={story.id}
              onClick={() => openStory(story, index)}
              className="flex flex-col items-center min-w-[76px] flex-shrink-0"
            >
              <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-yellow-400 to-red-500">
                <img
                  src={story.avatar}
                  alt={story.user}
                  className="w-full h-full object-cover rounded-full border-2 border-black"
                />
              </div>
              <span className="text-xs mt-2 truncate w-20 text-white">{story.user}</span>
            </button>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-4  top-15 transform -translate-y-1/2 z-10 w-8 h-8 rounded-full shadow text-black bg-white flex items-center justify-center"
        >
          <ChevronsRight size={20} />
        </button>
      </div>

      {/* Posts/Reels Section */}
      <div className="w-full max-w-[450px]">
        {posts.map((post, index) => {
          const { shortText, isTruncated } = truncateText(post.caption);
          const isMuted = mutedVideos[post.id];

          return (
            <div key={post.id} className="mb-8 border-b border-gray-800 pb-6">
              {/* User Info */}
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-yellow-400 to-red-500">
                    <img
                      src={post.profilePic}
                      alt={post.username}
                      className="w-full h-full rounded-full object-cover border border-black"
                    />
                  </div>
                  <div className="username text-white font-semibold">{post.username}</div>
                </div>
                <div className="text-white">
                  <Ellipsis size={20} />
                </div>
              </div>

              {/* Video Post */}
              <div className="relative">
                {/* Mute/Unmute Button */}
                {showVolumeBtn && (
                  <button
                    onClick={() => handleVideoClick(post.id)}
                    className="absolute top-4 right-4 z-20 text-white bg-black bg-opacity-50 rounded-full p-2"
                  >
                    {isMuted ? <VolumeOff size={20} /> : <Volume2 size={20} />}
                  </button>
                )}

                <video
                  ref={(el) => {
                    videoRefs.current[post.id] = el;
                  }}
                  data-post-id={post.id}
                  src={post.videoUrl}
                  className="w-full h-[600px] object-cover bg-black"
                  muted={isMuted}
                  loop
                  playsInline
                  onClick={() => handleVideoClick(post.id)}
                  onTouchStart={() => handleVideoClick(post.id)}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="transition-transform hover:scale-110"
                  >
                    <Heart
                      size={24}
                      className={`transition-all duration-300 ${likedPosts[post.id] ? "text-red-500 scale-110" : "text-white"
                        }`}
                      fill={likedPosts[post.id] ? "currentColor" : "none"}
                    />
                  </button>
                  <button className="text-white transition-transform hover:scale-110">
                    <MessageCircle size={24} />
                  </button>
                  {/* <button className="text-white transition-transform hover:scale-110">
                    <Share2 size={24} />
                  </button> */}
                </div>

                <button
                  onClick={() => toggleSave(post.id)}
                  className="transition-transform hover:scale-110"
                >
                  <Bookmark
                    size={24}
                    className={`transition-all duration-300 ${saved[post.id] ? "fill-white text-white" : "fill-none text-white"
                      }`}
                  />
                </button>
              </div>

              {/* Likes and Caption */}
              <div className="px-4">
                <div className="text-white font-semibold mb-2">
                  {post.likes.toLocaleString()} likes
                </div>

                <div className="text-white">
                  {showFull[post.id] ? post.caption : shortText}
                  {isTruncated && (
                    <button
                      onClick={() => toggleShow(post.id)}
                      className="text-gray-400 ml-1 zhover:text-white"
                    >
                      {showFull[post.id] ? " less" : " more"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}