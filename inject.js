import fs from 'fs';
let detailCode = fs.readFileSync('./src/pages/CalculatorDetail.tsx', 'utf8');
const logicStr = fs.readFileSync('logic_add.txt', 'utf8');
const inputStr = fs.readFileSync('inputs_add.txt', 'utf8');

detailCode = detailCode.replace(/(const LOGIC_MAP: Record<string, [^>]+> = \{)/, "$1\n" + logicStr);
detailCode = detailCode.replace(/(const INPUT_MAP: Record<string, CalculationInput\[\]> = \{)/, "$1\n" + inputStr);

fs.writeFileSync('./src/pages/CalculatorDetail.tsx', detailCode);
