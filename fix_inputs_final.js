import fs from 'fs';

let content = fs.readFileSync('src/pages/CalculatorDetail.tsx', 'utf8');

const repairs = {
  'percentage': [ { label: 'Value A', name: 'valA', type: 'number', defaultValue: 50 }, { label: 'Value B', name: 'valB', type: 'number', defaultValue: 100 }, { label: 'Operation', name: 'operation', type: 'select', defaultValue: 'percentage_of', options: [ { label: 'What is P% of V?', value: 'percentage_of' }, { label: 'X is what % of Y?', value: 'what_percent' }, { label: 'Percentage Increase', value: 'increase' }, { label: 'Percentage Decrease', value: 'decrease' } ] } ],
  'body-fat': [ { label: 'Male=1, Female=0', name: 'gender', type: 'number', defaultValue: 1 }, { label: 'Age', name: 'age', type: 'number', defaultValue: 30 }, { label: 'Weight (kg)', name: 'weight', type: 'number', defaultValue: 75 }, { label: 'Height (cm)', name: 'height', type: 'number', defaultValue: 175 }, { label: 'Neck (cm)', name: 'neck', type: 'number', defaultValue: 40 }, { label: 'Waist (cm)', name: 'waist', type: 'number', defaultValue: 85 }, { label: 'Hip (cm)', name: 'hip', type: 'number', defaultValue: 100 } ],
  'discount': [ { label: 'Original Price', name: 'price', type: 'number', defaultValue: 100 }, { label: 'Discount %', name: 'discountPercent', type: 'number', defaultValue: 20 }, { label: 'Sales Tax %', name: 'taxPercent', type: 'number', defaultValue: 5 } ],
  'unit-converter': [ { label: 'Value', name: 'value', type: 'number', defaultValue: 1 }, { label: 'From Unit', name: 'fromUnit', type: 'select', defaultValue: 'cm', options: [{label:'cm', value:'cm'},{label:'m', value:'m'},{label:'km', value:'km'},{label:'inch', value:'inch'},{label:'ft', value:'ft'},{label:'lb', value:'lb'},{label:'kg', value:'kg'}] }, { label: 'To Unit', name: 'toUnit', type: 'select', defaultValue: 'inch', options: [{label:'cm', value:'cm'},{label:'m', value:'m'},{label:'km', value:'km'},{label:'inch', value:'inch'},{label:'ft', value:'ft'},{label:'lb', value:'lb'},{label:'kg', value:'kg'}] } ],
  'date-diff': [ { label: 'Start Date', name: 'startDate', type: 'date', defaultValue: '2023-01-01' }, { label: 'End Date', name: 'endDate', type: 'date', defaultValue: '2023-12-31' } ],
  'simple-interest': [ { label: 'Principal', name: 'principal', type: 'number', defaultValue: 1000 }, { label: 'Rate (%)', name: 'rate', type: 'number', defaultValue: 5 }, { label: 'Time (Yrs)', name: 'time', type: 'number', defaultValue: 2 } ],
  'student-loan': [ { label: 'Loan Amount', name: 'amount', type: 'number', defaultValue: 30000 }, { label: 'Interest Rate (%)', name: 'rate', type: 'number', defaultValue: 5 }, { label: 'Term (Months)', name: 'term', type: 'number', defaultValue: 120 } ],
  'salary-comparison': [ { label: 'Salary A', name: 'salaryA', type: 'number', defaultValue: 50000 }, { label: 'Salary B', name: 'salaryB', type: 'number', defaultValue: 60000 }, { label: 'Cost of Living Index A', name: 'colA', type: 'number', defaultValue: 100 }, { label: 'Cost of Living Index B', name: 'colB', type: 'number', defaultValue: 120 } ],
  'password-strength': [ { label: 'Password Length', name: 'len', type: 'number', defaultValue: 12 }, { label: 'Include Uppercase (1/0)', name: 'upper', type: 'number', defaultValue: 1 }, { label: 'Include Numbers (1/0)', name: 'numbers', type: 'number', defaultValue: 1 }, { label: 'Include Symbols (1/0)', name: 'symbols', type: 'number', defaultValue: 1 } ],
  'binary': [ { label: 'Decimal Value', name: 'decimal', type: 'number', defaultValue: 15 } ],
  'countdown': [ { label: 'Target Date', name: 'targetDate', type: 'date', defaultValue: '2030-01-01' } ],
  'savings-goal': [ { label: 'Goal Amount', name: 'goal', type: 'number', defaultValue: 10000 }, { label: 'Initial Amount', name: 'initial', type: 'number', defaultValue: 1000 }, { label: 'Time (Months)', name: 'months', type: 'number', defaultValue: 24 }, { label: 'Interest Rate', name: 'rate', type: 'number', defaultValue: 3 } ],
  'water-intake': [ { label: 'Weight (kg)', name: 'weight', type: 'number', defaultValue: 70 }, { label: 'Exercise (min)', name: 'exercise', type: 'number', defaultValue: 30 } ],
  'basal-metabolic': [ { label: 'Weight (kg)', name: 'weight', type: 'number', defaultValue: 70 }, { label: 'Height (cm)', name: 'height', type: 'number', defaultValue: 175 }, { label: 'Age (yr)', name: 'age', type: 'number', defaultValue: 30 }, { label: 'Is Male', name: 'isMale', type: 'number', defaultValue: 1 } ],
  'lease': [ { label: 'Car Price', name: 'price', type: 'number', defaultValue: 30000 }, { label: 'Residual Value', name: 'residual', type: 'number', defaultValue: 15000 }, { label: 'Money Factor', name: 'moneyFactor', type: 'number', defaultValue: 0.001 }, { label: 'Term (Months)', name: 'months', type: 'number', defaultValue: 36 } ],
  'car-lease': [ { label: 'Car Price', name: 'price', type: 'number', defaultValue: 30000 }, { label: 'Residual Value', name: 'residual', type: 'number', defaultValue: 15000 }, { label: 'Money Factor', name: 'moneyFactor', type: 'number', defaultValue: 0.001 }, { label: 'Term (Months)', name: 'months', type: 'number', defaultValue: 36 } ],
  'dividend': [ { label: 'Dividend per Share', name: 'dividend', type: 'number', defaultValue: 2 }, { label: 'Stock Price', name: 'price', type: 'number', defaultValue: 50 }, { label: 'Shares Owned', name: 'shares', type: 'number', defaultValue: 100 } ],
  'probability': [ { label: 'Event Outcomes', name: 'event', type: 'number', defaultValue: 1 }, { label: 'Total Outcomes', name: 'total', type: 'number', defaultValue: 6 } ],
  'heloc': [ { label: 'Home Value', name: 'homeValue', type: 'number', defaultValue: 300000 }, { label: 'Mortgage Balance', name: 'mortgage', type: 'number', defaultValue: 150000 }, { label: 'Max LTV (%)', name: 'maxLtv', type: 'number', defaultValue: 80 } ],
  'logarithm': [ { label: 'Base', name: 'base', type: 'number', defaultValue: 10 }, { label: 'Value', name: 'value', type: 'number', defaultValue: 100 } ],
  'exponent': [ { label: 'Base', name: 'base', type: 'number', defaultValue: 2 }, { label: 'Exponent', name: 'exponent', type: 'number', defaultValue: 3 } ],
  'waist-hip': [ { label: 'Waist (cm)', name: 'waist', type: 'number', defaultValue: 80 }, { label: 'Hip (cm)', name: 'hip', type: 'number', defaultValue: 100 } ],
  'world-clock': [ { label: 'Offset Hours', name: 'offset', type: 'number', defaultValue: -5 } ]
};

