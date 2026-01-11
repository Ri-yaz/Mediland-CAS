import { auth } from "@clerk/nextjs/server";
import { getPatientPrescriptions } from "@/utils/services/medical-record";
import { format } from "date-fns";
import { Pill } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NoDataFound } from "@/components/no-data-found";

const PrescriptionPage = async () => {
    const { userId } = await auth();
    const { data, success } = await getPatientPrescriptions(userId!);

    if (!success || !data || data.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6">
                <NoDataFound note="No prescriptions found" />
            </div>
        );
    }

    // Filter out records that have no prescriptions in either field
    const prescriptions = data.filter(record =>
        record.prescriptions ||
        record.diagnosis.some(d => d.prescribed_medications)
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Pill className="size-8 text-blue-600" />
                <h1 className="text-3xl font-bold">My Prescriptions</h1>
            </div>

            <div className="grid gap-6">
                {prescriptions.map((record) => (
                    <Card key={record.id} className="shadow-none border border-gray-100">
                        <CardHeader className="bg-slate-50/50">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm font-medium text-gray-500">
                                    Prescribed on {format(new Date(record.created_at), "PPP")}
                                </CardTitle>
                                <span className="text-xs text-gray-400">ID: {record.id}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {record.prescriptions && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-700">General Prescriptions</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap">{record.prescriptions}</p>
                                </div>
                            )}

                            {record.diagnosis.map((diag, idx) => (
                                diag.prescribed_medications && (
                                    <div key={idx} className="space-y-2 pt-2 border-t border-gray-50 first:border-0 first:pt-0">
                                        <h3 className="font-semibold text-gray-700">
                                            Medication from Dr. {diag.doctor.name}
                                        </h3>
                                        <p className="text-gray-600 whitespace-pre-wrap">{diag.prescribed_medications}</p>
                                    </div>
                                )
                            ))}
                        </CardContent>
                    </Card>
                ))}

                {prescriptions.length === 0 && (
                    <NoDataFound note="No specific medications found in your records." />
                )}
            </div>
        </div>
    );
};

export default PrescriptionPage;
