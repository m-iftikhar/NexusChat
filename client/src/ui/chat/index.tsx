import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const Chat = ({ chatUser, messages, user, sendMessageHandler, message, setMessage }) => {
  const messagesEndRef = useRef(null);
  const [media, setMedia] = useState({ image: null, audio: null, video: null, file: null });
  const [preview, setPreview] = useState({ image: "", audio: "", video: "", file: "" });
  const [isRecording, setIsRecording] = useState(false);
  const [audioStream, setAudioStream] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const dateFormat = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(prev => ({ ...prev, [type]: file })); // ✅ Store File object
      setPreview(prev => ({ 
        ...prev, 
        [type]: URL.createObjectURL(file) // ✅ Create preview URL
      }));
    }
  };

  const handleStartRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start();

          mediaRecorder.ondataavailable = (e) => {
            setAudioBlob(e.data);
            setAudioUrl(URL.createObjectURL(e.data));
          };

          mediaRecorder.onstop = () => {
            setAudioStream(null);
          };

          setAudioStream(mediaRecorder);
          setIsRecording(true);
        })
        .catch((error) => console.error("Error accessing audio:", error));
    } else {
      alert("Audio recording is not supported in your browser.");
    }
  };

  const handleStopRecording = () => {
    if (audioStream) {
      audioStream.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (message.trim() || media.image || media.audio || media.video || media.file) {
            await sendMessageHandler({
                content: message,
                image: media.image,
                audio: audioBlob ? audioBlob : media.audio,
                video: media.video,
                file: media.file,
            });
            setMessage("");
            setMedia({ image: null, audio: null, video: null, file: null });
            setPreview({ image: "", audio: "", video: "", file: "" });
            setAudioBlob(null);
            setAudioUrl(null);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
};


  return (
    <div className="w-[90%] h-[80vh] rounded-lg shadow-md shadow-[#79c5ef]">
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

      <div className="flex overflow-auto flex-col h-full bg-white">
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages?.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.senderId !== user?.id ? "justify-start" : "justify-end"}`}
              >
                <div className="flex flex-col space-y-1 max-w-xs">
                  <div
                    className={`${
                      msg.senderId === user?.id
                        ? "bg-gray-300 text-black"
                        : "bg-blue-500 text-white"
                    } p-3 rounded-lg break-words`}
                  >
                    {msg?.image && <img src={msg.image} alt="Chat content" className="w-full max-h-48 object-cover rounded-lg mb-2" />}
                    {msg?.audio && <audio controls src={msg.audio} className="w-full mb-2" />}
                    {msg?.video && <video controls src={msg.video} className="w-full max-h-48 rounded-lg mb-2" />}
                    {msg?.file && <a href={msg.file} target="_blank" rel="noopener noreferrer " className="text-blue-500 hover:text-blue-700 underline">Download File</a>}
                    {msg?.content}
                  </div>
                  <span className="text-xs text-gray-500">{dateFormat(msg?.createdAt)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No messages yet</p>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="p-4 bg-white shadow-lg rounded-md">
          <div className="bg-white p-2 rounded-md border border-gray-400">
            {Object.keys(preview).map((type) =>
              preview[type] ? (
                <div key={type} className="mb-2 relative">
                  {type === "image" && <img src={preview.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />}
                  {type === "audio" && <audio controls src={preview.audio} className="w-full" />}
                  {type === "video" && <video controls src={preview.video} className="w-16 h-16 object-cover rounded-lg" />}
                  {type === "file" && <a href={preview.file} target="_blank" rel="noopener noreferrer">Preview File</a>}
                  <button
                    onClick={() => {
                      setPreview((prev) => ({ ...prev, [type]: "" }));
                      setMedia((prev) => ({ ...prev, [type]: null }));
                    }}
                    className="absolute top-0 right-0 bg-gray-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : null
            )}
            <form onSubmit={handleSubmit} className="flex items-center">
              <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, "image")} className="hidden" id="image-upload" />
              <input type="file" accept="audio/*" onChange={(e) => handleFileSelect(e, "audio")} className="hidden" id="audio-upload" />
              <input type="file" accept="video/*" onChange={(e) => handleFileSelect(e, "video")} className="hidden" id="video-upload" />
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileSelect(e, "file")} className="hidden" id="file-upload" />

              <label htmlFor="image-upload" className="cursor-pointer mr-2">📷</label>
              <label htmlFor="audio-upload" className="cursor-pointer mr-2">🎵</label>
              <label htmlFor="video-upload" className="cursor-pointer mr-2">🎥</label>
              <label htmlFor="file-upload" className="cursor-pointer mr-2">📂</label>

              <button
                type="button"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`mr-2 ${isRecording ? "bg-red-500" : "bg-green-500"} text-white px-3 py-2 rounded-full`}
              >
                {isRecording ? "Stop Recording" : "Record Audio"}
              </button>

              {audioUrl && <audio controls src={audioUrl} className="mr-2" />}

              <input onChange={(e) => setMessage(e.target.value)} value={message} className="flex-1 focus:outline-none px-2 py-1" placeholder="Type a message..." />
              <button type="submit" className="ml-2 bg-[#2222e6] hover:bg-[#6363cc] text-white px-4 py-2 rounded-lg">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
