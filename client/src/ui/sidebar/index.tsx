"use client";

import React from "react";
import {
  BellIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/features/userslice";


const Sidebar = ({user}) => {
 
  // Utility function to check if the URL is valid
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null));
    router.push("/login");
  };
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[100px] h-[95vh] lg:flex flex-col bg-[#2222e6] rounded-lg justify-between p-4 text-white">
      {/* Profile Section */}
      <div className="flex items-center justify-center mb-6">
      
   { isValidUrl(user?.profileImage) ? (
              <Image
                src={user?.profileImage?.trim() || "/fallback.jpg"}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full w-12 h-12 object-cover"
                priority
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-purple-600 text-white font-bold rounded-full">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

      </div> 
      <div className="text-white text-sm mb-20 ">
        {user.name}
      </div>
      

      {/* Sidebar Icons */}
      <div className="flex flex-col items-center space-y-10 mb-10">
        <HomeIcon className="w-8 h-8 text-white cursor-pointer hover:text-gray-300" />
        <ChatBubbleLeftEllipsisIcon className="w-8 h-8 text-white cursor-pointer hover:text-gray-300" />
        <BellIcon className="w-8 h-8 cursor-pointer hover:text-gray-300" />
        <Cog6ToothIcon className="w-8 h-8 cursor-pointer hover:text-gray-300" />
      </div>

      {/* Logout Icon */}
      <div className="flex flex-col items-center pb-4">
        <ArrowLeftOnRectangleIcon
          className="w-8 h-8 cursor-pointer hover:text-gray-300"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Sidebar;
