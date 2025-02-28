import React, { useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [fullName, setFullName] = useState<string | null>(authUser?.fullName || null);
  const [username, setUsername] = useState<string | null>(authUser?.username || null);
  const [selectedImg, setSelectedImg] = useState<string | null>(authUser?.profilePic || null);

  //console.log(authUser?.createdAt?.toString().split("T")[0])

  const handleProfileUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const base64Image = reader.result as string;
          setSelectedImg(base64Image);
          updateProfile({ profilePic: base64Image });
        }
      };

      reader.onerror = (error) => console.error("File reading error:", error);
      reader.readAsDataURL(file);
    }
  };

  const handleClickUpdateProfile = async () => {
    if (fullName === authUser?.fullName && username === authUser?.username && selectedImg === authUser?.profilePic) {
      return;
    }
    const formData = {
      profilePic: selectedImg, // Base64 string
      fullName,
      username,
      email: authUser?.email
    };
    updateProfile(formData);
    console.log("From handleclickup after update profile", authUser?.username)
  };

  // const hasChanges = fullName !== authUser?.fullName || username !== authUser?.username || selectedImg !== authUser?.profilePic;

  return (
    <div className="h-screen pt-20">
      <div className="max-w-xl mx-auto p-3 py-4">
        <div className="bg-base-300 rounded-xl p-3 space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2 text-sm">Your profile information</p>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img src={selectedImg || "/avatar.png"} alt="Profile" className="w-20 h-20 rounded-full object-cover border border-purple-500" />
              <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 bg-purple-500 p-1 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}>
                <Camera className="w-4 h-4 text-zinc-400" />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleProfileUpdate} disabled={isUpdatingProfile} />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Information Section */}
          <div className="space-y-4 mx-4">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <input type="text" onChange={(e) => setFullName(e.target.value)} placeholder={authUser?.fullName} className="px-3 py-2 text-sm bg-base-200 rounded-lg border w-full" />
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                User Name
              </div>
              <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder={ username ? username : authUser?.username } className="text-sm px-3 py-2 bg-base-200 rounded-lg border w-full" />
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Mail Address
              </div>
              <input type="email" value={authUser?.email} readOnly className="text-sm px-3 py-2 bg-base-200 rounded-lg border w-full" />
            </div>
          </div>


          {/* Account Information Section */}
          <div className="mt-3 bg-base-300 rounded-xl p-4">
            {/* <h2 className="text-lg font-medium mb-2">Account Information</h2> */}
            <div className="flex justify-center items-center mb-2">
              <button className="bg-purple-500 rounded-md px-3 py-1.5 text-sm"  onClick={handleClickUpdateProfile}>Update Profile</button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-zinc-700">
                <span>Member Since</span>
                <span className="text-xs">{authUser?.createdAt?.toString().split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
