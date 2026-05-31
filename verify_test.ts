import fs from 'fs';

const detailCode = fs.readFileSync('src/pages/CalculatorDetail.tsx', 'utf8');

const logicMapMatch = detailCode.match(/const LOGIC_MAP: Record<string, [^>]+> = \{([\s\S]*?)^\};/m);
const inputMapMatch = detailCode.match(/const INPUT_MAP: Record<string, [^>]+> = \{([\s\S]*?)^\};/m);

const logicKeysMatch = detailCode.match(/const LOGIC_MAP[\s\S]*?=\{([\s\S]*?)\n\};\n\nconst INPUT_MAP/);
const inputKeysMatch = detailCode.match(/const INPUT_MAP[\s\S]*?=\{([\s\S]*?)\n\};\n\nexport function /);

console.log("Parsing keys from CalculatorDetail.tsx...")

let logicText = logicKeysMatch ? logicKeysMatch[1] : '';
let inputText = inputKeysMatch ? inputKeysMatch[1] : '';

// Just simple regex to extract keys:
const logicKeys = new Set([...logicText.matchAll(/'([^']+)'\s*:/g)].map(m => m[1]));
const inputKeys = new Set([...inputText.matchAll(/'([^']+)'\s*:/g)].map(m => m[1]));

const constantsCode = fs.readFileSync('src/constants.ts', 'utf8');
const constantsMatch = constantsCode.match(/id: '([^']+)'/g);
const ids = constantsMatch ? constantsMatch.map(s => s.replace(/id: '|'/g, '')) : [];

console.log('Total calculators in constants:', ids.length);
console.log('Calculators with logic:', logicKeys.size);
console.log('Calculators with inputs:', inputKeys.size);

const missingLogic = ids.filter(id => !logicKeys.has(id));
const missingInputs = ids.filter(id => !inputKeys.has(id));

console.log('Missing Logic:', missingLogic.length > 0 ? missingLogic : 'None! ✨');
console.log('Missing Inputs:', missingInputs.length > 0 ? missingInputs : 'None! ✨');
