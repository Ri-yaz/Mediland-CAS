import { ActionDialog } from "@/components/action-dialog";
import { ViewAction } from "@/components/action-options";
import { Pagination } from "@/components/pagination";
import { ProfileImage } from "@/components/profile-image";
import SearchInput from "@/components/search-input";
import { Table } from "@/components/tables/table";
import { Button } from "@/components/ui/button";
import { SearchParamsProps } from "@/types";
import { checkRole, getRole } from "@/utils/roles";
import { DATA_LIMIT } from "@/utils/specializations";
import { getAllPatients } from "@/utils/services/patient";
import { Patient } from "@prisma/client";
import { format } from "date-fns";
import { Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import { redirect } from "next/navigation";

const columns = [
    { header: "Info", key: "name" },
    { header: "Contact", key: "contact", className: "hidden md:table-cell" },
    { header: "Email", key: "email", className: "hidden md:table-cell" },
    { header: "Last Visit", key: "lastVisit", className: "hidden xl:table-cell" },
    { header: "Actions", key: "action" },
];

const PatientManagement = async (props: SearchParamsProps) => {
    const searchParams = await props.searchParams;
    const page = (searchParams?.p || "1") as string;
    const searchQuery = (searchParams?.q || "") as string;

    const role = await getRole();
    const isAuthorized = role === "nurse" || role === "admin" || role === "doctor";

    if (!isAuthorized) {
        redirect("/");
    }

    const { data, totalPages, totalRecords, currentPage } = await getAllPatients({
        page,
        search: searchQuery,
    });

    if (!data) return null;

    const renderRow = (item: any) => (
        <tr
            key={item?.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
        >
            <td className="flex items-center gap-4 p-4">
                <ProfileImage
                    url={item?.img!}
                    name={item?.first_name + " " + item?.last_name}
                    bgColor={item?.colorCode!}
                    textClassName="text-black"
                />
                <div>
                    <h3 className="uppercase">
                        {item?.first_name + " " + item?.last_name}
                    </h3>
                    <span className="text-sm capitalize">{item?.gender.toLowerCase()}</span>
                </div>
            </td>
            <td className="hidden md:table-cell">{item?.phone}</td>
            <td className="hidden md:table-cell">{item?.email}</td>
            <td className="hidden xl:table-cell">
                {item?.appointments && item.appointments.length > 0
                    ? format(item.appointments[0].appointment_date, "yyyy-MM-dd")
                    : "N/A"}
            </td>
            <td>
                <div className="flex items-center gap-2">
                    <ViewAction href={`/record/patients/${item?.id}`} />
                </div>
            </td>
        </tr>
    );

    return (
        <div className="bg-white rounded-xl py-6 px-3 2xl:px-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Patient Management</h1>
                        <p className="text-sm text-gray-500">Manage registered patients</p>
                    </div>
                </div>

                <SearchInput />
            </div>

            <div className="mt-4">
                <Table columns={columns} data={data} renderRow={renderRow} />

                {totalPages && (
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        totalRecords={totalRecords}
                        limit={DATA_LIMIT}
                    />
                )}
            </div>
        </div>
    );
};

export default PatientManagement;
