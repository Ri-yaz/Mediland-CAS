"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Check, X } from "lucide-react";
import { approveDoctor, rejectDoctor } from "@/app/actions/doctor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const DoctorApprovalActions = ({ id }: { id: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleApprove = async () => {
        try {
            setIsLoading(true);
            const res = await approveDoctor(id);
            if (res.success) {
                toast.success(res.message);
                router.refresh();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!confirm("Are you sure you want to reject and delete this doctor?")) return;
        try {
            setIsLoading(true);
            const res = await rejectDoctor(id);
            if (res.success) {
                toast.success(res.message);
                router.refresh();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={handleApprove}
                disabled={isLoading}
                title="Approve"
            >
                <Check size={18} />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleReject}
                disabled={isLoading}
                title="Reject"
            >
                <X size={18} />
            </Button>
        </div>
    );
};
