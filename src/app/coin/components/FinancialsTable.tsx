import { descTableText, formatCurrencyForApp } from "@/lib/utils"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { FaCircleInfo } from "react-icons/fa6"

type FinancialsTableProps = {
  symbol: string
  financialsTableValues: {
    marketCap: string
    fullyDiluted: string
    tradingVol: string
    circulatingSupply: string
    totalSupply: string
    maxSupply: string | React.JSX.Element
  }
}

type UpperKeys =
  | "marketCap"
  | "fullyDiluted"
  | "tradingVol"
  | "circulatingSupply"
  | "totalSupply"
  | "maxSupply"

export default function FinancialsTable({
  symbol,
  financialsTableValues,
}: FinancialsTableProps) {
  return (
    <div>
      {descTableText.map((row, index) => {
        const { key, title, info } = row
        return (
          <div
            key={index}
            className="flex items-center justify-between border-b py-3 text-sm"
          >
            <div className="flex items-center gap-x-2 py-0 text-muted-foreground">
              <div>{title}</div>
              <HoverCard>
                <HoverCardTrigger>
                  <FaCircleInfo />
                </HoverCardTrigger>
                <HoverCardContent className="text-muted-foreground">
                  {info}
                </HoverCardContent>
              </HoverCard>
            </div>

            <div className="text-right">
              {financialsTableValues[key as UpperKeys]}
            </div>
          </div>
        )
      })}
    </div>
  )
}
