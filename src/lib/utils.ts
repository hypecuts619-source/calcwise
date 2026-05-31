import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, symbol: string = '$'): string {
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}

export async function detectCurrency(): Promise<{ symbol: string; code: string }> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Map currency strings to common symbols if possible
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      JPY: '¥',
      AUD: 'A$',
      CAD: 'C$',
      SGD: 'S$',
      AED: 'د.إ',
      CNY: '¥',
    };

    const code = data.currency || 'USD';
    return {
      symbol: symbols[code] || '$',
      code: code
    };
  } catch (error) {
    console.error('Currency detection failed:', error);
    return { symbol: '$', code: 'USD' };
  }
}
