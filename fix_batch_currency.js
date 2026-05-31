const fs = require('fs');
let code = fs.readFileSync('src/lib/calculators/batch.ts', 'utf8');

// We need to add formatCurrency import
if (!code.includes('formatCurrency')) {
  code = code.replace("import { CalculationResult } from '../../types.ts';", "import { CalculationResult } from '../../types.ts';\nimport { formatCurrency } from '../utils.ts';");
}

function update(funcName, replacements) {
    let re = new RegExp(`export function \\b${funcName}\\b\\(values: Record<string, any>\\): CalculationResult\\[\\] \\{\\n(.*)\\n\\}`, 'g');
    code = code.replace(re, (match, body) => {
        if (!body.includes('currencySymbol')) {
          body = `  const currencySymbol = values.currencySymbol || '$';\n` + body;
        }
        for (let r of replacements) {
            body = body.replace(r[0], r[1]);
        }
        return `export function ${funcName}(values: Record<string, any>): CalculationResult[] {\n${body}\n}`;
    });
}

update('calculate_present_value', [
    [/(fv\/Math\.pow\(1\+r, n\))\.toFixed\(2\)/g, "formatCurrency($1, currencySymbol)"]
]);

update('calculate_future_value', [
    [/(pv\*Math\.pow\(1\+r, n\))\.toFixed\(2\)/g, "formatCurrency($1, currencySymbol)"]
]);

update('calculate_energy_cost', [
    [/cost\.toFixed\(2\)/g, "formatCurrency(cost, currencySymbol)"]
]);

update('calculate_sales_tax', [
    [/t\.toFixed\(2\)/g, "formatCurrency(t, currencySymbol)"],
    [/\(p\+t\)\.toFixed\(2\)/g, "formatCurrency(p+t, currencySymbol)"]
]);

update('calculate_vat', [
    [/t\.toFixed\(2\)/g, "formatCurrency(t, currencySymbol)"],
    [/\(p\+t\)\.toFixed\(2\)/g, "formatCurrency(p+t, currencySymbol)"]
]);

update('calculate_revenue', [
    [/\(p\*u\)\.toFixed\(2\)/g, "formatCurrency(p*u, currencySymbol)"]
]);

update('calculate_net_income', [
    [/\(r-e\)\.toFixed\(2\)/g, "formatCurrency(r-e, currencySymbol)"]
]);

fs.writeFileSync('src/lib/calculators/batch.ts', code);
