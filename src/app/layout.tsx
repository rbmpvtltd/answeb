"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import Link from "next/link";
import "./globals.css";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <QueryClientProvider client={queryClient}>
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
                    href="/reals/1"
                    className="flex items-center gap-3 hover:text-gray-300"
                  >
                    <Clapperboard size={24} />
                    <span className="hidden xl:inline">Reels</span>
                  </Link>

                  <Link
                    href="/messages"
                    className="flex items-center gap-3 hover:text-gray-300"
                  >
                    <MessageCircle size={24} />
                    <span className="hidden xl:inline">Messages</span>
                  </Link>

                  <Link
                    href="/notifications"
                    className="flex items-center gap-3 hover:text-gray-300"
                  >
                    <Bell size={24} />
                    <span className="hidden xl:inline">Notifications</span>
                  </Link>

                  <Link
                    href="/profile/arbaaz-chouhan"
                    className="flex items-center gap-3 hover:text-gray-300"
                  >
                    <User size={24} />
                    <span className="hidden xl:inline">Profile</span>
                  </Link>
                </nav>
              </div>
            </aside>

            {/* Main Feed */}
            <main className="flex-1 flex justify-center p-5 md:ml-[80px]">
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
              <Link href="/reels">
                <Clapperboard size={24} />
              </Link>
              <Link href="/messages">
                <MessageCircle size={24} />
              </Link>
              <Link href="/profile">
                <User size={24} />
              </Link>
            </div>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
