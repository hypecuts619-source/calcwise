import { CalculationResult } from '../../types.ts';
import { formatCurrency, formatNumber } from '../utils.ts';

/**
 * Profit Margin
 */
export function calculateProfitMargin(values: Record<string, any>): CalculationResult[] {
  const { revenue, cost, currencySymbol = '$' } = values;
  if (!revenue || !cost) return [];

  const profit = revenue - cost;
  const margin = (profit / revenue) * 100;

  return [
    { 
      label: 'Gross Profit', 
      value: formatCurrency(profit, currencySymbol), 
      isPrimary: true,
      explanation: `By subtracting your total costs (${formatCurrency(cost, currencySymbol)}) from your revenue (${formatCurrency(revenue, currencySymbol)}), you are left with a gross profit of ${formatCurrency(profit, currencySymbol)}. This results in a profit margin of ${margin.toFixed(2)}%, meaning you keep ${formatCurrency(margin / 100, currencySymbol)} for every ${formatCurrency(1, currencySymbol)} earned.`
    },
    { label: 'Profit Margin', value: `${margin.toFixed(2)}%` },
  ];
}

/**
 * Break-Even Point
 */
export function calculateBreakEven(values: Record<string, any>): CalculationResult[] {
  const { fixedCosts, pricePerUnit, variableCostPerUnit, currencySymbol = '$' } = values;
  if (!fixedCosts || !pricePerUnit || !variableCostPerUnit) return [];

  const contributionMargin = pricePerUnit - variableCostPerUnit;
  if (contributionMargin <= 0) return [{ label: 'Error', value: 'Check unit costs', helpText: 'Unit price must be > variable cost' }];

  const units = fixedCosts / contributionMargin;
  const revenue = units * pricePerUnit;

  return [
    { label: 'Break-Even Units', value: Math.ceil(units).toString(), isPrimary: true },
    { label: 'Break-Even Revenue', value: formatCurrency(revenue, currencySymbol) },
  ];
}

/**
 * GST / VAT
 */
export function calculateGST(values: Record<string, any>): CalculationResult[] {
  const { amount, rate, currencySymbol = '$' } = values;
  if (!amount || !rate) return [];

  const tax = (amount * rate) / 100;
  const total = amount + tax;

  return [
    { label: 'Total Amount', value: formatCurrency(total, currencySymbol), isPrimary: true },
    { label: 'Tax Amount', value: formatCurrency(tax, currencySymbol) },
    { label: 'Base Amount', value: formatCurrency(amount, currencySymbol) },
  ];
}

/**
 * Hourly to Annual Salary
 */
export function calculateSalary(values: Record<string, any>): CalculationResult[] {
    const { hourlyRate, hoursPerWeek = 40, weeksPerYear = 52, currencySymbol = '$' } = values;
    if (!hourlyRate) return [];

    const annual = hourlyRate * hoursPerWeek * weeksPerYear;
    const monthly = annual / 12;

    return [
        { label: 'Annual Salary', value: formatCurrency(annual, currencySymbol), isPrimary: true },
        { label: 'Monthly Gross', value: formatCurrency(monthly, currencySymbol) },
        { label: 'Weekly Gross', value: formatCurrency(hourlyRate * hoursPerWeek, currencySymbol) }
    ];
}

/**
 * Return on Investment (ROI)
 */
export function calculateROI(values: Record<string, any>): CalculationResult[] {
    const { cost, revenue, currencySymbol = '$' } = values;
    if (!cost || !revenue) return [];
    
    const profit = revenue - cost;
    const roi = (profit / cost) * 100;
    
    return [
        { label: 'ROI', value: `${roi.toFixed(2)}%`, isPrimary: true },
        { label: 'Net Profit', value: formatCurrency(profit, currencySymbol) },
        { label: 'Investment Gain', value: `${(revenue / cost).toFixed(2)}x` }
    ];
}

/**
 * Markup Calculator
 */
