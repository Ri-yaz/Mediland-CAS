"use server";

import { DiagnosisFormData } from "@/components/dialogs/add-diagnosis";
import db from "@/lib/db";
import {
  DiagnosisSchema,
  LabTestSchema,
  PatientBillSchema,
  PaymentSchema,
} from "@/lib/schema";
import { checkRole } from "@/utils/roles";

export const addDiagnosis = async (
  data: DiagnosisFormData,
  appointmentId: string
) => {
  try {
    const validatedData = DiagnosisSchema.parse(data);

    let medicalRecord = null;

    if (!validatedData.medical_id) {
      medicalRecord = await db.medicalRecords.create({
        data: {
          patient_id: validatedData.patient_id,
          doctor_id: validatedData.doctor_id,
          appointment_id: appointmentId,
        },
      });
    }

    const med_id = (validatedData.medical_id || medicalRecord?.id) as string;
    await db.diagnosis.create({
      data: {
        ...validatedData,
        medical_id: med_id,
      },
    });

    return {
      success: true,
      message: "Diagnosis added successfully",
      status: 201,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to add diagnosis",
    };
  }
};

export async function addNewBill(data: any) {
  try {
    const isAdmin = await checkRole("ADMIN");
    const isDoctor = await checkRole("DOCTOR");

    if (!isAdmin && !isDoctor) {
      return {
        success: false,
        msg: "You are not authorized to add a bill",
      };
    }

    const isValidData = PatientBillSchema.safeParse(data);

    if (!isValidData.success) {
      return { success: false, msg: "Invalid bill data" };
    }

    const validatedData = isValidData.data;
    let bill_info = null;

    if (!data?.bill_id || data?.bill_id === "undefined") {
      const info = await db.appointment.findUnique({
        where: { id: data?.appointment_id },
        select: {
          id: true,
          patient_id: true,
          bills: {
            where: {
              appointment_id: data?.appointment_id,
            },
          },
        },
      });

      if (!info?.bills?.length) {
        bill_info = await db.payment.create({
          data: {
            appointment_id: data?.appointment_id,
            patient_id: info?.patient_id!,
            bill_date: new Date(),
            payment_date: new Date(),
            discount: 0.0,
            amount_paid: 0.0,
            total_amount: 0.0,
          },
        });
      } else {
        bill_info = info?.bills[0];
      }
    } else {
      bill_info = {
        id: data?.bill_id,
      };
    }

    await db.patientBills.create({
      data: {
        bill_id: bill_info?.id as string,
        service_id: validatedData?.service_id,
        service_date: new Date(validatedData?.service_date!),
        quantity: Number(validatedData?.quantity),
        unit_cost: Number(validatedData?.unit_cost),
        total_cost: Number(validatedData?.total_cost),
      },
    });

    return {
      success: true,
      error: false,
      msg: `Bill added successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function generateBill(data: any) {
  try {
    const isValidData = PaymentSchema.safeParse(data);

    if (!isValidData.success) {
      return { success: false, msg: "Invalid payment data" };
    }

    const validatedData = isValidData.data;

    const discountAmount =
      (Number(validatedData?.discount) / 100) *
      Number(validatedData?.total_amount);

    const res = await db.payment.update({
      data: {
        bill_date: validatedData?.bill_date,
        discount: discountAmount,
        total_amount: Number(validatedData?.total_amount)!,
      },
      where: { id: validatedData?.id },
    });

    await db.appointment.update({
      data: {
        status: "COMPLETED",
      },
      where: { id: res.appointment_id },
    });
    return {
      success: true,
      error: false,
      msg: `Bill generated successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function addLabTest(data: any) {
  try {
    const isAdmin = await checkRole("ADMIN");
    const isDoctor = await checkRole("DOCTOR");

    if (!isAdmin && !isDoctor) {
      return {
        success: false,
        msg: "You are not authorized to add a lab test",
      };
    }

    const validatedData = LabTestSchema.parse(data);

    await (db.labTest.create as any)({
      data: {
        record_id: validatedData.record_id,
        test_date: validatedData.test_date,
        result: validatedData.result,
        status: validatedData.status,
        notes: validatedData.notes,
        service_id: validatedData.service_id,
        test_type: validatedData.test_type,
      },
    });

    return {
      success: true,
      message: "Lab test added successfully",
    };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: error?.message || "Internal Server Error" };
  }
}
