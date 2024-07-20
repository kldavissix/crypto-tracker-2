"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { LuX } from "react-icons/lu"
import { numMin, toggleFavoritesArray } from "@/lib/utils"
import { ToggleFavorite } from "@/actions/toggleFavorite"
import { Coin } from "@/lib/coins"
import { createColumns } from "./columns"
import { useFavorites } from "@/context/FavoritesContext"

interface CoinsTableProps {
  data: Coin[]
  userId: string | undefined
}

export default function CoinsTable({ data, userId }: CoinsTableProps) {
  const [tableData, setTableData] = useState(data)
  const [coinFilter, setCoinFilter] = useState("")
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const { favorites, setFavorites } = useFavorites()
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "market_cap_rank",
      desc: false,
    },
  ])

  const handleToggleFavorite = async (rowIndex: number) => {
    const coinId = tableData[rowIndex].id

    const response = await ToggleFavorite(coinId, userId || null)
    setFavorites((prev) =>
      toggleFavoritesArray(prev, coinId, response === "created"),
    )
  }

  const columns = createColumns(favorites, handleToggleFavorite)

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  })

  const [columnVisibility, setColumnVisibility] = useState({
    id: false,
    searchColumn: false,
    favorite: !!userId,
  })

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      columnFilters: [
        ...(favoritesOnly ? [{ id: "id", value: null }] : []),
        ...(coinFilter ? [{ id: "searchColumn", value: coinFilter }] : []),
      ],
      sorting,
      pagination,
      columnVisibility,
    },
  })

  const { pageIndex, pageSize } = table.getState().pagination
  const filteredRowLength = table.getFilteredRowModel().rows.length
  const pageStartNum = pageIndex * pageSize + 1
  const pageEndNum = numMin(pageStartNum + pageSize - 1, filteredRowLength)
  const resultsCountText = `Showing ${pageStartNum} to ${pageEndNum} 
        of ${filteredRowLength} ${
          filteredRowLength === 1 ? "result" : "results"
        } `

  return (
    <>
      <div className="my-3 flex justify-end gap-x-4">
        {userId !== undefined && (
          <div className="flex items-center space-x-2">
            <label className="ml-2">
              <input
                type="checkbox"
                checked={favoritesOnly}
                onChange={() => setFavoritesOnly((prev) => !prev)}
              />
              {"  "}
              <span className="text-sm">Favorites Only</span>
            </label>
          </div>
        )}

        <div className="relative flex">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded border py-2 pl-2 pr-14"
            value={coinFilter}
            onChange={(event) => {
              setCoinFilter(event.target.value)
              setPagination({ ...pagination, pageIndex: 0 })
            }}
          />
          <span className="absolute inset-y-0 right-1 flex items-center pl-3">
            <Button variant="ghost" size="sm" onClick={() => setCoinFilter("")}>
              <LuX />
            </Button>
          </span>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-background" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      // style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">{resultsCountText}</div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  )
}
