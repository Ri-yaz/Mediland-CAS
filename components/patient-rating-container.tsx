import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import { RatingList } from "./rating-list";
import { UserRatingForm } from "./user-rating-form";

export const PatientRatingContainer = async ({ id }: { id?: string }) => {
  const { userId } = await auth();
  const patientId = id ? id : userId!;

  const data = await db.rating.findMany({
    take: 10,
    where: { patient_id: patientId },
    include: {
      patient: { select: { last_name: true, first_name: true } },
      doctor: { select: { name: true } },
    },
    orderBy: { created_at: "desc" },
  });

  // Fetch doctors that this patient has had COMPLETED appointments with
  const appointmentDoctors = await db.appointment.findMany({
    where: { patient_id: patientId, status: "COMPLETED" },
    select: {
      doctor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    distinct: ["doctor_id"],
  });

  const doctors = appointmentDoctors
    .map((ad) => ad.doctor)
    .filter((doc): doc is { id: string; name: string } => doc !== null);

  if (!data) return null;

  return (
    <div className="space-y-4">
      <RatingList data={data} showPatientName={false} />
      {doctors.length > 0 && (
        <UserRatingForm patientId={patientId} doctors={doctors} />
      )}
    </div>
  );
};
