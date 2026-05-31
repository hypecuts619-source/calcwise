import fs from 'fs';

let detailCode = fs.readFileSync('src/pages/CalculatorDetail.tsx', 'utf8');

const missingLogic = [
  'simple-interest', 'savings-goal',
  'discount',        'date-diff',
  'world-clock',     'fraction-decimal',
  'lease',           'heloc',
  'exponent',        'logarithm',
  'basal-metabolic', 'waist-hip',
  'binary',          'password-strength',
  'countdown',       'salary-comparison',
  'car-lease',       'student-loan',
  'macros',          'unit-converter'
];

const mockMappings = missingLogic.map(id => `  '${id}': Logic.calculateScientific,`).join('\n');

const mockInputs = missingLogic.map(id => `  '${id}': [
    { label: 'Input 1', name: 'val1', type: 'number', defaultValue: 100 },
  ],`).join('\n');

detailCode = detailCode.replace(/(const LOGIC_MAP: Record<string, [^>]+> = \{)/, `$1\n${mockMappings}`);
detailCode = detailCode.replace(/(const INPUTS_CONFIG: Record<string, CalculationInput\[\]> = \{)/, `$1\n${mockInputs}`);

fs.writeFileSync('src/pages/CalculatorDetail.tsx.new', detailCode);
