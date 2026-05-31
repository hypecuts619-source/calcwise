import { CalculationResult } from '../../types.ts';
import { formatCurrency } from '../utils.ts';

export function calculateDebtToIncome(values: Record<string, any>): CalculationResult[] {
  const d = parseFloat(values.monthlyDebts || '0');
  const i = parseFloat(values.grossIncome || '0');
  if (isNaN(d) || isNaN(i) || i === 0) return [];
  const percent = (d / i) * 100;
  return [{ label: 'DTI Ratio', value: percent.toFixed(2) + '%', isPrimary: true }];
}

export function calculateFIRE(values: Record<string, any>): CalculationResult[] {
  const e = parseFloat(values.annualExpenses || '0');
  const sym = values.currencySymbol || '$';
  if (isNaN(e) || e === 0) return [];
  return [{ label: 'FIRE Target (25x)', value: formatCurrency((e * 25), sym), isPrimary: true }];
}

export function calculateMonthlyBudget(values: Record<string, any>): CalculationResult[] {
  const i = parseFloat(values.income || '0');
  const e = parseFloat(values.expenses || '0');
  const sym = values.currencySymbol || '$';
  
  const needs = i * 0.5;
  const wants = i * 0.3;
  const savings = i * 0.2;

  const chartData = [
    { name: 'Needs (50%)', value: needs },
    { name: 'Wants (30%)', value: wants },
    { name: 'Savings (20%)', value: savings },
  ];

  return [
    { 
      label: 'Remaining', 
      value: formatCurrency((i - e), sym), 
      isPrimary: true, 
      chartData, 
      chartType: 'pie',
      explanation: `Based on the 50/30/20 budget rule, you should allocate ${formatCurrency(needs, sym)} (50%) for your needs, ${formatCurrency(wants, sym)} (30%) for wants, and ${formatCurrency(savings, sym)} (20%) for savings or paying off debt. You currently have ${formatCurrency((i - e), sym)} left after your listed expenses.`
    },
    { label: '50% Needs', value: formatCurrency(needs, sym) },
    { label: '30% Wants', value: formatCurrency(wants, sym) },
    { label: '20% Savings', value: formatCurrency(savings, sym) },
  ];
}

export function calculateInflation(values: Record<string, any>): CalculationResult[] {
  const amount = parseFloat(values.amount || '0');
  const rate = parseFloat(values.rate || '0');
  const years = parseFloat(values.years || '0');
  const sym = values.currencySymbol || '$';
  if (isNaN(amount) || isNaN(rate) || isNaN(years)) return [];
  const future = amount * Math.pow(1 + rate / 100, years);
  return [{ label: 'Future Value', value: formatCurrency(future, sym), isPrimary: true }];
}

export function calculateBodyFat(values: Record<string, any>): CalculationResult[] {
  // Simple BMI based body fat for simplicity: (1.20 * BMI) + (0.23 * age) - (10.8 * gender) - 5.4
  const w = parseFloat(values.weight || '0');
  const h = parseFloat(values.height || '0');
  const a = parseFloat(values.age || '0');
  const gender = values.gender || 'male';
  if (isNaN(w) || isNaN(h) || isNaN(a) || h === 0) return [];
  const bmi = w / Math.pow(h / 100, 2);
  const bf = (1.20 * bmi) + (0.23 * a) - (gender === 'male' ? 10.8 : 0) - 5.4;
  return [{ label: 'Estimated Body Fat', value: bf.toFixed(1) + '%', isPrimary: true }];
}

export function calculateLumpsum(values: Record<string, any>): CalculationResult[] {
  const p = parseFloat(values.principal || '0');
  const r = parseFloat(values.rate || '0');
  const y = parseFloat(values.years || '0');
  const sym = values.currencySymbol || '$';
  const amount = p * Math.pow(1 + r / 100, y);
  return [
    { label: 'Total Value', value: formatCurrency(amount, sym), isPrimary: true },
    { label: 'Wealth Gained', value: formatCurrency((amount - p), sym) }
  ];
}

export function calculateMutualFund(values: Record<string, any>): CalculationResult[] {
  return calculateLumpsum(values); // basic fallback
}

export function calculateBonusTax(values: Record<string, any>): CalculationResult[] {
  const b = parseFloat(values.bonusAmount || '0');
  const sym = values.currencySymbol || '$';
  if (isNaN(b)) return [];
  // Approx 22% flat federal + 7.65% FICA + some state
  const tax = b * 0.35;
  return [
    { label: 'Take Home (Est)', value: formatCurrency((b - tax), sym), isPrimary: true },
    { label: 'Estimated Taxes', value: formatCurrency(tax, sym) }
  ];
}

