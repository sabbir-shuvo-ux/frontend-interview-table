"use client";

import { SortingState } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { UserType } from "./types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ApiResponse } from "../page";

export const TableContainer = ({ data: initialData, meta }: ApiResponse) => {
  const [data, setData] = useState<UserType[]>(initialData);
  const [pageCount, setPageCount] = useState(
    meta ? Math.ceil(meta.total / meta.limit) : 1
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: meta?.limit || 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const previousPageSize = useRef(pagination.pageSize);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/users?page=${pagination.pageIndex + 1}&limit=${
          pagination.pageSize
        }`,
        { cache: "force-cache" }
      );
      const json: ApiResponse = await res.json();

      if (!json.data || !json.meta) {
        throw new Error("Invalid API response: Missing 'data' or 'meta'");
      }

      setData(json.data);
      setPageCount(Math.ceil(json.meta.total / pagination.pageSize));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setHasFetchedOnce(true);
      previousPageSize.current = pagination.pageSize;
    }
  };

  useEffect(() => {
    const pageSizeChanged = previousPageSize.current !== pagination.pageSize;
    const shouldFetch =
      pagination.pageIndex !== 0 || hasFetchedOnce || pageSizeChanged;

    if (shouldFetch) {
      fetchData();
    }
  }, [pagination]);

  return (
    <div className="container mx-auto py-10 max-w-[1440px]">
      <DataTable
        isLoading={isLoading}
        data={data}
        columns={columns}
        pageCount={pageCount}
        onPaginationChange={(pageIndex, pageSize) =>
          setPagination({ pageIndex, pageSize })
        }
        onSortingChange={setSorting}
        sorting={sorting}
        pagination={pagination}
      />
    </div>
  );
};
