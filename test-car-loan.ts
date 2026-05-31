import { calculateCarLoan } from './src/lib/calculators/finance.ts';

const result = calculateCarLoan({
    vehiclePrice: 25000,
    downPayment: 5000,
    rate: 4.5,
    tenure: 5,
    currencySymbol: '$'
});

console.log(result);
