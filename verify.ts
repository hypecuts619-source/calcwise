import { CALCULATORS } from './src/constants.ts';
import fs from 'fs';

const detailCode = fs.readFileSync('./src/pages/CalculatorDetail.tsx', 'utf8');

const constantsIds = CALCULATORS.map(c => c.id);

console.log('Total array items in CALCULATORS:', constantsIds.length);
// Filter out categories defined in constants
const ids = constantsIds.filter(id => !['finance', 'investment', 'tax', 'business', 'math', 'health', 'lifestyle'].includes(id));
console.log('Total actual calculator IDs:', ids.length);

const missingLogic = [];
const missingInputs = [];

for (const id of ids) {
    if (!detailCode.includes(`'${id}': Logic.`)) {
        if (!detailCode.includes(`'${id}':`)) {
             missingLogic.push(id);
        }
    }
    if (!detailCode.includes(`'${id}': [`)) {
        missingInputs.push(id);
    }
}
console.log('Missing Logic:', missingLogic);
console.log('Missing Inputs:', missingInputs);
