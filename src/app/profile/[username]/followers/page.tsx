// 'use client'
// import React, { useEffect, useState } from 'react'

// type Post = {
//   id: number;
//   username: string;
//   profilePic: string;
//   videoUrl: string;
//   likes: number;
//   caption: string;
// };

// function FollowersPage() {
//   const [posts, setPosts] = useState<Post[]>([]);

//   useEffect(() => {
//     fetch("/mokedata/db.json")
//       .then((res) => res.json())
//       .then((data) => setPosts(data))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-8">
//       <h1 className="text-3xl font-semibold text-center mb-6">Followers</h1>

//       {posts.map((post) => (
//         <div
//           key={post.id}
//           className="w-full max-w-[700px] border-b border-[#00CFFF] py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
//         >
//           {/* Profile Photo + User Info */}
//           <div className="flex items-center gap-3">
//             <img
//               className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
//               src={post.profilePic}
//               alt={post.username}
//             />
//             <div className="flex flex-col leading-tight">
//               <span className="text-lg font-medium">{post.username}</span>
//               <span className="text-sm text-gray-400">@arbaaz-chouhan</span>
//             </div>
//           </div>

//           {/* Unfollow Button */}
//           <button className="text-white bg-[#00CFFF] rounded-2xl px-5 py-2 sm:px-6 sm:py-2 mt-2 sm:mt-0 hover:bg-[#00a8d1] transition-all cursor-pointer">
//             Remove
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default FollowersPage;


'use client'
import React, { use, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { followUser, GetProfileUsername } from '../../api';
import Link from "next/link";

function FollowersPage() {
  const { username } = useParams<{ username: string }>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [tempFollowing, setTempFollowing] = useState<string[]>([]);
  const queryClient = useQueryClient()


  // Fetch user profile with followings
  const { data: userProfile, isLoading, isError } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => GetProfileUsername(username),
    enabled: !!username,
  })

  // Mutation for unfollow
  const followMutation = useMutation({
    mutationFn: (id: string) => followUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfile', username] }),
  })

  if (isLoading) return <div className="text-center mt-10 text-gray-400">Loading followers...</div>;
  if (isError) return <div className="text-center mt-10 text-red-500">Failed to load followers</div>;

  const followers = userProfile?.followers || [];

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-semibold text-center mb-6">Followers</h1>

      {followers.map((follower: any) => (
        <div
          key={follower.id}
          className="w-full max-w-[700px] border-b border-[#00CFFF] py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
        >
          {/* Left: Profile */}
          <Link href={`/profile/${follower.username}`} className="flex items-center gap-3">
            <img
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
              src={follower.ProfilePicture?.trim() || 'https://www.w3schools.com/howto/img_avatar.png'}
              alt={follower.username}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-medium">{follower.name}</span>
              <span className="text-sm text-gray-400">@{follower.username}</span>
            </div>
          </Link>

          {/* Right: Remove button */}
          <button
            onClick={() => {
              followMutation.mutate(follower.id);
              setTempFollowing(prev => [...prev, follower.id]);
            }}
            disabled={followMutation.isPending || tempFollowing.includes(follower.id)}
            className="text-white bg-[#00CFFF] rounded-2xl px-5 py-2 sm:px-6 sm:py-2 mt-2 sm:mt-0 hover:bg-[#00a8d1] transition-all cursor-pointer disabled:opacity-50"
          >
            {tempFollowing.includes(follower.id) ? "Following" : "Follow Back"}
          </button>

        </div>
      ))}
    </div>
  );
}

export default FollowersPage;
