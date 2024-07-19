"use client"

// components/LineChartWithGradient.js

import React, { useRef, useEffect } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ChartOptions,
  registerables,
  TooltipModel,
} from "chart.js"
import "chartjs-adapter-date-fns"
import { twHex, twRgb, twRgba } from "tailwind-color-util"
import millify from "millify"
import { formatCurrencyForApp } from "@/lib/utils"
import { format } from "date-fns"

// Register the necessary Chart.js components
ChartJS.register(...registerables)

export default function MainChart({ chartData, type, days }: LineChartProps) {
  const chartRef = useRef(null)

  const CustomTooltip = {
    id: "customTooltip",

    beforeDraw: (chart: ChartJS) => {
      const tooltip = chart.tooltip as TooltipModel<"line">
      const activeTooltips = tooltip.dataPoints

      if (tooltip.opacity > 0) {
        const ctx = chart.ctx
        ctx.save()
        const activePoint = activeTooltips[0]
        const x = activePoint.element.x
        const topY = chart.scales.y.top
        const bottomY = chart.scales.y.bottom

        ctx.beginPath()
        ctx.moveTo(x, topY)
        ctx.lineTo(x, bottomY)
        ctx.lineWidth = 2
        ctx.strokeStyle = "#33363E" // Line color
        ctx.stroke()
        ctx.restore()
      }
    },
  }

  const timeUnit = days === "1" ? "hour" : days === "365" ? "month" : "day"

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: timeUnit, // Set time unit
          // stepSize: 1, // Step size of 1 hour
        },
        ticks: {
          maxTicksLimit: 10,
          maxRotation: 0, // Prevent rotation of labels
        },
        grid: {
          display: false, // Show grid lines for the y-axis (default)
        },
      },
      y: {
        ticks: {
          maxTicksLimit: 8,
          callback: function (value) {
            return `$${millify(Number(value), { precision: 4 })}`
          },
        },
        grid: {
          display: true, // Show grid lines for the y-axis (default)
          color: "#33363E", // Grid line color
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        usePointStyle: false,
        displayColors: false,
        titleColor: twHex("slate-400"),
        bodyColor: twHex("slate-400"),
        titleMarginBottom: 12,
        padding: 13,
        callbacks: {
          title: function (context) {
            const date = new Date(context[0].parsed.x)
            return `${format(date, "MMM d, yyyy, hh:mm:ss")} PDT`
          },
          label: function (context) {
            let label = context.dataset.label || ""

            if (label) {
              label += ": "
            }

            if (context.parsed.y !== null) {
              label += type == "mc" ? "Market Cap" : "Price"
              label += `: ${formatCurrencyForApp(context.parsed.y, true)}`
            }

            const volume = `Vol: ${formatCurrencyForApp(
              chartData["total_volumes"][context.dataIndex][1],
              false,
            )}`
            return [label, volume]
          },
        },
      },
      legend: {
        display: false,
      },
    },
  }

  const displayData = chartData[type == "mc" ? "market_caps" : "prices"]
  const chartGain = displayData[displayData.length - 1][1] >= displayData[0][1]
  const colorsRGB = twRgba(chartGain ? "green-600" : "red-600", 10)

  const chartLabels = () => {
    return displayData.map((price, index) => price[0])
  }

  const chartDataSet = () => displayData.map((price) => price[1])

  const data = {
    labels: chartLabels(),
    datasets: [
      {
        data: chartDataSet(),
        borderColor: twRgb(chartGain ? "green-500" : "red-600"),
        pointRadius: 0,
        borderWidth: 2,
        pointHoverBorderWidth: 1,
        fill: true,
      },
    ],
  }

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current as ChartJS
      const ctx = chart.ctx

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
      // Add colors
      gradient.addColorStop(0, colorsRGB.replace("10)", "0.4)"))
      gradient.addColorStop(1, colorsRGB.replace("10)", "0)"))

      // Set the gradient as the background color
      chart.data.datasets[0].backgroundColor = gradient
      chart.update()
    }
  }, [colorsRGB])

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current as ChartJS
      const handleResize = () => {
        if (chart) {
          chart.resize()
        }
      }

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }
  }, [])

  return (
    <div>
      <Line
        ref={chartRef}
        data={data}
        options={options}
        plugins={[CustomTooltip]}
      />
    </div>
  )
}
