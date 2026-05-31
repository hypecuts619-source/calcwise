import * as fs from 'fs';
import { CALCULATORS } from './src/constants.ts';

const detailCode = fs.readFileSync('./src/pages/CalculatorDetail.tsx', 'utf8');

const missingItems = CALCULATORS.filter(c => {
    if (['finance', 'investment', 'tax', 'business', 'math', 'health', 'lifestyle'].includes(c.id)) return false;
    return !detailCode.includes(`'${c.id}': Logic.`) || !detailCode.includes(`'${c.id}': [`);
}).map(c => c.id);

console.log('We need to add inputs and logic for:', missingItems);

function toCamelCase(str) {
  return str.split('-').map((word, index) => {
    if (index === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
}

let logicToAdd = '';
let inputsToAdd = '';

for (const id of missingItems) {
    if (!detailCode.includes(`'${id}': Logic.`)) {
        logicToAdd += `  '${id}': Logic.calculateScientific,\n`;
    }
    if (!detailCode.includes(`'${id}': [`)) {
        inputsToAdd += `  '${id}': [\n    { label: 'Value 1', name: 'val1', type: 'number', defaultValue: 100 },\n    { label: 'Value 2', name: 'val2', type: 'number', defaultValue: 50 },\n  ],\n`;
    }
}

if (logicToAdd) {
    console.log("Logic Additions:\n", logicToAdd);
    fs.writeFileSync('logic_add.txt', logicToAdd);
}
if (inputsToAdd) {
    console.log("Inputs Additions:\n", inputsToAdd);
    fs.writeFileSync('inputs_add.txt', inputsToAdd);
}
