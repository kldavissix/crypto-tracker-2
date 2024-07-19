import {
  fetchAll,
  formatChartDate,
  formatCurrencyForApp,
  getFirstItem,
} from "@/lib/utils"
import { FaInfinity } from "react-icons/fa"

import ChartHeader from "../components/ChartSelect"
import { chartDuration } from "@/lib/utils"
import ChartFooter from "../components/PercentTable"
import MainChart from "@/app/coin/components/(coin-charts)/mainChart"

import { extent as d3Extent } from "d3-array"
import SideBarHeader from "../components/SideBarHeader"
import FinancialsTable from "../components/FinancialsTable"
import HistoricalTable from "../components/HistoricalPrice"
import { notFound } from "next/navigation"
import RangeBarChart from "../components/(coin-charts)/rangeBarChart"
import LinksTable from "../components/LinksTable"
import Description from "../components/Description"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import prisma from "@/lib/db"

export default async function CoinPage({
  params,
  searchParams,
}: {
  params: {
    id: string
  }
  searchParams: {
    days: string
    type: string
  }
}) {
  // await new Promise((resolve) => setTimeout(resolve, 60000))

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  const id = params.id.toLowerCase() || "bitcoin"
  const days = chartDuration.map((c) => c.days).includes(searchParams?.days)
    ? searchParams?.days
    : "1"
  const type = searchParams?.type == "mc" ? "mc" : "pr"

  const fetchURLs = [
    `https://api.coingecko.com/api/v3/coins/${id}?tickers=false&community_data=false&developer_data=false&localization=false`,
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`,
  ]

  const allData = await fetchAll(fetchURLs)
  if (allData === undefined) return notFound()

  const [coinData, chartData, chartData7Days] = allData

  if (!coinData?.symbol) {
    return notFound()
  }

  const lowHigh7Days = d3Extent(
    chartData7Days.prices,
    (price: number[]) => price[1],
  ) as number[]

  const {
    symbol,
    name,
    market_cap_rank,
    image: { small: coinLogo },
    links: {
      homepage,
      whitepaper,
      twitter_screen_name,
      facebook_username,
      official_forum_url,
      subreddit_url,
      repos_url: { github },
    },
    description,
    market_data: {
      current_price: { usd: currentPrice },
      market_cap: { usd: marketCap },
      fully_diluted_valuation: { usd: fullyDilutedValuation },
      total_volume: { usd: volume24h },
      high_24h: { usd: high24h },
      low_24h: { usd: low24h },
      last_updated,
      price_change_percentage_1h_in_currency: { usd: priceChangePercentage1h },
      price_change_percentage_24h_in_currency: {
        usd: priceChangePercentage24h,
      },
      price_change_percentage_7d_in_currency: { usd: priceChangePercentage7d },
      price_change_percentage_14d_in_currency: {
        usd: priceChangePercentage14d,
      },
      price_change_percentage_30d_in_currency: {
        usd: priceChangePercentage30d,
      },
      price_change_percentage_1y_in_currency: { usd: priceChangePercentage1y },
      atl: { usd: atl },
      ath: { usd: ath },
      atl_date: { usd: atlDate },
      ath_date: { usd: athDate },
      total_supply,
      max_supply,
      circulating_supply,
    },
  } = coinData

  const pctPriceChanges = [
    priceChangePercentage1h,
    priceChangePercentage24h,
    priceChangePercentage7d,
    priceChangePercentage14d,
    priceChangePercentage30d,
    priceChangePercentage1y,
  ]

  const descTableValues = {
    marketCap: formatCurrencyForApp(marketCap, false),
    fullyDiluted: formatCurrencyForApp(fullyDilutedValuation, false),
    tradingVol: formatCurrencyForApp(volume24h, false),
    circulatingSupply: Math.floor(circulating_supply).toLocaleString("en-US"),
    totalSupply: Math.floor(total_supply).toLocaleString("en-US"),
    maxSupply: max_supply ? (
      Math.floor(max_supply).toLocaleString("en-US")
    ) : (
      <FaInfinity />
    ),
  }

  const histTableValues = {
    symbol,
    range24h: [low24h, high24h],
    range7d: lowHigh7Days,
    atl,
    atlDate,
    ath,
    athDate,
  }

  const linkTableValues = {
    symbol,
    homepage: getFirstItem(homepage),
    whitepaper,
    twitter_screen_name,
    facebook_username,
    official_forum_url: getFirstItem(official_forum_url),
    subreddit_url,
    github: getFirstItem(github),
  }

  let isFavorite = false

  if (user && user.id) {
    const userId = user.id

    const favorite = await prisma.cT_Favorite.findUnique({
      where: {
        userId_coinId: {
          userId: userId,
          coinId: id,
        },
      },
    })

    isFavorite = await !!favorite
  }

  return (
    <div className="mt-4 flex flex-col lg:flex-row lg:items-start">
      <div className="mx-auto mb-4 mt-3 min-w-[375px] lg:mx-0 lg:border-r lg:pr-8">
        <SideBarHeader
          userId={user?.id}
          id={id}
          name={name}
          symbol={symbol}
          coinLogo={coinLogo}
          marketCapRank={market_cap_rank}
          currentPrice={currentPrice}
          priceChangePercentage24h={priceChangePercentage24h}
        />

        <div className="mb-5 mt-3">
          <RangeBarChart
            range={[low24h, high24h]}
            currentPrice={currentPrice}
          />
        </div>

        <div className="flex-col">
          <FinancialsTable
            symbol={symbol}
            financialsTableValues={descTableValues}
          />
        </div>

        <LinksTable linkTableValues={linkTableValues} />

        <div className="flex-col">
          <HistoricalTable
            symbol={symbol}
            currentPrice={currentPrice}
            historicalTableValues={histTableValues}
          />
        </div>

        <div className="flex justify-center pt-4">
          <p className="text-sm text-muted-foreground">{`Last Updated: ${formatChartDate(
            last_updated,
          )}`}</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-4 pl-6">
        <div className="py-3">
          <ChartHeader id={id} type={type} days={days} />
        </div>

        {chartData.prices.length > 0 && (
          <div className="mb-7 md:h-[355px]">
            <MainChart chartData={chartData} type={type} days={days} />
          </div>
        )}

        <div>
          <ChartFooter
            id={id}
            currentDays={days}
            priceChangePcts={pctPriceChanges}
          />
        </div>

        <Description description={description?.en} />
      </div>
    </div>
  )
}
