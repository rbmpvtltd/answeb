import { createApiUrl } from "@/lib/utils";
import axios from "axios";
import { FunctionSquare } from "lucide-react";

const getToken = async () => {
  return localStorage.getItem("accessToken");

};

async function UpdateProfile(reqbody: any) {
  const token = await getToken();
  console.log(token);

  const body = reqbody
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // withCredentials: true
    },
  };
  const apiUrl = createApiUrl('/api/users/update-profile');
  const { data } = await axios.post(apiUrl, body, config);
  return data;
}

async function GetProfileUsername(username: string) {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl(`/api/users/profile/${username}`);
  const { data } = await axios.get(apiUrl, config);
  return data;
}

async function GetCurrentUser() {
  const token = await getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl('/api/users/profile/current');
  const { data } = await axios.get(apiUrl, config);
  return data;
}

async function SearchUserProfiel(query: string) {
  const token = await getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl(`/api/users/search?q=${query}`);
  const { data } = await axios.get(apiUrl, config);
  return data;
}


async function followUser(followingId: string) {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    // withCredentials: true,
  };

  const apiUrl = createApiUrl('/api/follow/addfollow');
  console.log('Calling URL:', apiUrl);

  const { data } = await axios.post(apiUrl, { following: followingId }, config);
  console.log('Response:', data);
  return data;
}

async function UnfollowUser(followingId: string) {
  const token = await getToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    withCredentials: true,
    data: { following: followingId }
  };

  const apiUrl = createApiUrl('/api/follow/unfollow');
  console.log('Calling URL:', apiUrl);

  const { data } = await axios.delete(apiUrl, config);
  console.log('Response:', data);
  return data;
}



export { UpdateProfile, GetProfileUsername, GetCurrentUser, SearchUserProfiel, followUser, UnfollowUser };
