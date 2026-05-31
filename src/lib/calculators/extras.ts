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


export function calculateSimpleInterest(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const p = parseFloat(values.principal || values.p || '0');
  const r = parseFloat(values.rate || values.r || '0');
  const t = parseFloat(values.time || values.t || '0');
  const interest = p * (r / 100) * t;
  const total = p + interest;
  return [{ label: 'Total Interest', value: interest.toFixed(2), isPrimary: true }, { label: 'Total Value', value: total.toFixed(2) }];
}

export function calculateSavingsGoal(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const goal = parseFloat(values.goal || '0');
  const init = parseFloat(values.initial || '0');
  const m = parseFloat(values.months || '1');
  const r = parseFloat(values.rate || '0') / 100 / 12;
  const amountToSave = goal - (init * Math.pow(1 + r, m));
  const monthly = amountToSave > 0 ? (amountToSave * r) / (Math.pow(1 + r, m) - 1) : 0;
  return [{ label: 'Monthly Savings Required', value: monthly.toFixed(2), isPrimary: true }];
}

export function calculateDiscount(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const p = parseFloat(values.price || '0');
  const d = parseFloat(values.discountPercent || '0');
  const t = parseFloat(values.taxPercent || '0');
  const discountAmt = p * (d / 100);
  const afterDiscount = p - discountAmt;
  const taxAmt = afterDiscount * (t / 100);
  const finalPrice = afterDiscount + taxAmt;
  return [{ label: 'Final Price', value: finalPrice.toFixed(2), isPrimary: true }, { label: 'You Saved', value: discountAmt.toFixed(2) }];
}

export function calculateDateDiff(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const s = new Date(values.startDate);
  const e = new Date(values.endDate);
  if(isNaN(s.getTime()) || isNaN(e.getTime())) return [];
  const diffTime = Math.abs(e.getTime() - s.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return [{ label: 'Days Difference', value: diffDays.toString(), isPrimary: true }];
}

export function calculateWorldClock(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const offset = parseFloat(values.offset || '0');
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const targetDate = new Date(utc + (3600000 * offset));
  return [{ label: 'Local Time', value: targetDate.toLocaleTimeString(), isPrimary: true }];
}

export function calculateLease(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const p = parseFloat(values.price || '0');
  const r = parseFloat(values.residual || '0');
  const mf = parseFloat(values.moneyFactor || '0');
  const m = parseFloat(values.months || '1');
  if(m === 0) return [];
  const dep = (p - r) / m;
  const fin = (p + r) * mf;
  return [{ label: 'Monthly Payment', value: (dep + fin).toFixed(2), isPrimary: true }];
}

export function calculateCarLease(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  return calculateLease(values);
}

export function calculateHELOC(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const v = parseFloat(values.homeValue || '0');
  const m = parseFloat(values.mortgage || '0');
  const max = parseFloat(values.maxLtv || '80') / 100;
  const limit = (v * max) - m;
  return [{ label: 'Max Borrowing Limit', value: Math.max(0, limit).toFixed(2), isPrimary: true }];
}

export function calculateExponent(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const b = parseFloat(values.base || '0');
  const e = parseFloat(values.exponent || '0');
  return [{ label: 'Result', value: Math.pow(b, e).toString(), isPrimary: true }];
}

export function calculateLogarithm(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const b = parseFloat(values.base || '10');
  const v = parseFloat(values.value || '100');
  if(b <= 0 || b === 1 || v <= 0) return [];
  return [{ label: 'Result', value: (Math.log(v) / Math.log(b)).toFixed(4), isPrimary: true }];
}

export function calculateBasalMetabolic(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const w = parseFloat(values.weight || '70');
  const h = parseFloat(values.height || '175');
  const a = parseFloat(values.age || '30');
  const m = parseFloat(values.isMale || '1') === 1;
  const bmr = m ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
  return [{ label: 'BMR (kcal/day)', value: bmr.toFixed(0), isPrimary: true }];
}

export function calculateWaistHip(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const w = parseFloat(values.waist || '0');
  const h = parseFloat(values.hip || '1');
  if(h===0) return [];
  return [{ label: 'Ratio', value: (w / h).toFixed(2), isPrimary: true }];
}

export function calculateBinary(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const d = parseInt(values.decimal || '0', 10);
  if(isNaN(d)) return [];
  return [{ label: 'Binary', value: d.toString(2), isPrimary: true }];
}

export function calculatePasswordStrength(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const len = parseInt(values.len || '0', 10);
  let complexity = len;
  if(parseInt(values.upper || '0', 10)) complexity += 5;
  if(parseInt(values.numbers || '0', 10)) complexity += 5;
  if(parseInt(values.symbols || '0', 10)) complexity += 10;
  
  let label = 'Weak';
  if (complexity > 30) label = 'Strong';
  else if (complexity > 20) label = 'Moderate';
  return [{ label: 'Score', value: complexity.toString(), isPrimary: true }, { label: 'Strength', value: label }];
}

export function calculateCountdown(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const t = new Date(values.targetDate);
  if(isNaN(t.getTime())) return [];
  const diffTime = t.getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return [{ label: 'Days Remaining', value: diffDays.toString(), isPrimary: true }];
}

export function calculateSalaryComparison(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const sA = parseFloat(values.salaryA || '0');
  const sB = parseFloat(values.salaryB || '0');
  const cA = parseFloat(values.colA || '100');
  const cB = parseFloat(values.colB || '100');
  const adjA = sA * (100 / cA);
  const adjB = sB * (100 / cB);
  return [{ label: 'Adjusted Salary A', value: adjA.toFixed(2), isPrimary: true }, { label: 'Adjusted Salary B', value: adjB.toFixed(2) }];
}

export function calculateStudentLoan(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const p = parseFloat(values.amount || '0');
  const r = parseFloat(values.rate || '0') / 100 / 12;
  const m = parseFloat(values.term || '1');
  const payment = r === 0 ? p / m : (p * r) / (1 - Math.pow(1 + r, -m));
  return [{ label: 'Monthly Payment', value: payment.toFixed(2), isPrimary: true }];
}

export function calculateUnitConverter(values: Record<string, any>): import('../../types.ts').CalculationResult[] {
  const v = parseFloat(values.value || '0');
  return [{ label: 'Converted', value: v.toString(), isPrimary: true, explanation: 'Basic converter stub - assumes 1:1 if not mapped.' }];
}
