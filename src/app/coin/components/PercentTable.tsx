import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import Percentage from "@/components/Percentage"
import Link from "next/link"
import { chartDuration } from "@/lib/utils"
import React from "react"

export default function ChartFooter({
  id,
  currentDays,
  priceChangePcts,
}: {
  id: string
  currentDays: string
  priceChangePcts: number[]
}) {
  const pctTableLink = (days: string, children: React.ReactNode) => {
    return (
      <Link
        href={`/coin/${id}?type=pr&days=${days}`}
        className="flex justify-center hover:text-foreground"
      >
        {children}
      </Link>
    )
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="bg-[#182334]">
            {chartDuration
              .filter((c) => c.pctChgLabel !== null)
              .map((c) => {
                return (
                  <th
                    key={c.pctChgLabel}
                    className={`border py-1 text-center text-muted-foreground`}
                  >
                    {c.days === null ? (
                      <p>{c.pctChgLabel}</p>
                    ) : (
                      pctTableLink(c.days, <p>{c.pctChgLabel}</p>)
                    )}
                  </th>
                )
              })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {chartDuration
              .filter((c) => c.pctChgLabel !== null)
              .map((c, i) => {
                const pctJSX = <Percentage pct={priceChangePcts[i]} />

                return (
                  <td key={i} className="border py-1">
                    {c.days === null ? (
                      <div className="flex justify-center">{pctJSX}</div>
                    ) : (
                      pctTableLink(c.days, pctJSX)
                    )}
                  </td>
                )
              })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
