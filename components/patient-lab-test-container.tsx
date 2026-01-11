import db from "@/lib/db";
import { NoDataFound } from "./no-data-found";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LabTestCard } from "./appointment/lab-test-card";

export const PatientLabTestContainer = async ({
    patientId,
}: {
    patientId: string;
}) => {
    const labTests = await db.labTest.findMany({
        where: {
            medical_record: {
                patient_id: patientId,
            },
        },
        include: { services: true },
        orderBy: { created_at: "desc" },
    });

    return (
        <div>
            {labTests.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <NoDataFound note="No lab tests found" />
                </div>
            ) : (
                <section className="space-y-6">
                    <Card className="shadow-none border-none bg-transparent">
                        <CardHeader className="flex flex-row items-center justify-between px-0">
                            <CardTitle>Lab Test Results</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 px-0">
                            {labTests.map((test, index) => (
                                <div key={test.id}>
                                    <LabTestCard test={test as any} index={index} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            )}
        </div>
    );
};
