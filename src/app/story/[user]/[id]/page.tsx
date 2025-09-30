"use client"

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pause, Play } from "lucide-react";

// Mock data
const mockStories = [
  {
    id: 1,
    user: "Arbaaz",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    items: [
      { type: "image", src: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400&h=800&fit=crop", duration: 5000 },
      { type: "image", src: "https://images.unsplash.com/photo-1554629947-334ff61d85dc?w=400&h=800&fit=crop", duration: 5000 },
    ],
  },
  {
    id: 2,
    user: "Riya",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    items: [
      { type: "image", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df?w=400&h=800&fit=crop", duration: 5000 },
    ],
  },
];

// Props interface
interface StoryPageProps {
  params: {
    user: string;
    id: string;
  };
}

export default function StoryPage({ params }: StoryPageProps) {
  const router = useRouter();
  const { user, id } = params;

  const [open, setOpen] = useState(true);
  const [activeStory, setActiveStory] = useState({ userIndex: 0, itemIndex: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<null | NodeJS.Timeout>(null);

  // Timer logic
  useEffect(() => {
    if (!open) return;

    if (isPlaying) startTimer();
    else clearTimer();

    return () => clearTimer();
  }, [open, activeStory, isPlaying]);

  useEffect(() => {
    if (open && isPlaying) startTimer();
  }, [activeStory]);

  function startTimer() {
    clearTimer();
    if (!isPlaying) return;

    const duration = mockStories[activeStory.userIndex].items[activeStory.itemIndex]?.duration || 5000;
    const startTime = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);
      if (progressRef.current) progressRef.current.style.width = progressPercent + "%";
      if (elapsed >= duration) goForward();
    }, 50);
  }

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function togglePlayPause() {
    setIsPlaying(prev => !prev);
  }

  function closeStory() {
    setOpen(false);
    setIsPlaying(false);
    clearTimer();
    router.back(); // go back to previous page
  }

  function goForward() {
    clearTimer();
    const story = mockStories[activeStory.userIndex];
    if (activeStory.itemIndex < story.items.length - 1) {
      setActiveStory({ ...activeStory, itemIndex: activeStory.itemIndex + 1 });
    } else if (activeStory.userIndex < mockStories.length - 1) {
      setActiveStory({ userIndex: activeStory.userIndex + 1, itemIndex: 0 });
    } else {
      closeStory();
    }
  }

  function goBack() {
    clearTimer();
    if (activeStory.itemIndex > 0) {
      setActiveStory({ ...activeStory, itemIndex: activeStory.itemIndex - 1 });
    } else if (activeStory.userIndex > 0) {
      const prevUser = mockStories[activeStory.userIndex - 1];
      setActiveStory({ userIndex: activeStory.userIndex - 1, itemIndex: prevUser.items.length - 1 });
    }
  }

  function renderItem(item: any) {
    if (!item) return null;
    if (item.type === "image") return <img src={item.src} alt="story" className="h-full w-full object-cover" />;
    if (item.type === "video") return <video src={item.src} className="h-full w-full object-cover" autoPlay muted playsInline />;
    return null;
  }

  return (
    <>
       {/* Modal / Story Viewer */}
           {open && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950">
               <div className="relative w-[410px] max-w-md md:max-w-2xl h-[80vh] bg-black">
     
                 {/* Top progress bars - Static segments */}
                 <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
                   {mockStories[activeStory.userIndex].items.map((_, idx) => (
                     <div key={idx} className="flex-1 bg-white/30 h-1 rounded overflow-hidden">
                       <div
                         className="h-1 bg-white transition-all duration-100"
                         style={{
                           width: idx < activeStory.itemIndex ? "100%" : "0%",
                         }}
                       />
                     </div>
                   ))}
                 </div>
     
                 {/* Play / Pause Button - Better position */}
                 <button
                   onClick={togglePlayPause}
                   className="absolute top-6 right-8 z-20 text-white  px-3 py-1 round" >
                   {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                 </button>
     
                 {/* Close Button */}
                 <button
                   onClick={closeStory}
                   className="absolute top-6 right-3 text-white z-20 w-8 h-8 flex items-center justify-center rounde"
                 >
                   ✕
                 </button>
     
                 {/* Header */}
                 <div className="absolute top-6 left-4 flex items-center gap-3 z-20">
                   <img
                     src={mockStories[activeStory.userIndex].avatar}
                     className="w-8 h-8 rounded-full border-2 border-white"
                     alt="avatar"
                   />
                   <div className="text-white font-medium">
                     {mockStories[activeStory.userIndex].user}
                   </div>
                 </div>
     
                 {/* Story Content */}
                 <div
                   className="w-full h-full flex items-center justify-center relative"
                   onMouseDown={() => setIsPlaying(false)}
                   onMouseUp={() => setIsPlaying(true)}
                   onTouchStart={() => setIsPlaying(false)}
                   onTouchEnd={() => setIsPlaying(true)}
                 >
                   {/* Navigation areas */}
                   <div
                     className="absolute left-0 top-0 h-full w-1/2 cursor-pointer z-10"
                     onClick={goBack}
                   />
                   <div
                     className="absolute right-0 top-0 h-full w-1/2 cursor-pointer z-10"
                     onClick={goForward}
                   />
     
                   {/* Story Item */}
                   <div className="w-full h-full">
                     {renderItem(
                       mockStories[activeStory.userIndex].items[activeStory.itemIndex]
                     )}
                   </div>
     
                   {/* Active progress bar - current story ke liye */}
                   <div className="absolute top-3 left-3 right-3 h-1 z-30 pointer-events-none">
                     <div
                       ref={progressRef}
                       className="h-1 bg-white rounded transition-all duration-50 ease-linear"
                       style={{ width: "0%" }}
                     />
                   </div>
                 </div>
               </div>
             </div>
           )}
     
    </>
  );
}
