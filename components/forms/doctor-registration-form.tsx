"use client";

import { DoctorSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { CustomInput, SwitchInput } from "../custom-input";
import { SPECIALIZATION } from "@/utils/specializations";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { registerDoctor } from "@/app/actions/doctor";
import Link from "next/link";

const TYPES = [
    { label: "Full-Time", value: "FULL" },
    { label: "Part-Time", value: "PART" },
];

const WORKING_DAYS = [
    { label: "Sunday", value: "sunday" },
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
];

type Day = {
    day: string;
    start_time?: string;
    close_time?: string;
};

export const DoctorRegistrationForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [workSchedule, setWorkSchedule] = useState<Day[]>([]);

    const form = useForm<z.infer<typeof DoctorSchema>>({
        resolver: zodResolver(DoctorSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            specialization: "",
            address: "",
            type: "FULL",
            department: "",
            img: "",
            password: "",
            license_number: "",
        },
    });

    const handleSubmit = async (values: z.infer<typeof DoctorSchema>) => {
        try {
            if (workSchedule.length === 0) {
                toast.error("Please select work schedule");
                return;
            }

            setIsLoading(true);
            const resp = await registerDoctor({
                ...values,
                work_schedule: workSchedule,
            });

            if (resp.success) {
                toast.success(resp.message);
                form.reset();
                setWorkSchedule([]);
                router.push("/sign-in");
            } else {
                toast.error(resp.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const selectedSpecialization = form.watch("specialization");

    useEffect(() => {
        if (selectedSpecialization) {
            const department = SPECIALIZATION.find(
                (el) => el.value === selectedSpecialization
            );

            if (department) {
                form.setValue("department", department.department);
            }
        }
    }, [selectedSpecialization, form]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md my-10">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-blue-700">Doctor Registration</h1>
                <p className="text-gray-500">Join our medical team</p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomInput
                            type="input"
                            control={form.control}
                            name="name"
                            placeholder="Full Name"
                            label="Full Name"
                        />
                        <CustomInput
                            type="radio"
                            selectList={TYPES}
                            control={form.control}
                            name="type"
                            label="Job Type"
                            placeholder=""
                            defaultValue="FULL"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomInput
                            type="select"
                            control={form.control}
                            name="specialization"
                            placeholder="Select specialization"
                            label="Specialization"
                            selectList={SPECIALIZATION}
                        />
                        <CustomInput
                            type="input"
                            control={form.control}
                            name="department"
                            placeholder="Department (autofilled)"
                            label="Department"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomInput
                            type="input"
                            control={form.control}
                            name="license_number"
                            placeholder="License Number"
                            label="License Number"
                        />
                        <CustomInput
                            type="input"
                            control={form.control}
                            name="phone"
                            placeholder="Contact Number"
                            label="Contact Number"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomInput
                            type="input"
                            control={form.control}
                            name="email"
                            placeholder="john@example.com"
                            label="Email Address"
                        />
                        <CustomInput
                            type="input"
                            control={form.control}
                            name="password"
                            placeholder="Create a secure password"
                            label="Password"
                            inputType="password"
                        />
                    </div>

                    <CustomInput
                        type="input"
                        control={form.control}
                        name="address"
                        placeholder="Clinic or Home Address"
                        label="Address"
                    />

                    <div className="mt-6">
                        <Label className="text-base">Working Days & Hours</Label>
                        <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                            <SwitchInput
                                data={WORKING_DAYS}
                                setWorkSchedule={setWorkSchedule}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <Button type="submit" disabled={isLoading} className="w-full text-lg h-12 bg-blue-700 hover:bg-blue-800">
                            {isLoading ? "Submitting..." : "Submit Registration"}
                        </Button>
                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/sign-in" className="text-blue-700 font-semibold hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    );
};
