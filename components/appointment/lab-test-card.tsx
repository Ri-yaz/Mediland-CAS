import { LabTest, Services } from "@prisma/client";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";

interface ExtendedLabTest extends LabTest {
    services: Services | null;
}

export const LabTestCard = ({
    test,
    index,
}: {
    test: ExtendedLabTest;
    index: number;
}) => {
    return (
        <Card className="shadow-none p-4">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-sm text-gray-500">Test Type</span>
                        <p className="text-lg font-semibold">{test.test_type || test.services?.service_name}</p>
                    </div>
                    {index === 0 && (
                        <div className="px-3 py-1 text-xs bg-blue-100 rounded-full font-semibold text-blue-600">
                            Recent
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500 block">Date</span>
                        <p className="font-medium">{test.test_date.toLocaleDateString()}</p>
                    </div>
                    <div>
                        <span className="text-gray-500 block">Status</span>
                        <p className={`font-medium ${test.status?.toUpperCase() === 'PENDING' ? 'text-yellow-600' : 'text-green-600'}`}>
                            {test.status}
                        </p>
                    </div>
                </div>

                <Separator />

                <div>
                    <span className="text-sm text-gray-500 block">Result</span>
                    <p className="text-muted-foreground whitespace-pre-wrap">{test.result}</p>
                </div>

                {test.notes && (
                    <>
                        <Separator />
                        <div>
                            <span className="text-sm text-gray-500 block">Notes</span>
                            <p className="text-muted-foreground text-sm italic whitespace-pre-wrap">{test.notes}</p>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};