export function calculateMarkup(values: Record<string, any>): CalculationResult[] {
    const { cost, revenue, currencySymbol = '$' } = values;
    if (!cost || !revenue) return [];
    
    const profit = revenue - cost;
    const markup = (profit / cost) * 100;
    const margin = (profit / revenue) * 100;
    
    return [
        { label: 'Markup', value: `${markup.toFixed(2)}%`, isPrimary: true },
        { label: 'Gross Profit', value: formatCurrency(profit, currencySymbol) },
        { label: 'Profit Margin', value: `${margin.toFixed(2)}%` }
    ];
}

/**
 * Customer Lifetime Value (LTV)
 */
export function calculateLTV(values: Record<string, any>): CalculationResult[] {
    const { avgOrderValue, purchaseFrequency, lifespanYears, currencySymbol = '$' } = values;
    if (!avgOrderValue || !purchaseFrequency || !lifespanYears) return [];
    
    const ltv = avgOrderValue * purchaseFrequency * lifespanYears;
    return [{ label: 'Customer LTV', value: formatCurrency(ltv, currencySymbol), isPrimary: true }];
}

/**
 * Markup to Margin Conversion
 */
export function calculateMarkupMargin(values: Record<string, any>): CalculationResult[] {
    const { markup, margin } = values;
    
    if (markup) {
        const calculatedMargin = (markup / (100 + markup)) * 100;
        return [
            { label: 'Calculated Margin', value: `${calculatedMargin.toFixed(2)}%`, isPrimary: true },
            { label: 'Original Markup', value: `${markup}%` }
        ];
    } else if (margin) {
        const calculatedMarkup = (margin / (100 - margin)) * 100;
        return [
            { label: 'Calculated Markup', value: `${calculatedMarkup.toFixed(2)}%`, isPrimary: true },
            { label: 'Original Margin', value: `${margin}%` }
        ];
    }
    return [];
}

/**
 * Inventory Turnover
 */
export function calculateInventoryTurn(values: Record<string, any>): CalculationResult[] {
    const { cogs, avgInventory } = values;
    if (!cogs || !avgInventory) return [];
    
    const turnover = cogs / avgInventory;
    const days = 365 / turnover;
    
    return [
        { label: 'Inventory Turnover', value: `${turnover.toFixed(2)}x`, isPrimary: true },
        { label: 'Days Sales in Inventory', value: `${days.toFixed(0)} Days` }
    ];
}

/**
 * Customer Retention Rate
 */
export function calculateRetention(values: Record<string, any>): CalculationResult[] {
    const { startCustomers, endCustomers, newCustomers } = values;
    if (!startCustomers || !endCustomers) return [];
    
    const retention = ((endCustomers - (newCustomers || 0)) / startCustomers) * 100;
    const churn = 100 - retention;
    
    return [
        { label: 'Retention Rate', value: `${retention.toFixed(1)}%`, isPrimary: true },
        { label: 'Churn Rate', value: `${churn.toFixed(1)}%` }
    ];
}

/**
 * Sales Commission
 */
export function calculateCommission(values: Record<string, any>): CalculationResult[] {
    const { salesAmount, commissionRate, currencySymbol = '$' } = values;
    if (!salesAmount || !commissionRate) return [];
    
    const commission = (salesAmount * commissionRate) / 100;
    return [
        { label: 'Commission Earned', value: formatCurrency(commission, currencySymbol), isPrimary: true },
        { label: 'Net Sales', value: formatCurrency(salesAmount - commission, currencySymbol) }
    ];
}

/**
 * Customer Acquisition Cost (CAC)
 */
export function calculateCAC(values: Record<string, any>): CalculationResult[] {
    const { totalMarketingSpend, customersAcquired, currencySymbol = '$' } = values;
    if (!totalMarketingSpend || !customersAcquired) return [];
    
    const cac = totalMarketingSpend / customersAcquired;
    return [{ label: 'CAC', value: formatCurrency(cac, currencySymbol), isPrimary: true }];
}
