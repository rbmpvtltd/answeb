"use client";
import { useMutation } from "@tanstack/react-query";
import { Camera, Loader2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { UpdateProfile } from "../../api";

function EditProfilePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // store actual file
  const [previewImage, setPreviewImage] = useState<string | null>(null); // for UI preview
  const [imageChanged, setImageChanged] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [url, setUrl] = useState("");

  // handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImageChanged(true);

      // show preview in UI
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // handle delete image
  const handleDeleteImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    setImageChanged(false);
  };

  // mutation (API call)
  const updateProfileMutation = useMutation({
    mutationFn: (formData: FormData) => UpdateProfile(formData),
    onSuccess: (data) => {
      console.log("Profile update response:", data);
      if (data.success) {
        alert(" Profile updated successfully!");
      }
    },
    onError: (error) => {
      console.error(error);
      alert(" Something went wrong while updating profile");
    },
  });

  // handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("url", url);
    formData.append("imageChanged", String(imageChanged));
    if (selectedImage) {
      formData.append("ProfilePicture", selectedImage);
    }

    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="w-full flex justify-center items-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-5 p-6 rounded-lg shadow-md w-[90%] max-w-md border"
      >
        <h1 className="text-2xl font-bold">Edit Profile</h1>

        {/* Profile Image */}
        <div className="relative">
          <img
            src={
              previewImage ||
              "https://www.w3schools.com/howto/img_avatar.png"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full border object-cover"
          />

          {/* Camera Icon */}
          <label
            htmlFor="file-upload"
            className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer shadow-md"
          >
            <Camera className="w-5 h-5 text-white" />
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Delete Button */}
          {previewImage && (
            <button
              type="button"
              onClick={handleDeleteImage}
              className="absolute top-0 right-0 bg-red-500 p-2 rounded-full shadow-md"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Username */}
        <div className="w-full">
          <label htmlFor="username" className="block font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            placeholder="Enter your username"
          />
        </div>

        {/* Name */}
        <div className="w-full">
          <label htmlFor="name" className="block font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            placeholder="Enter your name"
          />
        </div>

        {/* Bio */}
        <div className="w-full">
          <label htmlFor="bio" className="block font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            placeholder="Write something about yourself"
          />
        </div>

        {/* Website URL */}
        <div className="w-full">
          <label htmlFor="addurl" className="block font-medium">
            Website
          </label>
          <input
            id="addurl"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            placeholder="https://example.com"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition flex items-center gap-2"
        >
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}

export default EditProfilePage;
