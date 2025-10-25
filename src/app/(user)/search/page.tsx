
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { SearchUserProfiel } from "../profile/api";

type UserType = {
  id: number;
  username: string;
  profilePic: string;
    userProfile?: {
    name: string;
    ProfilePicture:string;
    };
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserType[]>([]);

  const { data, isLoading, isError } = useQuery({
  queryKey: ["searchUsers", query],
  queryFn: () => SearchUserProfiel(query),
    enabled: !!query,
});

console.log('data is here', data);

  useEffect(() => {
    if (data) {
      setResults(data);
    } else {
      setResults([]);
    }
  }, [data]);

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Search Users</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Results */}
      {results.length > 0 ? (
        <div className="flex flex-col gap-3">
          {results.map(user => (
           <Link
      key={user.id}
      href={`/profile/${user.username}`} 
      className="flex items-center gap-3 p-2 border rounded hover:bg-gray-900"
    >
      {/* Profile Image */}
      <img
        src={user.userProfile?.ProfilePicture || 'https://www.w3schools.com/howto/img_avatar.png'} 
        alt={user.username}
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* Text: Username and Name */}
      <div className="flex flex-col">
        <span className="font-semibold">{user.username}</span>
        {user.userProfile?.name && (
          <span className="text-sm text-gray-500">{user.userProfile.name}</span>
        )}
      </div>
    </Link>
          ))}
        </div>
      ) : query ? (
        <p className="text-gray-400 text-center">No users found</p>
      ) : (
        <p className="text-gray-400 text-center">Type something to search...</p>
      )}
    </div>
  );
}``


