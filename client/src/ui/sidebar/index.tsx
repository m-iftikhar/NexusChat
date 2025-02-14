"use client";

import React from "react";
import {
  BellIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/lib/features/userslice";

const Sidebar = () => {
  const router=useRouter();
  const dispatch=useDispatch();
  const handleLogout=()=>{
    localStorage.removeItem("token");
    router.push("/login");
    dispatch(setUser(null));

  }
  return (
    <div className="w-[100px] h-[95vh] lg:flex flex-col bg-[#2222e6] rounded-lg justify-between  p-4 text-white">
      {/* Top Section (Profile) */}
      <div className="flex items-center justify-center space-y-4">
        <p className="w-12 h-12 text-white cursor-pointer hover:text-gray-300 bg-purple-800 rounded-full flex items-center justify-center">
          H
        </p>
      </div>

      <div className="flex flex-col items-center space-y-10 mb-10">
        <HomeIcon className="w-8 h-8 text-white cursor-pointer hover:text-gray-300" />
        <ChatBubbleLeftEllipsisIcon className="w-8 h-8 text-white cursor-pointer hover:text-gray-300" />
        <BellIcon className="w-8 h-8 cursor-pointer hover:text-gray-300" />
        <Cog6ToothIcon className="w-8 h-8 cursor-pointer hover:text-gray-300" />
      </div>

      {/* Bottom Section (Logout) */}
      <div className="flex flex-col items-center pb-4">
        <ArrowLeftOnRectangleIcon className="w-8 h-8 cursor-pointer hover:text-gray-300" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
