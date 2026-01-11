import { Star } from "lucide-react";
import React from "react";

interface DataProps {
  id: string;
  doctor_id: string | null;
  rating: number;
  comment?: string | null;
  created_at: Date | string;
  patient: { last_name: string; first_name: string } | null;
  doctor?: { name: string } | null;
}

export const RatingList = ({
  data,
  showPatientName = true,
}: {
  data: DataProps[];
  showPatientName?: boolean;
}) => {
  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold">Patient Reviews</h1>
      </div>

      <div className="space-y-4 p-4 pt-0">
        {data?.length > 0 ? (
          data.map((rate) => (
            <div
              key={rate.id}
              className="border-b last:border-0 pb-4 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="text-base font-semibold text-gray-900">
                      {showPatientName
                        ? `${rate.patient?.first_name || "Unknown"} ${rate.patient?.last_name || "Patient"}`
                        : `Review for Dr. ${rate.doctor?.name || "Unknown"}`}
                    </p>
                    <span className="text-sm text-gray-500">
                      {new Date(rate.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        size={18}
                        className={`${index < rate.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300 fill-gray-200"
                          }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-gray-700">
                      {rate.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {rate.comment && (
                <div className="mt-2 text-gray-600 text-sm italic">
                  "{rate.comment}"
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 italic">
            No reviews yet.
          </div>
        )}
      </div>
    </div>
  );
};

