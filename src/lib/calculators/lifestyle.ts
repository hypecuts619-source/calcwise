import { CalculationResult } from '../../types.ts';
import { formatCurrency } from '../utils.ts';

/**
 * Tip Calculator
 */
export function calculateTip(values: Record<string, any>): CalculationResult[] {
  const { bill, tipPercent, split = 1, currencySymbol = '$' } = values;
  if (!bill) return [];

  const tipAmount = (bill * tipPercent) / 100;
  const total = bill + tipAmount;
  const perPerson = total / split;

  return [
    { label: 'Total Tip', value: formatCurrency(tipAmount, currencySymbol), isPrimary: true },
    { label: 'Total Bill', value: formatCurrency(total, currencySymbol) },
    { label: 'Per Person', value: formatCurrency(perPerson, currencySymbol) }
  ];
}

/**
 * Fuel Cost
 */
export function calculateFuelCost(values: Record<string, any>): CalculationResult[] {
    const { distance, efficiency, fuelPrice, currencySymbol = '$' } = values;
    if (!distance || !efficiency || !fuelPrice) return [];
    
    // efficiency in km/l or mpg
    const fuelNeeded = distance / efficiency;
    const totalCost = fuelNeeded * fuelPrice;
    
    return [
        { label: 'Total Fuel Cost', value: formatCurrency(totalCost, currencySymbol), isPrimary: true },
        { label: 'Fuel Needed', value: `${fuelNeeded.toFixed(2)} units` }
    ];
}
