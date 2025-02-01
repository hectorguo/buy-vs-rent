"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface YearlyComparisonChartProps {
  data: {
    year: number
    buyNetCost: number
    rentNetCost: number
  }[]
}

export default function YearlyComparisonChart({ data }: YearlyComparisonChartProps) {
  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Yearly Net Cost Comparison: Buying vs Renting</CardTitle>
        <CardDescription>Chart showing the net costs of buying and renting over 10 years</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            buyNetCost: {
              label: "Buy Net Cost",
              color: "hsl(var(--chart-1))",
            },
            rentNetCost: {
              label: "Rent Net Cost",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="buyNetCost" name="Buy Net Cost" stroke="var(--color-buyNetCost)" />
              <Line type="monotone" dataKey="rentNetCost" name="Rent Net Cost" stroke="var(--color-rentNetCost)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

