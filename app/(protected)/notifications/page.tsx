import { Bell } from "lucide-react";
import React from "react";

const NotificationsPage = () => {
    return (
        <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Bell className="size-10 text-blue-600 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Notifications</h1>
            <p className="text-gray-500 max-w-sm">
                You're all caught up! When you have new alerts or updates, they'll appear here.
            </p>
        </div>
    );
};

export default NotificationsPage;
