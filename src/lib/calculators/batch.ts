import { CalculationResult } from '../../types.ts';
import { formatCurrency } from '../utils.ts';

export function calculate_pregnancy_due_date(values: Record<string, any>): CalculationResult[] {
  const lmpTime = new Date(values.lmp).getTime(); if (isNaN(lmpTime)) return []; const due = new Date(lmpTime + 280 * 24 * 60 * 60 * 1000); return [{ label: 'Estimated Due Date', value: due.toDateString(), isPrimary: true }];
}

export function calculate_ovulation(values: Record<string, any>): CalculationResult[] {
  const lmpTime = new Date(values.lmp).getTime(); const cycle = parseFloat(values.cycle); if (isNaN(lmpTime) || isNaN(cycle)) return []; const ovu = new Date(lmpTime + (cycle - 14) * 24 * 60 * 60 * 1000); return [{ label: 'Estimated Ovulation Date', value: ovu.toDateString(), isPrimary: true }];
}

export function calculate_tdee(values: Record<string, any>): CalculationResult[] {
  const w = parseFloat(values.weight); const h = parseFloat(values.height); const a = parseFloat(values.age); const m = values.gender !== 'female'; const act = parseFloat(values.activity); if(isNaN(w)||isNaN(h)||isNaN(a)||isNaN(act)) return []; const bmr = 10*w + 6.25*h - 5*a + (m?5:-161); return [{ label: 'TDEE (Calories/day)', value: Math.round(bmr*act).toString(), isPrimary: true }];
}

export function calculate_one_rep_max(values: Record<string, any>): CalculationResult[] {
  const w = parseFloat(values.weight); const r = parseFloat(values.reps); if(isNaN(w)||isNaN(r)||r<1) return []; const orm = w * (1 + r/30); return [{ label: 'Estimated 1RM', value: Math.round(orm).toString(), isPrimary: true }];
}

export function calculate_body_surface_area(values: Record<string, any>): CalculationResult[] {
  const w = parseFloat(values.weight); const h = parseFloat(values.height); if(isNaN(w)||isNaN(h)) return []; const bsa = Math.sqrt((w*h)/3600); return [{ label: 'Body Surface Area (m²)', value: bsa.toFixed(2), isPrimary: true }];
}

