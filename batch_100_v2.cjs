const fs = require('fs');

const calculators = [
  // Health & Fitness (20)
  { id: 'bmr-calc-v2', title: 'BMR (Harris-Benedict)', cat: 'health', inps: [{l:'Weight (kg)',n:'w',d:70},{l:'Height (cm)',n:'h',d:175},{l:'Age (y)',n:'a',d:30},{l:'Is Male (1=Y,0=N)',n:'m',d:1}], form: '(values.m ? 88.362 + (13.397*values.w) + (4.799*values.h) - (5.677*values.a) : 447.593 + (9.247*values.w) + (3.098*values.h) - (4.330*values.a))', desc: 'Calculate Basal Metabolic Rate' },
  { id: 'water-intake-calc', title: 'Water Intake', cat: 'health', inps: [{l:'Weight (kg)',n:'w',d:70},{l:'Exercise (min)',n:'e',d:30}], form: '(values.w * 0.033 + (values.e / 30) * 0.35)', desc: 'Daily water intake in Liters' },
  { id: 'body-fat-navy-calc', title: 'Body Fat (Navy)', cat: 'health', inps: [{l:'Waist (cm)',n:'w',d:85},{l:'Neck (cm)',n:'n',d:40},{l:'Height (cm)',n:'h',d:175}], form: '(495 / (1.0324 - 0.19077 * Math.log10(values.w - values.n) + 0.15456 * Math.log10(values.h)) - 450)', desc: 'Body fat % (Male)' },
  { id: 'macro-protein-calc', title: 'Protein Macros', cat: 'health', inps: [{l:'Weight (kg)',n:'w',d:70},{l:'Activity (1.2-2)',n:'a',d:1.5}], form: '(values.w * values.a * 1.2)', desc: 'Estimate daily protein needed (g)' },
  { id: 'macro-carbs-calc', title: 'Carb Macros', cat: 'health', inps: [{l:'Weight (kg)',n:'w',d:70},{l:'Activity (1.2-2)',n:'a',d:1.5}], form: '(values.w * values.a * 2)', desc: 'Estimate daily carbs needed (g)' },
  { id: 'blood-alcohol-calc', title: 'BAC Estimate', cat: 'health', inps: [{l:'Weight (kg)',n:'w',d:70},{l:'Standard Drinks',n:'d',d:3},{l:'Hours since start',n:'h',d:2}], form: '((values.d * 10) / (values.w * 0.68) * 100 - (values.h * 0.015))', desc: 'Estimate Blood Alcohol Content' },
  { id: 'one-rep-max-calc', title: 'One Rep Max', cat: 'health', inps: [{l:'Weight Lifted (kg)',n:'w',d:100},{l:'Reps',n:'r',d:5}], form: '(values.w * (1 + (values.r / 30)))', desc: 'Estimate 1RM' },
  { id: 'lean-body-mass-calc', title: 'Lean Body Mass', cat: 'health', inps: [{l:'Weight (kg)',n:'w',d:70},{l:'Body Fat %',n:'bf',d:15}], form: '(values.w * (1 - values.bf/100))', desc: 'Calculate Lean Body Mass (kg)' },
  { id: 'maximum-heart-rate-calc', title: 'Max Heart Rate', cat: 'health', inps: [{l:'Age (yrs)',n:'a',d:30}], form: '(220 - values.a)', desc: 'Max heart rate (bpm)' },
  { id: 'target-heart-rate-calc', title: 'Target Heart Rate', cat: 'health', inps: [{l:'Age (yrs)',n:'a',d:30},{l:'Intensity %',n:'i',d:70}], form: '((220 - values.a) * (values.i / 100))', desc: 'Target HR at intensity' },
  { id: 'calorie-burn-running', title: 'Calories (Running)', cat: 'health', inps: [{l:'Weight (kg)',n:'w',d:70},{l:'Distance (km)',n:'d',d:5}], form: '(values.w * values.d * 1.036)', desc: 'Calories burned running' },
  { id: 'calorie-burn-walking', title: 'Calories (Walking)', cat: 'health', inps: [{l:'Weight (kg)',n:'w',d:70},{l:'Distance (km)',n:'d',d:5}], form: '(values.w * values.d * 0.75)', desc: 'Calories burned walking' },
  { id: 'calorie-burn-cycling', title: 'Calories (Cycling)', cat: 'health', inps: [{l:'Weight (kg)',n:'w',d:70},{l:'Duration (hrs)',n:'h',d:1},{l:'Speed (km/h)',n:'s',d:20}], form: '(8 * values.w * values.h)', desc: 'Calories burned cycling' },
  { id: 'vo2-max-calc', title: 'VO2 Max (Cooper)', cat: 'health', inps: [{l:'Distance in 12 min (m)',n:'d',d:2400}], form: '((values.d - 504.9) / 44.73)', desc: 'VO2 Max estimate' },
  { id: 'bmi-prime-calc', title: 'BMI Prime', cat: 'health', inps: [{l:'Weight (kg)',n:'w',d:70},{l:'Height (cm)',n:'h',d:175}], form: '((values.w / ((values.h/100)**2)) / 25)', desc: 'BMI Prime (ratio to upper limit)' },
  { id: 'ponderal-index-calc', title: 'Ponderal Index', cat: 'health', inps: [{l:'Weight (kg)',n:'w',d:70},{l:'Height (cm)',n:'h',d:175}], form: '(values.w / ((values.h/100)**3))', desc: 'Ponderal Index (kg/m³)' },
  { id: 'waist-to-hip-calc', title: 'Waist to Hip Ratio', cat: 'health', inps: [{l:'Waist (cm)',n:'w',d:80},{l:'Hip (cm)',n:'h',d:100}], form: '(values.w / values.h)', desc: 'WHR calculation' },
  { id: 'waist-to-height-calc', title: 'Waist to Height', cat: 'health', inps: [{l:'Waist (cm)',n:'w',d:80},{l:'Height (cm)',n:'h',d:175}], form: '(values.w / values.h)', desc: 'WHtR calculation' },
  { id: 'blood-volume-calc', title: 'Blood Volume', cat: 'health', inps: [{l:'Weight (kg)',n:'w',d:70},{l:'Height (cm)',n:'h',d:175},{l:'Male=1',n:'m',d:1}], form: '(values.m ? (0.3669*(values.h/100)**3 + 0.03219*values.w + 0.6041) : (0.3561*(values.h/100)**3 + 0.03308*values.w + 0.1833))', desc: 'Calculate blood volume (L)' },
  { id: 'ideal-weight-devine', title: 'Ideal Weight (Devine)', cat: 'health', inps: [{l:'Height (in)',n:'h',d:70},{l:'Male=1',n:'m',d:1}], form: '(values.m ? 50 + 2.3 * (values.h - 60) : 45.5 + 2.3 * (values.h - 60))', desc: 'Ideal body weight' },

  // Finance (20)
  { id: 'present-value-calc', title: 'Present Value', cat: 'business', inps: [{l:'Future Value',n:'fv',d:10000},{l:'Interest Rate (%)',n:'r',d:5},{l:'Periods',n:'n',d:10}], form: '(values.fv / ((1 + values.r/100)**values.n))', desc: 'Calculate PV' },
  { id: 'future-value-calc', title: 'Future Value', cat: 'business', inps: [{l:'Present Value',n:'pv',d:5000},{l:'Interest Rate (%)',n:'r',d:5},{l:'Periods',n:'n',d:10}], form: '(values.pv * ((1 + values.r/100)**values.n))', desc: 'Calculate FV' },
  { id: 'cagr-calc', title: 'CAGR', cat: 'business', inps: [{l:'Ending Value',n:'ev',d:15000},{l:'Beginning Value',n:'bv',d:10000},{l:'Years',n:'t',d:5}], form: '(((values.ev / values.bv)**(1/values.t) - 1) * 100)', desc: 'Compound Annual Growth Rate' },
  { id: 'ebitda-calc', title: 'EBITDA', cat: 'business', inps: [{l:'Net Income',n:'ni',d:100000},{l:'Taxes',n:'t',d:20000},{l:'Interest',n:'i',d:15000},{l:'Depreciation',n:'d',d:10000},{l:'Amortization',n:'a',d:5000}], form: '(values.ni + values.t + values.i + values.d + values.a)', desc: 'Calculate EBITDA' },
  { id: 'wacc-calc', title: 'WACC', cat: 'business', inps: [{l:'Cost of Equity (%)',n:'ke',d:10},{l:'Equity Weight (%)',n:'we',d:60},{l:'Cost of Debt (%)',n:'kd',d:5},{l:'Debt Weight (%)',n:'wd',d:40},{l:'Tax Rate (%)',n:'t',d:21}], form: '((values.we/100 * values.ke) + (values.wd/100 * values.kd * (1 - values.t/100)))', desc: 'Weighted Average Cost of Capital' },
  { id: 'quick-ratio-calc', title: 'Quick Ratio', cat: 'business', inps: [{l:'Current Assets',n:'ca',d:50000},{l:'Inventory',n:'i',d:20000},{l:'Current Liab.',n:'cl',d:25000}], form: '((values.ca - values.i) / values.cl)', desc: 'Calculate Quick Ratio' },
  { id: 'current-ratio-calc', title: 'Current Ratio', cat: 'business', inps: [{l:'Current Assets',n:'ca',d:50000},{l:'Current Liab.',n:'cl',d:25000}], form: '(values.ca / values.cl)', desc: 'Calculate Current Ratio' },
  { id: 'debt-to-equity-calc', title: 'Debt to Equity', cat: 'business', inps: [{l:'Total Debt',n:'td',d:50000},{l:'Total Equity',n:'te',d:100000}], form: '(values.td / values.te)', desc: 'Calculate D/E Ratio' },
  { id: 'roa-calc', title: 'Return on Assets', cat: 'business', inps: [{l:'Net Income',n:'ni',d:20000},{l:'Total Assets',n:'ta',d:100000}], form: '((values.ni / values.ta) * 100)', desc: 'Calculate ROA (%)' },
  { id: 'roe-calc', title: 'Return on Equity', cat: 'business', inps: [{l:'Net Income',n:'ni',d:20000},{l:'Shareholders Equity',n:'se',d:80000}], form: '((values.ni / values.se) * 100)', desc: 'Calculate ROE (%)' },
  { id: 'gross-margin-calc', title: 'Gross Margin', cat: 'business', inps: [{l:'Revenue',n:'r',d:100000},{l:'COGS',n:'c',d:60000}], form: '(((values.r - values.c) / values.r) * 100)', desc: 'Calculate Gross Margin (%)' },
  { id: 'operating-margin-calc', title: 'Operating Margin', cat: 'business', inps: [{l:'Operating Inc.',n:'oi',d:20000},{l:'Revenue',n:'r',d:100000}], form: '((values.oi / values.r) * 100)', desc: 'Calculate Operating Margin (%)' },
  { id: 'markup-calc', title: 'Markup Percentage', cat: 'business', inps: [{l:'Cost',n:'c',d:50},{l:'Selling Price',n:'s',d:75}], form: '(((values.s - values.c) / values.c) * 100)', desc: 'Calculate Markup (%)' },
  { id: 'inventory-turnover-calc', title: 'Inventory Turnover', cat: 'business', inps: [{l:'COGS',n:'c',d:50000},{l:'Avg Inventory',n:'i',d:10000}], form: '(values.c / values.i)', desc: 'Calculate Inventory Turnover Ratio' },
  { id: 'days-sales-outstanding', title: 'Days Sales Outst.', cat: 'business', inps: [{l:'Receivables',n:'ar',d:10000},{l:'Total Credit Sales',n:'tcs',d:100000},{l:'Days in Period',n:'d',d:365}], form: '((values.ar / values.tcs) * values.d)', desc: 'Calculate DSO' },
  { id: 'working-capital-calc', title: 'Working Capital', cat: 'business', inps: [{l:'Current Assets',n:'ca',d:50000},{l:'Current Liab.',n:'cl',d:30000}], form: '(values.ca - values.cl)', desc: 'Calculate Net Working Capital' },
  { id: 'capital-gains-calc', title: 'Capital Gains tax', cat: 'tax', inps: [{l:'Purchase Price',n:'p',d:10000},{l:'Sale Price',n:'s',d:15000},{l:'Tax Rate (%)',n:'t',d:15}], form: '((values.s - values.p) * (values.t / 100))', desc: 'Calculate capital gains tax' },
  { id: 'dividend-yield-calc', title: 'Dividend Yield', cat: 'business', inps: [{l:'Annual Div. per Share',n:'d',d:2},{l:'Price per Share',n:'p',d:50}], form: '((values.d / values.p) * 100)', desc: 'Calculate Dividend Yield (%)' },
  { id: 'eps-calc', title: 'EPS', cat: 'business', inps: [{l:'Net Income',n:'ni',d:1000000},{l:'Pref. Dividends',n:'pd',d:100000},{l:'Shares',n:'s',d:500000}], form: '((values.ni - values.pd) / values.s)', desc: 'Earnings Per Share' },
  { id: 'pe-ratio-calc', title: 'P/E Ratio', cat: 'business', inps: [{l:'Price per Share',n:'p',d:50},{l:'EPS',n:'eps',d:2.5}], form: '(values.p / values.eps)', desc: 'Price to Earnings Ratio' },

  // Math (20)
  { id: 'pythagorean-long-calc', title: 'Hypotenuse', cat: 'math', inps: [{l:'Side A',n:'a',d:3},{l:'Side B',n:'b',d:4}], form: '(Math.sqrt(values.a**2 + values.b**2))', desc: 'Find Hypotenuse' },
  { id: 'pythagorean-short-calc', title: 'Cathetus (Leg)', cat: 'math', inps: [{l:'Hypotenuse',n:'c',d:5},{l:'Side',n:'a',d:3}], form: '(Math.sqrt(values.c**2 - values.a**2))', desc: 'Find short side (leg)' },
  { id: 'circle-area-calc', title: 'Area of Circle', cat: 'math', inps: [{l:'Radius',n:'r',d:5}], form: '(Math.PI * values.r**2)', desc: 'Area of Circle' },
  { id: 'circle-circumference', title: 'Circumference', cat: 'math', inps: [{l:'Radius',n:'r',d:5}], form: '(2 * Math.PI * values.r)', desc: 'Circumference of Circle' },
  { id: 'cylinder-volume', title: 'Cylinder Volume', cat: 'math', inps: [{l:'Radius',n:'r',d:5},{l:'Height',n:'h',d:10}], form: '(Math.PI * values.r**2 * values.h)', desc: 'Volume of Cylinder' },
  { id: 'cone-volume', title: 'Cone Volume', cat: 'math', inps: [{l:'Radius',n:'r',d:5},{l:'Height',n:'h',d:10}], form: '((1/3) * Math.PI * values.r**2 * values.h)', desc: 'Volume of Cone' },
  { id: 'sphere-volume', title: 'Sphere Volume', cat: 'math', inps: [{l:'Radius',n:'r',d:5}], form: '((4/3) * Math.PI * values.r**3)', desc: 'Volume of Sphere' },
  { id: 'sphere-surface-area', title: 'Sphere Surface Area', cat: 'math', inps: [{l:'Radius',n:'r',d:5}], form: '(4 * Math.PI * values.r**2)', desc: 'Surface Area of Sphere' },
  { id: 'trapezoid-area', title: 'Trapezoid Area', cat: 'math', inps: [{l:'Base A',n:'a',d:5},{l:'Base B',n:'b',d:10},{l:'Height',n:'h',d:6}], form: '(((values.a + values.b) / 2) * values.h)', desc: 'Area of Trapezoid' },
  { id: 'parallelogram-area', title: 'Parallelogram Area', cat: 'math', inps: [{l:'Base',n:'b',d:5},{l:'Height',n:'h',d:10}], form: '(values.b * values.h)', desc: 'Area of Parallelogram' },
  { id: 'rhombus-area', title: 'Rhombus Area', cat: 'math', inps: [{l:'Diagonal 1',n:'d1',d:5},{l:'Diagonal 2',n:'d2',d:10}], form: '((values.d1 * values.d2) / 2)', desc: 'Area of Rhombus' },
  { id: 'quadratic-root-plus', title: 'Quadratic Root (+)', cat: 'math', inps: [{l:'a',n:'a',d:1},{l:'b',n:'b',d:-3},{l:'c',n:'c',d:2}], form: '((-values.b + Math.sqrt(values.b**2 - 4*values.a*values.c)) / (2*values.a))', desc: 'Positive root of quadratic equation' },
  { id: 'quadratic-root-minus', title: 'Quadratic Root (-)', cat: 'math', inps: [{l:'a',n:'a',d:1},{l:'b',n:'b',d:-3},{l:'c',n:'c',d:2}], form: '((-values.b - Math.sqrt(values.b**2 - 4*values.a*values.c)) / (2*values.a))', desc: 'Negative root of quadratic equation' },
  { id: 'log10-calc', title: 'Log Base 10', cat: 'math', inps: [{l:'Value',n:'x',d:100}], form: '(Math.log10(values.x))', desc: 'Logarithm base 10' },
  { id: 'ln-calc', title: 'Natural Log (ln)', cat: 'math', inps: [{l:'Value',n:'x',d:Math.E}], form: '(Math.log(values.x))', desc: 'Natural logarithm' },
  { id: 'factorial-calc', title: 'Factorial (Approx)', cat: 'math', inps: [{l:'Value (integer)',n:'n',d:5}], form: '(Math.round(Math.sqrt(2 * Math.PI * values.n) * Math.pow(values.n / Math.E, values.n)))', desc: 'Stirlings approximation of n!' },
  { id: 'percentage-error', title: 'Percentage Error', cat: 'math', inps: [{l:'Expected Value',n:'e',d:100},{l:'Observed Value',n:'o',d:95}], form: '(Math.abs((values.o - values.e) / values.e) * 100)', desc: 'Calculate % error' },
  { id: 'geometric-mean-2', title: 'Geometric Mean (2)', cat: 'math', inps: [{l:'Val 1',n:'v1',d:4},{l:'Val 2',n:'v2',d:9}], form: '(Math.sqrt(values.v1 * values.v2))', desc: 'Geometric mean of two numbers' },
  { id: 'arithmetic-mean-3', title: 'Mean of 3 Numbers', cat: 'math', inps: [{l:'Val 1',n:'v1',d:4},{l:'Val 2',n:'v2',d:9},{l:'Val 3',n:'v3',d:20}], form: '((values.v1 + values.v2 + values.v3) / 3)', desc: 'Arithmetic average' },
  { id: 'degrees-to-radians', title: 'Deg to Radians', cat: 'math', inps: [{l:'Degrees',n:'d',d:180}], form: '(values.d * Math.PI / 180)', desc: 'Degrees to Radians' },

  // Everyday & Lifestyle (20)
  { id: 'gas-cost-calc', title: 'Trip Gas Cost', cat: 'lifestyle', inps: [{l:'Distance (miles)',n:'d',d:100},{l:'MPG',n:'mpg',d:25},{l:'Gas Price/Gal',n:'p',d:3.5}], form: '((values.d / values.mpg) * values.p)', desc: 'Calculate cost of gas for a trip' },
  { id: 'fuel-efficiency-mpg', title: 'Fuel Efficiency', cat: 'lifestyle', inps: [{l:'Miles Driven',n:'d',d:300},{l:'Gallons Used',n:'g',d:12}], form: '(values.d / values.g)', desc: 'Calculate MPG' },
  { id: 'fuel-efficiency-l100km', title: 'Fuel L/100km', cat: 'lifestyle', inps: [{l:'Km Driven',n:'d',d:500},{l:'Liters Used',n:'l',d:40}], form: '((values.l / values.d) * 100)', desc: 'Calculate L/100km' },
  { id: 'electricity-cost-calc', title: 'Electricity Cost', cat: 'lifestyle', inps: [{l:'Power (Watts)',n:'w',d:1000},{l:'Hours/Day',n:'h',d:5},{l:'Cost/kWh',n:'c',d:0.15}], form: '((values.w / 1000) * values.h * values.c)', desc: 'Daily electricity cost' },
  { id: 'tv-viewing-distance', title: 'TV View Distance', cat: 'lifestyle', inps: [{l:'TV Size (inches)',n:'s',d:55}], form: '(values.s * 1.2 / 12)', desc: 'Optimal viewing distance in feet' },
  { id: 'dog-years-calc', title: 'Dog Years', cat: 'lifestyle', inps: [{l:'Dog Age (human years)',n:'a',d:5}], form: '(16 * Math.log(values.a) + 31)', desc: 'Dog to Human years (AVMA method)' },
  { id: 'cat-years-calc', title: 'Cat Years', cat: 'lifestyle', inps: [{l:'Cat Age (years)',n:'a',d:5}], form: '(values.a <= 2 ? values.a * 12 : 24 + (values.a - 2) * 4)', desc: 'Cat age in human years' },
  { id: 'pizza-area-calc', title: 'Pizza Area', cat: 'lifestyle', inps: [{l:'Diameter (inches)',n:'d',d:12}], form: '(Math.PI * (values.d/2)**2)', desc: 'Area of pizza in sq inches' },
  { id: 'pizza-cost-per-sqin', title: 'Pizza Cost/sq in', cat: 'lifestyle', inps: [{l:'Diameter (in)',n:'d',d:12},{l:'Price ($)',n:'p',d:15}], form: '(values.p / (Math.PI * (values.d/2)**2))', desc: 'Price per square inch of pizza' },
  { id: 'download-time-calc', title: 'Download Time', cat: 'lifestyle', inps: [{l:'File Size (MB)',n:'s',d:1000},{l:'Speed (Mbps)',n:'v',d:50}], form: '((values.s * 8) / values.v / 60)', desc: 'Download time in minutes' },
  { id: 'reading-time-calc', title: 'Reading Time', cat: 'lifestyle', inps: [{l:'Word Count',n:'w',d:2500},{l:'Words/Minute',n:'s',d:250}], form: '(values.w / values.s)', desc: 'Reading time in minutes' },
  { id: 'steps-to-miles', title: 'Steps to Miles', cat: 'lifestyle', inps: [{l:'Steps',n:'s',d:10000},{l:'Stride Length (ft)',n:'l',d:2.5}], form: '((values.s * values.l) / 5280)', desc: 'Convert steps to miles' },
  { id: 'miles-to-steps', title: 'Miles to Steps', cat: 'lifestyle', inps: [{l:'Miles',n:'m',d:5},{l:'Stride Length (ft)',n:'l',d:2.5}], form: '((values.m * 5280) / values.l)', desc: 'Convert miles to steps' },
  { id: 'water-boiler-energy', title: 'Boil Water Energy', cat: 'lifestyle', inps: [{l:'Water Volume (L)',n:'v',d:1},{l:'Temp Change (°C)',n:'dt',d:80}], form: '(values.v * 4.184 * values.dt)', desc: 'Energy to boil water (kJ)' },
  { id: 'coffee-to-water-ratio', title: 'Coffee Ratio', cat: 'lifestyle', inps: [{l:'Coffee Grounds (g)',n:'c',d:20},{l:'Ratio (1:X)',n:'r',d:15}], form: '(values.c * values.r)', desc: 'Water needed for coffee (g/ml)' },
  { id: 'baking-temp-c-to-f', title: 'Baking C to F', cat: 'lifestyle', inps: [{l:'Celsius',n:'c',d:180}], form: '(values.c * 9/5 + 32)', desc: 'Baking temp in Fahrenheit' },
  { id: 'microwave-wattage-calc', title: 'Microwave Time Adjust', cat: 'lifestyle', inps: [{l:'Original Time (s)',n:'t',d:60},{l:'Original Watts',n:'w1',d:1000},{l:'Your Watts',n:'w2',d:800}], form: '(values.t * (values.w1 / values.w2))', desc: 'Adjust microwave time for wattage' },
  { id: 'sleep-cycles-calc', title: 'Sleep Cycles', cat: 'lifestyle', inps: [{l:'Hours Slept',n:'h',d:8}], form: '(values.h * 60 / 90)', desc: 'Number of 90-min sleep cycles' },
  { id: 'heartbeats-lifetime', title: 'Lifetime Heartbeats', cat: 'health', inps: [{l:'Age (yrs)',n:'a',d:30},{l:'Resting HR (bpm)',n:'hr',d:70}], form: '(values.a * 365.25 * 24 * 60 * values.hr)', desc: 'Total estimated heartbeats' },
  { id: 'breaths-lifetime', title: 'Lifetime Breaths', cat: 'health', inps: [{l:'Age (yrs)',n:'a',d:30},{l:'Breaths/min',n:'b',d:16}], form: '(values.a * 365.25 * 24 * 60 * values.b)', desc: 'Total estimated breaths' },

  // Construction & Conversion (20)
  { id: 'board-feet-calc', title: 'Board Feet 2', cat: 'construction', inps: [{l:'Qty',n:'q',d:10},{l:'Thickness (in)',n:'t',d:2},{l:'Width (in)',n:'w',d:4},{l:'Length (ft)',n:'l',d:8}], form: '(values.q * values.t * values.w * values.l / 12)', desc: 'Board feet total' },
  { id: 'roof-pitch-calc', title: 'Roof Pitch Angle', cat: 'construction', inps: [{l:'Rise (in)',n:'r',d:4},{l:'Run (in)',n:'rn',d:12}], form: '(Math.atan(values.r / values.rn) * 180 / Math.PI)', desc: 'Roof pitch angle in degrees' },
  { id: 'stair-treads-calc', title: 'Stair Treads', cat: 'construction', inps: [{l:'Total Rise (in)',n:'r',d:100}], form: '(Math.ceil(values.r / 7) - 1)', desc: 'Number of stair treads' },
  { id: 'stair-run-calc', title: 'Stair Total Run', cat: 'construction', inps: [{l:'Treads',n:'t',d:14},{l:'Tread Depth (in)',n:'d',d:10}], form: '(values.t * values.d)', desc: 'Total horizontal run of stairs' },
  { id: 'studs-16-oc-calc', title: 'Studs 16" OC', cat: 'construction', inps: [{l:'Wall length (ft)',n:'l',d:20}], form: '(Math.ceil((values.l * 12) / 16) + 1)', desc: 'Studs at 16 inches on center' },
  { id: 'studs-24-oc-calc', title: 'Studs 24" OC', cat: 'construction', inps: [{l:'Wall length (ft)',n:'l',d:20}], form: '(Math.ceil((values.l * 12) / 24) + 1)', desc: 'Studs at 24 inches on center' },
  { id: 'gpm-pipe-calc', title: 'Pipe Flow Rate', cat: 'construction', inps: [{l:'Velocity (ft/s)',n:'v',d:5},{l:'Diameter (in)',n:'d',d:2}], form: '(2.448 * (values.d**2) * values.v)', desc: 'Approximate flow rate (GPM)' },
  { id: 'hvac-btu-calc', title: 'HVAC BTU Estimator', cat: 'construction', inps: [{l:'Room Area (sq ft)',n:'a',d:500}], form: '(values.a * 20)', desc: 'Approximate BTUs for cooling' },
  { id: 'watts-to-amps', title: 'Watts to Amps', cat: 'conversion', inps: [{l:'Watts',n:'w',d:1200},{l:'Volts',n:'v',d:120}], form: '(values.w / values.v)', desc: 'Convert Watts to Amps' },
  { id: 'amps-to-watts', title: 'Amps to Watts', cat: 'conversion', inps: [{l:'Amps',n:'a',d:10},{l:'Volts',n:'v',d:120}], form: '(values.a * values.v)', desc: 'Convert Amps to Watts' },
  { id: 'hp-to-watts', title: 'HP to Watts', cat: 'conversion', inps: [{l:'Horsepower',n:'hp',d:1}], form: '(values.hp * 745.7)', desc: 'Convert Horsepower to Watts' },
  { id: 'watts-to-hp', title: 'Watts to HP', cat: 'conversion', inps: [{l:'Watts',n:'w',d:745.7}], form: '(values.w / 745.7)', desc: 'Convert Watts to Horsepower' },
  { id: 'btu-to-kw', title: 'BTU/hr to kW', cat: 'conversion', inps: [{l:'BTU/hr',n:'b',d:10000}], form: '(values.b / 3412.142)', desc: 'Convert BTU/hr to Kilowatts' },
  { id: 'kw-to-btu', title: 'kW to BTU/hr', cat: 'conversion', inps: [{l:'kW',n:'k',d:3}], form: '(values.k * 3412.142)', desc: 'Convert kW to BTU/hr' },
  { id: 'cfm-to-lps', title: 'CFM to L/s', cat: 'conversion', inps: [{l:'CFM',n:'c',d:100}], form: '(values.c * 0.471947)', desc: 'Convert Cubic Feet/Min to Liters/sec' },
  { id: 'lps-to-cfm', title: 'L/s to CFM', cat: 'conversion', inps: [{l:'L/s',n:'l',d:50}], form: '(values.l / 0.471947)', desc: 'Convert L/s to CFM' },
  { id: 'psi-to-bar', title: 'PSI to Bar', cat: 'conversion', inps: [{l:'PSI',n:'p',d:30}], form: '(values.p / 14.5038)', desc: 'Convert PSI to Bar' },
  { id: 'bar-to-psi', title: 'Bar to PSI', cat: 'conversion', inps: [{l:'Bar',n:'b',d:2.5}], form: '(values.b * 14.5038)', desc: 'Convert Bar to PSI' },
  { id: 'kg-to-newtons', title: 'Kg to Newtons', cat: 'conversion', inps: [{l:'Mass (kg)',n:'m',d:10}], form: '(values.m * 9.80665)', desc: 'Convert kg force to Newtons' },
  { id: 'newtons-to-kg', title: 'Newtons to Kg', cat: 'conversion', inps: [{l:'Force (N)',n:'n',d:100}], form: '(values.n / 9.80665)', desc: 'Convert Newtons to kg mass' }
];

