"use client"

import React, { useEffect, useRef, useState } from "react";
import '@/app/globals.css'
import { Bookmark, ChevronsLeft, ChevronsRight, Ellipsis, Heart, MessageCircle, Pause, Play, Share2, Volume2, VolumeOff } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
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

export default function RealPage() {
    const { id } = useParams();
    const router = useRouter();

    const [showFull, setShowFull] = useState<{ [Key: number]: boolean }>({});
    const [saved, setSaved] = useState<{ [key: number]: boolean }>({});
    const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});
    const [posts, setPosts] = useState<Post[]>([]);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const [videoStates, setVideoStates] = useState<{
        [key: number]: {
            isPlaying: boolean;
            isMuted: boolean;
            showIcon: 'play' | 'pause' | null;
        }
    }>({});

    const currentIndex = posts.findIndex((p) => p.id === Number(id));
    const currentPost = posts[currentIndex];


    // Data fetching
    useEffect(() => {
        fetch("/mokedata/db.json")
            .then((res) => res.json())
            .then((data) => setPosts(data))
            .catch((err) => console.error(err));
    }, []);


    // useEffect(() => {
    //     const handleScroll = () => {
    //         const scrollY = window.scrollY;
    //         const scrollHeight = document.body.scrollHeight - window.innerHeight;
    //         if (scrollY >= scrollHeight - 10) {
    //             const nextPost = posts[currentIndex + 1];
    //             if (nextPost) {
    //                 router.push(`/reels/${nextPost.id}`);
    //             }
    //         } else if (scrollY <= 0) {
    //             const prevPost = posts[currentIndex - 1];
    //             if (prevPost) {
    //                 router.push(`/reels/${prevPost.id}`);
    //             }
    //         }
    //     };

    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, [currentIndex, router]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY > 0) {
                const nextPost = posts[currentIndex + 1];
                if (nextPost) router.replace(`/reels/${nextPost.id}`);
            } else if (e.deltaY < 0) {
                const prevPost = posts[currentIndex - 1];
                if (prevPost) router.replace(`/reels/${prevPost.id}`);
            }
        };
        window.addEventListener("wheel", handleWheel, { passive: true });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [currentIndex, posts, router]);

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


    // Toggle Play/Pause 
    const togglePlayPause = (postId: number) => {
        const video = videoRefs.current[postId];
        if (video) {
            if (video.paused) {
                video.play().catch(err => {
                    console.log("Play failed:", err);
                });
                setVideoStates(prev => ({
                    ...prev,
                    [postId]: { ...prev[postId], isPlaying: true, showIcon: 'play' }
                }));
            } else {
                video.pause();
                setVideoStates(prev => ({
                    ...prev,
                    [postId]: { ...prev[postId], isPlaying: false, showIcon: 'pause' }
                }));
            }

            setTimeout(() => {
                setVideoStates(prev => ({
                    ...prev,
                    [postId]: { ...prev[postId], showIcon: null }
                }));
            }, 500);
        }
    };


    // Handle mute/unmute
    const handleMuteClick = (postId: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering video click
        const video = videoRefs.current[postId];
        if (video) {
            video.muted = !video.muted;
            setVideoStates(prev => ({
                ...prev,
                [postId]: { ...prev[postId], isMuted: video.muted }
            }));
        }
    };


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
        <div className="justify-items-center ">
            {/*  Tabs (Fixed top) */}
            {/* <div className="fixed top-0 left-[150px] right-0 z-30 flex justify-center gap-6 bg-black/60 backdrop-blur-md py-3 border-b border-gray-700">
                <Link href="/following" className='text-lg font-semibold transition-all'>Following</Link>
                <Link href="/news" className='text-lg font-semibold transition-all'>News</Link>
                <Link href="/explore" className='text-lg font-semibold transition-all'>Explore</Link>
            </div> */}

            {/* Reels Section */}
            <div className="w-full max-w-[450px]">
                {currentPost && (() => {
                    const { shortText, isTruncated } = truncateText(currentPost.caption);
                    const videoState = videoStates[currentPost.id] || { isPlaying: false, isMuted: false, showIcon: null };

                    return (
                        <div key={currentPost.id} className="mb-8 border-b border-gray-800 pb-6">
                            <div className="relative mt-2">

                                {/* Video */}
                                <video
                                    ref={(el) => { videoRefs.current[currentPost.id] = el; }}
                                    data-post-id={currentPost.id}
                                    src={currentPost.videoUrl}
                                    className="w-full h-[700px] object-cover bg-black z-0"
                                    muted={videoState.isMuted}
                                    loop
                                    playsInline
                                    onClick={() => togglePlayPause(currentPost.id)}
                                />

                                {/* Play/Pause Overlay */}
                                {videoState.showIcon && (
                                    <button className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300">
                                        {videoState.showIcon === 'play' ? (
                                            <Pause size={30} className="text-white/90" />
                                        ) : (
                                            <Play size={30} className="text-white/90" />
                                        )}
                                    </button>
                                )}

                                {/* User info */}
                                <div className="absolute flex items-center gap-3 bottom-20 left-3 z-20">
                                    <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-yellow-400 to-red-500">
                                        <img
                                            src={currentPost.profilePic}
                                            alt={currentPost.username}
                                            className="w-full h-full rounded-full object-cover border border-black"
                                        />
                                    </div>
                                    <div className="username text-white font-semibold">{currentPost.username}</div>
                                </div>

                                {/* Caption */}
                                <div className="absolute w-[375px] bottom-14 left-3 text-white text-sm z-20">
                                    {showFull[currentPost.id] ? currentPost.caption : shortText}
                                    {isTruncated && (
                                        <button
                                            onClick={() => toggleShow(currentPost.id)}
                                            className="text-gray-400 ml-1 hover:text-white"
                                        >
                                            {showFull[currentPost.id] ? " less" : " more"}
                                        </button>
                                    )}
                                </div>

                                {/* Volume Button */}
                                <button
                                    onClick={(e) => handleMuteClick(currentPost.id, e)}
                                    className="absolute top-10/11 ml-[420px] -translate-x-1/2 text-white bg-black/60 rounded-full p-2 backdrop-blur-sm"
                                >
                                    {videoState.isMuted ? <VolumeOff size={16} /> : <Volume2 size={16} />}
                                </button>

                                {/* Actions */}
                                <div className="absolute flex flex-col items-center right-4 bottom-28 gap-6 z-20">
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
                                            className={`transition-all duration-300 ${saved[currentPost.id]
                                                ? "fill-white text-white"
                                                : "fill-none text-white"
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })()}

            </div>
        </div>
    );
}

// ==================================
// share reels page
// ==================================
// "use client"

// import React, { useEffect, useRef, useState } from "react";
// import '@/app/globals.css'
// import { Bookmark, ChevronsLeft, ChevronsRight, Ellipsis, Heart, MessageCircle, Pause, Play, Share2, Volume2, VolumeOff } from 'lucide-react';
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";


// type Post = {
//     id: number;
//     username: string;
//     profilePic: string;
//     videoUrl: string;
//     likes: number;
//     caption: string;
//     comments: Array<{ user: string; text: string }>;
// };

// export default function RealPage() {
//     const { id } = useParams();
//     const router = useRouter();

//     const [showFull, setShowFull] = useState<{ [Key: number]: boolean }>({});
//     const [saved, setSaved] = useState<{ [key: number]: boolean }>({});
//     const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});
//     const [posts, setPosts] = useState<Post[]>([]);
//     const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
//     const [videoStates, setVideoStates] = useState<{
//         [key: number]: {
//             isPlaying: boolean;
//             isMuted: boolean;
//             showIcon: 'play' | 'pause' | null;
//         }
//     }>({});

//     const currentIndex = posts.findIndex((p) => p.id === Number(id));
//     const currentPost = posts[currentIndex];


//     // Data fetching
//     useEffect(() => {
//         fetch("/mokedata/db.json")
//             .then((res) => res.json())
//             .then((data) => setPosts(data))
//             .catch((err) => console.error(err));
//     }, []);


//     // useEffect(() => {
//     //     const handleScroll = () => {
//     //         const scrollY = window.scrollY;
//     //         const scrollHeight = document.body.scrollHeight - window.innerHeight;
//     //         if (scrollY >= scrollHeight - 10) {
//     //             const nextPost = posts[currentIndex + 1];
//     //             if (nextPost) {
//     //                 router.push(`/reels/${nextPost.id}`);
//     //             }
//     //         } else if (scrollY <= 0) {
//     //             const prevPost = posts[currentIndex - 1];
//     //             if (prevPost) {
//     //                 router.push(`/reels/${prevPost.id}`);
//     //             }
//     //         }
//     //     };

//     //     window.addEventListener("scroll", handleScroll);
//     //     return () => window.removeEventListener("scroll", handleScroll);
//     // }, [currentIndex, router]);

//     useEffect(() => {
//         const handleWheel = (e: WheelEvent) => {
//             if (e.deltaY > 0) {
//                 const nextPost = posts[currentIndex + 1];
//                 if (nextPost) router.replace(`/reels/${nextPost.id}`);
//             } else if (e.deltaY < 0) {
//                 const prevPost = posts[currentIndex - 1];
//                 if (prevPost) router.replace(`/reels/${prevPost.id}`);
//             }
//         };
//         window.addEventListener("wheel", handleWheel, { passive: true });
//         return () => window.removeEventListener("wheel", handleWheel);
//     }, [currentIndex, posts, router]);

//     // Improved Auto-play on scroll
//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((entry) => {
//                     const video = entry.target as HTMLVideoElement;
//                     const postId = parseInt(video.dataset.postId || '0');

//                     if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
//                         // Video visible - play it
//                         video.play().catch(err => {
//                             console.log("Auto-play prevented:", err);
//                         });
//                     } else {
//                         // Video not visible - pause it
//                         video.pause();
//                         video.currentTime = 0;
//                     }
//                 });
//             },
//             {
//                 threshold: [0.3, 0.7, 1.0],
//                 rootMargin: '0px 0px -10% 0px'
//             }
//         );

//         // Observe all videos
//         videoRefs.current.forEach((video) => {
//             if (video) observer.observe(video);
//         });

//         return () => {
//             videoRefs.current.forEach((video) => {
//                 if (video) observer.unobserve(video);
//             });
//         };
//     }, [posts]);


//     // Toggle Play/Pause 
//     const togglePlayPause = (postId: number) => {
//         const video = videoRefs.current[postId];
//         if (video) {
//             if (video.paused) {
//                 video.play().catch(err => {
//                     console.log("Play failed:", err);
//                 });
//                 setVideoStates(prev => ({
//                     ...prev,
//                     [postId]: { ...prev[postId], isPlaying: true, showIcon: 'play' }
//                 }));
//             } else {
//                 video.pause();
//                 setVideoStates(prev => ({
//                     ...prev,
//                     [postId]: { ...prev[postId], isPlaying: false, showIcon: 'pause' }
//                 }));
//             }

//             setTimeout(() => {
//                 setVideoStates(prev => ({
//                     ...prev,
//                     [postId]: { ...prev[postId], showIcon: null }
//                 }));
//             }, 500);
//         }
//     };


//     // Handle mute/unmute
//     const handleMuteClick = (postId: number, e: React.MouseEvent) => {
//         e.stopPropagation(); // Prevent triggering video click
//         const video = videoRefs.current[postId];
//         if (video) {
//             video.muted = !video.muted;
//             setVideoStates(prev => ({
//                 ...prev,
//                 [postId]: { ...prev[postId], isMuted: video.muted }
//             }));
//         }
//     };


//     const toggleLike = (id: number) => {
//         setLikedPosts((prev) => ({
//             ...prev,
//             [id]: !prev[id],
//         }));
//     };

//     const toggleSave = (id: number) => {
//         setSaved((prev) => ({
//             ...prev,
//             [id]: !prev[id],
//         }));
//     };

//     const toggleShow = (id: number) => {
//         setShowFull((prev) => ({
//             ...prev,
//             [id]: !prev[id],
//         }));
//     };

//     // Text
//     const truncateText = (text: string, maxWords: number = 6) => {
//         const words = text.split(" ");
//         const shortText = words.slice(0, maxWords).join(" ");
//         return {
//             shortText: shortText + (words.length > maxWords ? "..." : ""),
//             isTruncated: words.length > maxWords
//         };
//     };

//     if (!posts) {
//         return <div className="text-white flex justify-center items-center h-20">Loading...</div>;
//     }
// return (
//   <div className="w-full bg-black text-white flex flex-col items-center py-8 gap-8">
//     {currentPost && (
//       <div className="flex w-[800px] gap-8">
//         {/* Main Content */}
//         <div className="flex w-full">
//           {/* Main Image/Video */}
//           <div className="w-[400px] h-[650px] border border-gray-800 overflow-hidden rounded-lg">
//             <video
//               ref={(el) => { 
//                 videoRefs.current[currentPost.id] = el; 
//               }}
//               data-post-id={currentPost.id}
//               src={currentPost.videoUrl}
//               className="w-full h-full object-cover bg-black"
//               muted
//               loop
//               playsInline
//             />
//           </div>

//           {/* User Profile and Comments */}
//           <div className="w-[400px] p-4">
//             {/* User Profile */}
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-yellow-400 to-red-500">
//                   <img
//                     src={currentPost.profilePic}
//                     alt={currentPost.username}
//                     className="w-full h-full rounded-full object-cover border border-black"
//                   />
//                 </div>
//                 <div className="username font-semibold text-white">
//                   {currentPost.username}
//                 </div>
//               </div>

//               {/* Menu icon */}
//               <div className="text-gray-400 cursor-pointer text-xl leading-none">
//                 •••
//               </div>
//             </div>

//             {/* Comments Section */}
//             <div className="mt-4 border-t border-gray-800 pt-4">
//               <h3 className="text-sm font-semibold mb-4">Comments</h3>

//               <div className="space-y-3 overflow-y-auto h-[400px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300 pr-2">
//                 {currentPost.comments.map((comment, index) => (
//                   <div key={index} className="flex items-start gap-2">
//                     <img
//                       src={comment.profilePic || currentPost.profilePic}
//                       alt="profile"
//                       className="w-8 h-8 rounded-full object-cover"
//                     />
//                     <div className="flex flex-col">
//                       <div className="text-sm">
//                         <span className="font-semibold text-blue-400 mr-2">
//                           {comment.user}
//                         </span>
//                         <span>{comment.text}</span>
//                       </div>
//                       <div className="text-xs text-gray-400 mt-1">2d</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Action Buttons */}
//               <div className="flex items-center justify-between py-4 mt-4 border-t border-gray-800">
//                 <div className="flex gap-4">
//                   <button className="transition-transform hover:scale-110">
//                     <Heart size={24} className="text-white" fill="none" />
//                   </button>
//                   <button className="transition-transform hover:scale-110">
//                     <MessageCircle size={24} className="text-white" />
//                   </button>
//                 </div>
//                 <button className="transition-transform hover:scale-110">
//                   <Bookmark size={24} className="text-white" fill="none" />
//                 </button>
//               </div>

//               {/* Add Comment */}
//               <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
//                 <img
//                   src={currentPost.profilePic}
//                   alt="profile"
//                   className="w-7 h-7 rounded-full object-cover"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Add a comment..."
//                   className="flex-1 text-sm outline-none border-none bg-transparent placeholder-gray-400"
//                 />
//                 <div className="text-gray-400 cursor-pointer">😃</div>
//                 <button className="text-blue-500 text-sm font-semibold hover:text-blue-400 px-2">
//                   Post
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )}

//     {/* More Reels Section */}
//     <div className="w-[800px]">
//       <h1 className="text-2xl font-bold mb-6">More Reels From Arbaaz Chouha</h1>
//       <div className="grid grid-cols-3 gap-4">
//         {[1, 2, 3].map((item) => (
//           <div key={item} className="w-full aspect-[9/16] border border-gray-800 overflow-hidden rounded-lg">
//             <video
//               src={currentPost?.videoUrl}
//               className="w-full h-full object-cover bg-black"
//               muted
//               loop
//               playsInline
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// }




