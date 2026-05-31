import { CalculationResult } from '../../types.ts';
import { formatCurrency } from '../utils.ts';

/**
 * SIP Calculator
 */
export function calculateSIP(values: Record<string, any>): CalculationResult[] {
  const { monthlyInvestment, expectedRate, tenure, currencySymbol = '$' } = values;
  if (!monthlyInvestment || expectedRate === undefined || expectedRate === null || !tenure) return [];

  const P = monthlyInvestment;
  const i = (expectedRate / 100) / 12;
  const n = tenure * 12;

  let maturityAmount = 0;
  if (i === 0) {
      maturityAmount = P * n;
  } else {
      maturityAmount = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  }
  const totalInvested = P * n;
  const estReturns = maturityAmount - totalInvested;

  return [
    { label: 'Maturity Amount', value: formatCurrency(maturityAmount, currencySymbol), isPrimary: true },
    { label: 'Invested Amount', value: formatCurrency(totalInvested, currencySymbol) },
    { label: 'Est. Returns', value: formatCurrency(estReturns, currencySymbol) },
  ];
}

/**
 * Compound Interest
 */
export function calculateCompoundInterest(values: Record<string, any>): CalculationResult[] {
  const { principal, rate, tenure, frequency = 1, currencySymbol = '$' } = values;
  if (!principal || rate === undefined || rate === null || !tenure) return [];

  const P = principal;
  const r = rate / 100;
  const n = parseInt(frequency) || 1;
  const t = tenure;

  const amount = P * Math.pow(1 + r / n, n * t);
  const interest = amount - P;

  const chartData = [];
  if (t <= 50) {
    for (let year = 0; year <= t; year++) {
      const currentAmount = P * Math.pow(1 + r / n, n * year);
      chartData.push({
        year,
        principal: parseFloat(P.toFixed(2)),
        interest: parseFloat((currentAmount - P).toFixed(2))
      });
    }
  }

  return [
    { 
      label: 'Final Amount', 
      value: formatCurrency(amount, currencySymbol), 
      isPrimary: true, 
      chartData, 
      chartType: 'bar',
      explanation: `With an initial investment of ${formatCurrency(P, currencySymbol)} at an annual interest rate of ${rate}%, your money will grow to ${formatCurrency(amount, currencySymbol)} over ${t} years. This includes ${formatCurrency(interest, currencySymbol)} in earned interest.`
    },
    { label: 'Principal Amount', value: formatCurrency(P, currencySymbol) },
    { label: 'Total Interest', value: formatCurrency(interest, currencySymbol) },
  ];
}

/**
 * CAGR Calculator
 */
export function calculateCAGR(values: Record<string, any>): CalculationResult[] {
    const { initialValue, finalValue, years } = values;
    if (!initialValue || !finalValue || !years) return [];

    const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
    const totalReturn = ((finalValue - initialValue) / initialValue) * 100;

    return [
        { label: 'CAGR', value: `${cagr.toFixed(2)}%`, isPrimary: true },
        { label: 'Total Absolute Return', value: `${totalReturn.toFixed(2)}%` }
    ];
}

/**
 * FD Calculator
 */
export function calculateFD(values: Record<string, any>): CalculationResult[] {
    const { principal, rate, tenure, currencySymbol = '$' } = values;
    return calculateCompoundInterest({ principal, rate, tenure, frequency: 4, currencySymbol });
}

/**
 * Rule of 72
 */
export function calculateRule72(values: Record<string, any>): CalculationResult[] {
    const { rate } = values;
    if (!rate || rate <= 0) return [];
    
    const years = 72 / rate;
    return [
        { label: 'Years to Double', value: `${years.toFixed(1)} Years`, isPrimary: true },
        { label: 'Growth with 10% rate', value: '7.2 Years', helpText: 'Comparison baseline' }
    ];
}
