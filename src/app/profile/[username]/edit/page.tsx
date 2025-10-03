"use client";
import { Camera, Trash2 } from "lucide-react";
import React, { useState } from "react";

function EditProfilePage() {
    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [addurl, setAddurl] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Data:", { username, name, bio, addurl, image });
        alert("Profile updated!");
    };

    const handleDeleteImage = () => {
        setImage(null);
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
                            image ||
                            "https://www.w3schools.com/howto/img_avatar.png" // default avatar
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
                    {image && (
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
                        value={addurl}
                        onChange={(e) => setAddurl(e.target.value)}
                        className="w-full border rounded p-2 mt-1"
                        placeholder="https://example.com"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditProfilePage;
