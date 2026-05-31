import { CalculationResult } from '../../types.ts';

/**
 * Basic Scientific Eval
 */
export function calculateScientific(values: Record<string, any>): CalculationResult[] {
    const { expression } = values;
    if (!expression) return [];
    try {
        // Safe evaluation would be better, but for demo:
        // eslint-disable-next-line no-eval
        const res = eval(expression.replace(/[^-()\d/*+.]/g, ''));
        return [{ label: 'Result', value: res.toString(), isPrimary: true }];
    } catch {
        return [{ label: 'Result', value: 'Invalid Expression' }];
    }
}

/**
 * Probability
 */
export function calculateProbability(values: Record<string, any>): CalculationResult[] {
    const { favorable, total } = values;
    if (favorable === undefined || !total) return [];
    const p = (favorable / total) * 100;
    return [
        { label: 'Probability', value: `${p.toFixed(2)}%`, isPrimary: true },
        { label: 'Odds', value: `1 in ${(total / favorable).toFixed(1)}` }
    ];
}

/**
 * Statistics (Mean, Median, Mode)
 */
export function calculateStats(values: Record<string, any>): CalculationResult[] {
    const { data } = values;
    if (!data) return [];
    const numbers = data.split(',').map((n: string) => parseFloat(n.trim())).filter((n: number) => !isNaN(n));
    if (numbers.length === 0) return [];

    const sum = numbers.reduce((a: number, b: number) => a + b, 0);
    const mean = sum / numbers.length;
    const sorted = [...numbers].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0 
        ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2 
        : sorted[Math.floor(sorted.length/2)];

    return [
        { label: 'Mean (Average)', value: mean.toFixed(2), isPrimary: true },
        { label: 'Median', value: median.toFixed(2) },
        { label: 'Count', value: numbers.length.toString() }
    ];
}

/**
 * Circle Area
 */
export function calculateCircleArea(values: Record<string, any>): CalculationResult[] {
    const { radius } = values;
    if (!radius) return [];
    const area = Math.PI * radius * radius;
    const circumference = 2 * Math.PI * radius;
    return [
        { label: 'Area', value: area.toFixed(2), isPrimary: true },
        { label: 'Circumference', value: circumference.toFixed(2) }
    ];
}

/**
 * Unit Conversion (Length)
 */
export function calculateLengthConv(values: Record<string, any>): CalculationResult[] {
    const { val, fromUnit, toUnit } = values;
    if (val === undefined) return [];
    
    // Meters base
    const rates: Record<string, number> = {
        m: 1, km: 0.001, cm: 100, mm: 1000, inch: 39.3701, ft: 3.28084, yard: 1.09361, mile: 0.000621371
    };
    
    const meters = val / rates[fromUnit];
    const result = meters * rates[toUnit];
    
    return [{ label: 'Converted Value', value: result.toFixed(4), isPrimary: true }];
}
