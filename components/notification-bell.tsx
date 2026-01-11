"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { getNotifications, markAsRead } from "@/app/actions/notification";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export const NotificationBell = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const fetchNotifications = async () => {
        const res = await getNotifications();
        if (res.success) {
            setNotifications(res.data || []);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        const res = await markAsRead(id);
        if (res.success) {
            // Update local state to show it as read
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );

            // It should disappear after 20 seconds
            setTimeout(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
            }, 20000);
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <div className="relative">
            <div
                className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="size-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 size-4 bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden transition-all duration-300 transform origin-top-right">
                    <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
                        <h3 className="font-bold">Notifications</h3>
                        {unreadCount > 0 && <span className="text-[10px] bg-white text-blue-600 px-2 py-0.5 rounded-full uppercase font-extrabold">{unreadCount} New</span>}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <Bell className="size-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No notifications</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/30' : 'bg-white opacity-60'}`}
                                    onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                                >
                                    <p className={`text-sm ${!n.isRead ? 'text-gray-900 font-medium' : 'text-gray-500 italic'}`}>
                                        {n.message}
                                    </p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-[10px] text-gray-400">
                                            {format(new Date(n.created_at), "MMM d, h:mm a")}
                                        </span>
                                        {!n.isRead && (
                                            <span className="text-[9px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-bold uppercase">Mark as read</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-2 text-center border-t border-gray-100">
                        <button
                            className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
