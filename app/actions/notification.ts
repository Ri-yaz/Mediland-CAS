"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getNotifications() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, message: "Unauthorized", status: 401 };
        }

        const notifications = await db.notification.findMany({
            where: { userId },
            orderBy: { created_at: "desc" },
        });

        return { success: true, data: notifications, status: 200 };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Internal Server Error", status: 500 };
    }
}

export async function markAsRead(id: string) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, message: "Unauthorized", status: 401 };
        }

        await db.notification.update({
            where: { id, userId },
            data: { isRead: true },
        });

        return { success: true, message: "Notification marked as read", status: 200 };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Internal Server Error", status: 500 };
    }
}
