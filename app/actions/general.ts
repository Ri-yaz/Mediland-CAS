"use server";

import {
  ReviewFormValues,
  reviewSchema,
} from "@/components/dialogs/review-form";
import db from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function deleteDataById(
  id: string,

  deleteType: "doctor" | "staff" | "patient" | "payment" | "bill"
) {
  try {
    switch (deleteType) {
      case "doctor":
        await db.doctor.delete({ where: { id: id } });
        break;
      case "staff":
        await db.staff.delete({ where: { id: id } });
        break;
      case "patient":
        await db.patient.delete({ where: { id: id } });
        break;
      case "payment":
        await db.payment.delete({ where: { id: id } });
        break;
      case "bill":
        await db.patientBills.delete({ where: { id: id } });
        break;
    }

    if (
      deleteType === "staff" ||
      deleteType === "patient" ||
      deleteType === "doctor"
    ) {
      const client = await clerkClient();
      await client.users.deleteUser(id);
    }

    const { userId: performerId } = await auth();
    if (performerId) {
      await db.auditLog.create({
        data: {
          user_id: performerId,
          record_id: id,
          action: "DELETE",
          model: deleteType.toUpperCase(),
          details: `Deleted ${deleteType} with ID: ${id}`,
        },
      });
    }

    return {
      success: true,
      message: "Data deleted successfully",
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
}

export async function createReview(values: ReviewFormValues) {
  try {
    const validatedFields = reviewSchema.parse(values);

    await db.rating.create({
      data: {
        ...validatedFields,
      },
    });

    return {
      success: true,
      message: "Review created successfully",
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
}
