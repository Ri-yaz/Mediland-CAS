import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { getRole } from "./roles";

export async function checkDoctorStatus() {
    try {
        const { userId } = await auth();
        const role = await getRole();

        // Only check status for doctors
        if (role.toLowerCase() !== "doctor") {
            return { isDoctor: false, status: null };
        }

        const doctor = await db.doctor.findUnique({
            where: { id: userId! },
            select: { status: true },
        });

        return {
            isDoctor: true,
            status: doctor?.status || "PENDING",
        };
    } catch (error) {
        console.error("Error checking doctor status:", error);
        return { isDoctor: false, status: null };
    }
}
