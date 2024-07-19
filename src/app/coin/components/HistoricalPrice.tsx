import Percentage from "@/components/Percentage"
import { formatCurrencyForApp } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"

type HistoricalTableProps = {
  symbol: string
  currentPrice: number
  historicalTableValues: {
    range24h: number[]
    range7d: number[]
    ath: number
    athDate: string
    atl: number
    atlDate: string
  }
}

// type RangeProps = { "24h" | "7d" }

export default function HistoricalTable({
  symbol,
  currentPrice,
  historicalTableValues,
}: HistoricalTableProps) {
  const Range = ({ type }: { type: "24h" | "7d" }) => {
    const values = `${formatCurrencyForApp(
      historicalTableValues[`range${type}`][0],
      true,
    )} - 
        ${formatCurrencyForApp(historicalTableValues[`range${type}`][1], true)}`
    return (
      <div className="flex justify-between border-b py-3 text-sm">
        <div className="text-muted-foreground">{`${type} Range`}</div>
        <div>{values}</div>
      </div>
    )
  }

  const AllTime = ({ type }: { type: "h" | "l" }) => {
    const allTimePrice = historicalTableValues[`at${type}`]
    const pctChg = ((currentPrice - allTimePrice) / allTimePrice) * 100
    const date = format(historicalTableValues[`at${type}Date`], "MMM d, yyyy")
    return (
      <div className="flex items-center justify-between border-b pb-4 pt-3 text-sm">
        <div className="text-muted-foreground">{`All-Time ${
          type == "h" ? "High" : "Low"
        }`}</div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-x-1.5">
            {formatCurrencyForApp(allTimePrice, true)}{" "}
            <Percentage pct={pctChg} />
          </div>
          <div className="text-xs text-muted-foreground">
            {`${date} (${formatDistanceToNow(date)})`}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mt-6 text-xl">{`${symbol.toUpperCase()} Historical Price`}</div>
      <div className="mt-2">
        <Range type={"24h"} />
        <Range type={"7d"} />
        <AllTime type={"h"} />
        <AllTime type={"l"} />
      </div>
    </div>
  )
}
