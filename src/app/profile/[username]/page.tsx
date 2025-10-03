"use client";
import { Clapperboard, Home, Menu, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type UserType = {
  id: number;
  username: string;
  profilePic: string;
  videoUrl: string;
  Bio: string;
  Discreption: string;
};

function Page() {
  const [data, setData] = useState<UserType[]>([]);
  const [showFull, setShowFull] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetch("/mokedata/db.json")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  const toggleShow = (id: number) => {
    setShowFull((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-[500px] w-full mx-auto p-4">
      {data.length > 0 && (
        <>
          {/* section1 */}
          <div className="flex justify-between items-center mb-4 ml-2">
            <div className="font-semibold text-lg">{data[0].username}</div>
            <div className="lg:hidden mr-5">
              <Menu />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex sm:items-center sm:justify-between justify-between">
            <div className="flex justify-center sm:justify-start">
              <img
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-gray-300"
                src={data[0].profilePic}
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
                <div className="flex flex-col items-center">
                  <span className="font-bold text-xl">120</span>
                  <span className="text-gray-500 text-sm">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-xl">300</span>
                  <span className="text-gray-500 text-sm">Following</span>
                </div>
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
            <h2 className="font-bold text-lg">arbaaz-chouhan</h2>
            <div className="discrptions text-white text-sm mt-1">
            
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, voluptas?      
                    </div>
          </div>

          {/* Edit and View Profile */}
          <div className="">
            <button className="w-[280px] md:w-[450px] p-1 mt-4 ml-4 border rounded  bg-gray-900 hover:bg-gray-950">
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

          {/* Reels / Videos */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {data.map((user) => (
              <video
                key={user.id}
                className="w-full h-80 object-cover"
                src={user.videoUrl}
                autoPlay
                muted
                loop
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