export function calculatePropertyTax(values: Record<string, any>): CalculationResult[] {
  const v = parseFloat(values.propertyValue || '0');
  const r = parseFloat(values.taxRate || '0');
  const sym = values.currencySymbol || '$';
  const tax = v * (r / 100);
  return [
    { label: 'Annual Tax', value: formatCurrency(tax, sym), isPrimary: true },
    { label: 'Monthly Tax', value: formatCurrency((tax / 12), sym) }
  ];
}

export function calculateCryptoROI(values: Record<string, any>): CalculationResult[] {
  const current = parseFloat(values.currentPrice || '0');
  const buy = parseFloat(values.buyPrice || '1');
  const inv = parseFloat(values.investment || '0');
  const sym = values.currencySymbol || '$';
  if (buy === 0) return [];
  const roi = ((current - buy) / buy) * 100;
  return [
    { label: 'ROI', value: roi.toFixed(2) + '%', isPrimary: true },
    { label: 'Current Value', value: formatCurrency((inv * (current / buy)), sym) }
  ];
}

export const calculateSimpleInterest = (v: any): any[] => [];
export const calculateSavingsGoal = (v: any): any[] => [];
export const calculateDiscount = (v: any): any[] => [];
export const calculateDateDiff = (v: any): any[] => [];
export const calculateWorldClock = (v: any): any[] => [];
export function calculateFractionDecimal(values: Record<string, any>): CalculationResult[] {
  const mode = values.type || 'f2d';
  if (mode === 'f2d') {
    const n = parseFloat(values.n || '0');
    const d = parseFloat(values.d || '1');
    if (d === 0) return [{ label: 'Error', value: 'Denominator cannot be zero', isPrimary: true }];
    const dec = n / d;
    return [{ label: 'Decimal Value', value: dec.toString(), isPrimary: true }];
  } else {
    const dec = parseFloat(values.decimal || '0');
    if (isNaN(dec)) return [];
    
    const str = String(dec);
    if (!str.includes('.')) {
      return [{ label: 'Fraction', value: `${dec} / 1`, isPrimary: true }];
    }
    const decPart = str.split('.')[1];
    const denominator = Math.pow(10, decPart.length);
    const numerator = Math.round(dec * denominator);
    
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
    const divisor = gcd(numerator, denominator);
    
    const finalNum = numerator / divisor;
    const finalDen = denominator / divisor;
    
    const results: CalculationResult[] = [
      { label: 'Fraction', value: `${finalNum} / ${finalDen}`, isPrimary: true }
    ];
    
    // Add mixed fraction if improper
    if (Math.abs(finalNum) > finalDen && finalDen !== 1) {
      const whole = Math.trunc(finalNum / finalDen);
      const remainder = Math.abs(finalNum % finalDen);
      results.push({ label: 'Mixed Fraction', value: `${whole} ${remainder}/${finalDen}` });
    }
    
    return results;
  }
}
export const calculateLease = (v: any): any[] => [];
export const calculateHELOC = (v: any): any[] => [];
export const calculateExponent = (v: any): any[] => [];
export const calculateLogarithm = (v: any): any[] => [];
export const calculateBasalMetabolic = (v: any): any[] => [];
export const calculateWaistHip = (v: any): any[] => [];
export const calculateBinary = (v: any): any[] => [];
export const calculatePasswordStrength = (v: any): any[] => [];
export const calculateCountdown = (v: any): any[] => [];
export const calculateSalaryComparison = (v: any): any[] => [];
export const calculateCarLease = (v: any): any[] => [];
export const calculateStudentLoan = (v: any): any[] => [];
export function calculateMacros(values: Record<string, any>): CalculationResult[] {
  const calories = parseFloat(values.calories || '2000');
  if (isNaN(calories) || calories <= 0) return [];
  
  // Standard split: 30% Protein, 35% Carbs, 35% Fat
  const proteinCals = calories * 0.30;
  const carbCals = calories * 0.35;
  const fatCals = calories * 0.35;
  
  const proteinGrams = Math.round(proteinCals / 4);
  const carbGrams = Math.round(carbCals / 4);
  const fatGrams = Math.round(fatCals / 9);

  const chartData = [
    { name: 'Protein (g)', value: proteinGrams },
    { name: 'Carbs (g)', value: carbGrams },
    { name: 'Fat (g)', value: fatGrams },
  ];

  return [
    { 
      label: 'Protein (30%)', 
      value: `${proteinGrams}g`, 
      isPrimary: true,
      chartData,
      chartType: 'pie',
      explanation: `To meet your ${calories} calorie goal with a balanced macro split, aim for ${proteinGrams}g of protein, ${carbGrams}g of carbs, and ${fatGrams}g of fat per day.`
    },
    { label: 'Carbs (35%)', value: `${carbGrams}g` },
    { label: 'Fat (35%)', value: `${fatGrams}g` },
  ];
}
export const calculateUnitConverter = (v: any): any[] => [];

