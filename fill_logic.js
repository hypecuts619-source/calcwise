import fs from 'fs';

let detailCode = fs.readFileSync('src/pages/CalculatorDetail.tsx', 'utf8');

const updatedLogicMap = `
  'simple-interest': Logic.calculateSimpleInterest,
  'savings-goal': Logic.calculateSavingsGoal,
  'discount': Logic.calculateDiscount,
  'date-diff': Logic.calculateDateDiff,
  'world-clock': Logic.calculateWorldClock,
  'fraction-decimal': Logic.calculateFractionDecimal,
  'lease': Logic.calculateLease,
  'heloc': Logic.calculateHELOC,
  'exponent': Logic.calculateExponent,
  'logarithm': Logic.calculateLogarithm,
  'basal-metabolic': Logic.calculateBasalMetabolic,
  'waist-hip': Logic.calculateWaistHip,
  'binary': Logic.calculateBinary,
  'password-strength': Logic.calculatePasswordStrength,
  'countdown': Logic.calculateCountdown,
  'salary-comparison': Logic.calculateSalaryComparison,
  'car-lease': Logic.calculateCarLease,
  'student-loan': Logic.calculateStudentLoan,
  'macros': Logic.calculateMacros,
  'unit-converter': Logic.calculateUnitConverter,
`;

if (!detailCode.includes("'logarithm': Logic.calculateLogarithm")) {
  detailCode = detailCode.replace(/const LOGIC_MAP: Record<([^>]+)> = \{/, "const LOGIC_MAP: Record<$1> = {" + updatedLogicMap);
  fs.writeFileSync('src/pages/CalculatorDetail.tsx', detailCode);
  console.log("UPDATED LOGIC_MAP");
} else {
  console.log("ALREADY PRESENT");
}
