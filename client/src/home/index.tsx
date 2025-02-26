"use client";

import Chat from "@/ui/chat";
import Sidebar from "@/ui/sidebar";
import Users from "@/ui/users";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useFetchMessagesBySenderIdQuery,useFetchUsersQuery, useFetchUserQuery,useAddMessageMutation } from "@/lib/api";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { setUsers,setUser } from "@/lib/features/userslice";
import { skip } from "node:test";

import { addMessage,addLocalMessage,addSocketMessage } from "@/lib/features/messageSlice";


export default function Home() {
    useFetchUserQuery("");
    useFetchUsersQuery("");
      
    const [addMessage] = useAddMessageMutation();

    const usersState = useSelector((state: any) => state.user);
    const messagesState = useSelector((state: any) => state.messages);
    const { users, user } = usersState;
    const [activeUsers, setActiveUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const{messages}=messagesState;
    const [chatUser, setChatUser] = useState(users[0]);
    const router = useRouter();
    const socket = useRef<Socket | null>(null);
    const [message,setMessage]=useState("");
    const {isLoading,refetch}=useFetchMessagesBySenderIdQuery(chatUser?.id,{
        skip:!chatUser?.id
    })
    console.log(messagesState,"messageState-->>")

      const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage?.getItem("token");
        if (!token) {
            router.push("/login");
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (users.length > 0) {
            setChatUser(users[0]);
        }
        if (socket.current && user) {
            socket.current.emit("addUser", user);
            socket.current.on("activeUsers", (activeUsers) => {
                
                const filteredUsers = activeUsers.filter((u) => u.userId !== user.id);
                setActiveUsers(filteredUsers);
            });
        }
    }, [users, user]);
    

    useEffect(() => {
        socket.current = io("http://localhost:5000", {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 3000
        });
       socket.current.on("newMessage",(data)=>{
        dispatch(addSocketMessage(data));
       });
        return () => {
            socket.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket.current) {
            socket.current.on("getUsers", (activeUsers) => {
            
                if (user) {
                    const filteredUsers = activeUsers.filter((u) => u.userId !== user.id);
                    setActiveUsers(filteredUsers);
                }
            });
        }
    }, [user]);

    const chatUserHandler = (selectedUser: any) => {
        setChatUser(selectedUser);
    };
    useEffect(()=>{
        if(chatUser?.id){
            refetch?.();
        }
    },[chatUser,refetch])

    if (loading) {
        return <div>Loading...</div>;
    }


     const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
        dispatch(setUser(null));
        dispatch(setUsers([]));
        if(socket.current){
            socket.current.emit?.("logout",user?.id);
            socket.current.disconnect();
        }
        
      };
      const sendMessageHandler = async (data) => {
        // Validate if there's content or media
        if (!data.content && !data.image && !data.audio && !data.video && !data.file) {
            return alert("Please enter a message or attach a file.");
        }
        
        // Construct the message data with additional fields
        const messageData = {
            ...data,
            createdAt: new Date().toISOString(),
            senderId: user?.id,
            receiverId: chatUser?.id
        };
    
        try {
            const result = await addMessage(messageData).unwrap();
            if (socket.current) {
                socket.current.emit("sendMessage", messageData);
            }
            dispatch(addLocalMessage(result));
            setMessage(""); // Clear the input field
        } catch (error) {
            console.error('Full error:', error);
            console.error('Backend response:', error.data);
            alert(`Error: ${error.data?.message || 'Check console for details'}`);
          }
    };

    return (
        <div className="p-[20px] bg-slate-200">
            <div className="flex">
                <div className="w-[20%] flex justify-center">
                    <Sidebar user={user} handleLogout={handleLogout} />
                </div>
                <div className="w-[30%] h-[95vh] flex justify-center">
                    <Users users={users} activeUsers={activeUsers} chatUserHandler={chatUserHandler} />
                </div>
                <div className="w-[100%] h-[90vh] flex justify-center">
                    <Chat chatUser={chatUser} messages={messages}
                     user={user} message={message} 
                      setMessage={setMessage}
                      sendMessageHandler={sendMessageHandler}
                      />
                </div>
            </div>
        </div>
    );
}
