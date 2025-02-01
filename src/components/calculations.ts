export interface Inputs {
  homePrice: number
  downPayment: number
  mortgageRate: number
  loanTerm: number
  hoa: number
  insurance: number
  oneTimeSellingFeeRate: number
  propertyTaxRate: number
  annualAppreciationRate: number
  monthlyRent: number
  annualRentIncreaseRate: number
  annualInvestmentReturnRate: number
}

interface CostAnalysis {
  buyCost: number
  rentCost: number
  investmentReturns: number
  homeValue: number
  equity: number
  netCostBuy: number
  netCostRent: number
}

export interface YearlyComparison {
  year: number
  buyCost: number
  rentCost: number
  investmentReturns: number
  buyNetCost: number
  rentNetCost: number
  homeValue: number
  equity: number
}

export interface Results {
  fiveYear: CostAnalysis
  tenYear: CostAnalysis
  yearlyComparison: YearlyComparison[]
}

// Helper class to manage financial calculations
class FinancialCalculator {
  private monthlyMortgage: number
  private monthlyPropertyTax: number
  private monthlyInsurance: number
  private loanAmount: number

  constructor(private inputs: Inputs) {
    this.loanAmount = inputs.homePrice - inputs.downPayment
    const monthlyRate = inputs.mortgageRate / 100 / 12
    const numberOfPayments = inputs.loanTerm * 12

    this.monthlyMortgage = this.calculateMonthlyMortgage(monthlyRate, numberOfPayments)
    this.monthlyPropertyTax = (inputs.homePrice * (inputs.propertyTaxRate / 100)) / 12
    this.monthlyInsurance = inputs.insurance / 12
  }

  private calculateMonthlyMortgage(monthlyRate: number, numberOfPayments: number): number {
    return (
      (this.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    )
  }

  private calculateMonthlyBuyCost(): number {
    return this.monthlyMortgage + this.inputs.hoa + this.monthlyPropertyTax + this.monthlyInsurance
  }

  private applyAnnualRate(value: number, rate: number): number {
    return value * (1 + rate / 100)
  }

  private calculateNetCosts(params: {
    totalBuyCost: number
    totalRentCost: number
    currentHomeValue: number
    investmentValue: number
  }): { buyNetCost: number; rentNetCost: number } {
    const { totalBuyCost, totalRentCost, currentHomeValue, investmentValue } = params
    const sellingFees = currentHomeValue * (this.inputs.oneTimeSellingFeeRate / 100)

    return {
      buyNetCost: totalBuyCost - (currentHomeValue - this.inputs.homePrice) + sellingFees,
      rentNetCost: totalRentCost - (investmentValue - this.inputs.downPayment),
    }
  }

  calculateYearlyMetrics(years: number = 20): YearlyComparison[] {
    let currentRent = this.inputs.monthlyRent
    let currentHomeValue = this.inputs.homePrice
    let remainingLoanBalance = this.loanAmount
    let totalBuyCost = 0
    let totalRentCost = 0
    let investmentValue = this.inputs.downPayment
    const yearlyMetrics: YearlyComparison[] = []

    for (let year = 1; year <= years; year++) {
      // Calculate monthly costs for the year
      for (let month = 1; month <= 12; month++) {
        const interestPayment = remainingLoanBalance * (this.inputs.mortgageRate / 100 / 12)
        const principalPayment = this.monthlyMortgage - interestPayment
        remainingLoanBalance -= principalPayment

        totalBuyCost += this.calculateMonthlyBuyCost()
        totalRentCost += currentRent
      }

      // Update annual values
      currentRent = this.applyAnnualRate(currentRent, this.inputs.annualRentIncreaseRate)
      currentHomeValue = this.applyAnnualRate(currentHomeValue, this.inputs.annualAppreciationRate)
      investmentValue = this.applyAnnualRate(investmentValue, this.inputs.annualInvestmentReturnRate)

      const equity = currentHomeValue - remainingLoanBalance
      const { buyNetCost, rentNetCost } = this.calculateNetCosts({
        totalBuyCost,
        totalRentCost,
        currentHomeValue,
        investmentValue,
      })

      yearlyMetrics.push({
        year,
        buyCost: totalBuyCost,
        rentCost: totalRentCost,
        buyNetCost,
        rentNetCost,
        homeValue: currentHomeValue,
        equity,
        investmentReturns: investmentValue,
      })
    }

    return yearlyMetrics
  }

  // Get analysis for a specific year from yearly metrics
  getAnalysisForYear(year: number): CostAnalysis {
    const yearlyMetric = this.calculateYearlyMetrics(year)[year - 1]
    
    return {
      buyCost: yearlyMetric.buyCost,
      rentCost: yearlyMetric.rentCost,
      investmentReturns: yearlyMetric.investmentReturns,
      homeValue: yearlyMetric.homeValue,
      equity: yearlyMetric.equity,
      netCostBuy: yearlyMetric.buyNetCost,
      netCostRent: yearlyMetric.rentNetCost,
    }
  }
}

// Main calculation function
export function calculateMortgageVsRent(inputs: Inputs): Results {
  const calculator = new FinancialCalculator(inputs)
  
  return {
    fiveYear: calculator.getAnalysisForYear(5),
    tenYear: calculator.getAnalysisForYear(10),
    yearlyComparison: calculator.calculateYearlyMetrics(),
  }
}