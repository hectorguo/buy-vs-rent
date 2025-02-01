export interface Inputs {
  homePrice: number
  downPayment: number
  mortgageRate: number
  loanTerm: number
  hoa: number
  insurance: number
  propertyTaxRate: number
  annualAppreciationRate: number
  monthlyRent: number
  annualRentIncreaseRate: number
  annualInvestmentReturnRate: number
}

export interface Results {
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

export interface YearlyComparison {
  year: number
  buyCost: number
  rentCost: number
  buyNetCost: number
  rentNetCost: number
  equity: number
}

export function calculateMortgageVsRent(inputs: Inputs): Results & { yearlyComparison: YearlyComparison[] } {
  const {
    homePrice,
    downPayment,
    mortgageRate,
    loanTerm,
    hoa,
    insurance,
    propertyTaxRate,
    annualAppreciationRate,
    monthlyRent,
    annualRentIncreaseRate,
    annualInvestmentReturnRate,
  } = inputs

  const loanAmount = homePrice - downPayment
  const monthlyMortgageRate = mortgageRate / 100 / 12
  const numberOfPayments = loanTerm * 12

  // Calculate monthly mortgage payment
  const monthlyMortgage =
    (loanAmount * monthlyMortgageRate * Math.pow(1 + monthlyMortgageRate, numberOfPayments)) /
    (Math.pow(1 + monthlyMortgageRate, numberOfPayments) - 1)

  const monthlyPropertyTax = (homePrice * (propertyTaxRate / 100)) / 12
  const monthlyInsurance = insurance / 12

  function calculateForPeriod(years: number) {
    let totalBuyCost = 0
    let totalRentCost = 0
    let currentRent = monthlyRent
    let currentHomeValue = homePrice
    let remainingLoanBalance = loanAmount

    for (let month = 1; month <= years * 12; month++) {
      // Buy costs
      const interestPayment = remainingLoanBalance * monthlyMortgageRate
      const principalPayment = monthlyMortgage - interestPayment
      remainingLoanBalance -= principalPayment

      totalBuyCost += monthlyMortgage + hoa + monthlyPropertyTax + monthlyInsurance

      // Rent costs
      totalRentCost += currentRent

      // Update values annually
      if (month % 12 === 0) {
        currentRent *= 1 + annualRentIncreaseRate / 100
        currentHomeValue *= 1 + annualAppreciationRate / 100
      }
    }

    const investmentReturns = downPayment * Math.pow(1 + annualInvestmentReturnRate / 100, years)
    const equity = currentHomeValue - remainingLoanBalance
    const sellingFees = currentHomeValue * 0.05

    return {
      buyCost: totalBuyCost,
      rentCost: totalRentCost,
      investmentReturns,
      homeValue: currentHomeValue,
      equity,
      netCostBuy: totalBuyCost - (currentHomeValue - homePrice) + sellingFees,
      netCostRent: totalRentCost - (investmentReturns - downPayment),
    }
  }

  function calculateYearlyComparison(inputs: Inputs): YearlyComparison[] {
    const {
      homePrice,
      downPayment,
      mortgageRate,
      loanTerm,
      hoa,
      insurance,
      propertyTaxRate,
      annualAppreciationRate,
      monthlyRent,
      annualRentIncreaseRate,
      annualInvestmentReturnRate,
    } = inputs

    const loanAmount = homePrice - downPayment
    const monthlyMortgageRate = mortgageRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    const monthlyMortgage =
      (loanAmount * monthlyMortgageRate * Math.pow(1 + monthlyMortgageRate, numberOfPayments)) /
      (Math.pow(1 + monthlyMortgageRate, numberOfPayments) - 1)

    const monthlyPropertyTax = (homePrice * (propertyTaxRate / 100)) / 12
    const monthlyInsurance = insurance / 12

    let currentRent = monthlyRent
    let currentHomeValue = homePrice
    let remainingLoanBalance = loanAmount
    let totalBuyCost = 0
    let totalRentCost = 0
    let investmentValue = downPayment

    const yearlyComparison: YearlyComparison[] = []

    for (let year = 1; year <= 20; year++) {
      for (let month = 1; month <= 12; month++) {
        // Buy costs
        const interestPayment = remainingLoanBalance * monthlyMortgageRate
        const principalPayment = monthlyMortgage - interestPayment
        remainingLoanBalance -= principalPayment

        totalBuyCost += monthlyMortgage + hoa + monthlyPropertyTax + monthlyInsurance

        // Rent costs
        totalRentCost += currentRent
      }

      // Update values annually
      currentRent *= 1 + annualRentIncreaseRate / 100
      currentHomeValue *= 1 + annualAppreciationRate / 100
      investmentValue *= 1 + annualInvestmentReturnRate / 100

      const equity = currentHomeValue - remainingLoanBalance
      const sellingFees = currentHomeValue * 0.05
      const buyNetCost = totalBuyCost - (currentHomeValue - homePrice) + sellingFees
      const rentNetCost = totalRentCost - (investmentValue - downPayment)

      yearlyComparison.push({
        year,
        buyCost: totalBuyCost,
        rentCost: totalRentCost,
        buyNetCost,
        rentNetCost,
        equity
      })
    }

    return yearlyComparison
  }

  return {
    fiveYear: calculateForPeriod(5),
    tenYear: calculateForPeriod(10),
    yearlyComparison: calculateYearlyComparison(inputs),
  }
}