let logicCode = `import { CalculationResult } from '../../types.ts';\n\n`;
for(const c of calculators) {
  const funcName = c.id.replace(/-/g, '_');
  logicCode += `export function ${funcName}(values: Record<string, any>): CalculationResult[] {
  try {
    const result = ${c.form};
    return [
      { label: 'Result', value: Number.isFinite(result) ? result.toFixed(2) : '0.00', isPrimary: true, explanation: '${c.desc.replace(/'/g, "\\'")}.' }
    ];
  } catch(e) {
    return [{ label: 'Result', value: '0.00', isPrimary: true }];
  }
}\n\n`;
}
fs.writeFileSync('src/lib/calculators/batch_new_100.ts', logicCode);

// Append to calculatorLogic.ts
let exportCode = fs.readFileSync('src/lib/calculatorLogic.ts', 'utf8');
exportCode += `\nexport * as LogicBatchNew100 from './calculators/batch_new_100.ts';\n`;
fs.writeFileSync('src/lib/calculatorLogic.ts', exportCode);

const constantsPath = 'src/constants.ts';
let constantsContent = fs.readFileSync(constantsPath, 'utf8');

let newObjects = calculators.map(c => 
  `  { id: '${c.id}', title: '${c.title.replace(/'/g, "\\'")}', slug: '${c.id}', description: '${c.desc.replace(/'/g, "\\'")}', category: '${c.cat}', priority: 'P3', icon: 'Calculator', formula: '', howItWorks: [], faqs: [], countryTips: [], relatedSlugs: [], seoTitle: '${c.title.replace(/'/g, "\\'")} Calculator', seoDescription: 'Free online ${c.title.replace(/'/g, "\\'")} Calculator. ${c.desc.replace(/'/g, "\\'")}.' }`
).join(',\n');

