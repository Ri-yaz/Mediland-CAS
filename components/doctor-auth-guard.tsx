import { checkDoctorStatus } from "@/utils/check-doctor-status";
import { redirect } from "next/navigation";

export async function DoctorAuthGuard({
    children,
    allowedPaths = ["/doctor"],
}: {
    children: React.ReactNode;
    allowedPaths?: string[];
}) {
    const { isDoctor, status } = await checkDoctorStatus();

    // If doctor is not authorized (PENDING status), redirect to /doctor
    if (isDoctor && status === "PENDING") {
        // This component will be used in pages that need protection
        // The redirect will happen if they try to access unauthorized pages
        redirect("/doctor");
    }

    return <>{children}</>;
}
