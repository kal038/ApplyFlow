import { useJobStore } from "@/store/useJobStore";
import {
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import type { Job } from "@/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface JobTableProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (job_id: string) => void;
  isDemo?: boolean;
}

const getStatusStyles = (status: string) => {
  const styles = {
    Applied: "bg-blue-400/10 text-blue-400 ring-blue-400/30",
    Interview: "bg-yellow-400/10 text-yellow-400 ring-yellow-400/30",
    Offer: "bg-green-400/10 text-green-400 ring-green-400/30",
    Rejected: "bg-red-400/10 text-red-400 ring-red-400/30",
    "Follow Up": "bg-purple-400/10 text-purple-400 ring-purple-400/30",
    default: "bg-gray-400/10 text-gray-400 ring-gray-400/30",
  };

  return styles[status as keyof typeof styles] || styles.default;
};

export function JobTable({
  jobs,
  onEdit,
  onDelete,
  isDemo = false,
}: JobTableProps) {
  const columns: ColumnDef<Job>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: (info) => (
        <div className="font-medium">{info.getValue() as string}</div>
      ),
    },
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        return (
          <div className="flex w-[110px] items-center">
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusStyles(
                status
              )}`}
            >
              {status}
            </span>
          </div>
        );
      },
    },
    { accessorKey: "applied_date", header: "Applied" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container py-8 md:flex flex-col space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Job Applications
          </h2>
          <p className="text-muted-foreground">
            {"Track all your job applications in one place"}
          </p>
        </div>
        {!isDemo && (
          <div className="flex items-center space-x-2">
            {/* User profile or actions could go here */}
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
