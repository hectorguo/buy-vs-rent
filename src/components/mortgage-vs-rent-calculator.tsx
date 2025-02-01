"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  calculateMortgageVsRent,
  type Results,
  type YearlyComparison,
} from "./calculations";
import ResultsDisplay from "./results-display";
import YearlyComparisonChart from "./yearly-comparison-chart";

export default function MortgageVsRentCalculator() {
  const [inputs, setInputs] = useState({
    homePrice: 1800000,
    downPayment: 360000,
    mortgageRate: 6.5,
    loanTerm: 30,
    hoa: 469,
    insurance: 1500,
    propertyTaxRate: 1.2,
    annualAppreciationRate: 3,
    monthlyRent: 5000,
    annualRentIncreaseRate: 10,
    annualInvestmentReturnRate: 7,
    oneTimeSellingFeeRate: 5,
  });

  const [results, setResults] = useState<
    null | (Results & { yearlyComparison: YearlyComparison[] })
  >(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }));
  };

  useEffect(() => {
    const calculatedResults = calculateMortgageVsRent(inputs);
    setResults(calculatedResults);
  }, [inputs])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Mortgage vs Rent Calculator</CardTitle>
          <CardDescription>
            Compare the costs of buying vs renting over 5 and 10 years
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="homePrice">Home Price ($)</Label>
              <Input
                id="homePrice"
                name="homePrice"
                type="number"
                value={inputs.homePrice}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="downPayment">Down Payment ($)</Label>
              <Input
                id="downPayment"
                name="downPayment"
                type="number"
                value={inputs.downPayment}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="mortgageRate">Mortgage Rate (%)</Label>
              <Input
                id="mortgageRate"
                name="mortgageRate"
                type="number"
                step="0.1"
                value={inputs.mortgageRate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="loanTerm">Loan Term (years)</Label>
              <Input
                id="loanTerm"
                name="loanTerm"
                type="number"
                value={inputs.loanTerm}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="hoa">Monthly HOA ($)</Label>
              <Input
                id="hoa"
                name="hoa"
                type="number"
                value={inputs.hoa}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="insurance">Annual Insurance ($)</Label>
              <Input
                id="insurance"
                name="insurance"
                type="number"
                value={inputs.insurance}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="propertyTaxRate">Property Tax Rate (%)</Label>
              <Input
                id="propertyTaxRate"
                name="propertyTaxRate"
                type="number"
                step="0.1"
                value={inputs.propertyTaxRate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="annualAppreciationRate">
                Annual Home Appreciation Rate (%)
              </Label>
              <Input
                id="annualAppreciationRate"
                name="annualAppreciationRate"
                type="number"
                step="0.1"
                value={inputs.annualAppreciationRate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="oneTimeSellingFeeRate">
                One Time Selling Fee Rate (%)
              </Label>
              <Input
                id="oneTimeSellingFeeRate"
                name="oneTimeSellingFeeRate"
                type="number"
                step="0.1"
                value={inputs.oneTimeSellingFeeRate}
                onChange={handleInputChange}
              />
            </div>
            <hr className="md:col-span-2 mt-2" />
            <div>
              <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
              <Input
                id="monthlyRent"
                name="monthlyRent"
                type="number"
                value={inputs.monthlyRent}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="annualRentIncreaseRate">
                Annual Rent Increase Rate (%)
              </Label>
              <Input
                id="annualRentIncreaseRate"
                name="annualRentIncreaseRate"
                type="number"
                step="0.1"
                value={inputs.annualRentIncreaseRate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="annualInvestmentReturnRate">
                Annual Investment Return Rate (%)
              </Label>
              <Input
                id="annualInvestmentReturnRate"
                name="annualInvestmentReturnRate"
                type="number"
                step="0.1"
                value={inputs.annualInvestmentReturnRate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div>
          {results && <ResultsDisplay results={results} />}
          {results && (
            <YearlyComparisonChart data={results.yearlyComparison} />
          )}
      </div>
    </div>
  );
}
