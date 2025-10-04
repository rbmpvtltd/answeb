"use client"

import React, { useEffect, useRef, useState } from "react";
import '@/app/globals.css'
import { Bookmark, ChevronsLeft, ChevronsRight, Ellipsis, Heart, MessageCircle, Share2, Volume2, VolumeOff } from 'lucide-react';
import { useRouter } from "next/navigation";
import Link from "next/link";


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
    const [activeTab, setActiveTab] = useState("Following");
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);

    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const postRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Data fetching
    useEffect(() => {
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
                rootMargin: '0px 0px -10% 0px'
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

    // Text
    const truncateText = (text: string, maxWords: number = 6) => {
        const words = text.split(" ");
        const shortText = words.slice(0, maxWords).join(" ");
        return {
            shortText: shortText + (words.length > maxWords ? "..." : ""),
            isTruncated: words.length > maxWords
        };
    };

    if (!posts) {
        return <div className="text-white flex justify-center items-center h-20">Loading...</div>;
    }

    return (
        <div className="w-full justify-items-center bg-black min-h-screen">
            {/*  Tabs (Fixed top) */}
            <div className="fixed top-0 left-0 right-0 z-30 flex justify-center gap-6 bg-black/60 backdrop-blur-md py-3 border-b border-gray-700">
                <Link href="/following" className='text-lg font-semibold transition-all'>Following</Link>
                <Link href="/news" className='text-lg font-semibold transition-all'>News</Link>
                <Link href="/explore" className='text-lg font-semibold transition-all'>Explore</Link>
            </div>

            {/* Reels Section */}
            <div className="w-full max-w-[450px]">
                {posts.map((post, index) => {
                    const { shortText, isTruncated } = truncateText(post.caption);
                    const isMuted = mutedVideos[post.id];

                    return (
                        <div key={post.id} className="mb-8 border-b border-gray-800 pb-6">
                            <div className="relative">

                                {/*Video (background layer) */}
                                <video
                                    ref={(el) => { videoRefs.current[post.id] = el; }}
                                    // ref={(el) => (videoRefs.current[post.id] = el)}
                                    data-post-id={post.id}
                                    src={post.videoUrl}
                                    className="w-full h-[600px] object-cover bg-black z-0"
                                    muted={isMuted}
                                    loop
                                    playsInline
                                    onClick={() => handleVideoClick(post.id)}
                                    onTouchStart={() => handleVideoClick(post.id)}
                                />



                                {/* Volume Button */}
                                {showVolumeBtn && (
                                    <button
                                        onClick={() => handleVideoClick(post.id)}
                                        className="absolute top-4 right-4 z-20 text-white bg-black bg-opacity-50 rounded-full p-2"
                                    >
                                        {isMuted ? <VolumeOff size={20} /> : <Volume2 size={20} />}
                                    </button>
                                )}

                                {/*User info */}
                                <div className="absolute flex items-center gap-3 bottom-20 left-3 z-20">
                                    <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-yellow-400 to-red-500">
                                        <img
                                            src={post.profilePic}
                                            alt={post.username}
                                            className="w-full h-full rounded-full object-cover border border-black"
                                        />
                                    </div>
                                    <div className="username text-white font-semibold">{post.username}</div>
                                </div>

                                {/* Caption */}
                                <div className="absolute text-white bottom-14 left-3 text-sm z-20">
                                    {showFull[post.id] ? post.caption : shortText}
                                    {isTruncated && (
                                        <button
                                            onClick={() => toggleShow(post.id)}
                                            className="text-gray-400 ml-1 hover:text-white"
                                        >
                                            {showFull[post.id] ? " less" : " more"}
                                        </button>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="absolute flex flex-col items-center right-4 bottom-28 gap-6 z-20">
                                    <button
                                        onClick={() => toggleLike(post.id)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Heart
                                            size={24}
                                            className={`transition-all duration-300 ${likedPosts[post.id]
                                                ? "text-red-500 scale-110"
                                                : "text-white"
                                                }`}
                                            fill={likedPosts[post.id] ? "currentColor" : "none"}
                                        />
                                    </button>

                                    <button className="text-white transition-transform hover:scale-110">
                                        <MessageCircle size={24} />
                                    </button>

                                    <button
                                        onClick={() => toggleSave(post.id)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Bookmark
                                            size={24}
                                            className={`transition-all duration-300 ${saved[post.id]
                                                ? "fill-white text-white"
                                                : "fill-none text-white"
                                                }`}
                                        />
                                    </button>
                                </div>

                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
