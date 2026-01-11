"use server";

import db from "@/lib/db";
import { DoctorSchema, WorkingDaysSchema } from "@/lib/schema";
import { clerkClient, auth } from "@clerk/nextjs/server";

export async function registerDoctor(data: any) {
    try {
        const values = DoctorSchema.safeParse(data);
        const workingDaysValues = WorkingDaysSchema.safeParse(data?.work_schedule);

        if (!values.success || !workingDaysValues.success) {
            return {
                success: false,
                errors: true,
                message: "Please provide all required info",
            };
        }

        const validatedValues = values.data;
        const workingDayData = workingDaysValues.data || [];

        console.log("Registering doctor:", validatedValues.email);

        const client = await clerkClient();

        // Split name safely
        const nameParts = validatedValues.name.trim().split(/\s+/);
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Doctor";

        if (!validatedValues.password || validatedValues.password.length < 8) {
            return {
                success: false,
                error: true,
                message: "Password must be at least 8 characters long",
            };
        }

        // Create a unique username from email prefix
        const username = validatedValues.email.split("@")[0] + Math.floor(Math.random() * 1000);

        // Create the user in Clerk
        const user = await client.users.createUser({
            emailAddress: [validatedValues.email],
            password: validatedValues.password,
            firstName,
            lastName,
            username,
            publicMetadata: { role: "doctor" },
        });

        console.log("Clerk user created:", user.id);

        const { password, ...doctorData } = validatedValues;

        // Create the doctor record in Prisma with PENDING status
        const doctor = await db.doctor.create({
            data: {
                id: user.id,
                name: validatedValues.name,
                email: validatedValues.email,
                phone: validatedValues.phone,
                address: validatedValues.address,
                specialization: validatedValues.specialization,
                license_number: validatedValues.license_number,
                type: (validatedValues.type || "FULL") as any,
                department: validatedValues.department,
                img: validatedValues.img || "",
                status: "PENDING" as any,
            },
        });

        console.log("Prisma doctor created:", doctor.id);

        // Create working days
        if (workingDayData.length > 0) {
            await Promise.all(
                workingDayData.map((el) =>
                    db.workingDays.create({
                        data: { ...el, doctor_id: doctor.id },
                    })
                )
            );
            console.log("Working days created");
        }

        return {
            success: true,
            message: "Registration successful! Please wait for admin approval.",
            error: false,
        };
    } catch (error: any) {
        console.error("Registration Error Detail:", JSON.stringify(error, null, 2));
        return {
            error: true,
            success: false,
            message: error.errors ? error.errors[0]?.longMessage || error.errors[0]?.message : error.message || "Something went wrong"
        };
    }
}

export async function approveDoctor(id: string) {
    try {
        const doctor = await db.doctor.update({
            where: { id },
            data: { status: "ACTIVE" },
        });

        return {
            success: true,
            message: "Doctor approved successfully",
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Failed to approve doctor" };
    }
}

export const updateDoctorStatus = async (id: string, status: string) => {
    try {
        const { userId } = await auth();

        if (!userId) {
            return {
                success: false,
                message: "Unauthorized",
                status: 401,
            };
        }

        await db.doctor.update({
            where: { id },
            data: { status },
        });

        return {
            success: true,
            message: "Doctor status updated successfully",
            status: 200,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal Server Error",
            status: 500,
        };
    }
};

export async function rejectDoctor(id: string) {
    try {
        await db.doctor.delete({
            where: { id },
        });

        // Optionally delete from Clerk too
        const client = await clerkClient();
        await client.users.deleteUser(id);

        return {
            success: true,
            message: "Doctor rejected and account deleted",
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Failed to reject doctor" };
    }
}
