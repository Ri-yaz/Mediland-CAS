"use server";

import { VitalSignsFormData } from "@/components/dialogs/add-vital-signs";
import db from "@/lib/db";
import { AppointmentSchema, VitalSignsSchema } from "@/lib/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { AppointmentStatus } from "@prisma/client";

import { generateBookingConfirmationEmail, generateAppointmentEmail, sendEmail } from "@/utils/mail";

export async function createNewAppointment(data: any) {
  try {
    const validatedData = AppointmentSchema.safeParse(data);

    if (!validatedData.success) {
      return { success: false, error: true, message: "Invalid data" };
    }
    const validated = validatedData.data;

    const appointment = await db.appointment.create({
      data: {
        patient_id: data.patient_id,
        doctor_id: validated.doctor_id,
        time: validated.time,
        type: validated.type,
        appointment_date: new Date(validated.appointment_date),
        note: validated.note,
      },
      include: {
        patient: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        doctor: {
          select: {
            name: true,
          },
        },
      },
    });

    // Send Booking Confirmation Email
    const patientName = `${appointment.patient.first_name} ${appointment.patient.last_name}`;
    const doctorName = appointment.doctor.name;
    const patientEmail = appointment.patient.email;

    const emailHtml = generateBookingConfirmationEmail(
      patientName,
      doctorName,
      appointment.appointment_date,
      appointment.time
    );

    await sendEmail({
      to: patientEmail,
      subject: "Appointment Booking Confirmation - Under Review",
      html: emailHtml,
    });

    // Create Notification for the Doctor
    await db.notification.create({
      data: {
        userId: validated.doctor_id,
        message: `New appointment booking from ${appointment.patient.first_name} ${appointment.patient.last_name}`,
      },
    });

    return {
      success: true,
      error: false,
      message: "Appointment booked successfully",
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: true, message: "Internal Server Error" };
  }
}

export async function appointmentAction(
  id: string | number,
  status: AppointmentStatus,
  reason: string
) {
  try {
    const updatedAppointment = await db.appointment.update({
      where: { id: id as string },
      data: {
        status,
        reason,
      },
      include: {
        patient: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        doctor: {
          select: {
            name: true,
          },
        },
      },
    });

    // Send Email Notification
    if (status === "SCHEDULED" || status === "CANCELLED") {
      const patientName = `${updatedAppointment.patient.first_name} ${updatedAppointment.patient.last_name}`;
      const doctorName = updatedAppointment.doctor.name;
      const patientEmail = updatedAppointment.patient.email;

      const emailHtml = generateAppointmentEmail(
        patientName,
        doctorName,
        status,
        updatedAppointment.appointment_date,
        updatedAppointment.time,
        reason
      );

      await sendEmail({
        to: patientEmail,
        subject: `Appointment ${status === "SCHEDULED" ? "Approved" : "Declined"}`,
        html: emailHtml,
      });
    }

    return {
      success: true,
      error: false,
      message: `Appointment ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: true, message: "Internal Server Error" };
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
      return { success: false, error: true, message: "Unauthorized" };
    }

    const validatedData = VitalSignsSchema.parse(data);

    let medicalRecord = null;

    if (!validatedData.medical_id) {
      medicalRecord = await db.medicalRecords.create({
        data: {
          patient_id: validatedData.patient_id,
          appointment_id: appointmentId,
          doctor_id: doctorId,
        },
      });
    }

    const med_id = (validatedData.medical_id || medicalRecord?.id) as string;

    await db.vitalSigns.create({
      data: {
        patient_id: validatedData.patient_id,
        medical_id: med_id,
        body_temperature: validatedData.body_temperature,
        systolic: validatedData.systolic,
        diastolic: validatedData.diastolic,
        heartRate: validatedData.heartRate.toString(),
        respiratory_rate: validatedData.respiratory_rate,
        oxygen_saturation: validatedData.oxygen_saturation,
        weight: validatedData.weight,
        height: validatedData.height,
      },
    });

    return {
      success: true,
      error: false,
      message: "Vital signs added successfully",
    };
  } catch (error: any) {
    console.log(error);
    return { success: false, error: true, message: error?.message || "Internal Server Error" };
  }
}
