"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateDoctorStatus } from "@/app/actions/doctor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DoctorStatusSelectorProps {
    id: string;
    currentStatus: string;
}

export const DoctorStatusSelector = ({
    id,
    currentStatus,
}: DoctorStatusSelectorProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (value: string) => {
        try {
            setIsLoading(true);
            const res = await updateDoctorStatus(id, value);
            if (res.success) {
                toast.success(res.message);
                router.refresh();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const statusColor =
        currentStatus === "PENDING"
            ? "text-yellow-700 bg-yellow-100"
            : currentStatus === "ACTIVE"
                ? "text-green-700 bg-green-100"
                : currentStatus === "ON_LEAVE"
                    ? "text-red-700 bg-red-100"
                    : "text-gray-700 bg-gray-100";

    // If pending, just show the badge (approval actions handle it)
    if (currentStatus === "PENDING") {
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
            >
                {currentStatus}
            </span>
        );
    }

    return (
        <Select
            disabled={isLoading}
            defaultValue={currentStatus}
            onValueChange={handleStatusChange}
        >
            <SelectTrigger
                className={`w-[110px] h-8 rounded-full border-none focus:ring-0 focus:ring-offset-0 px-2 py-1 text-xs font-medium ${statusColor}`}
            >
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="ON_LEAVE">ON LEAVE</SelectItem>
            </SelectContent>
        </Select>
    );
};
