"use client";

import { LabTestSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { CardDescription, CardHeader } from "../ui/card";
import { Form } from "../ui/form";
import { CustomInput } from "../custom-input";
import { toast } from "sonner";
import { addLabTest } from "@/app/actions/medical";

interface AddLabTestProps {
    medicalId: string;
    servicesData: any[];
}

export type LabTestFormData = z.infer<typeof LabTestSchema>;

export const AddLabTest = ({ medicalId, servicesData }: AddLabTestProps) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<LabTestFormData>({
        resolver: zodResolver(LabTestSchema),
        defaultValues: {
            record_id: medicalId,
            test_date: new Date(),
            result: "",
            status: "PENDING",
            notes: "",
            service_id: "",
            test_type: "",
        },
    });

    const handleOnSubmit = async (data: LabTestFormData) => {
        try {
            setLoading(true);

            const res = await addLabTest(data);

            if (res.success) {
                toast.success(res.message);
                router.refresh();
                form.reset();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to add lab test");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant={"outline"}
                        size={"sm"}
                        className="text-sm font-normal"
                    >
                        <Plus size={22} className="text-gray-400" />
                        Add Lab Test
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    <CardHeader className="px-0">
                        <DialogTitle>Add Lab Test Result</DialogTitle>
                        <CardDescription>
                            Enter the details of the lab test performed.
                        </CardDescription>
                    </CardHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleOnSubmit)}
                            className="space-y-6"
                        >
                            <CustomInput
                                type="select"
                                control={form.control}
                                name="test_type"
                                label="Test Type"
                                placeholder="Select test type"
                                selectList={[
                                    { label: "Blood & Urine", value: "Blood & Urine" },
                                    { label: "Microbiology & Culture Tests", value: "Microbiology & Culture Tests" },
                                    { label: "Imaging & Physical Tests", value: "Imaging & Physical Tests" },
                                    { label: "Pregnancy Tests", value: "Pregnancy Tests" },
                                ]}
                            />

                            {/* <CustomInput
                                type="select"
                                control={form.control}
                                name="service_id"
                                label="Service (Optional)"
                                placeholder="Select specific service"
                                selectList={servicesData?.map((s) => ({
                                    label: s.service_name,
                                    value: s.id,
                                }))}
                            /> */}

                            <CustomInput
                                type="input"
                                control={form.control}
                                name="test_date"
                                label="Test Date"
                                inputType="date"
                            />

                            <CustomInput
                                type="input"
                                control={form.control}
                                name="status"
                                label="Status"
                                placeholder="e.g. Completed, Pending"
                            />

                            <CustomInput
                                type="textarea"
                                control={form.control}
                                name="result"
                                label="Result"
                                placeholder="Enter test results..."
                            />

                            <CustomInput
                                type="textarea"
                                control={form.control}
                                name="notes"
                                label="Notes"
                                placeholder="Additional notes..."
                            />

                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 w-full"
                            >
                                Submit Lab Test
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};
