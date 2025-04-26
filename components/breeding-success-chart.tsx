"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface BreedingSuccessChartProps {
  data: {
    success_rate: number
    total_offspring: number
    avg_gestation: number
  }
}

export function BreedingSuccessChart({ data }: BreedingSuccessChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[300px] w-full bg-muted/20 rounded-md">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    )
  }

  const chartData = [
    { name: "Success", value: data.success_rate },
    { name: "Failure", value: 100 - data.success_rate },
  ]

  const COLORS = ["#00C49F", "#FF8042"]

  return (
    <div className="h-[300px] w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-md">
          <span className="text-sm text-muted-foreground">Total Offspring</span>
          <span className="text-2xl font-bold">{data.total_offspring}</span>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-md">
          <span className="text-sm text-muted-foreground">Avg. Gestation (days)</span>
          <span className="text-2xl font-bold">{data.avg_gestation.toFixed(1)}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}%`, ""]}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

