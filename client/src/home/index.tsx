"use client";

import Chat from "@/ui/chat";
import Sidebar from "@/ui/sidebar";
import Users from "@/ui/users";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useFetchUserQuery, useFetchUsersQuery } from "@/lib/api";
import { io, Socket } from "socket.io-client";

export default function Home() {
    useFetchUserQuery("");
    useFetchUsersQuery("");

    const usersState = useSelector((state: any) => state.user);
    const { users, user } = usersState;
    const [activeUsers, setActiveUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatUser, setChatUser] = useState(users[0]);
    const router = useRouter();
    const socket = useRef<Socket | null>(null);

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
        if (socket.current) {
            socket.current.emit("addUser", user);
            socket.current.on("activeUsers", (activeUsers) => {
                if (user) {
                    const filteredUsers = activeUsers.filter((u) => u.userId !== user.id);
                    setActiveUsers(filteredUsers);
                }
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

        return () => {
            socket.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket.current) {
            socket.current.on("getUsers", (activeUsers) => {
                console.log(activeUsers);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log("activeUsers", activeUsers);

    return (
        <div className="p-[20px] bg-slate-200">
            <div className="flex">
                <div className="w-[20%] flex justify-center">
                    <Sidebar user={user} />
                </div>
                <div className="w-[30%] h-[95vh] flex justify-center">
                    <Users users={users} activeUsers={activeUsers} chatUserHandler={chatUserHandler} />
                </div>
                <div className="w-[100%] h-[90vh] flex justify-center">
                    <Chat chatUser={chatUser} />
                </div>
            </div>
        </div>
    );
}
