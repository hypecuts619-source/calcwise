const fs = require('fs');

const logicFile = fs.readFileSync('src/lib/calculatorLogic.ts', 'utf8');
const exportedFuncs = [];
let m;
const re = /export (?:function |const )([a-zA-Z0-9_]+)/g;
while ((m = re.exec(logicFile)) !== null) {
  exportedFuncs.push(m[1]);
}

const cMatch = fs.readFileSync('src/constants.ts', 'utf8').match(/id:\s*'([^']+)'/g);
const ids = cMatch.map(s => s.match(/'([^']+)'/)[1]);

const mappingStrLines = ids.map(id => {
  if (['finance', 'investment', 'tax', 'business', 'math', 'health', 'lifestyle'].includes(id)) return null;

  let fn1 = 'calculate_' + id.replace(/-/g, '_');
  let upperId = id.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  let fn2 = 'calculate' + upperId;

  let matchedFn = exportedFuncs.find(f => f.toLowerCase() === fn1.toLowerCase() || f.toLowerCase() === fn2.toLowerCase());
  
  if (id === 'loan-emi') matchedFn = 'calculateEMI';
  if (id === 'basal-metabolic') matchedFn = 'calculateBasalMetabolic';
  if (id === 'waist-hip') matchedFn = 'calculateWaistHip';
  if (id === 'car-lease') matchedFn = 'calculateCarLease';
  if (id === 'student-loan') matchedFn = 'calculateStudentLoan';
  if (id === 'credit-card-payoff') matchedFn = 'calculateCreditCardPayoff';
  if (id === 'auto-loan') matchedFn = 'calculateAutoLoan';
  if (id === 'retirement') matchedFn = 'calculateRetirement';
  if (id === 'sip') matchedFn = 'calculateSIP';
  if (id === 'compound-interest') matchedFn = 'calculateCompoundInterest';
  if (id === 'roi') matchedFn = 'calculateROI';
  if (id === 'inflation') matchedFn = 'calculateInflation';
  if (id === 'cagr') matchedFn = 'calculateCAGR';
  if (id === 'income-tax') matchedFn = 'calculateIncomeTax';
  if (id === 'sales-tax') matchedFn = 'calculate_sales_tax';
  if (id === 'capital-gains') matchedFn = 'calculateCapitalGains';
  if (id === 'hourly-wage') matchedFn = 'calculateHourlyWage';
  if (id === 'markup') matchedFn = 'calculateMarkup';
  if (id === 'margin') matchedFn = 'calculateMargin';
  if (id === 'break-even') matchedFn = 'calculateBreakEven';
  if (id === 'discount') matchedFn = 'calculateDiscount';
  if (id === 'percentage') matchedFn = 'calculatePercentage';
  if (id === 'bmi') matchedFn = 'calculateBMI';
  if (id === 'bmr') matchedFn = 'calculateBMR';
  if (id === 'ideal-weight') matchedFn = 'calculate_ideal_weight';
  if (id === 'calories-burned') matchedFn = 'calculateCaloriesBurned';
  if (id === 'pregnancy-due') matchedFn = 'calculatePregnancyDue'; // Wait, let's just do search fallback

  if (!matchedFn) {
      const partialMatch = exportedFuncs.find(f => f.toLowerCase().includes(id.replace(/-/g, '').toLowerCase()));
      if (partialMatch) matchedFn = partialMatch;
  }
  
  if (matchedFn) {
    return `  '${id}': Logic.${matchedFn},`;
  } else {
    // Generate dummy function for it to not crash
    return `  '${id}': () => [{ label: 'Result', value: 'Not Implemented' }],`;
  }
}).filter(Boolean);

let result = `const LOGIC_MAP: Record<string, (values: Record<string, any>) => any> = {\n` + mappingStrLines.join('\n') + `\n};`;

let calcdet = fs.readFileSync('src/pages/CalculatorDetail.tsx', 'utf8');
calcdet = calcdet.replace(/const LOGIC_MAP: Record<string, \(values: Record<string, any>\) => any> = \{[\s\S]*?\n\};/, result);

fs.writeFileSync('src/pages/CalculatorDetail.tsx', calcdet);
console.log('Done fixing LOGIC_MAP');
