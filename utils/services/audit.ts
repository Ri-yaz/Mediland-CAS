import db from "@/lib/db";
import { DATA_LIMIT } from "../specializations";

export const getAllAuditLogs = async ({
    page = "1",
    search = "",
}: {
    page?: string;
    search?: string;
}) => {
    try {
        const p = parseInt(page);
        const skip = (p - 1) * DATA_LIMIT;

        const [data, totalRecords] = await Promise.all([
            db.auditLog.findMany({
                where: {
                    OR: [
                        { user_id: { contains: search, mode: "insensitive" } },
                        { action: { contains: search, mode: "insensitive" } },
                        { model: { contains: search, mode: "insensitive" } },
                    ],
                },
                skip,
                take: DATA_LIMIT,
                orderBy: { created_at: "desc" },
            }),
            db.auditLog.count({
                where: {
                    OR: [
                        { user_id: { contains: search, mode: "insensitive" } },
                        { action: { contains: search, mode: "insensitive" } },
                        { model: { contains: search, mode: "insensitive" } },
                    ],
                },
            }),
        ]);

        const totalPages = Math.ceil(totalRecords / DATA_LIMIT);

        return {
            data,
            totalPages,
            totalRecords,
            currentPage: p,
        };
    } catch (error) {
        console.log(error);
        return {
            data: [],
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
        };
    }
};
