"use client";
import { Pause, Play, Volume2, VolumeOff, Heart, MessageCircle, Bookmark, ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ सही import

type UserType = {
    id: number;
    username: string;
    profilePic: string;
    videoUrl: string;
    Bio: string;
    Discreption: string;
    caption: string;
};

function Page() {
    const [data, setData] = useState<UserType[]>([]);
    const [showFull, setShowFull] = useState<{ [key: number]: boolean }>({});
    const [videoStates, setVideoStates] = useState<{
        [key: number]: {
            isMuted: boolean;
            showIcon: "play" | "pause" | null;
            isPlaying: boolean;
        }
    }>({});

    const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});
    const [saved, setSaved] = useState<{ [key: number]: boolean }>({});

    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const params = useParams();
    const router = useRouter();
    const postId = parseInt(params.id as string);

    useEffect(() => {
        fetch("/mokedata/db.json")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.error(err));
    }, []);

    // Find current post and its index
    const currentPost = data.find(post => post.id === postId);
    const currentIndex = data.findIndex(post => post.id === postId);

    const toggleShow = (id: number) => {
        setShowFull((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleMuteClick = (id: number) => {
    const video = videoRefs.current[id];
    if (!video) return;

    video.muted = !video.muted;  
    setVideoStates(prev => ({
        ...prev,
        [id]: {
            ...prev[id],
            isMuted: video.muted  
        }
    }));
};

    const toggleLike = (id: number) => {
        setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleSave = (id: number) => {
        setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        if (!text) return { shortText: "", isTruncated: false };
        if (text.length <= maxLength) return { shortText: text, isTruncated: false };
        return {
            shortText: text.substring(0, maxLength) + "...",
            isTruncated: true
        };
    };

    // Navigate to next/previous post
    const navigateToPost = (direction: 'next' | 'prev') => {
        if (!data.length) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % data.length;
        } else {
            newIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
        }

        const nextPost = data[newIndex];
        router.push(`/post/${nextPost.id}`);
    };

    // Initialize video state when post changes
    useEffect(() => {
    if (currentPost && !videoStates[currentPost.id]) {
        setVideoStates(prev => ({
            ...prev,
            [currentPost.id]: {
                isMuted: false, 
                showIcon: null,
                isPlaying: true
            }
        }));
    }
}, [currentPost, videoStates]);


    // Auto-play video
    useEffect(() => {
        if (currentPost && videoRefs.current[currentPost.id]) {
            const video = videoRefs.current[currentPost.id];
            if (video) {
                video.play().catch(err => console.log("Auto-play prevented:", err));
            }
        }
    }, [currentPost]);

    if (!currentPost) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

// current video state
const currentVideoState = currentPost ? (videoStates[currentPost.id] || { isPlaying: true, isMuted: false,showIcon: null 
    }) : {  isPlaying: true,  isMuted: false,  showIcon: null };
   
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            {/* Modal*/}
            <div className="relative w-[90%] max-w-[500px] rounded-2xl overflow-hidden shadow-lg">

                {/* Video */}
                <video
                    ref={(el) => {
                        if (el) {
                            videoRefs.current[currentPost.id] = el;
                            // Auto-play with error handling
                            el.play().catch(err => {
                                console.log("Auto-play prevented:", err);
                            });
                        }
                    }}
                    src={currentPost.videoUrl}
                    className="w-full h-[80vh] object-cover rounded-2xl"
                    muted={currentVideoState.isMuted }
                    loop
                    autoPlay
                    playsInline
                />

                {/* Close Button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 right-4 text-white bg-black/60 px-3 py-1 rounded-full hover:bg-black z-10"
                >
                    <X />
                </button>

                {/* Prev Button */}
                {data.length > 1 && currentIndex > 0 && (
                    <button
                        onClick={() => navigateToPost('prev')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full px-3 py-2 hover:bg-black z-10"
                    >
                        <ChevronLeft size={22} />
                    </button>
                )}

                {/* Next Button */}
                {data.length > 1 && currentIndex < data.length - 1 && (
                    <button
                        onClick={() => navigateToPost('next')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full px-3 py-2 hover:bg-black z-10"
                    >
                        <ChevronRight size={22} />
                    </button>
                )}

                {/* User Info */}
                <div className="absolute flex items-center gap-3 bottom-24 left-3 z-10">
                    <img
                        src={currentPost.profilePic}
                        alt={currentPost.username}
                        className="w-9 h-9 rounded-full border border-white"
                    />
                    <span className="text-white font-semibold">{currentPost.username}</span>
                </div>

                {/* Caption */}
                <div className="absolute top-10/12 left-3 right-16 mt-2  w-[89%]  text-white text-sm z-10">
                    {(() => {
                        const { shortText, isTruncated } = truncateText(currentPost.caption);
                        return (
                            <>
                                {showFull[currentPost.id] ? currentPost.caption : shortText}
                                {isTruncated && (
                                    <button
                                        onClick={() => toggleShow(currentPost.id)}
                                        className="text-gray-400 ml-1 hover:text-white"
                                    >
                                        {showFull[currentPost.id] ? " less" : " more"}
                                    </button>
                                )}
                            </>
                        );
                    })()}
                </div>

                {/* Volume Button */}
                              <button
                    onClick={() => handleMuteClick(currentPost.id)}
                    className="absolute bottom-16 right-4 text-white bg-black/60 rounded-full p-2 z-10 hover:bg-black/80 transition-colors"
                >
                    {currentVideoState.isMuted ? <VolumeOff size={18} /> : <Volume2 size={18} />}
                </button>

                {/* Action Buttons */}
                <div className="absolute flex flex-col items-center right-4 bottom-28 gap-6 z-10">
                    <button onClick={() => toggleLike(currentPost.id)}>
                        <Heart
                            size={24}
                            className={`transition-all duration-300 ${likedPosts[currentPost.id]
                                ? "text-red-500 scale-110"
                                : "text-white"
                                }`}
                            fill={likedPosts[currentPost.id] ? "currentColor" : "none"}
                        />
                    </button>

                    <button className="text-white transition-transform hover:scale-110">
                        <MessageCircle size={24} />
                    </button>

                    <button onClick={() => toggleSave(currentPost.id)}>
                        <Bookmark
                            size={24}
                            className={`transition-all duration-300 ${saved[currentPost.id] ? "fill-white text-white" : "fill-none text-white"
                                }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Page;