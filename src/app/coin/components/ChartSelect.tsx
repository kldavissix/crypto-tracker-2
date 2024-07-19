import { Button } from "@/components/ui/button"
import { chartDuration } from "@/lib/utils"
import Link from "next/link"

export default function ChartHeader({
  id,
  type,
  days,
}: {
  id: string
  type: string
  days: string
}) {
  const chartTypeButtons = () => {
    const chartType = new Map([
      ["Price", "pr"],
      ["Market Cap", "mc"],
    ])

    return Array.from(chartType).map(([key, value]) => {
      const active = type === value.toString()
      return (
        <Button asChild key={key} variant="outline" size="sm">
          <Link
            href={`/coin/${id}?type=${value}&days=${days}`}
            className={!active ? "text-muted-foreground" : "bg-slate-800"}
          >
            {key}
          </Link>
        </Button>
      )
    })
  }

  const chartDurationButtons = () => {
    return chartDuration.map((dur) => {
      if (dur.days === null) return null
      const active = days === dur.days

      return (
        <Button asChild key={dur.days} variant="outline" size="sm">
          <Link
            href={`/coin/${id}?type=${type}&days=${dur.days}`}
            className={!active ? "text-muted-foreground" : "bg-slate-800"}
          >
            {dur.btnLabel}
          </Link>
        </Button>
      )
    })
  }

  return (
    <div className="flex flex-col items-center gap-y-2 lg:flex-row lg:justify-between lg:gap-y-0">
      <div className="flex gap-1">{chartTypeButtons()}</div>
      <div className="flex gap-1">{chartDurationButtons()}</div>
    </div>
  )
}
