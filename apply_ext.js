import fs from 'fs';

let content = fs.readFileSync('src/lib/calculators/extras.ts', 'utf8');

content = content.replace(/export const calculateSimpleInterest.*\n/g, '')
  .replace(/export const calculateSavingsGoal.*\n/g, '')
  .replace(/export const calculateDiscount.*\n/g, '')
  .replace(/export const calculateDateDiff.*\n/g, '')
  .replace(/export const calculateWorldClock.*\n/g, '')
  .replace(/export const calculateLease.*\n/g, '')
  .replace(/export const calculateCarLease.*\n/g, '')
  .replace(/export const calculateHELOC.*\n/g, '')
  .replace(/export const calculateExponent.*\n/g, '')
  .replace(/export const calculateLogarithm.*\n/g, '')
  .replace(/export const calculateBasalMetabolic.*\n/g, '')
  .replace(/export const calculateWaistHip.*\n/g, '')
  .replace(/export const calculateBinary.*\n/g, '')
  .replace(/export const calculatePasswordStrength.*\n/g, '')
  .replace(/export const calculateCountdown.*\n/g, '')
  .replace(/export const calculateSalaryComparison.*\n/g, '')
  .replace(/export const calculateStudentLoan.*\n/g, '')
  .replace(/export const calculateUnitConverter.*\n/g, '');

const implementations = fs.readFileSync('ext.txt', 'utf8');
let newContent = content + '\n' + implementations;
fs.writeFileSync('src/lib/calculators/extras.ts', newContent);
console.log('Fixed extras.');
