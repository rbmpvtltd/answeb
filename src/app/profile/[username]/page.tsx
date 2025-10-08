"use client";
import { Clapperboard, Home, Menu, User, Pause, Play, Volume2, VolumeOff, Heart, MessageCircle, Bookmark, ChevronsRight, ChevronsLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    fetch("/mokedata/db.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);


   const params = useParams();
  const usernameFromRoute = params.username;

  // Find the user based on route
  const user = data.find(u => u.username === usernameFromRoute);

  if (!user) return <div className="text-center">User not found</div>;


  return (
    <div className="max-w-[500px] w-full mx-auto p-4">
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-4 ml-2">
            <div className="font-semibold text-lg">{user.username}</div>
            <div className="lg:hidden mr-5">
              <Menu />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex sm:items-center sm:justify-between justify-between">
            <div className="flex justify-center sm:justify-start">
              <img
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-gray-300"
                src={user.profilePic}
                alt="Profile"
              />
            </div>

            {/* Stats */}
            <div className="flex flex-col">
              <div className="flex justify-around sm:justify-between gap-4 sm:gap-12 w-full sm:w-auto">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-xl">10</span>
                  <span className="text-gray-500 text-sm">Posts</span>
                </div>
                <Link href={`${user.username}/followers`}>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-xl">120</span>
                    <span className="text-gray-500 text-sm">Followers</span>
                  </div>
                </Link>
                <Link href={`${user.username}/following`}>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-xl">300</span>
                    <span className="text-gray-500 text-sm">Following</span>
                  </div>
                </Link>
              </div>
              <div className="flex items-center mt-2 gap-16">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-xl">300</span>
                  <span className="text-gray-500 text-sm">Like</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-xl">300</span>
                  <span className="text-gray-500 text-sm">View</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-4 ml-4">
            <h2 className="font-bold text-lg">{user.username}</h2>
            <div className="discrptions text-white text-sm mt-1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, voluptas?
            </div>
          </div>

          {/* Edit Profile */}
          <div className="">
            <button className="w-[280px] md:w-[450px] p-1 mt-4 ml-4 border rounded bg-gray-900 hover:bg-gray-950">
              <Link href='/profile/arbaaz-chouhan/edit'>
                Edit Profile
              </Link>
            </button>
          </div>

          {/* Icons Section */}
          <div className="flex justify-around mt-6">
            <Home size={28} />
            <Clapperboard size={28} />
            <User size={28} />
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {data.map((user, index) => (
            <Link key={user.id} href={`/post/${user.id}`}>
              <video
                key={user.id}
                ref={(el) => {
                  videoRefs.current[user.id] = el;
                }}
                className="w-full h-80 object-cover cursor-pointer hover:opacity-90 transition"
                src={user.videoUrl}
                muted
                loop
                onClick={() => setSelectedIndex(index)}
              />
                 </Link>
            ))}
          </div>

      </>
    
    </div>
  );
}

export default Page;