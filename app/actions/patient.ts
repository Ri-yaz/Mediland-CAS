"use server";

import db from "@/lib/db";
import { PatientFormSchema } from "@/lib/schema";
import { clerkClient } from "@clerk/nextjs/server";

export async function updatePatient(data: any, pid: string) {
  try {
    const validateData = PatientFormSchema.safeParse(data);

    if (!validateData.success) {
      return {
        success: false,
        error: true,
        message: "Provide all required fields",
      };
    }

    const patientData = validateData.data;

    const client = await clerkClient();
    await client.users.updateUser(pid, {
      firstName: patientData.first_name,
      lastName: patientData.last_name,
    });

    await db.patient.update({
      data: {
        ...patientData,
      },
      where: { id: pid },
    });

    return {
      success: true,
      error: false,
      message: "Patient info updated successfully",
    };
  } catch (error: any) {
    console.error(error);
    const message = error?.errors?.[0]?.message || error?.message || "Something went wrong";
    return { success: false, error: true, message };
  }
}

export async function createNewPatient(data: any, pid: string) {
  try {
    const validateData = PatientFormSchema.safeParse(data);

    if (!validateData.success) {
      return {
        success: false,
        error: true,
        message: "Provide all required fields",
      };
    }

    const patientData = validateData.data;
    let patient_id = pid;

    const client = await clerkClient();
    if (pid === "new-patient") {
      const user = await client.users.createUser({
        emailAddress: [patientData.email],
        password: patientData.phone,
        firstName: patientData.first_name,
        lastName: patientData.last_name,
        publicMetadata: { role: "patient" },
      });

      patient_id = user?.id;
    } else {
      await client.users.updateUser(pid, {
        publicMetadata: { role: "patient" },
      });
    }

    await db.patient.create({
      data: {
        ...patientData,
        id: patient_id,
      },
    });

    return { success: true, error: false, message: "Patient created successfully" };
  } catch (error: any) {
    console.error(error);
    const message = error?.errors?.[0]?.message || error?.message || "Something went wrong";
    return { success: false, error: true, message };
  }
}

export async function createRating(data: {
  doctor_id: string;
  patient_id: string;
  rating: number;
  comment?: string;
}) {
  try {
    if (!data.doctor_id || !data.patient_id || !data.rating) {
      return {
        success: false,
        message: "Provide all required fields",
      };
    }

    await db.rating.create({
      data: {
        doctor_id: data.doctor_id,
        patient_id: data.patient_id,
        rating: data.rating,
        comment: data.comment,
      },
    });

    return {
      success: true,
      message: "Review submitted successfully",
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
}
