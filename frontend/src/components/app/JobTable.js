import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { getCoreRowModel, useReactTable, flexRender, } from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead, } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
const getStatusStyles = (status) => {
    const styles = {
        Applied: "bg-blue-400/10 text-blue-400 ring-blue-400/30",
        Interview: "bg-yellow-400/10 text-yellow-400 ring-yellow-400/30",
        Offer: "bg-green-400/10 text-green-400 ring-green-400/30",
        Rejected: "bg-red-400/10 text-red-400 ring-red-400/30",
        "Follow Up": "bg-purple-400/10 text-purple-400 ring-purple-400/30",
        default: "bg-gray-400/10 text-gray-400 ring-gray-400/30",
    };
    return styles[status] || styles.default;
};
export function JobTable({ jobs, onEdit, onDelete, isDemo = false, }) {
    const columns = [
        {
            id: "select",
            header: ({ table }) => (_jsx(Checkbox, { checked: table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate"), onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value), "aria-label": "Select all", className: "translate-y-[2px]" })),
            cell: ({ row }) => (_jsx(Checkbox, { checked: row.getIsSelected(), onCheckedChange: (value) => row.toggleSelected(!!value), "aria-label": "Select row", className: "translate-y-[2px]" })),
        },
        {
            accessorKey: "company",
            header: "Company",
            cell: (info) => (_jsx("div", { className: "font-medium", children: info.getValue() })),
        },
        { accessorKey: "title", header: "Title" },
        {
            accessorKey: "status",
            header: "Status",
            cell: (info) => {
                const status = info.getValue();
                return (_jsx("div", { className: "flex w-[110px] items-center", children: _jsx("span", { className: `inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusStyles(status)}`, children: status }) }));
            },
        },
        { accessorKey: "applied_date", header: "Applied" },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (_jsx("div", { className: "flex justify-end", children: _jsxs(Button, { variant: "ghost", size: "icon", onClick: () => onEdit(row.original), className: "h-8 w-8 p-0", children: [_jsx("span", { className: "sr-only", children: "Open menu" }), _jsx(MoreHorizontal, { className: "h-4 w-4" })] }) })),
        },
    ];
    const table = useReactTable({
        data: jobs,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return (_jsxs("div", { className: "container py-8 md:flex flex-col space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between space-y-2", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Job Applications" }), _jsx("p", { className: "text-muted-foreground", children: "Track all your job applications in one place" })] }), !isDemo && (_jsx("div", { className: "flex items-center space-x-2" }))] }), _jsx("div", { className: "rounded-md border", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: table.getHeaderGroups().map((headerGroup) => (_jsx(TableRow, { className: "hover:bg-transparent", children: headerGroup.headers.map((header) => (_jsx(TableHead, { children: flexRender(header.column.columnDef.header, header.getContext()) }, header.id))) }, headerGroup.id))) }), _jsx(TableBody, { children: table.getRowModel().rows.length ? (table.getRowModel().rows.map((row) => (_jsx(TableRow, { "data-state": row.getIsSelected() && "selected", className: "border-b transition-colors hover:bg-muted/50", children: row.getVisibleCells().map((cell) => (_jsx(TableCell, { children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))) }, row.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: columns.length, className: "h-24 text-center", children: "No jobs found" }) })) })] }) })] }));
}
