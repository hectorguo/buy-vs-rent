import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
          <CardTitle>{label} Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Buying</h3>
              <p>Total Cost: {formatCurrency(data.buyCost)}</p>
              <p>Home Value: {formatCurrency(data.homeValue)}</p>
              <p>Equity: {formatCurrency(data.equity)}</p>
              <p>Net Cost: {formatCurrency(data.netCostBuy)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Renting</h3>
              <p>Total Cost: {formatCurrency(data.rentCost)}</p>
              <p>Investment Returns: {formatCurrency(data.investmentReturns)}</p>
              <p>Net Cost: {formatCurrency(data.netCostRent)}</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">Summary</h3>
            <p>
              {data.netCostBuy < data.netCostRent
                ? `Buying saves you ${formatCurrency(data.netCostRent - data.netCostBuy)}`
                : `Renting saves you ${formatCurrency(data.netCostBuy - data.netCostRent)}`}
            </p>
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

