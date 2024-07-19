import Percentage from "@/components/Percentage"
import { formatCurrencyForApp } from "@/lib/utils"
import millify from "millify"
import Image from "next/image"
import FavoriteStar from "./FavoriteStar"

type SideBarHeaderProps = {
  userId: string | undefined
  id: string
  coinLogo: string
  name: string
  symbol: string
  currentPrice: number
  priceChangePercentage24h: number
  marketCapRank: number
}

export default function SideBarHeader({
  userId,
  id,
  coinLogo,
  name,
  symbol,
  currentPrice,
  priceChangePercentage24h,
  marketCapRank,
}: SideBarHeaderProps) {
  return (
    <div className="">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-x-3">
          <Image
            src={coinLogo}
            width={35}
            height={35}
            alt={name}
            style={{ width: "35px", height: "35px" }}
          />
          <p className="text-lg">{name}</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="flex text-nowrap text-sm text-muted-foreground">
              {`${symbol.toUpperCase()}`}
            </p>
            <div className="rounded bg-muted px-1.5 text-muted-foreground">{`#${marketCapRank}`}</div>
          </div>
        </div>
        {!!userId && <FavoriteStar coinId={id} userId={userId} />}
      </div>

      <div className="flex items-center gap-x-3 pb-3">
        <div className="text-4xl font-bold">
          {formatCurrencyForApp(currentPrice, true)}
        </div>
        <div className="text-xl">
          <Percentage pct={priceChangePercentage24h} />
        </div>
      </div>
    </div>
  )
}
