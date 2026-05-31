import fs from 'fs';
import { CALCULATORS } from './src/constants.js';

// compile CalculatorDetail temporarily so we can import it
let originalCode = fs.readFileSync('src/pages/CalculatorDetail.tsx', 'utf8');

// I will just create a tiny test file that imports LOGIC_MAP and INPUT_MAP
const modCode = originalCode.replace('const LOGIC_MAP', 'export const LOGIC_MAP').replace('const INPUT_MAP', 'export const INPUT_MAP');
fs.writeFileSync('src/pages/CalculatorDetail.temp.tsx', modCode);

// now write the test runner
const runnerCode = `
import { LOGIC_MAP, INPUT_MAP } from './src/pages/CalculatorDetail.temp.tsx';
import { CALCULATORS } from './src/constants.ts';

let failures = 0;
let defaultPasses = 0;

for (const calc of CALCULATORS) {
  const id = calc.id;
  const logic = LOGIC_MAP[id];
  const inputs = INPUT_MAP[id];
  
  if (!logic || !inputs) {
    console.error(\`Missing map for \${id}\`);
    failures++;
    continue;
  }
  
  let defaultValues = {};
  inputs.forEach(inp => {
    defaultValues[inp.name] = inp.defaultValue;
  });
  
  try {
    const result = logic(defaultValues);
    if (!Array.isArray(result) || result.length === 0) {
      console.error(\`\${id} returned invalid result. Expected array with entries, got \`, result);
      failures++;
    } else {
      defaultPasses++;
    }
  } catch(e) {
    console.error(\`\${id} logic crashed with defaults: \`, e);
    failures++;
  }
}

console.log(\`Passed: \${defaultPasses}\`);
console.log(\`Failed: \${failures}\`);
`;

fs.writeFileSync('temp_runner.ts', runnerCode);
