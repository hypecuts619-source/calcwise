import { CALCULATORS } from './src/constants.js'; // need tsx to import, but we'll use tsx
import * as Logic from './src/lib/calculatorLogic.ts';
import fs from 'fs';

// Read LOGIC_MAP from CalculatorDetail.tsx using a sneaky eval
const detailCode = fs.readFileSync('src/pages/CalculatorDetail.tsx', 'utf8');

const mapCodePart = detailCode.substring(detailCode.indexOf('const LOGIC_MAP'), detailCode.indexOf('export function CalculatorDetail()'));
// Provide dummy Logic object used in the map
const LogicBatchNew100 = Logic.LogicBatchNew100;
const LogicBatch100 = Logic.LogicBatch100;
const calculate_pregnancy_due_date = Logic.calculate_pregnancy_due_date;
const calculate_ovulation = Logic.calculate_ovulation;
// Just inject it:
let extract = mapCodePart.replace(/const LOGIC_MAP[^]+const INPUT_MAP/, "const LOGIC_MAP = {}; const INPUT_MAP");
// It's too complex to eval.

// Let's do a pure static verification of logic.ts:
const allIds = CALCULATORS.map(c => c.id);

let logicKeys = new Set();
let inputKeys = new Set();

// Extract from mapCodePart
const logicRegex = /^\s*'([^']+)':/gm;
let m;
while ((m = logicRegex.exec(mapCodePart)) !== null) {
  logicKeys.add(m[1]);
}
// since input map is also below logic map:
// it's the exact same keys usually. But let's check INPUT_MAP:
const inputCodePart = detailCode.substring(detailCode.indexOf('const INPUT_MAP'), detailCode.indexOf('export function CalculatorDetail()'));
const inputRegex = /^\s*'([^']+)':/gm;
let m2;
while ((m2 = inputRegex.exec(inputCodePart)) !== null) {
  inputKeys.add(m2[1]);
}

let missingIds = allIds.filter(id => !logicKeys.has(id));
let missingInputs = allIds.filter(id => !inputKeys.has(id));

console.log("Total Calculators Configured:", allIds.length);
console.log("Missing logic mapping:", missingIds);
console.log("Missing input mapping:", missingInputs);

