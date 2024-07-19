import { Card, CardContent } from "./ui/card"
import { formatCurrencyForApp } from "@/lib/utils"
import Percentage from "./Percentage"

export default function CardSimple({
  title,
  amount,
  percentage,
}: {
  title: string
  amount: number
  percentage?: number
}) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-start">
        <p className="pb-1 pt-4 text-xl font-bold">
          {formatCurrencyForApp(amount, false)}
        </p>
        <p className="flex items-center gap-2 text-sm">
          <span>{title}</span>
          {percentage !== undefined ? <Percentage pct={percentage} /> : null}
        </p>
      </CardContent>
    </Card>
  )
}
