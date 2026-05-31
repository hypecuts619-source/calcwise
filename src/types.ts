export type Category = 
  | 'finance' 
  | 'investment' 
  | 'tax' 
  | 'business' 
  | 'math' 
  | 'health' 
  | 'lifestyle'
  | 'physics'
  | 'construction'
  | 'conversion';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CountryTip {
  region: string;
  tip: string;
}

export interface CalculatorMetadata {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: Category;
  priority: 'P1' | 'P2' | 'P3';
  icon: string; // Lucide icon name
  seoTitle?: string;
  seoDescription?: string;
  howItWorks?: string[];
  formula?: string;
  faqs?: FAQItem[];
  countryTips?: CountryTip[];
  relatedSlugs?: string[];
}

export interface CalculationInput {
  label: string;
  name: string;
  type: 'number' | 'date' | 'select' | 'text' | 'hidden';
  unit?: string;
  defaultValue?: any;
  placeholder?: string;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  condition?: { field: string; value: any };
}

export interface CalculationResult {
  label: string;
  value: string | number;
  isPrimary?: boolean;
  helpText?: string;
  explanation?: string;
  chartData?: any[];
  chartType?: 'pie' | 'bar' | 'line' | 'area';
}
