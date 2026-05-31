import { CalculationResult } from '../../types.ts';
import { formatCurrency } from '../utils.ts';

/**
 * Standard EMI Formula
 */
export function calculateEMI(values: Record<string, any>): CalculationResult[] {
  const { principal, rate, tenure, tenureUnit = 'years', currencySymbol = '$' } = values;
  if (!principal || rate === undefined || rate === null || !tenure) return [];

  const P = principal;
  const annualRate = rate / 100;
  const n = tenureUnit === 'years' ? tenure * 12 : tenure;

  let emi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (annualRate === 0) {
      emi = P / n;
      totalPayment = P;
      totalInterest = 0;
  } else {
      const r = annualRate / 12;
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      totalPayment = emi * n;
      totalInterest = totalPayment - P;
  }

  // Generate basic amortization schedule points (say, yearly)
  const chartData = [];
  let balance = P;
  const monthlyRate = annualRate / 12;
  
  if (annualRate > 0 && n <= 360) {
    chartData.push({ year: 0, Principal: 0, Interest: 0 });
    let accInterest = 0;
    let accPrincipal = 0;
    for (let month = 1; month <= n; month++) {
      const interest = balance * monthlyRate;
      accInterest += interest;
      const principalPaid = emi - interest;
      accPrincipal += principalPaid;
      balance = Math.max(0, balance - principalPaid);
      if (month % 12 === 0 || month === n) {
        chartData.push({ 
          year: month / 12, 
          Principal: parseFloat(accPrincipal.toFixed(2)), 
          Interest: parseFloat(accInterest.toFixed(2))
        });
      }
    }
  }

  return [
    { 
      label: 'Monthly EMI', 
      value: formatCurrency(emi, currencySymbol), 
      isPrimary: true, 
      chartData, 
      chartType: 'area',
      explanation: `Your estimated monthly payment is ${formatCurrency(emi, currencySymbol)}. Over the course of ${tenure} ${tenureUnit}, you will pay a total of ${formatCurrency(totalInterest, currencySymbol)} in interest, bringing your total payment to ${formatCurrency(totalPayment, currencySymbol)}.`
    },
    { label: 'Total Interest Payable', value: formatCurrency(totalInterest, currencySymbol) },
    { label: 'Total Payment', value: formatCurrency(totalPayment, currencySymbol) },
  ];
}

/**
 * Mortgage Calculator (with Down Payment)
 */
export function calculateMortgage(values: Record<string, any>): CalculationResult[] {
  const { homePrice, downPayment, rate, term, currencySymbol = '$' } = values;
  if (!homePrice || rate === undefined || rate === null || !term) return [];

  const P = homePrice - (downPayment || 0);
  return calculateEMI({ principal: P, rate, tenure: term, tenureUnit: 'years', currencySymbol });
}

/**
 * Debt-to-Income Ratio
 */
export function calculateDTI(values: Record<string, any>): CalculationResult[] {
  const { monthlyDebts, grossIncome } = values;
  if (monthlyDebts === undefined || monthlyDebts === null || !grossIncome) return [];

  const dti = (monthlyDebts / grossIncome) * 100;
  let rating = 'Excellent';
  if (dti > 43) rating = 'Poor';
  else if (dti > 36) rating = 'Fair';
  else if (dti > 20) rating = 'Good';

  return [
    { label: 'DTI Ratio', value: `${dti.toFixed(2)}%`, isPrimary: true },
    { label: 'Rating', value: rating, helpText: 'Lenders typically prefer under 36%' }
  ];
}

/**
 * Car Loan Calculator
 */
export function calculateCarLoan(values: Record<string, any>): CalculationResult[] {
    const { vehiclePrice, downPayment, rate, tenure, currencySymbol = '$' } = values;
    if (!vehiclePrice || rate === undefined || rate === null || !tenure) return [];
    const P = vehiclePrice - (downPayment || 0);
    return calculateEMI({ principal: P, rate, tenure, tenureUnit: 'years', currencySymbol });
}

/**
 * Credit Card Payoff
 */
