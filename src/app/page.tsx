import CardSimple from "@/components/CardSimple"
import CardTable from "@/components/CardTable"
import CoinsTable from "@/components/(coins-table)/CoinsTable"
import {
  fetchAll,
  homogenizeTrendingCoinData,
  largestGainers,
} from "@/lib/utils"
import { Coin } from "@/lib/coins"
import { notFound } from "next/navigation"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import prisma from "@/lib/db"

export default async function Home() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  const urls = [
    "https://api.coingecko.com/api/v3/global",
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&price_change_percentage=1h,7d&per_page=250",
    "https://api.coingecko.com/api/v3/search/trending",
  ]

  const allData = await fetchAll(urls)
  if (allData === undefined) return notFound()

  const [dataGlobal, jsonCoinsList, jsonTrending] = allData

  const dataCoinsList = jsonCoinsList.map((coin: Coin) => {
    coin.searchColumn = coin.name + " " + coin.symbol
    return coin
  })

  const dataTrending = homogenizeTrendingCoinData(jsonTrending.coins)
  const dataLargestGainers = largestGainers(dataCoinsList, 3)

  return (
    <main className="text-center">
      <div className="pt-5">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {!!dataGlobal && (
            <div className="flex flex-col items-start justify-between">
              <CardSimple
                title="Market Cap"
                amount={dataGlobal.data.total_market_cap.usd as number}
                percentage={
                  dataGlobal.data.market_cap_change_percentage_24h_usd as number
                }
              />
              <CardSimple
                title="24h Trading Volume"
                amount={dataGlobal.data.total_volume.usd as number}
              />
            </div>
          )}

          {dataTrending.length > 0 && (
            <div>
              <CardTable title="Trending" coinData={dataTrending.slice(0, 3)} />
            </div>
          )}

          {dataLargestGainers.length > 0 && (
            <div>
              <CardTable
                title="Largest Gainers"
                coinData={dataLargestGainers.slice(0, 3)}
              />
            </div>
          )}
        </div>

        {dataCoinsList.length > 0 && (
          <div className="mt-3 w-full">
            <CoinsTable userId={user?.id} data={dataCoinsList.slice(0, 300)} />
          </div>
        )}
      </div>
    </main>
  )
}
