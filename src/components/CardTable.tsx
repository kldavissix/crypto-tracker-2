import { formatCurrencyForApp } from "@/lib/utils"
import { Card } from "./ui/card"
import { FaChevronRight } from "react-icons/fa"
import Percentage from "./Percentage"
import Image from "next/image"
import Link from "next/link"

export default function CardTable({
  title,
  coinData,
}: {
  title: string
  coinData: any[]
}) {
  const emoji = title === "Trending" ? "🔥" : "🚀"

  return (
    <Card className="p-3">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="font-bold">{`${emoji} ${title} `}</h1>
        <div className="flex cursor-pointer items-center justify-between gap-2 rounded p-2 text-sm hover:bg-muted">
          <p className="">View More</p> <FaChevronRight />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        {coinData.map((coin, index) => (
          <Link
            href={`/coin/${coin.id}`}
            key={index}
            className="flex cursor-pointer justify-between rounded px-3 py-1 hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <Image
                src={coin?.small || coin?.image}
                width="28"
                height="28"
                alt={coin.name}
                style={{ width: "28px", height: "28px" }}
              />
              <div className="truncate whitespace-nowrap">{coin.name}</div>
            </div>

            <div className="flex items-center gap-1">
              {formatCurrencyForApp(
                coin?.data?.price || coin?.current_price,
                false,
              )}
              <Percentage
                pct={
                  coin?.data?.price_change_percentage_24h?.usd ||
                  coin?.price_change_percentage_24h
                }
              />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
