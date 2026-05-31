import { CalculationResult } from '../../types.ts';

/**
 * Calorie Calculator (TDEE)
 */
export function calculateCalorie(values: Record<string, any>): CalculationResult[] {
  const { weight, height, age, gender, activity = 1.2 } = values;
  if (!weight || !height || !age) return [];

  // Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') bmr += 5;
  else bmr -= 161;

  const tdee = bmr * activity;

  return [
    { label: 'Maintain Weight', value: `${Math.round(tdee)} kcal`, isPrimary: true },
    { label: 'Weight Loss (0.5kg/wk)', value: `${Math.round(tdee - 500)} kcal` },
    { label: 'Weight Gain (0.5kg/wk)', value: `${Math.round(tdee + 500)} kcal` },
    { label: 'Basal Metabolic Rate', value: `${Math.round(bmr)} kcal` }
  ];
}

/**
 * Ideal Weight (Devine Formula)
 */
export function calculateIdealWeight(values: Record<string, any>): CalculationResult[] {
  const { height, gender } = values;
  if (!height) return [];

  const hInches = height / 2.54;
  const over5ft = Math.max(0, hInches - 60);
  let ideal = 0;

  if (gender === 'male') ideal = 50 + 2.3 * over5ft;
  else ideal = 45.5 + 2.3 * over5ft;

  return [
    { label: 'Ideal Weight', value: `${ideal.toFixed(1)} kg`, isPrimary: true },
    { label: 'Healthy Range', value: `${(ideal * 0.9).toFixed(1)}kg - ${(ideal * 1.1).toFixed(1)}kg` }
  ];
}

/**
 * Water Intake
 */
export function calculateWaterIntake(values: Record<string, any>): CalculationResult[] {
    const { weight, activity = 0 } = values;
    if (!weight) return [];
    
    // Base: 33ml per kg + 500ml per 30min activity
    const daily = (weight * 33) + (activity * 500 / 30);
    return [
        { label: 'Daily Water Needs', value: `${(daily / 1000).toFixed(2)} Liters`, isPrimary: true },
        { label: 'Number of Glasses', value: `${Math.ceil(daily / 250)} (250ml each)` }
    ];
}