export function calculateCreditCardPayoff(values: Record<string, any>): CalculationResult[] {
    const { balance, rate, monthlyPayment, currencySymbol = '$' } = values;
    if (!balance || rate === undefined || rate === null || !monthlyPayment) return [];

    let currentBalance = balance;
    const monthlyRate = (rate / 100) / 12;
    let months = 0;
    let totalInterest = 0;

    // Guard against infinite loop
    if (monthlyPayment <= balance * monthlyRate) {
        return [{ label: 'Error', value: 'Payment too low', helpText: 'Minimum payment must cover interest' }];
    }

    while (currentBalance > 0 && months < 360) {
        const interest = currentBalance * monthlyRate;
        totalInterest += interest;
        currentBalance = currentBalance + interest - monthlyPayment;
        months++;
    }

    return [
        { label: 'Time to Pay Off', value: `${months} Months`, isPrimary: true },
        { label: 'Total Interest', value: formatCurrency(totalInterest, currencySymbol) },
        { label: 'Total Paid', value: formatCurrency(balance + totalInterest, currencySymbol) }
    ];
}

/**
 * Home Affordability
 */
export function calculateHomeAffordability(values: Record<string, any>): CalculationResult[] {
  const { annualIncome, monthlyDebts, downPayment, rate = 6.5, term = 30, currencySymbol = '$' } = values;
  if (!annualIncome) return [];

  const monthlyGross = annualIncome / 12;
  // 28/36 Rule
  const maxHousingPayment = monthlyGross * 0.28;
  const maxTotalDebtPayment = monthlyGross * 0.36;
  const currentAvailableForHousing = Math.min(maxHousingPayment, maxTotalDebtPayment - (monthlyDebts || 0));

  if (currentAvailableForHousing <= 0) return [{ label: 'Affordability', value: 'Low', helpText: 'Debts are too high' }];

  const monthlyRate = (rate / 100) / 12;
  const n = term * 12;
  const loanAmount = currentAvailableForHousing * (Math.pow(1 + monthlyRate, n) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, n));
  const purchasePrice = loanAmount + (downPayment || 0);

  return [
    { label: 'Estimated Budget', value: formatCurrency(purchasePrice, currencySymbol), isPrimary: true },
    { label: 'Monthly Payment', value: formatCurrency(currentAvailableForHousing, currencySymbol) },
    { label: 'Loan Amount', value: formatCurrency(loanAmount, currencySymbol) }
  ];
}

/**
 * Retirement / FIRE
 */
export function calculateRetirement(values: Record<string, any>): CalculationResult[] {
  const { currentAge, retireAge, annualExpenses, currentSavings, expectedReturn = 7, currencySymbol = '$' } = values;
  if (!currentAge || !retireAge || !annualExpenses) return [];

  const yearsToRetire = retireAge - currentAge;
  const fireNumber = annualExpenses * 25; // 4% Rule
  
  // Future value of current savings
  const r = expectedReturn / 100;
  const fvSavings = currentSavings * Math.pow(1 + r, yearsToRetire);
  const gap = Math.max(0, fireNumber - fvSavings);

  return [
    { label: 'FIRE Number', value: formatCurrency(fireNumber, currencySymbol), isPrimary: true, helpText: '25x annual expenses' },
    { label: 'Savings at Retirement', value: formatCurrency(fvSavings, currencySymbol) },
    { label: 'Goal Gap', value: formatCurrency(gap, currencySymbol) }
  ];
}

/**
 * Loan Payoff / Extra Payment
 */
export function calculateLoanPayoff(values: Record<string, any>): CalculationResult[] {
  const { balance, rate, monthlyPayment, extraPayment = 0, currencySymbol = '$' } = values;
  if (!balance || !rate || !monthlyPayment) return [];

  const r = rate / 100 / 12;
  const totalPayment = monthlyPayment + extraPayment;

  // Normal payoff
  let normalBalance = balance;
  let normalMonths = 0;
  while (normalBalance > 0 && normalMonths < 600) {
    normalBalance = normalBalance * (1 + r) - monthlyPayment;
    normalMonths++;
  }

  // Extra payoff
  let extraBalance = balance;
  let extraMonths = 0;
  let totalInterestSaved = 0;
  let normalInterest = 0;
  let extraInterest = 0;

  // (Simple calculation for demo purposes)
  const calculateInterest = (b: number, p: number) => {
    let bal = b;
    let m = 0;
    let interest = 0;
    while (bal > 0 && m < 600) {
      const i = bal * r;
      interest += i;
      bal = bal + i - p;
      m++;
    }
    return { interest, months: m };
  };

  const normal = calculateInterest(balance, monthlyPayment);
  const accelerated = calculateInterest(balance, totalPayment);

  return [
    { label: 'Months Saved', value: `${normal.months - accelerated.months} Months`, isPrimary: true },
    { label: 'Interest Saved', value: formatCurrency(normal.interest - accelerated.interest, currencySymbol) },
    { label: 'New Payoff Time', value: `${accelerated.months} Months` }
  ];
}

