import { checkRole } from "@/utils/roles";
import React from "react";
import { redirect } from "next/navigation";
import { getMedicalRecords } from "@/utils/services/medical-record";
import { Table } from "@/components/tables/table";
import { Pagination } from "@/components/pagination";
import { DATA_LIMIT } from "@/utils/specializations";
import SearchInput from "@/components/search-input";
import { Pill } from "lucide-react";
import { format } from "date-fns";
import { ProfileImage } from "@/components/profile-image";

const columns = [
    { header: "Patient Info", key: "name" },
    { header: "Doctor", key: "doctor", className: "hidden md:table-cell" },
    { header: "Date", key: "date", className: "hidden md:table-cell" },
    { header: "Medications", key: "medications" },
];

const AdministerMedicationsPage = async (props: { searchParams?: Promise<{ [key: string]: string | undefined }> }) => {
    const searchParams = await props.searchParams;
    const page = (searchParams?.p || "1") as string;
    const searchQuery = (searchParams?.q || "") as string;

    const role = await checkRole("NURSE") || await checkRole("DOCTOR") || await checkRole("ADMIN");

    if (!role) {
        return redirect("/");
    }

    const { data, totalPages, totalRecords, currentPage } = await getMedicalRecords({
        page,
        search: searchQuery,
    });

    // Filter mainly for records with prescriptions
    const recordsWithMeds = data?.filter(
        (record: any) => record.prescriptions || record.diagnosis?.some((d: any) => d.prescribed_medications)
    ) || [];

    const renderRow = (item: any) => {
        const patientName = item?.patient?.first_name + " " + item?.patient?.last_name;
        const medications = item?.prescriptions || item?.diagnosis?.map((d: any) => d.prescribed_medications).join(", ") || "No medications listed";

        return (
            <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50">
                <td className="flex items-center gap-4 p-4">
                    <ProfileImage
                        url={item?.patient?.img!}
                        name={patientName}
                        bgColor={item?.patient?.colorCode!}
                    />
                    <div>
                        <h3 className="font-semibold">{patientName}</h3>
                        <span className="text-xs text-gray-500">{item?.patient?.gender}</span>
                    </div>
                </td>
                <td className="hidden md:table-cell">{item?.doctor_id}</td>
                <td className="hidden md:table-cell">{format(item?.created_at, "yyyy-MM-dd")}</td>
                <td className="max-w-xs truncate" title={medications}>{medications}</td>
            </tr>
        );
    };

    return (
        <div className="bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <Pill size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">Administer Medications</h1>
                        <p className="text-sm text-gray-500">View and manage patient prescriptions</p>
                    </div>
                </div>
                <SearchInput />
            </div>

            <Table columns={columns} data={recordsWithMeds} renderRow={renderRow} />

            <Pagination
                totalPages={totalPages!}
                currentPage={currentPage!}
                totalRecords={totalRecords!}
                limit={DATA_LIMIT}
            />
        </div>
    );
};

export default AdministerMedicationsPage;
