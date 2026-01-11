import { NewPatient } from "@/components/new-patient";
import { getPatientById } from "@/utils/services/patient";
import React from "react";

const EditPatient = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;

    const { data } = await getPatientById(params.id);

    if (!data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-semibold">Patient data not found</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex justify-center py-6 px-3 2xl:px-6">
            <div className="max-w-6xl w-full relative pb-10">
                <NewPatient data={data} type="update" patientId={params.id} />
            </div>
        </div>
    );
};

export default EditPatient;
