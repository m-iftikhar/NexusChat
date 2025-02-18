import React from "react";
import Image from "next/image";

const Users = ({ users, chatUserHandler, activeUsers }) => {
  return (
    <div className="w-full h-[85vh] hidden lg:block rounded-lg">
      <p className="text-black text-xl font-bold pt-2 pb-4">People</p>
      <div className="h-[450px] overflow-y-auto scrollbar-medium rounded-lg shadow-sm bg-white shadow-[#C4E3F4]">
        {users.map((item) => {
          const isActive = activeUsers.some((u) => u.userId === item.id);
          return (
            <div
              onClick={() => chatUserHandler(item)}
              key={item.id}
              className="cursor-pointer py-4 px-4 border-b flex items-center border-gray-200 hover:border-gray-100"
            >
              <div className="relative flex items-center space-x-4">
                {item.profileImage ? (
                  <div className="relative">
                    <Image
                      src={item.profileImage.trim() || "/fallback.jpg"}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded-full w-12 h-12 object-cover"
                    />
                    {isActive && (
                      <span className="status-indicator absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-12 h-12 flex items-center justify-center bg-purple-600 text-white font-bold rounded-full">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    {isActive && (
                      <span className="status-indicator absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                )}
                <p className="text-gray-800 font-medium">{item.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Users;
