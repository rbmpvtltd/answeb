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

// function FollowingPage() {
//   const [posts, setPosts] = useState<Post[]>([]);

//   useEffect(() => {
//     fetch("/mokedata/db.json")
//       .then((res) => res.json())
//       .then((data) => setPosts(data))
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-8">
//       <h1 className="text-3xl font-semibold text-center mb-6">Following</h1>

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
//             Unfollow
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default FollowingPage;

'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GetProfileUsername, UnfollowUser } from '../../api'

function FollowingPage() {
  const { username } = useParams<{ username: string }>()
  const queryClient = useQueryClient()

  // Fetch user profile with followings
  const { data: userProfile, isLoading, isError } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => GetProfileUsername(username),
    enabled: !!username,
  })

  // Mutation for unfollow
  const unfollowMutation = useMutation({
    mutationFn: (id: string) => UnfollowUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['userProfile', username] }),
  })

  if (isLoading)
    return <div className="text-center mt-10 text-gray-400">Loading followings...</div>
  if (isError)
    return <div className="text-center mt-10 text-red-500">Failed to load followings</div>

  const followings = userProfile?.followings || []

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-semibold text-center mb-6">Following</h1>

      {followings.map((following: any) => (
        <div
          key={following.id}
          className="w-full max-w-[700px] border-b border-[#00CFFF] py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
        >
          {/* Profile Photo + User Info */}
          <a
            href={`/profile/${following.username}`}
            className="flex items-center gap-3"
          >
            <img
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
              src={following.ProfilePicture?.trim() || 'https://www.w3schools.com/howto/img_avatar.png'}
              alt={following.username}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-medium">{following.name}</span>
              <span className="text-sm text-gray-400">@{following.username}</span>
            </div>
          </a>

          {/* Unfollow Button */}
          <button
            onClick={() => unfollowMutation.mutate(following.id)}
            disabled={unfollowMutation.isPending}
            className="text-white bg-[#00CFFF] rounded-2xl px-5 py-2 sm:px-6 sm:py-2 mt-2 sm:mt-0 hover:bg-[#00a8d1] transition-all cursor-pointer disabled:opacity-50"
          >
            Unfollow
          </button>
        </div>
      ))}
    </div>
  )
}

export default FollowingPage
