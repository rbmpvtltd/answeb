"use client";
import { Clapperboard, Home, Menu, User, Pause, Play, Volume2, VolumeOff, Heart, MessageCircle, Bookmark, ChevronsRight, ChevronsLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Mutation, useMutation, useQuery } from "@tanstack/react-query";
import { followUser, GetCurrentUser, GetProfileUsername } from "../api";
import { useRouter } from "next/navigation";

function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size dynamically
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize(); // initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const { data, isLoading, isError } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => GetProfileUsername(username),
    enabled: !!username,
  })


  // Fetch current logged-in user
  const { data: currentUserData, isError: currentUserError, isLoading: currentUserLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => GetProfileUsername("current"),
  });


  const foloweUserMetation = useMutation({
    mutationFn: (followingId: string) => followUser(followingId),
    onSuccess: () => {
      console.log("User followed successfully");
    },
    onError: () => {
      console.log("Error following user");

    }
  })

  // foloweUserMetation.mutate;

  if (isLoading)
    return (
      <div className="text-center mt-20 text-gray-400">Loading profile...</div>
    );

  if (isError || !data)
    return (
      <div className="text-center mt-20 text-red-500">
        Failed to load user data
      </div>
    );


  const currentUser = currentUserData?.userProfile;
  console.log("Current User Data:", currentUserData);
  console.log("Current User Error:", currentUserError);
  console.log("Current User Loading:", currentUserLoading);

  const isOwnProfile =
    currentUser?.username === username ||
    currentUser?.id === data?.userProfile?.id;

  const user = data;
  const profile = user.userProfile || {};
  // if (!user) return <div className="text-center">User not found</div>;

  return (
    <div className="max-w-[500px] w-full mx-auto p-4 ">
      <>
        {/* Profile Info */}
        <div className="flex flex-col gap-1">
          <div className="flex sm:justify-between justify-between">
            <div className="flex justify-center sm:justify-start">
              <img
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-gray-300"
                src={
                  profile.ProfilePicture && profile.ProfilePicture.trim() !== ""
                    ? profile.ProfilePicture
                    : "https://www.w3schools.com/howto/img_avatar.png"
                }
                alt="Profile"
              />
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 items-center">
                <div className="font-semibold text-lg">{user.username}</div>
                {!isMobile && (
                  isOwnProfile ? (
                    <button
                      onClick={() =>
                        foloweUserMetation.mutate(profile.id)
                      }
                      disabled={foloweUserMetation.isPending}
                      className="mt-2 px-4 py-1 rounded text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {foloweUserMetation.isPending ? "Following..." : "Follow"}
                    </button>

                  ) : (
                    <Link href={`/profile/${user.username}/edit`}>
                      <button className="mt-2 px-4 py-1 rounded text-sm font-medium transition-colors bg-gray-700 text-white hover:bg-gray-600">
                        Edit Profile
                      </button>
                    </Link>
                  )
                )}
                {/* <div className="lg:hidden mr-5">
                  <Menu />
                </div> */}

              </div>

              <div className="flex justify-around sm:justify-between gap-2  sm:gap-12  sm:w-full ">
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
              <div className="flex items-center mt-2 gap-6">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xl">300</span>
                  <span className="text-gray-500 text-sm">Like</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xl">300</span>
                  <span className="text-gray-500 text-sm">View</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="ml-4">
            <h3 className="font-semibold text-base">{profile.name}</h3>
            <p className="text-sm text-gray-300 leading-snug mt-1">
              {profile.bio}
            </p>
            <a
              href="https://yourwebsite.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm mt-1 inline-block hover:underline"
            >
              {profile.url}
            </a>
          </div>
        </div>


        {isMobile && (
          <div className="w-full mt-4">
            {isOwnProfile ? (
              <Link href={`/profile/${user.username}/edit`}>
                <button className="w-full py-3 rounded-lg text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition shadow-lg">
                  Edit Profile
                </button>
              </Link>
            ) : (
              <button className="w-full py-3 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg">
                Follow
              </button>
            )}
          </div>
        )}
        {/* Icons Section */}
        <div className="flex justify-around mt-6">
          <Home size={28} />
          <Clapperboard size={28} />
          <User size={28} />
        </div>

        {/* Video Grid */}
        {/* <div className="grid grid-cols-3 gap-2 mt-4">
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

        </div> */}

      </>

    </div >
  );
}

export default ProfilePage;

