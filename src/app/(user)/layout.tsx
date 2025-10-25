"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
const queryClient = new QueryClient();
import Link from "next/link";
import "../globals.css";
import {
  Bell,
  Compass,
  House,
  MessageCircle,
  Search,
  SquarePlus,
  User,
  Clapperboard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { GetCurrentUser, GetProfileUsername } from "./profile/api";
import { useParams, useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutContent>
        {children}
      </LayoutContent>
    </QueryClientProvider>

  );
}

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const param = useParams();
  // const username = param?.username;

  const { data: currentUserData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => GetCurrentUser(),
    // enabled: !!param.username,
  });


  const currentUser = currentUserData?.userProfile;
  console.log("Current User Data:", currentUserData);

  // const isOwnProfile = currentUser?.username === username;

  // const user = data;
  // const profile = user.userProfile || {};
``

  return (
    <html lang="en">
      <body className=" text-white">
        <div className="flex min-h-screen">
          {/* Left Sidebar */}
          <aside className="hidden md:flex flex-col justify-between border-r border-gray-800 p-5 fixed h-screen">
            <div>
              {/* Logo */}
              <h1 className="text-2xl font-bold mb-6 hidden xl:block">
                <i>AAONISA</i>
              </h1>
              <h1 className="text-2xl font-bold mb-6 xl:hidden">A</h1>

              {/* Nav */}
              <nav className="flex flex-col gap-6 text-lg">
                <Link
                  href="/"
                  className="flex items-center gap-3 hover:text-gray-300"
                >
                  <House size={24} />
                  <span className="hidden xl:inline">Home</span>
                </Link>

                <Link
                  href="/search"
                  className="flex items-center gap-3 hover:text-gray-300"
                >
                  <Search size={24} />
                  <span className="hidden xl:inline">Search</span>
                </Link>

                <Link
                  href="/explore"
                  className="flex items-center gap-3 hover:text-gray-300"
                >
                  <Compass size={24} />
                  <span className="hidden xl:inline">Explore</span>
                </Link>

                <Link
                    href="/reels/1"
                    className="flex items-center gap-3 hover:text-gray-300"
                  >
                    <Clapperboard size={24} />
                    <span className="hidden xl:inline">Reels</span>
                  </Link>

                {/* <Link
                    href="/messages"
                    className="flex items-center gap-3 hover:text-gray-300"
                  >
                    <MessageCircle size={24} />
                    <span className="hidden xl:inline">Messages</span>
                  </Link> */}

                {/* <Link
                    href="/notifications"
                    className="flex items-center gap-3 hover:text-gray-300"
                  >
                    <Bell size={24} />
                    <span className="hidden xl:inline">Notifications</span>
                  </Link> */}

                {/* <Link
                  href={`/profile/${ currentUser?.username}`}
                  className="flex items-center gap-3 hover:text-gray-300"
                >
                  <User size={24} />
                  <span className="hidden xl:inline">Profile</span>
                </Link> */}
                {currentUser && (
                  <Link
                    href={`/profile/${currentUser.username}`}
                    className="flex items-center gap-3 hover:text-gray-300"
                  >
                    <User size={24} />
                    <span className="hidden xl:inline">Profile</span>
                  </Link>
                )}
              </nav>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="flex-1 flex justify-center bg-black text-white">
            <div className="w-full">{children}</div>
          </main>

          {/* Mobile Bottom Navbar */}
          <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around py-3 md:hidden">
            <Link href="/">
              <House size={24} />
            </Link>
            <Link href="/search">
              <Search size={24} />
            </Link>
            <Link href="/reels/1">
                <Clapperboard size={24} />
              </Link>
            {/* <Link href="/messages">
                <MessageCircle size={24} />
              </Link> */}

                {currentUser && (
            <Link href={`/profile/${currentUser?.username}`}>
              <User size={24} />
            </Link>
                )}
          </div>
        </div>
      </body>
    </html>
  );
}


