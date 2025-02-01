import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ResultsDisplayProps {
  results: {
    fiveYear: {
      buyCost: number
      rentCost: number
      investmentReturns: number
      homeValue: number
      equity: number
      netCostBuy: number
      netCostRent: number
    }
    tenYear: {
      buyCost: number
      rentCost: number
      investmentReturns: number
      homeValue: number
      equity: number
      netCostBuy: number
      netCostRent: number
    }
  }
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const renderPeriodResults = (period: "fiveYear" | "tenYear", label: string) => {
    const data = results[period]
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{label} Outlook</CardTitle>
          <CardDescription>A comprehensive cost comparison between buying and renting over {label.split('-')[0]} years, including property appreciation, investment returns, and all associated costs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Cost of Buying</h3>
              <p>Net Cost (After Selling): <span className="font-semibold">{formatCurrency(data.netCostBuy)}</span></p>
              <p>Total Expenses: {formatCurrency(data.buyCost)}</p>
              <p>Projected Home Value: {formatCurrency(data.homeValue)}</p>
              <p>Built-up Equity: {formatCurrency(data.equity)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Cost of Renting</h3>
              <p>Net Cost: <span className="font-semibold">{formatCurrency(data.netCostRent)}</span></p>
              <p>Total Expenses: {formatCurrency(data.rentCost)}</p>
              <p>Investment Returns: {formatCurrency(data.investmentReturns)}</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Summary</h3>
              {data.netCostBuy < data.netCostRent
                ? <p className="text-lg font-semibold text-[hsl(var(--chart-1))]">Buying would save you <span>{formatCurrency(data.netCostRent - data.netCostBuy)}</span></p>
                : <p className="text-lg font-semibold text-[hsl(var(--chart-2))]">Renting would save you <span>{formatCurrency(data.netCostBuy - data.netCostRent)}</span></p>
              }
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mt-0">
      {renderPeriodResults("fiveYear", "5-Year")}
      {renderPeriodResults("tenYear", "10-Year")}
    </div>
  )
}

