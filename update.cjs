const fs = require('fs');

const content = fs.readFileSync('src/constants.ts', 'utf8');
const lines = content.split('\n');

const keywordsMap = {
    finance: "loans, interest rates, and financial planning",
    investment: "wealth growth, savings, and investment returns",
    business: "profitability, margins, and key business metrics",
    health: "health tracking, fitness, and daily wellness",
    lifestyle: "everyday calculations, dates, and conversions",
    math: "equations, geometry, and advanced mathematical problems",
    tax: "tax estimation, income, and deductions"
};

const specific = {
    'loan-emi': 'Calculate your Equated Monthly Installment (EMI) for home, car, and personal loans. Use our free EMI calculator for precise repayment schedules.',
    'mortgage': 'Free mortgage calculator to estimate monthly house payments including principal, interest, taxes, and insurance. Plan your home purchase easily.',
    'car-loan': 'Estimate your monthly auto loan payments quickly. Compare car loan interest rates, terms, and down payments to get the best financing deal.',
    'credit-card-payoff': 'Calculate how long it takes to pay off credit card debt. Optimize your payments to save on interest and become debt-free faster.',
    'bmi': 'Calculate your Body Mass Index (BMI) online. Check if your weight is in a healthy range with our free BMI calculator based on WHO parameters.',
    'profit-margin': 'Calculate gross and net profit margins instantly. Essential business profitability calculator to optimize pricing and track revenue.',
    'break-even': 'Find your business break-even point. Calculate the exact sales volume needed to cover fixed and variable costs with this useful financial tool.',
    'pregnancy-due-date': 'Calculate your estimated pregnancy due date based on your last menstrual period (LMP) or conception date. Free online pregnancy calculator.',
    'ovulation': 'Track your fertility window with our online ovulation calculator. Find your most fertile days to increase chances of conception fast.',
    'tdee': 'Calculate your Total Daily Energy Expenditure (TDEE). Find out exactly how many calories you burn per day for weight loss or muscle gain.',
    'roi': 'Easily calculate Return on Investment (ROI). Measure the profitability and performance of your business or personal investments with our free ROI calculator.',
    'retirement-fire': 'Plan your early retirement with our FIRE calculator. Determine your target FIRE number and see when you can achieve financial independence.',
    'percentage': 'Solve percentage problems fast. Use our free percentage calculator to find percent increase, decrease, or calculate discounts easily.',
    'home-affordability': 'Find out how much house you can afford. Estimate your maximum home price based on income, debt, and down payment.',
    'calorie': 'Estimate your daily calorie intake needs for weight loss, maintenance, or muscle gain with our accurate calorie calculator.',
    'salary': 'Convert your salary into hourly, weekly, monthly, and annual take-home pay with our comprehensive salary calculator.',
    'sip': 'Calculate mutual fund returns with our SIP calculator. Forecast your future wealth creation through systematic investing over time.',
    'debt-to-income': 'Calculate your Debt-to-Income (DTI) ratio. Determine your borrowing capacity and financial health with our accurate DTI calculator.',
    'compound-interest': 'See how your money grows over time with our compound interest calculator. Calculate exponential growth for savings and investments quickly.',
    'fd': 'Estimate the maturity amount and interest earned on your Fixed Deposit (FD). Reliable return on investment tool for safe financial planning.',
    'gst': 'Calculate GST and VAT easily. Determine inclusive or exclusive tax amounts for products and services with our quick tax estimation tool.',
    'discount': 'Calculate the final price after a discount. Quickly find out exactly how much you are saving during sales and shopping events.',
    'tip': 'Easily calculate tips and split the bill among friends. Determine appropriate gratuity amounts instantly with our online tip calculator.',
    'monthly-budget': 'Manage your finances efficiently. Track income and expenses using the 50/30/20 rule with our free monthly budget calculator.',
    'sales-tax': 'Determine the total price after adding sales tax. Accurate shopping and retail calculator for estimating state and local taxes.'
};

let currentId = null;
let currentTitle = null;
let currentDesc = null;
let currentCat = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if it's a single-line calculator
    const singleMatch = line.match(/\{ id:\s*'([^']+)',\s*title:\s*'([^']+)'/);
    const hasSeoDesc = line.includes('seoDescription:');
    
    if (singleMatch && hasSeoDesc && line.includes('category:')) {
       const catMatch = line.match(/category:\s*'([^']+)'/);
       const descMatch = line.match(/description:\s*'([^']+)'/);
       
       if (descMatch && catMatch) {
           const id = singleMatch[1];
           const title = singleMatch[2];
           const cat = catMatch[1];
           let baseDesc = descMatch[1].replace(/ calculator\.$/, '.').replace(/ calculator$/, '').replace(/\.$/, '') + '.';
           
           let newSeo = specific[id];
           if (!newSeo) {
               const kw = keywordsMap[cat] || "accurate mathematical solutions";
               newSeo = `Free online ${title} Calculator. ${baseDesc} Get fast, accurate results for ${kw} with no registration required.`;
           }
           
           lines[i] = line.replace(/seoDescription:\s*'([^']*)'/, `seoDescription: '${newSeo.replace(/'/g, "\\'")}'`);
       }
       continue;
    }

    // Otherwise, check for multi-line properties building up
    const idMatch = line.match(/id:\s*'([^']+)'/);
    if (idMatch) currentId = idMatch[1];
    
    const titleMatch = line.match(/title:\s*'([^']+)'/);
    if (titleMatch) currentTitle = titleMatch[1];
    
    const descMatchMulti = line.match(/description:\s*'([^']+)'/);
    if (descMatchMulti) currentDesc = descMatchMulti[1];
    
    const catMatch = line.match(/category:\s*'([^']+)'/);
    if (catMatch) currentCat = catMatch[1];
    
    const seoDescMatch = line.match(/seoDescription:\s*'([^']*)'/);
    if (seoDescMatch && currentId && currentTitle && currentDesc) {
        let baseDesc = currentDesc.replace(/ calculator\.$/, '.').replace(/ calculator$/, '').replace(/\.$/, '') + '.';
        let newSeo = specific[currentId];
        if (!newSeo) {
            const kw = keywordsMap[currentCat] || "accurate mathematical solutions";
            newSeo = `Free online ${currentTitle} Calculator. ${baseDesc} Get fast, accurate results for ${kw} with no registration required.`;
        }
        
        lines[i] = line.replace(/seoDescription:\s*'([^']*)'/, `seoDescription: '${newSeo.replace(/'/g, "\\'")}'`);
        
        // Reset after finding seoDescription
        currentId = null;
        currentTitle = null;
        currentDesc = null;
        currentCat = null;
    }
}

fs.writeFileSync('src/constants.ts', lines.join('\n'));
console.log("Updated constants.ts");
