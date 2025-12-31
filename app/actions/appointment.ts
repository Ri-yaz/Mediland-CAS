"use server";

import { VitalSignsFormData } from "@/components/dialogs/add-vital-signs";
import db from "@/lib/db";
import { AppointmentSchema, VitalSignsSchema } from "@/lib/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { AppointmentStatus } from "@prisma/client";

export async function createNewAppointment(data: any) {
  try {
    const validatedData = AppointmentSchema.safeParse(data);

    if (!validatedData.success) {
      return { success: false, msg: "Invalid data" };
    }
    const validated = validatedData.data;

    await db.appointment.create({
      data: {
        patient_id: data.patient_id,
        doctor_id: validated.doctorId,
        time: validated.time,
        type: validated.type,
        appointment_date: new Date(validated.appointmentDate),
        note: validated.note,
      },
    });

    return {
      success: true,
      message: "Appointment booked successfully",
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}
export async function appointmentAction(
  id: string | number,

  status: AppointmentStatus,
  reason: string
) {
  try {
    await db.appointment.update({
      where: { id: id as string },
      data: {
        status,
        reason,
      },
    });

    return {
      success: true,
      error: false,
      msg: `Appointment ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function addVitalSigns(
  data: VitalSignsFormData,
  appointmentId: string,
  doctorId: string
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, msg: "Unauthorized" };
    }

    const validatedData = VitalSignsSchema.parse(data);

    let medicalRecord = null;

    if (!validatedData.medicalRecordId) {
      medicalRecord = await db.medicalRecords.create({
        data: {
          patient_id: validatedData.patientId,
          appointment_id: appointmentId,
          doctor_id: doctorId,
        },
      });
    }

    const med_id = validatedData.medicalRecordId || medicalRecord?.id;

    await db.vitalSigns.create({
      data: {
        patient_id: validatedData.patientId,
        medical_id: med_id!,
        body_temperature: validatedData.bodyTemperature,
        systolic: validatedData.systolicBP,
        diastolic: validatedData.diastolicBP,
        heartRate: validatedData.heartRate.toString(),
        respiratory_rate: validatedData.respiratoryRate,
        oxygen_saturation: validatedData.oxygenSaturation,
        weight: validatedData.weight,
        height: validatedData.height,
      },
    });

    return {
      success: true,
      msg: "Vital signs added successfully",
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}