let startIdx = content.indexOf('const INPUT_MAP: Record<string, CalculationInput[]> = {');
let endIdx = content.indexOf('export function CalculatorDetail()', startIdx);
let inputMapStr = content.substring(startIdx, endIdx);

// Convert `repairs` into string map
for (const [key, arr] of Object.entries(repairs)) {
  // It's much easier to literally find the `'key': [` and its matching `],` in string
  const keyStart = inputMapStr.indexOf("'" + key + "': [");
  if (keyStart !== -1) {
    let brackets = 0;
    let curr = keyStart + ("'" + key + "': [").length - 1; // start at '['
    let keyEnd = -1;
    for(let i = curr; i < inputMapStr.length; i++) {
        if(inputMapStr[i] === '[') brackets++;
        else if (inputMapStr[i] === ']') {
            brackets--;
            if (brackets === 0) {
                keyEnd = i + 1;
                if(inputMapStr[keyEnd] === ',') keyEnd++;
                break;
            }
        }
    }
    
    if (keyEnd !== -1) {
       const replaceStr = "\\n  '" + key + "': " + JSON.stringify(arr, null, 2).replace(/\\n/g, '\\n  ') + ",";
       inputMapStr = inputMapStr.substring(0, keyStart) + replaceStr + inputMapStr.substring(keyEnd);
    }
  }
}

let newContent = content.substring(0, startIdx) + inputMapStr + content.substring(endIdx);
fs.writeFileSync('src/pages/CalculatorDetail.tsx', newContent);
console.log('Fixed via bracket counting');

