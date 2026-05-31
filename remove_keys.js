import fs from 'fs';

let detailCode = fs.readFileSync('src/pages/CalculatorDetail.tsx', 'utf8');

const oldKeys = [
  'simple-interest', 'savings-goal','discount','date-diff','world-clock','fraction-decimal',
  'lease','heloc','exponent','logarithm','basal-metabolic','waist-hip',
  'binary','password-strength','countdown','salary-comparison','car-lease',
  'student-loan','macros','unit-converter'
];

oldKeys.forEach(key => {
  const reg = new RegExp("'" + key + "': \\\\[[\\\\s\\\\S]*?\\\\](?:,)?");
  detailCode = detailCode.replace(reg, '');
});

fs.writeFileSync('src/pages/CalculatorDetail.tsx', detailCode);
console.log("REMOVED OLD KEYS");