constantsContent = constantsContent.replace(
  'const RAW_CALCULATORS: CalculatorMetadata[] = [',
  'const RAW_CALCULATORS: CalculatorMetadata[] = [\n' + newObjects + ','
);
fs.writeFileSync(constantsPath, constantsContent);

const detailPath = 'src/pages/CalculatorDetail.tsx';
let detailContent = fs.readFileSync(detailPath, 'utf8');

let logicEntries = calculators.map(c => `  '${c.id}': Logic.LogicBatchNew100.${c.id.replace(/-/g, '_')}`).join(',\n');
detailContent = detailContent.replace(
  'const LOGIC_MAP: Record<string, (values: Record<string, any>) => any> = {',
  'const LOGIC_MAP: Record<string, (values: Record<string, any>) => any> = {\n' + logicEntries + ','
);

let inputEntries = calculators.map(c => {
  const inpsStr = c.inps.map(i => `{label: '${i.l}', name: '${i.n}', type: 'number', defaultValue: ${i.d}}`).join(', ');
  return `  '${c.id}': [${inpsStr}]`;
}).join(',\n');
detailContent = detailContent.replace(
  'const INPUT_MAP: Record<string, CalculationInput[]> = {',
  'const INPUT_MAP: Record<string, CalculationInput[]> = {\n' + inputEntries + ','
);

fs.writeFileSync(detailPath, detailContent);
console.log("Added new high-volume calculators:", calculators.length);
