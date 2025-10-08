"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type UserType = {
  id: number;
  username: string;
  profilePic: string;
  videoUrl: string;
  Bio: string;
  Discreption: string;
  caption: string;
};

export default function SearchPage() {
  const [data, setData] = useState<UserType[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserType[]>([]);

  // Fetch users on mount
  useEffect(() => {
    fetch("/mokedata/db.json")
      .then(res => res.json())
      .then(users => setData(users))
      .catch(err => console.error(err));
  }, []);

  // Filter users when query changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const filtered = data.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, data]);

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
              <img
                src={user.profilePic}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="font-semibold">{user.username}</span>
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
}
