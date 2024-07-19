"use client"

import { Coin } from "@/lib/coins"
import { formatCurrencyForApp, sortingArrow } from "@/lib/utils"
import { ColumnDef, Column } from "@tanstack/react-table"
import Image from "next/image"
import Percentage from "../Percentage"
import Link from "next/link"
import { FaRegStar, FaStar } from "react-icons/fa"

const sortingColumnHeader = (
  column: Column<Coin>,
  headerText: string,
  reverseHeader: boolean = false,
  justifyEnd: boolean = true,
) => {
  const currentSorting = sortingArrow(column.getIsSorted())
  const nextSorting =
    currentSorting === null && sortingArrow(column.getNextSortingOrder())
  return (
    <div
      className={`group flex cursor-pointer items-center gap-x-1 py-1 hover:text-primary ${reverseHeader ? "flex-row-reverse" : ""} ${justifyEnd ? "justify-end" : "justify-start"} `}
      onClick={() => {
        const isSorted = column.getIsSorted()

        if (isSorted === false) {
          if (column.getIndex() == 0) {
            column.toggleSorting(false)
          } else {
            column.toggleSorting(true)
          }
        } else {
          column.toggleSorting(isSorted === "asc")
        }
      }}
    >
      {currentSorting}
      <div className="invisible group-hover:visible">{nextSorting}</div>
      <p>{headerText}</p>
    </div>
  )
}

const TableCellLinks = ({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) => {
  return <Link href={`/coin/${id}`}>{children}</Link>
}

export const createColumns = (
  favorites: string[],
  handleToggleFavorite: (rowIndex: number) => void,
): ColumnDef<Coin>[] => [
  {
    accessorKey: "id",
    filterFn: (row) => {
      return favorites.includes(row.original.id)
    },
  },
  {
    accessorKey: "market_cap_rank",
    header: ({ column }) => sortingColumnHeader(column, "#"),
    sortDescFirst: false,
  },
  {
    id: "coin",
    accessorKey: "coin",
    header: ({ column }) => sortingColumnHeader(column, "Coin", true, true),
    cell: ({ row }) => {
      return (
        <TableCellLinks id={row.original.id}>
          <div className="flex cursor-pointer items-center gap-x-2">
            <Image
              src={row.original.image}
              width={28}
              height={28}
              alt={row.original.name}
              style={{ width: "28px", height: "28px" }}
            />
            <p className="flex items-center gap-x-1.5">
              {row.original.name}
              <span className="text-xs text-muted-foreground">
                {row.original.symbol.toUpperCase()}
              </span>
            </p>
          </div>
        </TableCellLinks>
      )
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.name.toLowerCase() > rowB.original.name.toLowerCase()
        ? 1
        : -1
    },
  },
  {
    accessorKey: "searchColumn",
    header: "Search Column",
  },

  {
    accessorKey: "current_price",
    header: ({ column }) => sortingColumnHeader(column, "Price"),
    cell: ({ row }) => {
      return (
        <TableCellLinks id={row.original.id}>
          <div className="text-right">
            {row.original.current_price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </TableCellLinks>
      )
    },
  },
  {
    accessorKey: "price_change_percentage_1h_in_currency",
    header: ({ column }) => sortingColumnHeader(column, "1h"),
    cell: ({ row }) => {
      return (
        <TableCellLinks id={row.original.id}>
          <div className="flex justify-end">
            <Percentage
              pct={row.original.price_change_percentage_1h_in_currency}
            />
          </div>
        </TableCellLinks>
      )
    },
  },

  {
    accessorKey: "price_change_percentage_24h",
    header: ({ column }) => sortingColumnHeader(column, "24h"),
    cell: ({ row }) => {
      return (
        <TableCellLinks id={row.original.id}>
          <div className="flex justify-end">
            <Percentage pct={row.original.price_change_percentage_24h} />
          </div>
        </TableCellLinks>
      )
    },
  },
  {
    accessorKey: "price_change_percentage_7d_in_currency",
    header: ({ column }) => sortingColumnHeader(column, "7d"),
    cell: ({ row }) => {
      return (
        <TableCellLinks id={row.original.id}>
          <div className="flex justify-end">
            <Percentage
              pct={row.original.price_change_percentage_7d_in_currency}
            />
          </div>
        </TableCellLinks>
      )
    },
  },
  {
    accessorKey: "total_volume",
    header: ({ column }) => sortingColumnHeader(column, "24h Volume"),
    cell: ({ row }) => {
      return (
        <TableCellLinks id={row.original.id}>
          <div className="text-right">
            {formatCurrencyForApp(row.original.total_volume, false)}
          </div>
        </TableCellLinks>
      )
    },
  },
  {
    id: "market_cap",
    accessorKey: "market_cap",
    header: ({ column }) => sortingColumnHeader(column, "Market Cap"),
    cell: ({ row }) => {
      return (
        <TableCellLinks id={row.original.id}>
          <div className="text-right">
            {formatCurrencyForApp(row.original.market_cap, false)}
          </div>
        </TableCellLinks>
      )
    },
  },
  {
    id: "favorite",
    accessorKey: "favorite",
    header: "",
    size: 80,
    cell: ({ row }) => {
      const isFavorite = favorites.includes(row.original.id)

      return (
        <div
          id={row.original.id}
          className="flex cursor-pointer justify-center text-lg"
          onClick={() => handleToggleFavorite(row.index)}
        >
          {isFavorite ? (
            <FaStar className="text-yellow-500" />
          ) : (
            <FaRegStar className="text-muted" />
          )}
        </div>
      )
    },
  },
]
