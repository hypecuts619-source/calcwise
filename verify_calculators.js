import fs from 'fs';

const detailCode = fs.readFileSync('src/pages/CalculatorDetail.tsx', 'utf8');

const logicMapMatch = detailCode.match(/const LOGIC_MAP: Record<string, [^>]+> = \{([\s\S]*?)\};/);
const inputMapMatch = detailCode.match(/const INPUTS_CONFIG: Record<string, CalculationInput\[\]> = \{([\s\S]*?)^\};/m);

const logicKeys = new Set(logicMapMatch ? logicMapMatch[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, '')) : []);
const inputKeys = new Set(inputMapMatch ? inputMapMatch[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, '')) : []);

const constantsCode = fs.readFileSync('src/constants.ts', 'utf8');
const constantsMatch = constantsCode.match(/id: '([^']+)'/g);
const ids = constantsMatch ? constantsMatch.map(s => s.replace(/id: '|'/g, '')) : [];

console.log('Total calculators in constants:', ids.length);

const missingLogic = ids.filter(id => !logicKeys.has(id));
const missingInputs = ids.filter(id => !inputKeys.has(id));

console.log('Missing Logic:', missingLogic);
console.log('Missing Inputs:', missingInputs);
