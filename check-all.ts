import * as Logic from './src/lib/calculatorLogic.ts';
import fs from 'fs';
import { CALCULATORS } from './src/constants.ts';

const missingLogicOutputs = [];

for (const calc of CALCULATORS) {
   const logicStr = `Logic.calculate...`; // just trying to see if we can instantiate it...
   // Wait, actually I already inserted dummy Logic yesterday? No, today.
}
console.log('done');
