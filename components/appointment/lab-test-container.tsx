import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NoDataFound } from "../no-data-found";
import { AddLabTest } from "../dialogs/add-lab-test";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { checkRole } from "@/utils/roles";
import { LabTestCard } from "./lab-test-card";

export const LabTestContainer = async ({
    id,
    status,
}: {
    id: string;
    status?: string;
}) => {
    const { userId } = await auth();

    if (!userId) redirect("/sign-in");

    const data = await db.medicalRecords.findFirst({
        where: { appointment_id: id },
        include: {
            lab_test: {
                include: { services: true },
                orderBy: { created_at: "desc" },
            },
        },
        orderBy: { created_at: "desc" },
    });

    const labTests = data?.lab_test || [];
    const isPatient = await checkRole("PATIENT");
    const services = await db.services.findMany({
        select: { id: true, service_name: true }
    });

    return (
        <div>
            {labTests.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <NoDataFound note="No lab tests found" />
                    {!isPatient && status !== "CANCELLED" && status !== "COMPLETED" && (
                        <AddLabTest
                            medicalId={data?.id || ""}
                            servicesData={services}
                        />
                    )}
                </div>
            ) : (
                <section className="space-y-6">
                    <Card className="shadow-none border-none bg-transparent">
                        <CardHeader className="flex flex-row items-center justify-between px-0">
                            <CardTitle>Lab Test Results</CardTitle>

                            {!isPatient && status !== "CANCELLED" && status !== "COMPLETED" && (
                                <AddLabTest
                                    medicalId={data?.id || ""}
                                    servicesData={services}
                                />
                            )}
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
