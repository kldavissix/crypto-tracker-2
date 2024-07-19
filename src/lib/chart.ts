// type ChartDataProps = {
//   chartData: ChartData
// }

type ChartDataProps = {
  prices: number[][]
  market_caps: number[][]
  total_volumes: number[][]
}

type LineChartProps = {
  chartData: {
    prices: number[][]
    market_caps: number[][]
    total_volumes: number[][]
  }
  type?: "pr" | "mc"
  days: string
}
