"use client"

import React, { use, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pause, Play } from "lucide-react";

// Props interface
interface StoryPageProps {
  params: Promise<{ user: string; id: string }>;
}

type Story = {
  id: number;
  user: string;
  avatar: string;
  items: Array<{ type: string; src: string; duration: number }>;
}

export default function StoryPage() {
  // const router = useRouter();
  // const { user, id } = use(params);

    const router = useRouter();
  const params = useParams(); 
  const user = params?.user as string;
  const id = params?.id as string;

  const [open, setOpen] = useState(true);
  const [activeStory, setActiveStory] = useState({ userIndex: 0, itemIndex: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<null | NodeJS.Timeout>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/mokedata/stories.json")
      .then((res) => res.json())
      .then((data) => {
        setStories(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!open) return;

    if (isPlaying) {
      startTimer();
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [open, activeStory, isPlaying]);


useEffect(() => {
  if (!isLoading && stories.length > 0 && user && id) {
    const foundIndex = stories.findIndex(
      (s) => s.user.toLowerCase() === user.toLowerCase() && s.id.toString() === id
    );

    if (foundIndex !== -1 && activeStory.userIndex !== foundIndex) {
      setActiveStory({ userIndex: foundIndex, itemIndex: 0 });
    }
  }
}, [user, id, stories, isLoading]);


  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    clearTimer()
    if (open && isPlaying) {
      startTimer();
    }

  }, [activeStory, isPlaying, open]);

  function startTimer() {
    clearTimer();

    if (!isPlaying) return;

    const duration = stories[activeStory.userIndex]?.items[activeStory.itemIndex]?.duration || 5000;
    const startTime = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);

      // Single progress bar ko update karo
      if (progressRef.current) {
        (progressRef.current as HTMLDivElement).style.width = progressPercent + "%";
      }

      if (elapsed >= duration) {
        goForward();
      }
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
    router.push('/');
  }

  function goForward() {
  clearTimer();

  if (!stories[activeStory.userIndex]) return;

  const story = stories[activeStory.userIndex];
  if (activeStory.itemIndex < story.items.length - 1) {
    setActiveStory({ ...activeStory, itemIndex: activeStory.itemIndex + 1 });
  } else if (activeStory.userIndex < stories.length - 1) {
    const nextStory = stories[activeStory.userIndex + 1];
    setActiveStory({ userIndex: activeStory.userIndex + 1, itemIndex: 0 });

    // Add this line:
    router.push(`/story/${nextStory.user.toLowerCase()}/${nextStory.id}`, { scroll: false });
  } else {
    closeStory();
  }
}

function goBack() {
  clearTimer();

  if (activeStory.itemIndex > 0) {
    setActiveStory({ ...activeStory, itemIndex: activeStory.itemIndex - 1 });
  } 
  else if (activeStory.userIndex > 0) {
    const prevUser = stories[activeStory.userIndex - 1];

    setActiveStory({
      userIndex: activeStory.userIndex - 1,
      itemIndex: prevUser.items.length - 1,
    });
    router.push(`/story/${prevUser.user.toLowerCase()}/${prevUser.id}`, { scroll: false });
  }
}


  function renderItem(item: any) {
    if (!item) return null;
    if (item.type === "image") return <img src={item.src} alt="story" className="h-full w-full object-cover" />;
    if (item.type === "video") return (
      <video
        ref={videoRef}
        src={item.src}
        className="h-full w-full object-cover"
        autoPlay
        // controls
        // muted
        playsInline
      />
    );
    return null;
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!stories || stories.length === 0) {
    return <div className="text-white">No stories found</div>;
  }

  const currentStory = stories[activeStory.userIndex];
  const currentItem = currentStory.items[activeStory.itemIndex];

  if (!currentStory || !currentItem) {
    return <div className="text-white">Story not found</div>;
  }

  return (
    <>
      {/* Modal / Story Viewer */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950">
          <div className="relative w-[410px] max-w-md md:max-w-2xl h-[80vh] bg-black">
            {/* Top progress bars - Static segments */}
            <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
              {currentStory.items.map((_, idx) => (
                <div
                  key={idx}
                  className="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-white transition-all duration-300 ${idx < activeStory.itemIndex
                      ? 'w-full'
                      : idx === activeStory.itemIndex
                        ? 'w-0'
                        : 'w-0'
                      }`}
                  />
                </div>
              ))}
            </div>

            {/* Play / Pause Button */}
            <button
              onClick={togglePlayPause}
              className="absolute top-6 right-8 z-20 text-white px-3 py-1 rounded"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Close Button */}
            <button
              onClick={closeStory}
              className="absolute top-6 right-3 text-white z-20 w-8 h-8 flex items-center justify-center rounded"
            >
              ✕
            </button>

            {/* Header */}
            <div className="absolute top-6 left-4 flex items-center gap-3 z-20">
              <img
                src={currentStory.avatar}
                className="w-8 h-8 rounded-full border-2 border-white"
                alt="avatar"
              />
              <span className="text-white font-semibold">
                {currentStory.user}
              </span>
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
                {renderItem(currentItem)}
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