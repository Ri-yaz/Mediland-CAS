import { Pagination } from "@/components/pagination";
import SearchInput from "@/components/search-input";
import { Table } from "@/components/tables/table";
import { SearchParamsProps } from "@/types";
import { DATA_LIMIT } from "@/utils/specializations";
import { getAllAuditLogs } from "@/utils/services/audit";
import { format } from "date-fns";
import { Logs } from "lucide-react";
import React from "react";

const columns = [
    {
        header: "Action",
        key: "action",
    },
    {
        header: "Model",
        key: "model",
    },
    {
        header: "User ID",
        key: "user_id",
        className: "hidden md:table-cell",
    },
    {
        header: "Record ID",
        key: "record_id",
        className: "hidden lg:table-cell",
    },
    {
        header: "Details",
        key: "details",
        className: "hidden xl:table-cell",
    },
    {
        header: "Timestamp",
        key: "created_at",
    },
];

const AuditLogsPage = async (props: SearchParamsProps) => {
    const searchParams = await props.searchParams;
    const page = (searchParams?.p || "1") as string;
    const searchQuery = (searchParams?.q || "") as string;

    const { data, totalPages, totalRecords, currentPage } = await getAllAuditLogs({
        page,
        search: searchQuery,
    });

    const renderRow = (item: any) => (
        <tr
            key={item?.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
        >
            <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.action.toLowerCase().includes('delete') ? 'bg-red-100 text-red-600' :
                    item.action.toLowerCase().includes('create') ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                    {item.action}
                </span>
            </td>
            <td>{item.model}</td>
            <td className="hidden md:table-cell text-gray-500">{item.user_id}</td>
            <td className="hidden lg:table-cell text-gray-500">{item.record_id}</td>
            <td className="hidden xl:table-cell">{item.details}</td>
            <td>{format(item?.created_at, "yyyy-MM-dd HH:mm:ss")}</td>
        </tr>
    );

    return (
        <div className="bg-white rounded-xl py-6 px-3 2xl:px-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Logs size={20} className="text-gray-500" />
                    <p className="text-2xl font-semibold">{totalRecords}</p>
                    <span className="text-gray-600 text-sm xl:text-base">
                        total logs
                    </span>
                </div>
                <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
                    <SearchInput />
                </div>
            </div>

            <div className="mt-4">
                <Table columns={columns} data={data} renderRow={renderRow} />

                {totalPages > 0 && (
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

export default AuditLogsPage;
