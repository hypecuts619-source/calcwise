import fs from 'fs';
let content = fs.readFileSync('src/pages/CalculatorDetail.tsx', 'utf8');
content = content.replace(/\\n/g, '\n');
fs.writeFileSync('src/pages/CalculatorDetail.tsx', content);
