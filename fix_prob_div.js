import fs from 'fs';

let content = fs.readFileSync('src/pages/CalculatorDetail.tsx', 'utf8');

const repairs = {
  'dividend': [ { label: 'Dividend', name: 'd', type: 'number', defaultValue: 2 }, { label: 'Stock Price', name: 'p', type: 'number', defaultValue: 50 }, { label: 'Shares Owned', name: 'shares', type: 'number', defaultValue: 100 } ],
  'probability': [ { label: 'Favorable Outcomes', name: 'favorable', type: 'number', defaultValue: 1 }, { label: 'Total Outcomes', name: 'total', type: 'number', defaultValue: 6 } ]
};


let startIdx = content.indexOf('const INPUT_MAP: Record<string, CalculationInput[]> = {');
let endIdx = content.indexOf('export function CalculatorDetail()', startIdx);
let inputMapStr = content.substring(startIdx, endIdx);

for (const [key, arr] of Object.entries(repairs)) {
  const keyStart = inputMapStr.indexOf("'" + key + "': [");
  if (keyStart !== -1) {
    let brackets = 0;
    let curr = keyStart + ("'" + key + "': [").length - 1; 
    let keyEnd = -1;
    for(let i = curr; i < inputMapStr.length; i++) {
        if(inputMapStr[i] === '[') brackets++;
        else if (inputMapStr[i] === ']') {
            brackets--;
            if (brackets === 0) {
                keyEnd = i + 1;
                while (inputMapStr[keyEnd] === ' ' || inputMapStr[keyEnd] === '\\n' || inputMapStr[keyEnd] === '\\r' || inputMapStr[keyEnd] === '\\t' || inputMapStr[keyEnd] === '\\n') {
                    keyEnd++;
                }
                if(inputMapStr[keyEnd] === ',') keyEnd++;
                break;
            }
        }
    }
    
    if (keyEnd !== -1) {
       const replaceStr = "\\n  '" + key + "': " + JSON.stringify(arr) + ",";
       inputMapStr = inputMapStr.substring(0, keyStart) + replaceStr + inputMapStr.substring(keyEnd);
       console.log('Replaced', key);
    }
  }
}

let newContent = content.substring(0, startIdx) + inputMapStr + content.substring(endIdx);
fs.writeFileSync('src/pages/CalculatorDetail.tsx', newContent);

