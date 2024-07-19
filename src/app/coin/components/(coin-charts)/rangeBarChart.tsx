"use client"

import { formatCurrencyForApp, getRandomNumber } from "@/lib/utils"

function calculatePercentageInRange(
  number: number,
  minRange: number,
  maxRange: number,
) {
  // API sometimes returns a current price that is outside the range
  // This is a temporary fix to prevent the app from crashing

  if (number < minRange || number > maxRange) {
    const randomPct = getRandomNumber(0, 100)
    return getRandomNumber(35, 75)
  }

  const range = maxRange - minRange
  const percentage = Math.round(((number - minRange) / range) * 100)
  return percentage
}

const RangeBarChart = ({
  range,
  currentPrice,
}: {
  range: number[]
  currentPrice: number
}) => {
  const gradientPct = calculatePercentageInRange(
    currentPrice,
    range[0],
    range[1],
  )

  return (
    <div>
      <div className="relative h-2">
        <div
          className="absolute left-0 top-0 z-10 h-full rounded-2xl bg-gradient-to-r from-yellow-300 to-green-700"
          style={{ width: "99%" }}
        ></div>
        <div
          className="absolute top-0 z-20 h-full rounded-r-2xl bg-slate-800"
          style={{ left: `${gradientPct}%`, width: `${100 - gradientPct}%` }}
        ></div>
      </div>

      <div className="mt-2.5 flex w-full justify-between text-xs text-foreground">
        <p>{formatCurrencyForApp(range[0], true)}</p>
        <p className="text-muted-foreground">24h Range</p>
        <p>{formatCurrencyForApp(range[1], true)}</p>
      </div>
    </div>
  )
}

export default RangeBarChart
