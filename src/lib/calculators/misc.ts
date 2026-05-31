import { CalculationResult } from '../../types.ts';
import { formatNumber } from '../utils.ts';

/**
 * BMI Calculator
 */
export function calculateBMI(values: Record<string, any>): CalculationResult[] {
  const { weight, height, weightUnit = 'kg', heightUnit = 'cm' } = values;
  if (!weight || !height) return [];

  let w = weight;
  let h = height;

  if (weightUnit === 'lbs') w = weight * 0.453592;
  if (heightUnit === 'inches') h = height * 2.54;
  
  const hMeter = h / 100;
  const bmiValue = w / (hMeter * hMeter);
  
  let category = '';
  if (bmiValue < 18.5) category = 'Underweight';
  else if (bmiValue < 25) category = 'Normal';
  else if (bmiValue < 30) category = 'Overweight';
  else category = 'Obese';

  return [
    { 
      label: 'BMI Score', 
      value: bmiValue.toFixed(1), 
      isPrimary: true,
      explanation: `Your calculated Body Mass Index is ${bmiValue.toFixed(1)}, which generally falls into the "${category}" category. According to WHO guidelines, a normal BMI ranges from 18.5 to 24.9.` 
    },
    { label: 'Category', value: category },
    { label: 'Healthy Range', value: `${(18.5 * hMeter * hMeter).toFixed(1)}kg - ${(24.9 * hMeter * hMeter).toFixed(1)}kg` }
  ];
}

/**
 * Percentage Calculator
 */
export function calculatePercentage(values: Record<string, any>): CalculationResult[] {
    const { valA, valB, operation } = values;
    if (valA === undefined || valB === undefined) return [];

    let resultValue = 0;
    switch (operation) {
        case 'percentage_of': resultValue = (valA / 100) * valB; break;
        case 'what_percent': return [{ label: 'Result', value: `${((valA / valB) * 100).toFixed(2)}%`, isPrimary: true }];
        case 'increase': resultValue = valA * (1 + valB / 100); break;
        case 'decrease': resultValue = valA * (1 - valB / 100); break;
    }
    return [{ label: 'Result', value: formatNumber(resultValue), isPrimary: true }];
}

/**
 * GPA Calculator
 */
export function calculateGPA(values: Record<string, any>): CalculationResult[] {
    // simplified version for now, usually needs multiple rows
    const { gradeSum, totalCredits } = values;
    if (!gradeSum || !totalCredits) return [];
    return [{ label: 'GPA', value: (gradeSum / totalCredits).toFixed(2), isPrimary: true }];
}

/**
 * Age Calculator
 */
export function calculateAge(values: Record<string, any>): CalculationResult[] {
    const { dob } = values;
    if (!dob) return [];
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return [{ label: 'Age', value: `${age} Years`, isPrimary: true }];
}
