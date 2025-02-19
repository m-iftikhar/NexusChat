import React, { useEffect, useRef } from "react";
import Image from "next/image";

const Chat = ({ chatUser, messages, user, sendMessageHandler, message, setMessage }) => {
  const messagesEndRef = useRef(null);

  const dateFormat = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const scrollToBottom = () => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }; // Added missing closing brace here

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Changed dependency to 'messages'

  return (
    <div className="w-[90%] h-[80vh] rounded-lg shadow-md shadow-[#79c5ef]">
      {/* Chat Header */}
      <div className="flex items-center bg-gray-100 border-b border-gray-300 p-4">
        <div>
          {chatUser?.profileImage ? (
            <Image
              src={chatUser.profileImage.trim() || "/fallback.jpg"}
              alt={chatUser?.name}
              width={40}
              height={40}
              className="rounded-full w-12 h-12 object-cover"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center bg-purple-600 text-white font-bold rounded-full">
              {chatUser?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-gray-800">{chatUser?.name}</h2>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex overflow-auto flex-col h-full bg-white">
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages?.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.senderId !== user?.id ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`${
                    msg.senderId === user?.id
                      ? "bg-gray-300 text-black"
                      : "bg-blue-500 text-white"
                  } p-3 rounded-lg max-w-xs relative`}
                >
                  {msg?.content}
                </div>
                <span
                  className={
                    msg.senderId === user?.id
                      ? "text-xs text-gray-500 bottom-0 float-left p-1"
                      : "text-xs text-gray-500 bottom-0 float-right p-1"
                  }
                >
                  {dateFormat(msg?.createdAt)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No messages yet</p>
          )}
          {/* Corrected ref placement */}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white shadow-lg rounded-md">
          <div className="bg-white p-2 rounded-md border border-gray-400">
            <form onSubmit={sendMessageHandler} className="flex items-center">
              <input
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                className="flex-1 focus:outline-none px-2 py-1"
                placeholder="Type a message..."
              />
              <button
                type="submit" // Changed to 'submit' to trigger form submission
                className="ml-2 bg-[#2222e6] hover:bg-[#6363cc] text-white px-4 py-2 rounded-lg"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
