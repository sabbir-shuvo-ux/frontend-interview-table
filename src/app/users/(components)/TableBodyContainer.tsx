import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  Table as ReactTableInstance,
} from "@tanstack/react-table";
import React from "react";

type Props<TData extends { id: string }, TValue> = {
  isLoading?: boolean;
  table: ReactTableInstance<TData>;
  columns: ColumnDef<TData, TValue>[];
};

type ExpandedRowDetails = {
  phone?: string;
  address1?: string;
  address2?: string;
};

export function TableBodyContainer<TData extends { id: string }, TValue>({
  isLoading,
  table,
  columns,
}: Props<TData, TValue>) {
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);
  const [expandedRowData, setExpandedRowData] = React.useState<
    Record<string, ExpandedRowDetails>
  >({});

  const [loadingRowId, setLoadingRowId] = React.useState<string | null>(null);

  const handleRowClick = async (userId: string) => {
    if (expandedRowId === userId) {
      setExpandedRowId(null);
      return;
    }

    if (!expandedRowData[userId]) {
      setLoadingRowId(userId);
      try {
        const res = await fetch(`/api/users/${userId}`);
        const json = await res.json();
        setExpandedRowData((prev) => ({ ...prev, [userId]: json }));
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoadingRowId(null);
      }
    }

    setExpandedRowId(userId);
  };

  return (
    <TableBody>
      {isLoading ? (
        Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell colSpan={columns.length} className="h-[58px]">
              <Skeleton className="text-center h-full rounded-none" />
            </TableCell>
          </TableRow>
        ))
      ) : table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => {
          const userId = row.original.id;
          const isExpanded = expandedRowId === userId;
          const details = expandedRowData[userId];
          const isLoadingRow = loadingRowId === userId;

          return (
            <React.Fragment key={row.id}>
              <TableRow
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer border-none"
                onClick={() => handleRowClick(userId)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="py-4 text-base " key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>

              {isExpanded && (
                <TableRow className="">
                  <TableCell colSpan={columns.length}>
                    {isLoadingRow ? (
                      <div className="text-sm text-center">
                        Loading details...
                      </div>
                    ) : (
                      <div className="flex justify-around rounded-md overflow-hidden shadow-[0px_4px_4px_0px_rgba(164,164,164,0.25)] text-sm">
                        <div className="flex flex-col w-full text-center">
                          <p className="py-4 bg-[rgba(236,236,236,1)] text-base text-[rgba(87,95,110,1)]">
                            Address 1
                          </p>
                          <p className="py-4 text-base">
                            {details?.address1 || "N/A"}
                          </p>
                        </div>
                        <div className="flex flex-col w-full text-center">
                          <p className="py-4 bg-[rgba(236,236,236,1)] text-base text-[rgba(87,95,110,1)]">
                            Address 2
                          </p>
                          <p className="py-4 text-base">
                            {details?.address2 || "N/A"}
                          </p>
                        </div>
                        <div className="flex flex-col w-full text-center">
                          <p className="py-4 bg-[rgba(236,236,236,1)] text-base text-[rgba(87,95,110,1)]">
                            Phone
                          </p>
                          <p className="py-4 text-base">
                            {details?.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
