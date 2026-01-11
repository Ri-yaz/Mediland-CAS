"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { createRating } from "@/app/actions/patient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Doctor {
    id: string;
    name: string;
}

export const UserRatingForm = ({
    patientId,
    doctors,
}: {
    patientId: string;
    doctors: Doctor[];
}) => {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [doctorId, setDoctorId] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!doctorId) {
            toast.error("Please select a doctor");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setLoading(true);
        try {
            const res = await createRating({
                doctor_id: doctorId,
                patient_id: patientId,
                rating,
                comment,
            });

            if (res.success) {
                toast.success(res.message);
                setOpen(false);
                setRating(0);
                setComment("");
                setDoctorId("");
                router.refresh();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-4">
                    Leave a Review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Submitting a Review</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Select Doctor</Label>
                        <Select onValueChange={setDoctorId} value={doctorId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map((doc) => (
                                    <SelectItem key={doc.id} value={doc.id}>
                                        {doc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={32}
                                    className={`cursor-pointer transition-colors ${(hoverRating || rating) >= star
                                            ? "text-yellow-500 fill-yellow-500"
                                            : "text-gray-300"
                                        }`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Comment (Optional)</Label>
                        <Textarea
                            placeholder="What do you think about the service?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="resize-none"
                            rows={4}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Submitting..." : "Submit Review"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
