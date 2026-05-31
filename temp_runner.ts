
import { LOGIC_MAP, INPUT_MAP } from './src/pages/CalculatorDetail.temp.tsx';
import { CALCULATORS } from './src/constants.ts';

let failures = 0;
let defaultPasses = 0;

for (const calc of CALCULATORS) {
  const id = calc.id;
  const logic = LOGIC_MAP[id];
  const inputs = INPUT_MAP[id];
  
  if (!logic || !inputs) {
    console.error(`Missing map for ${id}`);
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
      console.error(`${id} returned invalid result. Expected array with entries, got `, result);
      failures++;
    } else {
      defaultPasses++;
    }
  } catch(e) {
    console.error(`${id} logic crashed with defaults: `, e);
    failures++;
  }
}

console.log(`Passed: ${defaultPasses}`);
console.log(`Failed: ${failures}`);