/**
 * Refinance Calculator
 */
export function calculateRefinance(values: Record<string, any>): CalculationResult[] {
  const { currentBalance, currentRate, currentTerm, newRate, newTerm, closingCosts = 0, currencySymbol = '$' } = values;
  if (!currentBalance || !currentRate || !newRate) return [];

  const currentEMI = calculateEMI({ principal: currentBalance, rate: currentRate, tenure: currentTerm, tenureUnit: 'years' })[0].value;
  const newEMIResult = calculateEMI({ principal: currentBalance, rate: newRate, tenure: newTerm, tenureUnit: 'years' })[0].value;
  
  // Clean currency strings for math
  const parse = (s: string | number) => typeof s === 'number' ? s : parseFloat(s.replace(/[^0-9.-]+/g, ''));
  const cE = parse(currentEMI);
  const nE = parse(newEMIResult);
  
  const monthlySavings = cE - nE;
  const breakEvenMonths = monthlySavings > 0 ? closingCosts / monthlySavings : 0;

  return [
    { label: 'Monthly Savings', value: formatCurrency(monthlySavings, currencySymbol), isPrimary: true },
    { label: 'Break-even Point', value: monthlySavings > 0 ? `${Math.ceil(breakEvenMonths)} Months` : 'Never' },
    { label: 'New Monthly EMI', value: formatCurrency(nE, currencySymbol) }
  ];
}

/**
 * Rent vs Buy
 */
export function calculateRentVsBuy(values: Record<string, any>): CalculationResult[] {
  const { monthlyRent, homePrice, downPayment, rate, term, years = 10, currencySymbol = '$' } = values;
  if (!monthlyRent || !homePrice) return [];

  const totalRent = monthlyRent * 12 * years;
  const emiRes = calculateEMI({ principal: homePrice - downPayment, rate, tenure: term, tenureUnit: 'years' });
  const monthlyMortgage = typeof emiRes[0].value === 'number' ? emiRes[0].value : parseFloat(emiRes[0].value.replace(/[^0-9.-]+/g, ''));
  const totalBuyCost = (monthlyMortgage * 12 * years) + downPayment;

  return [
    { label: 'Verdict', value: totalRent < totalBuyCost ? 'Better to Rent' : 'Better to Buy', isPrimary: true },
    { label: 'Total Rent Cost', value: formatCurrency(totalRent, currencySymbol) },
    { label: 'Total Buy Cost', value: formatCurrency(totalBuyCost, currencySymbol) }
  ];
}

/**
 * Balloon Loan
 */
export function calculateBalloonLoan(values: Record<string, any>): CalculationResult[] {
  const { principal, rate, term, balloonAmount, currencySymbol = '$' } = values;
  if (!principal || !rate || !term) return [];

  const r = rate / 100 / 12;
  const n = term * 12;
  
  // Adjusted EMI for balloon payment
  // P = EMI * ( (1+r)^n - 1 ) / ( r * (1+r)^n ) + B / (1+r)^n
  // EMI = ( P - B / (1+r)^n ) * ( r * (1+r)^n ) / ( (1+r)^n - 1 )
  
  const discountFactor = (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
  const emi = (principal - (balloonAmount / Math.pow(1 + r, n))) / discountFactor;

  const totalInterest = (emi * n) + balloonAmount - principal;

  return [
    { label: 'Monthly Payment', value: formatCurrency(emi, currencySymbol), isPrimary: true },
    { label: 'Balloon Amount', value: formatCurrency(balloonAmount, currencySymbol) },
    { label: 'Total Interest', value: formatCurrency(totalInterest, currencySymbol) }
  ];
}
