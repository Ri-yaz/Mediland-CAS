"use server";

import db from "@/lib/db";
import {
  DoctorSchema,
  ServiceSchema,
  StaffSchema,
  WorkingDaysSchema,
} from "@/lib/schema";
import { generateRandomColor } from "@/utils";
import { checkRole } from "@/utils/roles";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createNewStaff(data: any) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const isAdmin = await checkRole("ADMIN");

    if (!isAdmin) {
      return { success: false, message: "Unauthorized" };
    }

    const values = StaffSchema.safeParse(data);

    if (!values.success) {
      return {
        success: false,
        error: true,
        message: values.error.errors[0].message,
      };
    }

    const validatedValues = values.data;
    const client = await clerkClient();

    const nameParts = validatedValues.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Staff";

    const user = await client.users.createUser({
      emailAddress: [validatedValues.email],
      password: validatedValues.password,
      firstName,
      lastName,
      publicMetadata: { role: validatedValues.role.toLowerCase() },
    });

    const { password, ...staffData } = validatedValues;

    await db.staff.create({
      data: {
        ...staffData,
        role: validatedValues.role as any,
        colorCode: generateRandomColor(),
        id: user.id,
        status: "ACTIVE",
      },
    });

    revalidatePath("/record/staffs");

    return {
      success: true,
      message: "Staff added successfully",
      error: false,
    };
  } catch (error: any) {
    console.log(error);
    const message = error?.errors?.[0]?.message || error?.message || "Something went wrong";
    return { error: true, success: false, message };
  }
}

export async function createNewDoctor(data: z.infer<typeof DoctorSchema> & { work_schedule: any[] }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const isAdmin = await checkRole("ADMIN");

    if (!isAdmin) {
      return { success: false, message: "Unauthorized" };
    }

    const values = DoctorSchema.safeParse(data);
    const workingDaysValues = WorkingDaysSchema.safeParse(data?.work_schedule);

    if (!values.success) {
      return {
        success: false,
        error: true,
        message: values.error.errors[0].message,
      };
    }

    if (!workingDaysValues.success) {
      return {
        success: false,
        error: true,
        message: "Invalid work schedule data",
      };
    }

    const validatedValues = values.data;
    const workingDayData = workingDaysValues.data!;
    const client = await clerkClient();

    const nameParts = validatedValues.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Doctor";

    // Create Clerk User
    const user = await client.users.createUser({
      emailAddress: [validatedValues.email],
      password: validatedValues.password,
      firstName,
      lastName,
      publicMetadata: { role: "doctor" },
    });

    const { password, ...doctorData } = validatedValues;
    const colorCode = generateRandomColor();

    // Create Doctor Record
    const doctor = await db.doctor.create({
      data: {
        ...doctorData,
        id: user.id,
        colorCode,
      },
    });


    // Create Working Days
    await Promise.all(
      workingDayData?.map((el) =>
        db.workingDays.create({
          data: { ...el, doctor_id: doctor.id },
        })
      )
    );

    revalidatePath("/record/doctors");
    revalidatePath("/record/staffs");

    return {
      success: true,
      message: "Doctor added successfully",
      error: false,
    };
  } catch (error: any) {
    console.error("Error creating doctor:", error);

    // Extract more specific error message if available (e.g. Clerk or Prisma)
    let message = "Something went wrong";
    if (error?.errors?.[0]?.message) {
      message = error.errors[0].message;
    } else if (error?.message) {
      if (error.message.includes("Unique constraint failed")) {
        message = "A user with this email or license number already exists.";
      } else {
        message = error.message;
      }
    }

    return { error: true, success: false, message };
  }
}

export async function addNewService(data: any) {
  try {
    const isValidData = ServiceSchema.safeParse(data);

    if (!isValidData.success) {
      return { success: false, error: true, message: "Invalid data" };
    }

    const validatedData = isValidData.data;

    await db.services.create({
      data: { ...validatedData!, price: Number(data.price!) },
    });

    return {
      success: true,
      error: false,
      message: `Service added successfully`,
    };
  } catch (error: any) {
    console.log(error);
    return { success: false, error: true, message: "Internal Server Error" };
  }
}
