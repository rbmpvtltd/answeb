'use client'
import React, { useEffect, useState } from 'react'

type Post = {
  id: number;
  username: string;
  profilePic: string;
  videoUrl: string;
  likes: number;
  caption: string;
};

function FollowersPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/mokedata/db.json")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-semibold text-center mb-6">Followers</h1>

      {posts.map((post) => (
        <div
          key={post.id}
          className="w-full max-w-[700px] border-b border-[#00CFFF] py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
        >
          {/* Profile Photo + User Info */}
          <div className="flex items-center gap-3">
            <img
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
              src={post.profilePic}
              alt={post.username}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-medium">{post.username}</span>
              <span className="text-sm text-gray-400">@arbaaz-chouhan</span>
            </div>
          </div>

          {/* Unfollow Button */}
          <button className="text-white bg-[#00CFFF] rounded-2xl px-5 py-2 sm:px-6 sm:py-2 mt-2 sm:mt-0 hover:bg-[#00a8d1] transition-all cursor-pointer">
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default FollowersPage;
