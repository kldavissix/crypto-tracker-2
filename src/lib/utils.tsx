import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FaCaretUp, FaCaretDown } from "react-icons/fa"
import { format } from "date-fns/format"
import { notFound } from "next/navigation"
import Error from "next/error"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  showCents = true,
  locale = "en-US",
  currency = "USD"
) {
  const output = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount)

  if (showCents) return output
  return output.split(".")[0]
}

export function formatAsPercentage(
  amount: number,
  x100: boolean = true,
  decimalPlaces = 2,
  showSign = true
) {
  // Check if the input is a number
  if (amount === undefined) {
    return null
  }

  // Convert the number to a percentage and fix to the specified decimal places
  const percentage = `${(amount * (x100 ? 100 : 1)).toFixed(decimalPlaces)}%`

  // Append the percentage sign and return
  if (showSign) return percentage
  return percentage.split("-").join("")
}

export function formatCurrencyForApp(amount: number, showCents = true) {
  if (amount > 2) return formatCurrency(amount, showCents)
  return `$${amount.toPrecision(4)}`
}

export function formatCurrencySmall(amount: number) {
  return `$${amount.toPrecision(4)}`
}

export function formatAsPercentageForApp(percentage: number) {
  return formatAsPercentage(percentage, false, 1, false)
}

export function largestGainers(data: any[], count: number = 1000) {
  const dataCopy = [...data]
  return dataCopy
    .sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    )
    .slice(0, count)
}

export function homogenizeTrendingCoinData(data: any[]) {
  return data.map((coin) => coin.item)
}

export function sortingArrow(desc: boolean | string) {
  if (desc === "asc") return <FaCaretUp />
  if (desc === "desc") return <FaCaretDown />
  return null
}

export function numMax(num1: number, num2: number) {
  return num1 > num2 ? num1 : num2
}

export function numMin(num1: number, num2: number) {
  return num1 < num2 ? num1 : num2
}

export async function getChartData(id: string, days: number) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  )
  return response.json()
}

export function transformChartData(chartData: ChartDataProps) {
  const { prices, market_caps, total_volumes } = chartData

  return prices.map((price: number[], index) => ({
    epoch: price[0],
    date: new Date(price[0]),
    price: price[1],
    marketCap: market_caps[index][1],
    volume: total_volumes[index][1],
  }))
}

export function chartArrayMin(data: any[], key: string) {
  const min = data.reduce(
    (min, current) => Math.min(min, current[key]),
    Infinity
  )
  return Math.floor(min)
}

export function chartArrayMax(data: any[], key: string) {
  const max = data.reduce(
    (max, current) => Math.max(max, current[key]),
    -Infinity
  )
  return Math.floor(max)
}

export function formatChartDate(inputDate: number, type?: "XAxis" | "Tooltip") {
  const date = new Date(inputDate)

  if (type === "XAxis") {
    const output = format(date, "HH:mm")
    return output
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  })
}

// export const chartDuration = new Map([
//   ["24 Hours", 1],
//   ["7 Days", 7],
//   ["30 Days", 30],
//   ["3 Months", 90],
//   ["1 Year", 365],
// ])
export const chartDuration = [
  { btnLabel: null, days: null, pctChgLabel: "1h" },
  { btnLabel: "24 Hours", days: "1", pctChgLabel: "24h" },
  { btnLabel: "7 Days", days: "7", pctChgLabel: "7d" },
  { btnLabel: null, days: null, pctChgLabel: "14d" },
  { btnLabel: "30 Days", days: "30", pctChgLabel: "30d" },
  { btnLabel: "3 Months", days: "90", pctChgLabel: null },
  { btnLabel: "1 Year", days: "365", pctChgLabel: "1y" },
]

export const descTableText = [
  {
    key: "marketCap",
    title: "Market Cap",
    info: (
      <>
        <h1>Market Cap = Current Price x Circulating Supply</h1>
        <br />
        <p>
          Refers to the total market value of a cryptocurrency’s circulating
          supply. It is similar to the stock market’s measurement of multiplying
          price per share by shares readily available in the market (not held &
          locked by insiders, governments)
        </p>
      </>
    ),
  },
  {
    key: "fullyDiluted",
    title: "Fully Diluted Valuation",
    info: (
      <>
        <h1>Fully Diluted Valuation (FDV) = Current Price x Total Supply</h1>
        <br />
        <p>
          Fully Diluted Valuation (FDV) is the theoretical market capitalization
          of a coin if the entirety of its supply is in circulation, based on
          its current market price. The FDV value is theoretical as increasing
          the circulating supply of a coin may impact its market price. Also
          depending on the tokenomics, emission schedule or lock-up period of a
          coin&apos;s supply, it may take a significant time before its entire
          supply is released into circulation.
        </p>
      </>
    ),
  },
  {
    key: "tradingVol",
    title: "24 Hour Trading Vol",
    info: "A measure of a cryptocurrency trading volume across all tracked platforms in the last 24 hours. This is tracked on a rolling 24-hour basis with no open/closing times.",
  },
  {
    key: "circulatingSupply",
    title: "Circulating Supply",
    info: "A measure of a cryptocurrency trading volume across all tracked platforms in the last 24 hours. This is tracked on a rolling 24-hour basis with no open/closing times.",
  },
  {
    key: "totalSupply",
    title: "Total Supply",
    info: (
      <>
        <p>
          The amount of coins that have already been created, minus any coins
          that have been burned (removed from circulation). It is comparable to
          outstanding shares in the stock market.
        </p>
        <br />
        <p>Total Supply = Onchain supply - burned tokens</p>
      </>
    ),
  },
  {
    key: "maxSupply",
    title: "Max Supply",
    info: (
      <>
        <p>
          The maximum number of coins coded to exist in the lifetime of the
          cryptocurrency. It is comparable to the maximum number of issuable
          shares in the stock market.
        </p>
        <br />
        <p>Max Supply = Theoretical maximum as coded</p>
      </>
    ),
  },
]

let useApiKey = false

export async function fetchAll(urls: string[]) {
  const apiKey = useApiKey
    ? `&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`
    : ""

  try {
    const responses = await Promise.all(
      urls.map(async (url) => {
        // console.log("Fetching data from: ", useApiKey, `${url}${apiKey}`)

        const response = await fetch(`${url}${apiKey}`, {
          next: { revalidate: 3600 },
        })
        if (!response.ok) {
          throw {
            status: response.status,
            message: `HTTP error! status: ${response.status} ${response.statusText}`,
          }
        }
        return response
      })
    )

    const data = await Promise.all(responses.map((res) => res.json()))
    return data
  } catch (err: any) {
    console.error("Error fetching data:", err)

    if (err?.message?.includes("429")) {
      useApiKey = !useApiKey
      return fetchAll(urls)
    }

    return notFound()
  }
}

export const getFirstItem = (arr: any) =>
  Array.isArray(arr) && arr.length > 0 ? arr[0] : null

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const toggleFavoritesArray = (
  favorites: string[],
  coinId: string,
  favorite: boolean
) => {
  if (favorite) {
    return [...favorites, coinId]
  } else {
    return favorites.filter((favorite) => favorite !== coinId)
  }
}