export function calculate_pythagorean(values: Record<string, any>): CalculationResult[] {
  const a = parseFloat(values.a); const b = parseFloat(values.b); if(isNaN(a)||isNaN(b)) return []; return [{ label: 'Hypotenuse (C)', value: Math.sqrt(a*a + b*b).toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_sphere_volume(values: Record<string, any>): CalculationResult[] {
  const r = parseFloat(values.r); if(isNaN(r)) return []; return [{ label: 'Volume', value: ((4/3)*Math.PI*Math.pow(r,3)).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_cylinder_volume(values: Record<string, any>): CalculationResult[] {
  const r = parseFloat(values.r); const h = parseFloat(values.h); if(isNaN(r)||isNaN(h)) return []; return [{ label: 'Volume', value: (Math.PI*Math.pow(r,2)*h).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_cone_volume(values: Record<string, any>): CalculationResult[] {
  const r = parseFloat(values.r); const h = parseFloat(values.h); if(isNaN(r)||isNaN(h)) return []; return [{ label: 'Volume', value: ((1/3)*Math.PI*Math.pow(r,2)*h).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_quadratic_equation(values: Record<string, any>): CalculationResult[] {
  const a = parseFloat(values.a); const b = parseFloat(values.b); const c = parseFloat(values.c); if(isNaN(a)||isNaN(b)||isNaN(c)) return []; const d = b*b - 4*a*c; if (d < 0) return [{ label: 'Roots', value: 'Complex roots', isPrimary: true }]; const r1 = (-b + Math.sqrt(d))/(2*a); const r2 = (-b - Math.sqrt(d))/(2*a); return [{ label: 'Root 1', value: r1.toString(), isPrimary: true }, { label: 'Root 2', value: r2.toString() }];
}

export function calculate_midpoint(values: Record<string, any>): CalculationResult[] {
  const x1=parseFloat(values.x1); const y1=parseFloat(values.y1); const x2=parseFloat(values.x2); const y2=parseFloat(values.y2); if(isNaN(x1)||isNaN(y1)||isNaN(x2)||isNaN(y2)) return []; return [{ label: 'Midpoint', value: (x1+x2)/2 + ", " + (y1+y2)/2, isPrimary: true }];
}

export function calculate_distance_2d(values: Record<string, any>): CalculationResult[] {
  const x1=parseFloat(values.x1); const y1=parseFloat(values.y1); const x2=parseFloat(values.x2); const y2=parseFloat(values.y2); if(isNaN(x1)||isNaN(y1)||isNaN(x2)||isNaN(y2)) return []; const d = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2)); return [{ label: 'Distance', value: d.toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_slope(values: Record<string, any>): CalculationResult[] {
  const x1=parseFloat(values.x1); const y1=parseFloat(values.y1); const x2=parseFloat(values.x2); const y2=parseFloat(values.y2); if(isNaN(x1)||isNaN(y1)||isNaN(x2)||isNaN(y2)) return []; if (x1 === x2) return [{ label: 'Slope', value: 'Undefined (Vertical)', isPrimary: true }]; return [{ label: 'Slope', value: ((y2-y1)/(x2-x1)).toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_factorial(values: Record<string, any>): CalculationResult[] {
  const n = parseInt(values.n); if(isNaN(n) || n < 0) return []; let f = 1; for(let i=2; i<=n; i++) f*=i; return [{ label: 'Factorial', value: f.toString(), isPrimary: true }];
}

export function calculate_combinations(values: Record<string, any>): CalculationResult[] {
  const n = parseInt(values.n); const r = parseInt(values.r); if(isNaN(n)||isNaN(r)||n<0||r<0||r>n) return []; let f = 1; for(let i=1; i<=r; i++) { f = f * (n - i + 1) / i; } return [{ label: 'Combinations (nCr)', value: Math.round(f).toString(), isPrimary: true }];
}

export function calculate_permutations(values: Record<string, any>): CalculationResult[] {
  const n = parseInt(values.n); const r = parseInt(values.r); if(isNaN(n)||isNaN(r)||n<0||r<0||r>n) return []; let f = 1; for(let i=0; i<r; i++) { f = f * (n - i); } return [{ label: 'Permutations (nPr)', value: Math.round(f).toString(), isPrimary: true }];
}

export function calculate_prime_factorization(values: Record<string, any>): CalculationResult[] {
  let n = parseInt(values.n); if(isNaN(n) || n < 2) return []; const factors = []; let d = 2; while (n > 1) { while (n % d === 0) { factors.push(d); n /= d; } d++; if (d * d > n && n > 1) { factors.push(n); break; } } return [{ label: 'Prime Factors', value: factors.join(' × '), isPrimary: true }];
}

export function calculate_gcd_lcm(values: Record<string, any>): CalculationResult[] {
  const a = parseInt(values.a); const b = parseInt(values.b); if(isNaN(a)||isNaN(b)||a<1||b<1) return []; const gcd = (x,y) => (!y ? x : gcd(y, x%y)); const g = gcd(a,b); const l = (a*b)/g; return [{ label: 'GCD', value: g.toString(), isPrimary: true }, { label: 'LCM', value: l.toString() }];
}

export function calculate_standard_deviation(values: Record<string, any>): CalculationResult[] {
  if(!values.vals) return []; const arr = values.vals.split(',').map(v=>parseFloat(v.trim())).filter(v=>!isNaN(v)); if(arr.length < 2) return []; const mean = arr.reduce((a,b)=>a+b)/arr.length; const variance = arr.reduce((a,b)=>a+Math.pow(b-mean,2),0)/(arr.length-1); return [{ label: 'Sample Std Dev', value: Math.sqrt(variance).toPrecision(6).toString(), isPrimary: true }, { label: 'Variance', value: variance.toPrecision(6).toString() }];
}

export function calculate_kinetic_energy(values: Record<string, any>): CalculationResult[] {
  const m = parseFloat(values.m); const v = parseFloat(values.v); if(isNaN(m)||isNaN(v)) return []; return [{ label: 'Kinetic Energy (J)', value: (0.5*m*v*v).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_potential_energy(values: Record<string, any>): CalculationResult[] {
  const m = parseFloat(values.m); const h = parseFloat(values.h); if(isNaN(m)||isNaN(h)) return []; return [{ label: 'Potential Energy (J)', value: (m*9.81*h).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_ohm_law(values: Record<string, any>): CalculationResult[] {
  const v = parseFloat(values.v); const i = parseFloat(values.i); const r = parseFloat(values.r); if(isNaN(v) && !isNaN(i) && !isNaN(r)) return [{label: 'Voltage (V)', value: (i*r).toPrecision(5), isPrimary: true}]; if(!isNaN(v) && isNaN(i) && !isNaN(r)) return [{label: 'Current (A)', value: (v/r).toPrecision(5), isPrimary: true}]; if(!isNaN(v) && !isNaN(i) && isNaN(r)) return [{label: 'Resistance (Ω)', value: (v/i).toPrecision(5), isPrimary: true}]; return [{label: 'Error', value: 'Leave exactly one field empty'}];
}

export function calculate_power(values: Record<string, any>): CalculationResult[] {
  const v = parseFloat(values.v); const i = parseFloat(values.i); if(isNaN(v)||isNaN(i)) return []; return [{ label: 'Power (W)', value: (v*i).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_density(values: Record<string, any>): CalculationResult[] {
  const m = parseFloat(values.m); const v = parseFloat(values.v); if(isNaN(m)||isNaN(v)||v===0) return []; return [{ label: 'Density (kg/m³)', value: (m/v).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_force(values: Record<string, any>): CalculationResult[] {
  const m = parseFloat(values.m); const a = parseFloat(values.a); if(isNaN(m)||isNaN(a)) return []; return [{ label: 'Force (N)', value: (m*a).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_speed_distance_time(values: Record<string, any>): CalculationResult[] {
  const d=parseFloat(values.d); const s=parseFloat(values.s); const t=parseFloat(values.t); if(isNaN(d)&&!isNaN(s)&&!isNaN(t)) return [{label: 'Distance', value: (s*t).toPrecision(5), isPrimary:true}]; if(!isNaN(d)&&isNaN(s)&&!isNaN(t)) return [{label: 'Speed', value: (d/t).toPrecision(5), isPrimary:true}]; if(!isNaN(d)&&!isNaN(s)&&isNaN(t)) return [{label: 'Time', value: (d/s).toPrecision(5), isPrimary:true}]; return [{label: 'Error', value: 'Leave exactly ONE blank'}];
}

export function calculate_present_value(values: Record<string, any>): CalculationResult[] {
  const currencySymbol = values.currencySymbol || '$';
  const fv=parseFloat(values.fv); const r=parseFloat(values.r)/100; const n=parseFloat(values.n); if(isNaN(fv)||isNaN(r)||isNaN(n)) return []; return [{ label: 'Present Value', value: formatCurrency((fv/Math.pow(1+r, n)), currencySymbol), isPrimary: true }];
}

export function calculate_future_value(values: Record<string, any>): CalculationResult[] {
  const currencySymbol = values.currencySymbol || '$';
  const pv=parseFloat(values.pv); const r=parseFloat(values.r)/100; const n=parseFloat(values.n); if(isNaN(pv)||isNaN(r)||isNaN(n)) return []; return [{ label: 'Future Value', value: formatCurrency((pv*Math.pow(1+r, n)), currencySymbol), isPrimary: true }];
}

export function calculate_apy(values: Record<string, any>): CalculationResult[] {
  const apr=parseFloat(values.apr)/100; const n=parseFloat(values.n); if(isNaN(apr)||isNaN(n)) return []; const apy = Math.pow(1 + apr/n, n) - 1; return [{ label: 'APY', value: (apy*100).toFixed(3)+'%', isPrimary: true }];
}

export function calculate_current_yield(values: Record<string, any>): CalculationResult[] {
  const c=parseFloat(values.c); const p=parseFloat(values.p); if(isNaN(c)||isNaN(p)) return []; return [{ label: 'Current Yield', value: ((c/p)*100).toFixed(2)+'%', isPrimary: true }];
}

export function calculate_dividend_yield(values: Record<string, any>): CalculationResult[] {
  const d=parseFloat(values.d); const p=parseFloat(values.p); if(isNaN(d)||isNaN(p)) return []; return [{ label: 'Dividend Yield', value: ((d/p)*100).toFixed(2)+'%', isPrimary: true }];
}

export function calculate_wacc(values: Record<string, any>): CalculationResult[] {
  const e=parseFloat(values.e); const d=parseFloat(values.d); const ce=parseFloat(values.ce)/100; const cd=parseFloat(values.cd)/100; const t=parseFloat(values.t)/100; if(isNaN(e)||isNaN(d)||isNaN(ce)||isNaN(cd)||isNaN(t)) return []; const v = e+d; if(v===0) return []; const wacc = (e/v)*ce + (d/v)*cd*(1-t); return [{ label: 'WACC', value: (wacc*100).toFixed(2)+'%', isPrimary: true }];
}

export function calculate_current_ratio(values: Record<string, any>): CalculationResult[] {
  const a=parseFloat(values.a); const l=parseFloat(values.l); if(isNaN(a)||isNaN(l)||l===0) return []; return [{ label: 'Current Ratio', value: (a/l).toFixed(2), isPrimary: true }];
}

export function calculate_quick_ratio(values: Record<string, any>): CalculationResult[] {
  const a=parseFloat(values.a); const i=parseFloat(values.i); const l=parseFloat(values.l); if(isNaN(a)||isNaN(i)||isNaN(l)||l===0) return []; return [{ label: 'Quick Ratio', value: ((a-i)/l).toFixed(2), isPrimary: true }];
}

export function calculate_debt_to_equity(values: Record<string, any>): CalculationResult[] {
  const l=parseFloat(values.l); const e=parseFloat(values.e); if(isNaN(l)||isNaN(e)||e===0) return []; return [{ label: 'D/E Ratio', value: (l/e).toFixed(2), isPrimary: true }];
}

export function calculate_bra_size(values: Record<string, any>): CalculationResult[] {
  const u=parseFloat(values.u); const b=parseFloat(values.b); if(isNaN(u)||isNaN(b)) return []; let band = Math.round(u); if(band%2!==0) band+=1; const diff = b - band; const cups = ['AA','A','B','C','D','DD','E','F','FF','G']; let cup = diff < 0 ? 'AA' : cups[diff] || 'Unknown'; return [{ label: 'Estimated Size', value: band + cup, isPrimary: true }];
}

export function calculate_shoe_size_converter(values: Record<string, any>): CalculationResult[] {
  const us = parseFloat(values.us); if(isNaN(us)) return []; return [{ label: 'UK Size', value: (us - 1).toString(), isPrimary: true }, { label: 'EU Size (approx)', value: Math.round(33 + (us * 1.33)).toString() }];
}

export function calculate_temperature_converter(values: Record<string, any>): CalculationResult[] {
  const t = parseFloat(values.t); const f = values.from; if(isNaN(t)) return []; let c = t; if(f==='f') c = (t-32)*5/9; if(f==='k') c = t - 273.15; return [{ label: 'Celsius', value: c.toFixed(2)+' °C', isPrimary: true }, { label: 'Fahrenheit', value: (c*9/5 + 32).toFixed(2)+' °F' }, { label: 'Kelvin', value: (c+273.15).toFixed(2)+' K' }];
}

export function calculate_weight_converter(values: Record<string, any>): CalculationResult[] {
  const w = parseFloat(values.w); const f = values.from; if(isNaN(w)) return []; let kg = f==='lb' ? w*0.453592 : w; return [{ label: 'Kilograms', value: kg.toFixed(2), isPrimary: true }, { label: 'Pounds', value: (kg*2.20462).toFixed(2) }];
}

export function calculate_data_storage_converter(values: Record<string, any>): CalculationResult[] {
  const gb = parseFloat(values.gb); if(isNaN(gb)) return []; return [{ label: 'Megabytes (MB)', value: (gb*1024).toString(), isPrimary: true }, { label: 'Terabytes (TB)', value: (gb/1024).toPrecision(5).toString() }];
}

export function calculate_dog_age(values: Record<string, any>): CalculationResult[] {
  const d=parseFloat(values.d); if(isNaN(d)) return []; let h = d<=2 ? d*10.5 : 21 + (d-2)*4; return [{ label: 'Human Years', value: h.toString(), isPrimary: true }];
}

export function calculate_cat_age(values: Record<string, any>): CalculationResult[] {
  const c=parseFloat(values.c); if(isNaN(c)) return []; let h = c===1 ? 15 : (c===2 ? 24 : 24 + (c-2)*4); return [{ label: 'Human Years', value: h.toString(), isPrimary: true }];
}

export function calculate_energy_cost(values: Record<string, any>): CalculationResult[] {
  const currencySymbol = values.currencySymbol || '$';
  const w = parseFloat(values.w); const h = parseFloat(values.h); const c = parseFloat(values.c); if(isNaN(w)||isNaN(h)||isNaN(c)) return []; const cost = (w/1000)*h*c*30; return [{ label: 'Monthly Cost', value: formatCurrency(cost, currencySymbol), isPrimary: true }];
}

export function calculate_pool_volume(values: Record<string, any>): CalculationResult[] {
  const l = parseFloat(values.l); const w = parseFloat(values.w); const d = parseFloat(values.d); if(isNaN(l)||isNaN(w)||isNaN(d)) return []; const gallons = l*w*d*7.5; return [{ label: 'Volume (Gallons)', value: Math.round(gallons).toString(), isPrimary: true }];
}

export function calculate_concrete_volume(values: Record<string, any>): CalculationResult[] {
  const l = parseFloat(values.l); const w = parseFloat(values.w); const t = parseFloat(values.t); if(isNaN(l)||isNaN(w)||isNaN(t)) return []; const yards = (l*w*(t/12))/27; return [{ label: 'Concrete Needed (Cubic Yards)', value: yards.toFixed(2), isPrimary: true }];
}

export function calculate_paint(values: Record<string, any>): CalculationResult[] {
  const l = parseFloat(values.l); const h = parseFloat(values.h); if(isNaN(l)||isNaN(h)) return []; const sqft = l*h; return [{ label: 'Paint Needed (Gallons)', value: (sqft/350).toFixed(2), isPrimary: true }];
}

export function calculate_roofing(values: Record<string, any>): CalculationResult[] {
  const a = parseFloat(values.a); if(isNaN(a)) return []; const squares = a/100; return [{ label: 'Roofing Squares needed', value: Math.ceil(squares).toString(), isPrimary: true }];
}

export function calculate_z_score(values: Record<string, any>): CalculationResult[] {
  const x=parseFloat(values.x); const m=parseFloat(values.m); const s=parseFloat(values.s); if(isNaN(x)||isNaN(m)||isNaN(s)||s===0) return []; return [{ label: 'Z-Score', value: ((x-m)/s).toFixed(3), isPrimary: true }];
}

export function calculate_expected_value(values: Record<string, any>): CalculationResult[] {
  if(!values.v||!values.p) return []; const val = values.v.split(',').map(x=>parseFloat(x.trim())); const pb = values.p.split(',').map(x=>parseFloat(x.trim())); if(val.length !== pb.length || val.some(isNaN) || pb.some(isNaN)) return []; let ev = 0; for(let i=0; i<val.length; i++) ev += val[i]*pb[i]; return [{ label: 'Expected Value', value: ev.toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_roman_numerals(values: Record<string, any>): CalculationResult[] {
  let n = parseInt(values.n); if(isNaN(n) || n < 1 || n > 3999) return []; const val = [1000,900,500,400,100,90,50,40,10,9,5,4,1]; const s = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]; let rn = ""; for(let i=0; i<val.length; i++){ while(n >= val[i]){ rn += s[i]; n -= val[i]; } } return [{ label: 'Roman Numeral', value: rn, isPrimary: true }];
}

export function calculate_ratio(values: Record<string, any>): CalculationResult[] {
  const a=parseFloat(values.a); const b=parseFloat(values.b); const c=parseFloat(values.c); if(isNaN(a)||isNaN(b)||isNaN(c)||a===0) return []; return [{ label: 'Equivalent D', value: ((b/a)*c).toFixed(2), isPrimary: true }];
}

export function calculate_percentage_diff(values: Record<string, any>): CalculationResult[] {
  const v1=parseFloat(values.v1); const v2=parseFloat(values.v2); if(isNaN(v1)||isNaN(v2)) return []; const diff=Math.abs(v1-v2); const avg=(v1+v2)/2; return [{ label: 'Difference', value: ((diff/avg)*100).toFixed(2)+'%', isPrimary: true }];
}

export function calculate_percentage_error(values: Record<string, any>): CalculationResult[] {
  const o=parseFloat(values.o); const e=parseFloat(values.e); if(isNaN(o)||isNaN(e)||e===0) return []; return [{ label: 'Percentage Error', value: (Math.abs((o-e)/e)*100).toFixed(2)+'%', isPrimary: true }];
}

export function calculate_fraction_decimal(values: Record<string, any>): CalculationResult[] {
  const n=parseFloat(values.n); const d=parseFloat(values.d); if(isNaN(n)||isNaN(d)||d===0) return []; return [{ label: 'Decimal', value: (n/d).toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_triangle_area(values: Record<string, any>): CalculationResult[] {
  const b=parseFloat(values.b); const h=parseFloat(values.h); if(isNaN(b)||isNaN(h)) return []; return [{ label: 'Area', value: (0.5*b*h).toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_rectangle_area(values: Record<string, any>): CalculationResult[] {
  const l=parseFloat(values.l); const w=parseFloat(values.w); if(isNaN(l)||isNaN(w)) return []; return [{ label: 'Area', value: (l*w).toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_circle_circumference(values: Record<string, any>): CalculationResult[] {
  const r=parseFloat(values.r); if(isNaN(r)) return []; return [{ label: 'Circumference', value: (2*Math.PI*r).toPrecision(6).toString(), isPrimary: true }, { label: 'Area', value: (Math.PI*r*r).toPrecision(6).toString() }];
}

export function calculate_arc_length(values: Record<string, any>): CalculationResult[] {
  const r=parseFloat(values.r); const a=parseFloat(values.a); if(isNaN(r)||isNaN(a)) return []; return [{ label: 'Arc Length', value: (2*Math.PI*r*(a/360)).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_sector_area(values: Record<string, any>): CalculationResult[] {
  const r=parseFloat(values.r); const a=parseFloat(values.a); if(isNaN(r)||isNaN(a)) return []; return [{ label: 'Sector Area', value: (Math.PI*r*r*(a/360)).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_sphere_surface_area(values: Record<string, any>): CalculationResult[] {
  const r=parseFloat(values.r); if(isNaN(r)) return []; return [{ label: 'Surface Area', value: (4*Math.PI*r*r).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_cylinder_surface_area(values: Record<string, any>): CalculationResult[] {
  const r=parseFloat(values.r); const h=parseFloat(values.h); if(isNaN(r)||isNaN(h)) return []; return [{ label: 'Surface Area', value: (2*Math.PI*r*h + 2*Math.PI*r*r).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_box_surface_area(values: Record<string, any>): CalculationResult[] {
  const l=parseFloat(values.l); const w=parseFloat(values.w); const h=parseFloat(values.h); if(isNaN(l)||isNaN(w)||isNaN(h)) return []; return [{ label: 'Surface Area', value: (2*(l*w + w*h + l*h)).toPrecision(6).toString(), isPrimary: true }];
}

export function calculate_margin_of_error(values: Record<string, any>): CalculationResult[] {
  const z=parseFloat(values.z); const s=parseFloat(values.s); const n=parseFloat(values.n); if(isNaN(z)||isNaN(s)||isNaN(n)||n<=0) return []; return [{ label: 'Margin of Error', value: (z*(s/Math.sqrt(n))).toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_rule_of_72(values: Record<string, any>): CalculationResult[] {
  const r=parseFloat(values.r); if(isNaN(r)||r===0) return []; return [{ label: 'Years to Double', value: (72/r).toFixed(2), isPrimary: true }];
}

export function calculate_sales_tax(values: Record<string, any>): CalculationResult[] {
  const currencySymbol = values.currencySymbol || '$';
  const p=parseFloat(values.p); const r=parseFloat(values.r)/100; if(isNaN(p)||isNaN(r)) return []; const t = p*r; return [{ label: 'Tax Amount', value: formatCurrency(t, currencySymbol), isPrimary: true }, { label: 'Total Price', value: formatCurrency((p+t), currencySymbol) }];
}

export function calculate_vat(values: Record<string, any>): CalculationResult[] {
  const currencySymbol = values.currencySymbol || '$';
  const p=parseFloat(values.p); const r=parseFloat(values.r)/100; if(isNaN(p)||isNaN(r)) return []; const t = p*r; return [{ label: 'VAT Amount', value: formatCurrency(t, currencySymbol), isPrimary: true }, { label: 'Gross Price', value: formatCurrency((p+t), currencySymbol) }];
}

export function calculate_profit_percentage(values: Record<string, any>): CalculationResult[] {
  const c=parseFloat(values.c); const s=parseFloat(values.s); if(isNaN(c)||isNaN(s)||c===0) return []; return [{ label: 'Profit %', value: (((s-c)/c)*100).toFixed(2)+'%', isPrimary: true }];
}

export function calculate_revenue(values: Record<string, any>): CalculationResult[] {
  const currencySymbol = values.currencySymbol || '$';
  const p=parseFloat(values.p); const u=parseFloat(values.u); if(isNaN(p)||isNaN(u)) return []; return [{ label: 'Total Revenue', value: formatCurrency((p*u), currencySymbol), isPrimary: true }];
}

export function calculate_net_income(values: Record<string, any>): CalculationResult[] {
  const currencySymbol = values.currencySymbol || '$';
  const r=parseFloat(values.r); const e=parseFloat(values.e); if(isNaN(r)||isNaN(e)) return []; return [{ label: 'Net Income', value: formatCurrency((r-e), currencySymbol), isPrimary: true }];
}

export function calculate_inventory_turnover(values: Record<string, any>): CalculationResult[] {
  const c=parseFloat(values.c); const i=parseFloat(values.i); if(isNaN(c)||isNaN(i)||i===0) return []; return [{ label: 'Turnover Ratio', value: (c/i).toFixed(2), isPrimary: true }];
}

export function calculate_days_in_inventory(values: Record<string, any>): CalculationResult[] {
  const i=parseFloat(values.i); const c=parseFloat(values.c); if(isNaN(i)||isNaN(c)||c===0) return []; return [{ label: 'Days in Inventory', value: ((i/c)*365).toFixed(2), isPrimary: true }];
}

export function calculate_receivables_turnover(values: Record<string, any>): CalculationResult[] {
  const s=parseFloat(values.s); const a=parseFloat(values.a); if(isNaN(s)||isNaN(a)||a===0) return []; return [{ label: 'Turnover Ratio', value: (s/a).toFixed(2), isPrimary: true }];
}

export function calculate_return_on_assets(values: Record<string, any>): CalculationResult[] {
  const i=parseFloat(values.i); const a=parseFloat(values.a); if(isNaN(i)||isNaN(a)||a===0) return []; return [{ label: 'ROA', value: ((i/a)*100).toFixed(2)+'%', isPrimary: true }];
}

export function calculate_return_on_equity(values: Record<string, any>): CalculationResult[] {
  const i=parseFloat(values.i); const e=parseFloat(values.e); if(isNaN(i)||isNaN(e)||e===0) return []; return [{ label: 'ROE', value: ((i/e)*100).toFixed(2)+'%', isPrimary: true }];
}

export function calculate_calorie_deficit(values: Record<string, any>): CalculationResult[] {
  const t=parseFloat(values.tdee); const w=parseFloat(values.w); if(isNaN(t)||isNaN(w)) return []; const deficit = (w * 3500) / 7; return [{ label: 'Daily Calorie Target', value: Math.round(t - deficit).toString(), isPrimary: true }, { label: 'Daily Deficit', value: Math.round(deficit).toString() }];
}

export function calculate_run_pace(values: Record<string, any>): CalculationResult[] {
  const d=parseFloat(values.d); const t=parseFloat(values.t); if(isNaN(d)||isNaN(t)||d===0) return []; const p = t/d; const mins = Math.floor(p); const secs = Math.round((p-mins)*60); return [{ label: 'Pace (min/mi)', value: mins + ":" + (secs<10?"0"+secs:secs), isPrimary: true }];
}

export function calculate_ideal_weight(values: Record<string, any>): CalculationResult[] {
  const h=parseFloat(values.h); const m=values.gender!=='female'; if(isNaN(h)) return []; const iw = m ? 50 + 0.91*(h-152.4) : 45.5 + 0.91*(h-152.4); return [{ label: 'Ideal Weight (kg)', value: iw.toFixed(1), isPrimary: true }];
}

export function calculate_water_intake(values: Record<string, any>): CalculationResult[] {
  const w=parseFloat(values.w); const e=parseFloat(values.e); if(isNaN(w)||isNaN(e)) return []; const oz = (w*2.20462)*0.5 + (e/30)*12; const liters = oz * 0.0295735; return [{ label: 'Daily Water (Liters)', value: liters.toFixed(2), isPrimary: true }, { label: 'Daily Water (Oz)', value: oz.toFixed(0) }];
}

export function calculate_blood_donation(values: Record<string, any>): CalculationResult[] {
  const d=new Date(values.d).getTime(); if(isNaN(d)) return []; const next = new Date(d + 56 * 24 * 60 * 60 * 1000); return [{ label: 'Next Eligible Date', value: next.toDateString(), isPrimary: true }];
}

export function calculate_velocity_calc(values: Record<string, any>): CalculationResult[] {
  const d=parseFloat(values.d); const t=parseFloat(values.t); if(isNaN(d)||isNaN(t)||t===0) return []; return [{ label: 'Velocity (m/s)', value: (d/t).toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_torque_calc(values: Record<string, any>): CalculationResult[] {
  const f=parseFloat(values.f); const r=parseFloat(values.r); const a=parseFloat(values.a); if(isNaN(f)||isNaN(r)||isNaN(a)) return []; const t = r*f*Math.sin(a*(Math.PI/180)); return [{ label: 'Torque (N·m)', value: t.toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_mass_energy(values: Record<string, any>): CalculationResult[] {
  const m=parseFloat(values.m); if(isNaN(m)) return []; const c = 299792458; const e = m*c*c; return [{ label: 'Energy (Joules)', value: e.toExponential(4).toString(), isPrimary: true }];
}

export function calculate_hookes_law(values: Record<string, any>): CalculationResult[] {
  const k=parseFloat(values.k); const x=parseFloat(values.x); if(isNaN(k)||isNaN(x)) return []; return [{ label: 'Restoring Force (N)', value: (-k*x).toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_kinetic_friction(values: Record<string, any>): CalculationResult[] {
  const u=parseFloat(values.u); const n=parseFloat(values.n); if(isNaN(u)||isNaN(n)) return []; return [{ label: 'Kinetic Friction (N)', value: (u*n).toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_escape_velocity(values: Record<string, any>): CalculationResult[] {
  const m=parseFloat(values.m); const r=parseFloat(values.r); if(isNaN(m)||isNaN(r)||r===0) return []; const G = 6.67430e-11; const v = Math.sqrt((2*G*m)/r); return [{ label: 'Escape Velocity (m/s)', value: v.toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_decimal_binary(values: Record<string, any>): CalculationResult[] {
  const n=parseInt(values.n); if(isNaN(n)) return []; return [{ label: 'Binary', value: n.toString(2), isPrimary: true }];
}

export function calculate_decimal_hex(values: Record<string, any>): CalculationResult[] {
  const n=parseInt(values.n); if(isNaN(n)) return []; return [{ label: 'Hexadecimal', value: n.toString(16).toUpperCase(), isPrimary: true }];
}

export function calculate_binary_decimal(values: Record<string, any>): CalculationResult[] {
  if(!values.b) return []; const n = parseInt(values.b, 2); if(isNaN(n)) return []; return [{ label: 'Decimal', value: n.toString(), isPrimary: true }];
}

export function calculate_hex_decimal(values: Record<string, any>): CalculationResult[] {
  if(!values.h) return []; const n = parseInt(values.h, 16); if(isNaN(n)) return []; return [{ label: 'Decimal', value: n.toString(), isPrimary: true }];
}

export function calculate_base64_encode(values: Record<string, any>): CalculationResult[] {
  if(!values.t) return []; try{ const b = btoa(values.t); return [{ label: 'Base64', value: b, isPrimary: true }]; }catch(e){return [];}
}

export function calculate_words_calculator(values: Record<string, any>): CalculationResult[] {
  if(!values.t) return []; const words = values.t.trim().split(/\s+/).filter(w=>w.length>0).length; const chars = values.t.length; return [{ label: 'Word Count', value: words.toString(), isPrimary: true }, { label: 'Character Count', value: chars.toString() }];
}

export function calculate_time_duration(values: Record<string, any>): CalculationResult[] {
  if(!values.s||!values.e) return []; try{ const [h1,m1] = values.s.split(':').map(Number); const [h2,m2] = values.e.split(':').map(Number); let dMin = (h2*60 + m2) - (h1*60 + m1); if(dMin < 0) dMin += 24*60; return [{ label: 'Duration', value: Math.floor(dMin/60) + 'h ' + (dMin%60) + 'm', isPrimary: true }]; }catch(E){return [];}
}

export function calculate_days_between(values: Record<string, any>): CalculationResult[] {
  try{ const d1 = new Date(values.s).getTime(); const d2 = new Date(values.e).getTime(); if(isNaN(d1)||isNaN(d2)) return []; const diff = Math.abs(d2-d1)/(1000*60*60*24); return [{ label: 'Days', value: Math.round(diff).toString(), isPrimary: true }]; }catch(e){return [];}
}

export function calculate_timestamp_date(values: Record<string, any>): CalculationResult[] {
  const t=parseFloat(values.t); if(isNaN(t)) return []; const ms = t < 1e12 ? t*1000 : t; return [{ label: 'Date', value: new Date(ms).toUTCString(), isPrimary: true }];
}

export function calculate_adding_time(values: Record<string, any>): CalculationResult[] {
  if(!values.s) return []; const h=parseFloat(values.h)||0; const m=parseFloat(values.m)||0; try{ const [sh, sm] = values.s.split(':').map(Number); if(isNaN(sh)||isNaN(sm)) return []; let tMin = (sh*60 + sm) + (h*60 + m); tMin = tMin % (24*60); const oh=Math.floor(tMin/60); const om=tMin%60; return [{ label: 'New Time', value: oh.toString().padStart(2,'0') + ':' + om.toString().padStart(2,'0'), isPrimary: true }]; }catch(E){return [];}
}

export function calculate_scientific_notation(values: Record<string, any>): CalculationResult[] {
  if(!values.v) return []; const n=Number(values.v); if(isNaN(n)) return []; return [{ label: 'Decimal', value: n.toString(), isPrimary: true }];
}

export function calculate_molar_mass(values: Record<string, any>): CalculationResult[] {
  const m=parseFloat(values.m); if(isNaN(m)) return []; return [{ label: 'Mass of H2O (g)', value: (m*18.01528).toPrecision(5).toString(), isPrimary: true }];
}

export function calculate_moles(values: Record<string, any>): CalculationResult[] {
  const m=parseFloat(values.m); if(isNaN(m)) return []; return [{ label: 'Moles', value: (m/18.01528).toPrecision(5).toString(), isPrimary: true }];
}

