import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { CALCULATORS, CATEGORIES } from '../constants.ts';
import { CalculatorWidget } from '../components/calculator.tsx';
import { SEOArticleBlock } from '../components/SEOArticleBlock.tsx';
import * as Logic from '../lib/calculatorLogic.ts';
import { CalculationInput } from '../types.ts';

// Map calculator IDs to their specific logic functions
export const LOGIC_MAP: Record<string, (values: Record<string, any>) => any> = {
  'bmr-calc-v2': Logic.LogicBatchNew100.bmr_calc_v2,
  'water-intake-calc': Logic.LogicBatchNew100.water_intake_calc,
  'body-fat-navy-calc': Logic.LogicBatchNew100.body_fat_navy_calc,
  'macro-protein-calc': Logic.LogicBatchNew100.macro_protein_calc,
  'macro-carbs-calc': Logic.LogicBatchNew100.macro_carbs_calc,
  'blood-alcohol-calc': Logic.LogicBatchNew100.blood_alcohol_calc,
  'one-rep-max-calc': Logic.LogicBatchNew100.one_rep_max_calc,
  'lean-body-mass-calc': Logic.LogicBatchNew100.lean_body_mass_calc,
  'maximum-heart-rate-calc': Logic.LogicBatchNew100.maximum_heart_rate_calc,
  'target-heart-rate-calc': Logic.LogicBatchNew100.target_heart_rate_calc,
  'calorie-burn-running': Logic.LogicBatchNew100.calorie_burn_running,
  'calorie-burn-walking': Logic.LogicBatchNew100.calorie_burn_walking,
  'calorie-burn-cycling': Logic.LogicBatchNew100.calorie_burn_cycling,
  'vo2-max-calc': Logic.LogicBatchNew100.vo2_max_calc,
  'bmi-prime-calc': Logic.LogicBatchNew100.bmi_prime_calc,
  'ponderal-index-calc': Logic.LogicBatchNew100.ponderal_index_calc,
  'waist-to-hip-calc': Logic.LogicBatchNew100.waist_to_hip_calc,
  'waist-to-height-calc': Logic.LogicBatchNew100.waist_to_height_calc,
  'blood-volume-calc': Logic.LogicBatchNew100.blood_volume_calc,
  'ideal-weight-devine': Logic.LogicBatchNew100.ideal_weight_devine,
  'present-value-calc': Logic.LogicBatchNew100.present_value_calc,
  'future-value-calc': Logic.LogicBatchNew100.future_value_calc,
  'cagr-calc': Logic.LogicBatchNew100.cagr_calc,
  'ebitda-calc': Logic.LogicBatchNew100.ebitda_calc,
  'wacc-calc': Logic.LogicBatchNew100.wacc_calc,
  'quick-ratio-calc': Logic.LogicBatchNew100.quick_ratio_calc,
  'current-ratio-calc': Logic.LogicBatchNew100.current_ratio_calc,
  'debt-to-equity-calc': Logic.LogicBatchNew100.debt_to_equity_calc,
  'roa-calc': Logic.LogicBatchNew100.roa_calc,
  'roe-calc': Logic.LogicBatchNew100.roe_calc,
  'gross-margin-calc': Logic.LogicBatchNew100.gross_margin_calc,
  'operating-margin-calc': Logic.LogicBatchNew100.operating_margin_calc,
  'markup-calc': Logic.LogicBatchNew100.markup_calc,
  'inventory-turnover-calc': Logic.LogicBatchNew100.inventory_turnover_calc,
  'days-sales-outstanding': Logic.LogicBatchNew100.days_sales_outstanding,
  'working-capital-calc': Logic.LogicBatchNew100.working_capital_calc,
  'capital-gains-calc': Logic.LogicBatchNew100.capital_gains_calc,
  'dividend-yield-calc': Logic.LogicBatchNew100.dividend_yield_calc,
  'eps-calc': Logic.LogicBatchNew100.eps_calc,
  'pe-ratio-calc': Logic.LogicBatchNew100.pe_ratio_calc,
  'pythagorean-long-calc': Logic.LogicBatchNew100.pythagorean_long_calc,
  'pythagorean-short-calc': Logic.LogicBatchNew100.pythagorean_short_calc,
  'circle-area-calc': Logic.LogicBatchNew100.circle_area_calc,
  'trapezoid-area': Logic.LogicBatchNew100.trapezoid_area,
  'parallelogram-area': Logic.LogicBatchNew100.parallelogram_area,
  'rhombus-area': Logic.LogicBatchNew100.rhombus_area,
  'quadratic-root-plus': Logic.LogicBatchNew100.quadratic_root_plus,
  'quadratic-root-minus': Logic.LogicBatchNew100.quadratic_root_minus,
  'log10-calc': Logic.LogicBatchNew100.log10_calc,
  'ln-calc': Logic.LogicBatchNew100.ln_calc,
  'factorial-calc': Logic.LogicBatchNew100.factorial_calc,
  'geometric-mean-2': Logic.LogicBatchNew100.geometric_mean_2,
  'arithmetic-mean-3': Logic.LogicBatchNew100.arithmetic_mean_3,
  'degrees-to-radians': Logic.LogicBatchNew100.degrees_to_radians,
  'gas-cost-calc': Logic.LogicBatchNew100.gas_cost_calc,
  'fuel-efficiency-mpg': Logic.LogicBatchNew100.fuel_efficiency_mpg,
  'fuel-efficiency-l100km': Logic.LogicBatchNew100.fuel_efficiency_l100km,
  'electricity-cost-calc': Logic.LogicBatchNew100.electricity_cost_calc,
  'tv-viewing-distance': Logic.LogicBatchNew100.tv_viewing_distance,
  'dog-years-calc': Logic.LogicBatchNew100.dog_years_calc,
  'cat-years-calc': Logic.LogicBatchNew100.cat_years_calc,
  'pizza-area-calc': Logic.LogicBatchNew100.pizza_area_calc,
  'pizza-cost-per-sqin': Logic.LogicBatchNew100.pizza_cost_per_sqin,
  'download-time-calc': Logic.LogicBatchNew100.download_time_calc,
  'reading-time-calc': Logic.LogicBatchNew100.reading_time_calc,
  'steps-to-miles': Logic.LogicBatchNew100.steps_to_miles,
  'miles-to-steps': Logic.LogicBatchNew100.miles_to_steps,
  'water-boiler-energy': Logic.LogicBatchNew100.water_boiler_energy,
  'coffee-to-water-ratio': Logic.LogicBatchNew100.coffee_to_water_ratio,
  'baking-temp-c-to-f': Logic.LogicBatchNew100.baking_temp_c_to_f,
  'microwave-wattage-calc': Logic.LogicBatchNew100.microwave_wattage_calc,
  'sleep-cycles-calc': Logic.LogicBatchNew100.sleep_cycles_calc,
  'heartbeats-lifetime': Logic.LogicBatchNew100.heartbeats_lifetime,
  'breaths-lifetime': Logic.LogicBatchNew100.breaths_lifetime,
  'board-feet-calc': Logic.LogicBatchNew100.board_feet_calc,
  'roof-pitch-calc': Logic.LogicBatchNew100.roof_pitch_calc,
  'stair-treads-calc': Logic.LogicBatchNew100.stair_treads_calc,
  'stair-run-calc': Logic.LogicBatchNew100.stair_run_calc,
  'studs-16-oc-calc': Logic.LogicBatchNew100.studs_16_oc_calc,
  'studs-24-oc-calc': Logic.LogicBatchNew100.studs_24_oc_calc,
  'gpm-pipe-calc': Logic.LogicBatchNew100.gpm_pipe_calc,
  'hvac-btu-calc': Logic.LogicBatchNew100.hvac_btu_calc,
  'watts-to-amps': Logic.LogicBatchNew100.watts_to_amps,
  'amps-to-watts': Logic.LogicBatchNew100.amps_to_watts,
  'hp-to-watts': Logic.LogicBatchNew100.hp_to_watts,
  'watts-to-hp': Logic.LogicBatchNew100.watts_to_hp,
  'btu-to-kw': Logic.LogicBatchNew100.btu_to_kw,
  'kw-to-btu': Logic.LogicBatchNew100.kw_to_btu,
  'cfm-to-lps': Logic.LogicBatchNew100.cfm_to_lps,
  'lps-to-cfm': Logic.LogicBatchNew100.lps_to_cfm,
  'psi-to-bar': Logic.LogicBatchNew100.psi_to_bar,
  'bar-to-psi': Logic.LogicBatchNew100.bar_to_psi,
  'kg-to-newtons': Logic.LogicBatchNew100.kg_to_newtons,
  'newtons-to-kg': Logic.LogicBatchNew100.newtons_to_kg,
  'acceleration-calc': Logic.LogicBatch100.acceleration_calc,
  'force-calc': Logic.LogicBatch100.force_calc,
  'work-calc': Logic.LogicBatch100.work_calc,
  'power-calc': Logic.LogicBatch100.power_calc,
  'kinetic-energy-calc': Logic.LogicBatch100.kinetic_energy_calc,
  'potential-energy-calc': Logic.LogicBatch100.potential_energy_calc,
  'momentum-calc': Logic.LogicBatch100.momentum_calc,
  'density-calc': Logic.LogicBatch100.density_calc,
  'pressure-calc': Logic.LogicBatch100.pressure_calc,
  'impulse-calc': Logic.LogicBatch100.impulse_calc,
  'hookes-law-calc': Logic.LogicBatch100.hookes_law_calc,
  'wave-speed-calc': Logic.LogicBatch100.wave_speed_calc,
  'ohm-law-v-calc': Logic.LogicBatch100.ohm_law_v_calc,
  'ohm-law-i-calc': Logic.LogicBatch100.ohm_law_i_calc,
  'ohm-law-r-calc': Logic.LogicBatch100.ohm_law_r_calc,
  'capacitance-calc': Logic.LogicBatch100.capacitance_calc,
  'electric-field-calc': Logic.LogicBatch100.electric_field_calc,
  'centripetal-force-calc': Logic.LogicBatch100.centripetal_force_calc,
  'centripetal-acceleration-calc': Logic.LogicBatch100.centripetal_acceleration_calc,
  'specific-heat-calc': Logic.LogicBatch100.specific_heat_calc,
  'heat-capacity-calc': Logic.LogicBatch100.heat_capacity_calc,
  'buoyant-force-calc': Logic.LogicBatch100.buoyant_force_calc,
  'gravitational-force-calc': Logic.LogicBatch100.gravitational_force_calc,
  'escape-velocity-calc': Logic.LogicBatch100.escape_velocity_calc,
  'friction-force-calc': Logic.LogicBatch100.friction_force_calc,
  'pendulum-period-calc': Logic.LogicBatch100.pendulum_period_calc,
  'spring-potential-energy-calc': Logic.LogicBatch100.spring_potential_energy_calc,
  'stress-calc': Logic.LogicBatch100.stress_calc,
  'strain-calc': Logic.LogicBatch100.strain_calc,
  'youngs-modulus-calc': Logic.LogicBatch100.youngs_modulus_calc,
  'photon-energy-calc': Logic.LogicBatch100.photon_energy_calc,
  'mach-number-calc': Logic.LogicBatch100.mach_number_calc,
  'concrete-volume-calc': Logic.LogicBatch100.concrete_volume_calc,
  'brick-count-calc': Logic.LogicBatch100.brick_count_calc,
  'block-count-calc': Logic.LogicBatch100.block_count_calc,
  'tile-count-calc': Logic.LogicBatch100.tile_count_calc,
  'paint-coverage-calc': Logic.LogicBatch100.paint_coverage_calc,
  'drywall-sheets-calc': Logic.LogicBatch100.drywall_sheets_calc,
  'roofing-squares-calc': Logic.LogicBatch100.roofing_squares_calc,
  'laminate-flooring-calc': Logic.LogicBatch100.laminate_flooring_calc,
  'hardwood-flooring-calc': Logic.LogicBatch100.hardwood_flooring_calc,
  'decking-boards-calc': Logic.LogicBatch100.decking_boards_calc,
  'pavers-calc': Logic.LogicBatch100.pavers_calc,
  'mulch-volume-calc': Logic.LogicBatch100.mulch_volume_calc,
  'soil-volume-calc': Logic.LogicBatch100.soil_volume_calc,
  'gravel-volume-calc': Logic.LogicBatch100.gravel_volume_calc,
  'sand-volume-calc': Logic.LogicBatch100.sand_volume_calc,
  'retaining-wall-block-calc': Logic.LogicBatch100.retaining_wall_block_calc,
  'stair-stringer-calc': Logic.LogicBatch100.stair_stringer_calc,
  'ceiling-tiles-calc': Logic.LogicBatch100.ceiling_tiles_calc,
  'insulation-rolls-calc': Logic.LogicBatch100.insulation_rolls_calc,
  'wallpaper-rolls-calc': Logic.LogicBatch100.wallpaper_rolls_calc,
  'wall-framing-studs-calc': Logic.LogicBatch100.wall_framing_studs_calc,
  'fence-pickets-calc': Logic.LogicBatch100.fence_pickets_calc,
  'concrete-slab-calc': Logic.LogicBatch100.concrete_slab_calc,
  'concrete-column-calc': Logic.LogicBatch100.concrete_column_calc,
  'concrete-footer-calc': Logic.LogicBatch100.concrete_footer_calc,
  'asphalt-driveway-calc': Logic.LogicBatch100.asphalt_driveway_calc,
  'driveway-sealer-calc': Logic.LogicBatch100.driveway_sealer_calc,
  'carpet-area-calc': Logic.LogicBatch100.carpet_area_calc,
  'sod-rolls-calc': Logic.LogicBatch100.sod_rolls_calc,
  'grout-volume-calc': Logic.LogicBatch100.grout_volume_calc,
  'board-foot-calc': Logic.LogicBatch100.board_foot_calc,
  'area-calc': Logic.LogicBatch100.area_calc,
  'perimeter-calc': Logic.LogicBatch100.perimeter_calc,
  'm-to-ft-calc': Logic.LogicBatch100.m_to_ft_calc,
  'ft-to-m-calc': Logic.LogicBatch100.ft_to_m_calc,
  'cm-to-in-calc': Logic.LogicBatch100.cm_to_in_calc,
  'in-to-cm-calc': Logic.LogicBatch100.in_to_cm_calc,
  'km-to-mi-calc': Logic.LogicBatch100.km_to_mi_calc,
  'mi-to-km-calc': Logic.LogicBatch100.mi_to_km_calc,
  'yd-to-m-calc': Logic.LogicBatch100.yd_to_m_calc,
  'm-to-yd-calc': Logic.LogicBatch100.m_to_yd_calc,
  'kg-to-lb-calc': Logic.LogicBatch100.kg_to_lb_calc,
  'lb-to-kg-calc': Logic.LogicBatch100.lb_to_kg_calc,
  'g-to-oz-calc': Logic.LogicBatch100.g_to_oz_calc,
  'oz-to-g-calc': Logic.LogicBatch100.oz_to_g_calc,
  't-to-ton-calc': Logic.LogicBatch100.t_to_ton_calc,
  'l-to-gal-calc': Logic.LogicBatch100.l_to_gal_calc,
  'gal-to-l-calc': Logic.LogicBatch100.gal_to_l_calc,
  'ml-to-oz-calc': Logic.LogicBatch100.ml_to_oz_calc,
  'oz-to-ml-calc': Logic.LogicBatch100.oz_to_ml_calc,
  'cup-to-ml-calc': Logic.LogicBatch100.cup_to_ml_calc,
  'c-to-f-calc': Logic.LogicBatch100.c_to_f_calc,
  'f-to-c-calc': Logic.LogicBatch100.f_to_c_calc,
  'c-to-k-calc': Logic.LogicBatch100.c_to_k_calc,
  'k-to-c-calc': Logic.LogicBatch100.k_to_c_calc,
  'sqm-to-sqft-calc': Logic.LogicBatch100.sqm_to_sqft_calc,
  'sqft-to-sqm-calc': Logic.LogicBatch100.sqft_to_sqm_calc,
  'acre-to-sqm-calc': Logic.LogicBatch100.acre_to_sqm_calc,
  'hectare-to-acre-calc': Logic.LogicBatch100.hectare_to_acre_calc,
  'kmh-to-mph-calc': Logic.LogicBatch100.kmh_to_mph_calc,
  'mph-to-kmh-calc': Logic.LogicBatch100.mph_to_kmh_calc,
  'ms-to-kmh-calc': Logic.LogicBatch100.ms_to_kmh_calc,
  'knots-to-mph-calc': Logic.LogicBatch100.knots_to_mph_calc,
  'min-to-hours-calc': Logic.LogicBatch100.min_to_hours_calc,
  'mb-to-gb-calc': Logic.LogicBatch100.mb_to_gb_calc,
  'j-to-cal-calc': Logic.LogicBatch100.j_to_cal_calc,
  'pregnancy-due-date': Logic.calculate_pregnancy_due_date,
  'ovulation': Logic.calculate_ovulation,
  'tdee': Logic.calculate_tdee,
  'one-rep-max': Logic.calculate_one_rep_max,
  'body-surface-area': Logic.calculate_body_surface_area,
  'pythagorean': Logic.calculate_pythagorean,
  'sphere-volume': Logic.calculate_sphere_volume,
  'cylinder-volume': Logic.calculate_cylinder_volume,
  'cone-volume': Logic.calculate_cone_volume,
  'quadratic-equation': Logic.calculate_quadratic_equation,
  'midpoint': Logic.calculate_midpoint,
  'distance-2d': Logic.calculate_distance_2d,
  'slope': Logic.calculate_slope,
  'factorial': Logic.calculate_factorial,
  'combinations': Logic.calculate_combinations,
  'permutations': Logic.calculate_permutations,
  'prime-factorization': Logic.calculate_prime_factorization,
  'gcd-lcm': Logic.calculate_gcd_lcm,
  'standard-deviation': Logic.calculate_standard_deviation,
  'kinetic-energy': Logic.calculate_kinetic_energy,
  'potential-energy': Logic.calculate_potential_energy,
  'ohm-law': Logic.calculate_ohm_law,
  'power': Logic.calculate_power,
  'density': Logic.calculate_density,
  'force': Logic.calculate_force,
  'speed-distance-time': Logic.calculate_speed_distance_time,
  'present-value': Logic.calculate_present_value,
  'future-value': Logic.calculate_future_value,
  'apy': Logic.calculate_apy,
  'current-yield': Logic.calculate_current_yield,
  'dividend-yield': Logic.calculate_dividend_yield,
  'wacc': Logic.calculate_wacc,
  'current-ratio': Logic.calculate_current_ratio,
  'quick-ratio': Logic.calculate_quick_ratio,
  'debt-to-equity': Logic.calculate_debt_to_equity,
  'bra-size': Logic.calculate_bra_size,
  'shoe-size-converter': Logic.calculate_shoe_size_converter,
  'temperature-converter': Logic.calculate_temperature_converter,
  'weight-converter': Logic.calculate_weight_converter,
  'data-storage-converter': Logic.calculate_data_storage_converter,
  'dog-age': Logic.calculate_dog_age,
  'cat-age': Logic.calculate_cat_age,
  'energy-cost': Logic.calculate_energy_cost,
  'pool-volume': Logic.calculate_pool_volume,
  'concrete-volume': Logic.calculate_concrete_volume,
  'paint': Logic.calculate_paint,
  'roofing': Logic.calculate_roofing,
  'z-score': Logic.calculate_z_score,
  'expected-value': Logic.calculate_expected_value,
  'roman-numerals': Logic.calculate_roman_numerals,
  'ratio': Logic.calculate_ratio,
  'percentage-diff': Logic.calculate_percentage_diff,
  'percentage-error': Logic.calculate_percentage_error,
  'triangle-area': Logic.calculate_triangle_area,
  'rectangle-area': Logic.calculate_rectangle_area,
  'circle-circumference': Logic.calculate_circle_circumference,
  'arc-length': Logic.calculate_arc_length,
  'sector-area': Logic.calculate_sector_area,
  'sphere-surface-area': Logic.calculate_sphere_surface_area,
  'cylinder-surface-area': Logic.calculate_cylinder_surface_area,
  'box-surface-area': Logic.calculate_box_surface_area,
  'margin-of-error': Logic.calculate_margin_of_error,
  'rule-of-72': Logic.calculate_rule_of_72,
  'vat': Logic.calculate_vat,
  'profit-percentage': Logic.calculate_profit_percentage,
  'revenue': Logic.calculate_revenue,
  'net-income': Logic.calculate_net_income,
  'inventory-turnover': Logic.calculate_inventory_turnover,
  'days-in-inventory': Logic.calculate_days_in_inventory,
  'receivables-turnover': Logic.calculate_receivables_turnover,
  'return-on-assets': Logic.calculate_return_on_assets,
  'return-on-equity': Logic.calculate_return_on_equity,
  'calorie-deficit': Logic.calculate_calorie_deficit,
  'run-pace': Logic.calculate_run_pace,
  'blood-donation': Logic.calculate_blood_donation,
  'velocity-calc': Logic.calculate_velocity_calc,
  'torque-calc': Logic.calculate_torque_calc,
  'mass-energy': Logic.calculate_mass_energy,
  'hookes-law': Logic.calculate_hookes_law,
  'kinetic-friction': Logic.calculate_kinetic_friction,
  'escape-velocity': Logic.calculate_escape_velocity,
  'decimal-binary': Logic.calculate_decimal_binary,
  'decimal-hex': Logic.calculate_decimal_hex,
  'binary-decimal': Logic.calculate_binary_decimal,
  'hex-decimal': Logic.calculate_hex_decimal,
  'base64-encode': Logic.calculate_base64_encode,
  'words-calculator': Logic.calculate_words_calculator,
  'time-duration': Logic.calculate_time_duration,
  'days-between': Logic.calculate_days_between,
  'timestamp-date': Logic.calculate_timestamp_date,
  'adding-time': Logic.calculate_adding_time,
  'scientific-notation': Logic.calculate_scientific_notation,
  'molar-mass': Logic.calculate_molar_mass,
  'moles': Logic.calculate_moles,
  'loan-emi': Logic.calculateEMI,
  'mortgage': Logic.calculateMortgage,
  'car-loan': Logic.calculateCarLoan,
  'credit-card-payoff': Logic.calculateCreditCardPayoff,
  'debt-to-income': Logic.calculateDebtToIncome,
  'sip': Logic.calculateSIP,
  'compound-interest': Logic.calculateCompoundInterest,
  'fd': Logic.calculateFD,
  'profit-margin': Logic.calculateProfitMargin,
  'break-even': Logic.calculateBreakEven,
  'salary': Logic.calculateSalary,
  'gst': Logic.calculateGST,
  'bmi': Logic.calculateBMI,
  'percentage': Logic.calculatePercentage,
  'home-affordability': Logic.calculateHomeAffordability,
  'simple-interest': Logic.calculateSimpleInterest,
  'retirement-fire': Logic.calculateFIRE,
  'savings-goal': Logic.calculateSavingsGoal,
  'roi': Logic.calculateROI,
  'markup': Logic.calculateMarkup,
  'calorie': Logic.calculateCalorie,
  'ideal-weight': Logic.calculate_ideal_weight,
  'discount': Logic.calculateDiscount,
  'tip': Logic.calculateTip,
  'date-diff': Logic.calculateDateDiff,
  'monthly-budget': Logic.calculateMonthlyBudget,
  'inflation': Logic.calculateInflation,
  'body-fat': Logic.calculateBodyFat,
  'world-clock': Logic.calculateWorldClock,
  'fraction-decimal': Logic.calculateFractionDecimal,
  'sales-tax': Logic.calculate_sales_tax,
  'refinance': Logic.calculateRefinance,
  'loan-payoff': Logic.calculateLoanPayoff,
  'lease': Logic.calculateLease,
  'heloc': Logic.calculateHELOC,
  'lumpsum': Logic.calculateLumpsum,
  'mutual-fund': Logic.calculateMutualFund,
  'rule-72': Logic.calculateRule72,
  'dividend': Logic.calculate_dividend_yield,
  'markup-margin': Logic.calculateMarkupMargin,
  'ltv': Logic.calculateLTV,
  'retention': Logic.calculateRetention,
  'inventory-turn': Logic.calculateInventoryTurn,
  'commission': Logic.calculateCommission,
  'cac': Logic.calculateCAC,
  'scientific': Logic.calculateScientific,
  'probability': Logic.calculateProbability,
  'stats': Logic.calculateStats,
  'exponent': Logic.calculateExponent,
  'logarithm': Logic.calculateLogarithm,
  'basal-metabolic': Logic.calculateBasalMetabolic,
  'waist-hip': Logic.calculateWaistHip,
  'water-intake': Logic.calculateWaterIntake,
  'binary': Logic.calculateBinary,
  'password-strength': Logic.calculatePasswordStrength,
  'countdown': Logic.calculateCountdown,
  'salary-comparison': Logic.calculateSalaryComparison,
  'bonus': Logic.calculateBonusTax,
  'property-tax': Logic.calculatePropertyTax,
  'balloon-loan': Logic.calculateBalloonLoan,
  'rent-vs-buy': Logic.calculateRentVsBuy,
  'car-lease': Logic.calculateCarLease,
  'student-loan': Logic.calculateStudentLoan,
  'crypto-roi': Logic.calculateCryptoROI,
  'macros': Logic.calculateMacros,
  'unit-converter': Logic.calculateUnitConverter,
};

// Map calculator IDs to their input configurations
export const INPUT_MAP: Record<string, CalculationInput[]> = {
  'bmr-calc-v2': [{label: 'Weight (kg)', name: 'w', type: 'number', defaultValue: 70}, {label: 'Height (cm)', name: 'h', type: 'number', defaultValue: 175}, {label: 'Age (y)', name: 'a', type: 'number', defaultValue: 30}, {label: 'Is Male (1=Y,0=N)', name: 'm', type: 'number', defaultValue: 1}],
  'water-intake-calc': [{label: 'Weight (kg)', name: 'w', type: 'number', defaultValue: 70}, {label: 'Exercise (min)', name: 'e', type: 'number', defaultValue: 30}],
  'body-fat-navy-calc': [{label: 'Waist (cm)', name: 'w', type: 'number', defaultValue: 85}, {label: 'Neck (cm)', name: 'n', type: 'number', defaultValue: 40}, {label: 'Height (cm)', name: 'h', type: 'number', defaultValue: 175}],
  'macro-protein-calc': [{label: 'Weight (kg)', name: 'w', type: 'number', defaultValue: 70}, {label: 'Activity (1.2-2)', name: 'a', type: 'number', defaultValue: 1.5}],
  'macro-carbs-calc': [{label: 'Weight (kg)', name: 'w', type: 'number', defaultValue: 70}, {label: 'Activity (1.2-2)', name: 'a', type: 'number', defaultValue: 1.5}],
  'blood-alcohol-calc': [{label: 'Weight (kg)', name: 'w', type: 'number', defaultValue: 70}, {label: 'Standard Drinks', name: 'd', type: 'number', defaultValue: 3}, {label: 'Hours since start', name: 'h', type: 'number', defaultValue: 2}],
  'one-rep-max-calc': [{label: 'Weight Lifted (kg)', name: 'w', type: 'number', defaultValue: 100}, {label: 'Reps', name: 'r', type: 'number', defaultValue: 5}],
  'lean-body-mass-calc': [{label: 'Weight (kg)', name: 'w', type: 'number', defaultValue: 70}, {label: 'Body Fat %', name: 'bf', type: 'number', defaultValue: 15}],
  'maximum-heart-rate-calc': [{label: 'Age (yrs)', name: 'a', type: 'number', defaultValue: 30}],
  'target-heart-rate-calc': [{label: 'Age (yrs)', name: 'a', type: 'number', defaultValue: 30}, {label: 'Intensity %', name: 'i', type: 'number', defaultValue: 70}],
  'calorie-burn-running': [{label: 'Weight (kg)', name: 'w', type: 'number', defaultValue: 70}, {label: 'Distance (km)', name: 'd', type: 'number', defaultValue: 5}],
  'calorie-burn-walking': [{label: 'Weight (kg)', name: 'w', type: 'number', defaultValue: 70}, {label: 'Distance (km)', name: 'd', type: 'number', defaultValue: 5}],
  'calorie-burn-cycling': [{label: 'Weight (kg)', name: 'w', type: 'number', defaultValue: 70}, {label: 'Duration (hrs)', name: 'h', type: 'number', defaultValue: 1}, {label: 'Speed (km/h)', name: 's', type: 'number', defaultValue: 20}],
  'vo2-max-calc': [{label: 'Distance in 12 min (m)', name: 'd', type: 'number', defaultValue: 2400}],
  'bmi-prime-calc': [{label: 'Weight (kg)', name: 'w', type: 'number', defaultValue: 70}, {label: 'Height (cm)', name: 'h', type: 'number', defaultValue: 175}],
  'ponderal-index-calc': [{label: 'Weight (kg)', name: 'w', type: 'number', defaultValue: 70}, {label: 'Height (cm)', name: 'h', type: 'number', defaultValue: 175}],
  'waist-to-hip-calc': [{label: 'Waist (cm)', name: 'w', type: 'number', defaultValue: 80}, {label: 'Hip (cm)', name: 'h', type: 'number', defaultValue: 100}],
  'waist-to-height-calc': [{label: 'Waist (cm)', name: 'w', type: 'number', defaultValue: 80}, {label: 'Height (cm)', name: 'h', type: 'number', defaultValue: 175}],
  'blood-volume-calc': [{label: 'Weight (kg)', name: 'w', type: 'number', defaultValue: 70}, {label: 'Height (cm)', name: 'h', type: 'number', defaultValue: 175}, {label: 'Male=1', name: 'm', type: 'number', defaultValue: 1}],
  'ideal-weight-devine': [{label: 'Height (in)', name: 'h', type: 'number', defaultValue: 70}, {label: 'Male=1', name: 'm', type: 'number', defaultValue: 1}],
  'present-value-calc': [{label: 'Future Value', name: 'fv', type: 'number', defaultValue: 10000}, {label: 'Interest Rate (%)', name: 'r', type: 'number', defaultValue: 5}, {label: 'Periods', name: 'n', type: 'number', defaultValue: 10}],
  'future-value-calc': [{label: 'Present Value', name: 'pv', type: 'number', defaultValue: 5000}, {label: 'Interest Rate (%)', name: 'r', type: 'number', defaultValue: 5}, {label: 'Periods', name: 'n', type: 'number', defaultValue: 10}],
  'cagr-calc': [{label: 'Ending Value', name: 'ev', type: 'number', defaultValue: 15000}, {label: 'Beginning Value', name: 'bv', type: 'number', defaultValue: 10000}, {label: 'Years', name: 't', type: 'number', defaultValue: 5}],
  'ebitda-calc': [{label: 'Net Income', name: 'ni', type: 'number', defaultValue: 100000}, {label: 'Taxes', name: 't', type: 'number', defaultValue: 20000}, {label: 'Interest', name: 'i', type: 'number', defaultValue: 15000}, {label: 'Depreciation', name: 'd', type: 'number', defaultValue: 10000}, {label: 'Amortization', name: 'a', type: 'number', defaultValue: 5000}],
  'wacc-calc': [{label: 'Cost of Equity (%)', name: 'ke', type: 'number', defaultValue: 10}, {label: 'Equity Weight (%)', name: 'we', type: 'number', defaultValue: 60}, {label: 'Cost of Debt (%)', name: 'kd', type: 'number', defaultValue: 5}, {label: 'Debt Weight (%)', name: 'wd', type: 'number', defaultValue: 40}, {label: 'Tax Rate (%)', name: 't', type: 'number', defaultValue: 21}],
  'quick-ratio-calc': [{label: 'Current Assets', name: 'ca', type: 'number', defaultValue: 50000}, {label: 'Inventory', name: 'i', type: 'number', defaultValue: 20000}, {label: 'Current Liab.', name: 'cl', type: 'number', defaultValue: 25000}],
  'current-ratio-calc': [{label: 'Current Assets', name: 'ca', type: 'number', defaultValue: 50000}, {label: 'Current Liab.', name: 'cl', type: 'number', defaultValue: 25000}],
  'debt-to-equity-calc': [{label: 'Total Debt', name: 'td', type: 'number', defaultValue: 50000}, {label: 'Total Equity', name: 'te', type: 'number', defaultValue: 100000}],
  'roa-calc': [{label: 'Net Income', name: 'ni', type: 'number', defaultValue: 20000}, {label: 'Total Assets', name: 'ta', type: 'number', defaultValue: 100000}],
  'roe-calc': [{label: 'Net Income', name: 'ni', type: 'number', defaultValue: 20000}, {label: 'Shareholders Equity', name: 'se', type: 'number', defaultValue: 80000}],
  'gross-margin-calc': [{label: 'Revenue', name: 'r', type: 'number', defaultValue: 100000}, {label: 'COGS', name: 'c', type: 'number', defaultValue: 60000}],
  'operating-margin-calc': [{label: 'Operating Inc.', name: 'oi', type: 'number', defaultValue: 20000}, {label: 'Revenue', name: 'r', type: 'number', defaultValue: 100000}],
  'markup-calc': [{label: 'Cost', name: 'c', type: 'number', defaultValue: 50}, {label: 'Selling Price', name: 's', type: 'number', defaultValue: 75}],
  'inventory-turnover-calc': [{label: 'COGS', name: 'c', type: 'number', defaultValue: 50000}, {label: 'Avg Inventory', name: 'i', type: 'number', defaultValue: 10000}],
  'days-sales-outstanding': [{label: 'Receivables', name: 'ar', type: 'number', defaultValue: 10000}, {label: 'Total Credit Sales', name: 'tcs', type: 'number', defaultValue: 100000}, {label: 'Days in Period', name: 'd', type: 'number', defaultValue: 365}],
  'working-capital-calc': [{label: 'Current Assets', name: 'ca', type: 'number', defaultValue: 50000}, {label: 'Current Liab.', name: 'cl', type: 'number', defaultValue: 30000}],
  'capital-gains-calc': [{label: 'Purchase Price', name: 'p', type: 'number', defaultValue: 10000}, {label: 'Sale Price', name: 's', type: 'number', defaultValue: 15000}, {label: 'Tax Rate (%)', name: 't', type: 'number', defaultValue: 15}],
  'dividend-yield-calc': [{label: 'Annual Div. per Share', name: 'd', type: 'number', defaultValue: 2}, {label: 'Price per Share', name: 'p', type: 'number', defaultValue: 50}],
  'eps-calc': [{label: 'Net Income', name: 'ni', type: 'number', defaultValue: 1000000}, {label: 'Pref. Dividends', name: 'pd', type: 'number', defaultValue: 100000}, {label: 'Shares', name: 's', type: 'number', defaultValue: 500000}],
  'pe-ratio-calc': [{label: 'Price per Share', name: 'p', type: 'number', defaultValue: 50}, {label: 'EPS', name: 'eps', type: 'number', defaultValue: 2.5}],
  'pythagorean-long-calc': [{label: 'Side A', name: 'a', type: 'number', defaultValue: 3}, {label: 'Side B', name: 'b', type: 'number', defaultValue: 4}],
  'pythagorean-short-calc': [{label: 'Hypotenuse', name: 'c', type: 'number', defaultValue: 5}, {label: 'Side', name: 'a', type: 'number', defaultValue: 3}],
  'circle-area-calc': [{label: 'Radius', name: 'r', type: 'number', defaultValue: 5}],
  'trapezoid-area': [{label: 'Base A', name: 'a', type: 'number', defaultValue: 5}, {label: 'Base B', name: 'b', type: 'number', defaultValue: 10}, {label: 'Height', name: 'h', type: 'number', defaultValue: 6}],
  'parallelogram-area': [{label: 'Base', name: 'b', type: 'number', defaultValue: 5}, {label: 'Height', name: 'h', type: 'number', defaultValue: 10}],
  'rhombus-area': [{label: 'Diagonal 1', name: 'd1', type: 'number', defaultValue: 5}, {label: 'Diagonal 2', name: 'd2', type: 'number', defaultValue: 10}],
  'quadratic-root-plus': [{label: 'a', name: 'a', type: 'number', defaultValue: 1}, {label: 'b', name: 'b', type: 'number', defaultValue: -3}, {label: 'c', name: 'c', type: 'number', defaultValue: 2}],
  'quadratic-root-minus': [{label: 'a', name: 'a', type: 'number', defaultValue: 1}, {label: 'b', name: 'b', type: 'number', defaultValue: -3}, {label: 'c', name: 'c', type: 'number', defaultValue: 2}],
  'log10-calc': [{label: 'Value', name: 'x', type: 'number', defaultValue: 100}],
  'ln-calc': [{label: 'Value', name: 'x', type: 'number', defaultValue: 2.718281828459045}],
  'factorial-calc': [{label: 'Value (integer)', name: 'n', type: 'number', defaultValue: 5}],
  'geometric-mean-2': [{label: 'Val 1', name: 'v1', type: 'number', defaultValue: 4}, {label: 'Val 2', name: 'v2', type: 'number', defaultValue: 9}],
  'arithmetic-mean-3': [{label: 'Val 1', name: 'v1', type: 'number', defaultValue: 4}, {label: 'Val 2', name: 'v2', type: 'number', defaultValue: 9}, {label: 'Val 3', name: 'v3', type: 'number', defaultValue: 20}],
  'degrees-to-radians': [{label: 'Degrees', name: 'd', type: 'number', defaultValue: 180}],
  'gas-cost-calc': [{label: 'Distance (miles)', name: 'd', type: 'number', defaultValue: 100}, {label: 'MPG', name: 'mpg', type: 'number', defaultValue: 25}, {label: 'Gas Price/Gal', name: 'p', type: 'number', defaultValue: 3.5}],
  'fuel-efficiency-mpg': [{label: 'Miles Driven', name: 'd', type: 'number', defaultValue: 300}, {label: 'Gallons Used', name: 'g', type: 'number', defaultValue: 12}],
  'fuel-efficiency-l100km': [{label: 'Km Driven', name: 'd', type: 'number', defaultValue: 500}, {label: 'Liters Used', name: 'l', type: 'number', defaultValue: 40}],
  'electricity-cost-calc': [{label: 'Power (Watts)', name: 'w', type: 'number', defaultValue: 1000}, {label: 'Hours/Day', name: 'h', type: 'number', defaultValue: 5}, {label: 'Cost/kWh', name: 'c', type: 'number', defaultValue: 0.15}],
  'tv-viewing-distance': [{label: 'TV Size (inches)', name: 's', type: 'number', defaultValue: 55}],
  'dog-years-calc': [{label: 'Dog Age (human years)', name: 'a', type: 'number', defaultValue: 5}],
  'cat-years-calc': [{label: 'Cat Age (years)', name: 'a', type: 'number', defaultValue: 5}],
  'pizza-area-calc': [{label: 'Diameter (inches)', name: 'd', type: 'number', defaultValue: 12}],
  'pizza-cost-per-sqin': [{label: 'Diameter (in)', name: 'd', type: 'number', defaultValue: 12}, {label: 'Price ($)', name: 'p', type: 'number', defaultValue: 15}],
  'download-time-calc': [{label: 'File Size (MB)', name: 's', type: 'number', defaultValue: 1000}, {label: 'Speed (Mbps)', name: 'v', type: 'number', defaultValue: 50}],
  'reading-time-calc': [{label: 'Word Count', name: 'w', type: 'number', defaultValue: 2500}, {label: 'Words/Minute', name: 's', type: 'number', defaultValue: 250}],
  'steps-to-miles': [{label: 'Steps', name: 's', type: 'number', defaultValue: 10000}, {label: 'Stride Length (ft)', name: 'l', type: 'number', defaultValue: 2.5}],
  'miles-to-steps': [{label: 'Miles', name: 'm', type: 'number', defaultValue: 5}, {label: 'Stride Length (ft)', name: 'l', type: 'number', defaultValue: 2.5}],
  'water-boiler-energy': [{label: 'Water Volume (L)', name: 'v', type: 'number', defaultValue: 1}, {label: 'Temp Change (°C)', name: 'dt', type: 'number', defaultValue: 80}],
  'coffee-to-water-ratio': [{label: 'Coffee Grounds (g)', name: 'c', type: 'number', defaultValue: 20}, {label: 'Ratio (1:X)', name: 'r', type: 'number', defaultValue: 15}],
  'baking-temp-c-to-f': [{label: 'Celsius', name: 'c', type: 'number', defaultValue: 180}],
  'microwave-wattage-calc': [{label: 'Original Time (s)', name: 't', type: 'number', defaultValue: 60}, {label: 'Original Watts', name: 'w1', type: 'number', defaultValue: 1000}, {label: 'Your Watts', name: 'w2', type: 'number', defaultValue: 800}],
  'sleep-cycles-calc': [{label: 'Hours Slept', name: 'h', type: 'number', defaultValue: 8}],
  'heartbeats-lifetime': [{label: 'Age (yrs)', name: 'a', type: 'number', defaultValue: 30}, {label: 'Resting HR (bpm)', name: 'hr', type: 'number', defaultValue: 70}],
  'breaths-lifetime': [{label: 'Age (yrs)', name: 'a', type: 'number', defaultValue: 30}, {label: 'Breaths/min', name: 'b', type: 'number', defaultValue: 16}],
  'board-feet-calc': [{label: 'Qty', name: 'q', type: 'number', defaultValue: 10}, {label: 'Thickness (in)', name: 't', type: 'number', defaultValue: 2}, {label: 'Width (in)', name: 'w', type: 'number', defaultValue: 4}, {label: 'Length (ft)', name: 'l', type: 'number', defaultValue: 8}],
  'roof-pitch-calc': [{label: 'Rise (in)', name: 'r', type: 'number', defaultValue: 4}, {label: 'Run (in)', name: 'rn', type: 'number', defaultValue: 12}],
  'stair-treads-calc': [{label: 'Total Rise (in)', name: 'r', type: 'number', defaultValue: 100}],
  'stair-run-calc': [{label: 'Treads', name: 't', type: 'number', defaultValue: 14}, {label: 'Tread Depth (in)', name: 'd', type: 'number', defaultValue: 10}],
  'studs-16-oc-calc': [{label: 'Wall length (ft)', name: 'l', type: 'number', defaultValue: 20}],
  'studs-24-oc-calc': [{label: 'Wall length (ft)', name: 'l', type: 'number', defaultValue: 20}],
  'gpm-pipe-calc': [{label: 'Velocity (ft/s)', name: 'v', type: 'number', defaultValue: 5}, {label: 'Diameter (in)', name: 'd', type: 'number', defaultValue: 2}],
  'hvac-btu-calc': [{label: 'Room Area (sq ft)', name: 'a', type: 'number', defaultValue: 500}],
  'watts-to-amps': [{label: 'Watts', name: 'w', type: 'number', defaultValue: 1200}, {label: 'Volts', name: 'v', type: 'number', defaultValue: 120}],
  'amps-to-watts': [{label: 'Amps', name: 'a', type: 'number', defaultValue: 10}, {label: 'Volts', name: 'v', type: 'number', defaultValue: 120}],
  'hp-to-watts': [{label: 'Horsepower', name: 'hp', type: 'number', defaultValue: 1}],
  'watts-to-hp': [{label: 'Watts', name: 'w', type: 'number', defaultValue: 745.7}],
  'btu-to-kw': [{label: 'BTU/hr', name: 'b', type: 'number', defaultValue: 10000}],
  'kw-to-btu': [{label: 'kW', name: 'k', type: 'number', defaultValue: 3}],
  'cfm-to-lps': [{label: 'CFM', name: 'c', type: 'number', defaultValue: 100}],
  'lps-to-cfm': [{label: 'L/s', name: 'l', type: 'number', defaultValue: 50}],
  'psi-to-bar': [{label: 'PSI', name: 'p', type: 'number', defaultValue: 30}],
  'bar-to-psi': [{label: 'Bar', name: 'b', type: 'number', defaultValue: 2.5}],
  'kg-to-newtons': [{label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 10}],
  'newtons-to-kg': [{label: 'Force (N)', name: 'n', type: 'number', defaultValue: 100}],
  'acceleration-calc': [{label: 'Initial Velocity (m/s)', name: 'u', type: 'number', defaultValue: 0}, {label: 'Final Velocity (m/s)', name: 'v', type: 'number', defaultValue: 10}, {label: 'Time (s)', name: 't', type: 'number', defaultValue: 5}],
  'force-calc': [{label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 10}, {label: 'Acceleration (m/s²)', name: 'a', type: 'number', defaultValue: 9.8}],
  'work-calc': [{label: 'Force (N)', name: 'f', type: 'number', defaultValue: 10}, {label: 'Distance (m)', name: 'd', type: 'number', defaultValue: 5}],
  'power-calc': [{label: 'Work (J)', name: 'w', type: 'number', defaultValue: 50}, {label: 'Time (s)', name: 't', type: 'number', defaultValue: 10}],
  'kinetic-energy-calc': [{label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 10}, {label: 'Velocity (m/s)', name: 'v', type: 'number', defaultValue: 5}],
  'potential-energy-calc': [{label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 10}, {label: 'Height (m)', name: 'h', type: 'number', defaultValue: 5}],
  'momentum-calc': [{label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 10}, {label: 'Velocity (m/s)', name: 'v', type: 'number', defaultValue: 5}],
  'density-calc': [{label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 10}, {label: 'Volume (m³)', name: 'v', type: 'number', defaultValue: 2}],
  'pressure-calc': [{label: 'Force (N)', name: 'f', type: 'number', defaultValue: 100}, {label: 'Area (m²)', name: 'a', type: 'number', defaultValue: 2}],
  'impulse-calc': [{label: 'Force (N)', name: 'f', type: 'number', defaultValue: 10}, {label: 'Time (s)', name: 't', type: 'number', defaultValue: 2}],
  'hookes-law-calc': [{label: 'Spring Constant (N/m)', name: 'k', type: 'number', defaultValue: 100}, {label: 'Displacement (m)', name: 'x', type: 'number', defaultValue: 0.1}],
  'wave-speed-calc': [{label: 'Frequency (Hz)', name: 'f', type: 'number', defaultValue: 50}, {label: 'Wavelength (m)', name: 'l', type: 'number', defaultValue: 2}],
  'ohm-law-v-calc': [{label: 'Current (A)', name: 'i', type: 'number', defaultValue: 2}, {label: 'Resistance (Ω)', name: 'r', type: 'number', defaultValue: 10}],
  'ohm-law-i-calc': [{label: 'Voltage (V)', name: 'v', type: 'number', defaultValue: 12}, {label: 'Resistance (Ω)', name: 'r', type: 'number', defaultValue: 6}],
  'ohm-law-r-calc': [{label: 'Voltage (V)', name: 'v', type: 'number', defaultValue: 12}, {label: 'Current (A)', name: 'i', type: 'number', defaultValue: 2}],
  'capacitance-calc': [{label: 'Charge (C)', name: 'q', type: 'number', defaultValue: 0.01}, {label: 'Voltage (V)', name: 'v', type: 'number', defaultValue: 12}],
  'electric-field-calc': [{label: 'Force (N)', name: 'f', type: 'number', defaultValue: 5}, {label: 'Charge (C)', name: 'q', type: 'number', defaultValue: 0.001}],
  'centripetal-force-calc': [{label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 2}, {label: 'Velocity (m/s)', name: 'v', type: 'number', defaultValue: 4}, {label: 'Radius (m)', name: 'r', type: 'number', defaultValue: 2}],
  'centripetal-acceleration-calc': [{label: 'Velocity (m/s)', name: 'v', type: 'number', defaultValue: 4}, {label: 'Radius (m)', name: 'r', type: 'number', defaultValue: 2}],
  'specific-heat-calc': [{label: 'Heat Energy (J)', name: 'q', type: 'number', defaultValue: 1000}, {label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 2}, {label: 'Temperature Change (K)', name: 'dt', type: 'number', defaultValue: 10}],
  'heat-capacity-calc': [{label: 'Heat Energy (J)', name: 'q', type: 'number', defaultValue: 1000}, {label: 'Temperature Change (K)', name: 'dt', type: 'number', defaultValue: 10}],
  'buoyant-force-calc': [{label: 'Density (kg/m³)', name: 'd', type: 'number', defaultValue: 1000}, {label: 'Volume Displaced (m³)', name: 'v', type: 'number', defaultValue: 0.5}],
  'gravitational-force-calc': [{label: 'Mass 1 (kg)', name: 'm1', type: 'number', defaultValue: 100}, {label: 'Mass 2 (kg)', name: 'm2', type: 'number', defaultValue: 50}, {label: 'Distance (m)', name: 'r', type: 'number', defaultValue: 2}],
  'escape-velocity-calc': [{label: 'Mass of Planet (kg)', name: 'm', type: 'number', defaultValue: 5.972e+24}, {label: 'Radius of Planet (m)', name: 'r', type: 'number', defaultValue: 6371000}],
  'friction-force-calc': [{label: 'Coefficient of Friction', name: 'mu', type: 'number', defaultValue: 0.3}, {label: 'Normal Force (N)', name: 'n', type: 'number', defaultValue: 100}],
  'pendulum-period-calc': [{label: 'Length (m)', name: 'l', type: 'number', defaultValue: 1}],
  'spring-potential-energy-calc': [{label: 'Spring Constant (N/m)', name: 'k', type: 'number', defaultValue: 100}, {label: 'Displacement (m)', name: 'x', type: 'number', defaultValue: 0.2}],
  'stress-calc': [{label: 'Force (N)', name: 'f', type: 'number', defaultValue: 1000}, {label: 'Area (m²)', name: 'a', type: 'number', defaultValue: 0.05}],
  'strain-calc': [{label: 'Change in Length (m)', name: 'dl', type: 'number', defaultValue: 0.01}, {label: 'Original Length (m)', name: 'l', type: 'number', defaultValue: 2}],
  'youngs-modulus-calc': [{label: 'Stress (Pa)', name: 'stress', type: 'number', defaultValue: 20000}, {label: 'Strain', name: 'strain', type: 'number', defaultValue: 0.005}],
  'photon-energy-calc': [{label: 'Frequency (Hz)', name: 'f', type: 'number', defaultValue: 500000000000000}],
  'mach-number-calc': [{label: 'Speed of Object (m/s)', name: 'v', type: 'number', defaultValue: 680}, {label: 'Speed of Sound (m/s)', name: 'c', type: 'number', defaultValue: 340}],
  'concrete-volume-calc': [{label: 'Length (ft)', name: 'l', type: 'number', defaultValue: 10}, {label: 'Width (ft)', name: 'w', type: 'number', defaultValue: 10}, {label: 'Depth (in)', name: 'd', type: 'number', defaultValue: 4}],
  'brick-count-calc': [{label: 'Wall Area (sq ft)', name: 'a', type: 'number', defaultValue: 100}],
  'block-count-calc': [{label: 'Wall Area (sq ft)', name: 'a', type: 'number', defaultValue: 100}],
  'tile-count-calc': [{label: 'Floor Area (sq ft)', name: 'a', type: 'number', defaultValue: 100}, {label: 'Tile Size (sq in)', name: 't', type: 'number', defaultValue: 144}],
  'paint-coverage-calc': [{label: 'Wall Area (sq ft)', name: 'a', type: 'number', defaultValue: 400}],
  'drywall-sheets-calc': [{label: 'Wall Area (sq ft)', name: 'a', type: 'number', defaultValue: 500}, {label: 'Sheet Size (sq ft)', name: 's', type: 'number', defaultValue: 32}],
  'roofing-squares-calc': [{label: 'Roof Area (sq ft)', name: 'a', type: 'number', defaultValue: 1500}],
  'laminate-flooring-calc': [{label: 'Room Area (sq ft)', name: 'a', type: 'number', defaultValue: 200}],
  'hardwood-flooring-calc': [{label: 'Room Area (sq ft)', name: 'a', type: 'number', defaultValue: 200}],
  'decking-boards-calc': [{label: 'Deck Area (sq ft)', name: 'a', type: 'number', defaultValue: 150}, {label: 'Board Width (in)', name: 'w', type: 'number', defaultValue: 5.5}],
  'pavers-calc': [{label: 'Patio Area (sq ft)', name: 'a', type: 'number', defaultValue: 100}, {label: 'Paver Size (sq in)', name: 'p', type: 'number', defaultValue: 64}],
  'mulch-volume-calc': [{label: 'Garden Area (sq ft)', name: 'a', type: 'number', defaultValue: 100}, {label: 'Depth (in)', name: 'd', type: 'number', defaultValue: 3}],
  'soil-volume-calc': [{label: 'Area (sq ft)', name: 'a', type: 'number', defaultValue: 50}, {label: 'Depth (in)', name: 'd', type: 'number', defaultValue: 6}],
  'gravel-volume-calc': [{label: 'Area (sq ft)', name: 'a', type: 'number', defaultValue: 100}, {label: 'Depth (in)', name: 'd', type: 'number', defaultValue: 2}],
  'sand-volume-calc': [{label: 'Area (sq ft)', name: 'a', type: 'number', defaultValue: 100}, {label: 'Depth (in)', name: 'd', type: 'number', defaultValue: 2}],
  'retaining-wall-block-calc': [{label: 'Wall Length (ft)', name: 'l', type: 'number', defaultValue: 20}, {label: 'Wall Height (ft)', name: 'h', type: 'number', defaultValue: 3}, {label: 'Block Length (in)', name: 'bl', type: 'number', defaultValue: 12}, {label: 'Block Height (in)', name: 'bh', type: 'number', defaultValue: 6}],
  'stair-stringer-calc': [{label: 'Total Rise (in)', name: 'r', type: 'number', defaultValue: 35}],
  'ceiling-tiles-calc': [{label: 'Ceiling Area (sq ft)', name: 'a', type: 'number', defaultValue: 200}, {label: 'Tile Size (sq ft)', name: 't', type: 'number', defaultValue: 4}],
  'insulation-rolls-calc': [{label: 'Wall Area (sq ft)', name: 'a', type: 'number', defaultValue: 400}, {label: 'Roll Coverage (sq ft)', name: 'r', type: 'number', defaultValue: 40}],
  'wallpaper-rolls-calc': [{label: 'Wall Area (sq ft)', name: 'a', type: 'number', defaultValue: 100}, {label: 'Roll Coverage (sq ft)', name: 'r', type: 'number', defaultValue: 30}],
  'wall-framing-studs-calc': [{label: 'Wall Length (ft)', name: 'l', type: 'number', defaultValue: 20}, {label: 'Spacing (in)', name: 's', type: 'number', defaultValue: 16}],
  'fence-pickets-calc': [{label: 'Fence Length (ft)', name: 'l', type: 'number', defaultValue: 100}, {label: 'Picket Width (in)', name: 'w', type: 'number', defaultValue: 5.5}],
  'concrete-slab-calc': [{label: 'Volume (cu ft)', name: 'v', type: 'number', defaultValue: 10}, {label: 'Bag Yield (cu ft)', name: 'y', type: 'number', defaultValue: 0.45}],
  'concrete-column-calc': [{label: 'Radius (in)', name: 'r', type: 'number', defaultValue: 6}, {label: 'Height (ft)', name: 'h', type: 'number', defaultValue: 10}],
  'concrete-footer-calc': [{label: 'Length (ft)', name: 'l', type: 'number', defaultValue: 50}, {label: 'Width (in)', name: 'w', type: 'number', defaultValue: 12}, {label: 'Depth (in)', name: 'd', type: 'number', defaultValue: 12}],
  'asphalt-driveway-calc': [{label: 'Area (sq ft)', name: 'a', type: 'number', defaultValue: 400}, {label: 'Depth (in)', name: 'd', type: 'number', defaultValue: 2}],
  'driveway-sealer-calc': [{label: 'Driveway Area (sq ft)', name: 'a', type: 'number', defaultValue: 600}, {label: 'Pail Coverage (sq ft)', name: 'c', type: 'number', defaultValue: 300}],
  'carpet-area-calc': [{label: 'Room Length (ft)', name: 'l', type: 'number', defaultValue: 12}, {label: 'Room Width (ft)', name: 'w', type: 'number', defaultValue: 10}],
  'sod-rolls-calc': [{label: 'Lawn Area (sq ft)', name: 'a', type: 'number', defaultValue: 1000}, {label: 'Roll Area (sq ft)', name: 'r', type: 'number', defaultValue: 10}],
  'grout-volume-calc': [{label: 'Tiled Area (sq ft)', name: 'a', type: 'number', defaultValue: 100}],
  'board-foot-calc': [{label: 'Thickness (in)', name: 't', type: 'number', defaultValue: 2}, {label: 'Width (in)', name: 'w', type: 'number', defaultValue: 4}, {label: 'Length (ft)', name: 'l', type: 'number', defaultValue: 8}],
  'area-calc': [{label: 'Length', name: 'l', type: 'number', defaultValue: 10}, {label: 'Width', name: 'w', type: 'number', defaultValue: 5}],
  'perimeter-calc': [{label: 'Length', name: 'l', type: 'number', defaultValue: 10}, {label: 'Width', name: 'w', type: 'number', defaultValue: 5}],
  'm-to-ft-calc': [{label: 'Meters', name: 'v', type: 'number', defaultValue: 1}],
  'ft-to-m-calc': [{label: 'Feet', name: 'v', type: 'number', defaultValue: 1}],
  'cm-to-in-calc': [{label: 'Centimeters', name: 'v', type: 'number', defaultValue: 1}],
  'in-to-cm-calc': [{label: 'Inches', name: 'v', type: 'number', defaultValue: 1}],
  'km-to-mi-calc': [{label: 'Kilometers', name: 'v', type: 'number', defaultValue: 1}],
  'mi-to-km-calc': [{label: 'Miles', name: 'v', type: 'number', defaultValue: 1}],
  'yd-to-m-calc': [{label: 'Yards', name: 'v', type: 'number', defaultValue: 1}],
  'm-to-yd-calc': [{label: 'Meters', name: 'v', type: 'number', defaultValue: 1}],
  'kg-to-lb-calc': [{label: 'Kilograms', name: 'v', type: 'number', defaultValue: 1}],
  'lb-to-kg-calc': [{label: 'Pounds', name: 'v', type: 'number', defaultValue: 1}],
  'g-to-oz-calc': [{label: 'Grams', name: 'v', type: 'number', defaultValue: 1}],
  'oz-to-g-calc': [{label: 'Ounces', name: 'v', type: 'number', defaultValue: 1}],
  't-to-ton-calc': [{label: 'Metric Tons', name: 'v', type: 'number', defaultValue: 1}],
  'l-to-gal-calc': [{label: 'Liters', name: 'v', type: 'number', defaultValue: 1}],
  'gal-to-l-calc': [{label: 'Gallons', name: 'v', type: 'number', defaultValue: 1}],
  'ml-to-oz-calc': [{label: 'Milliliters', name: 'v', type: 'number', defaultValue: 1}],
  'oz-to-ml-calc': [{label: 'Fluid Ounces', name: 'v', type: 'number', defaultValue: 1}],
  'cup-to-ml-calc': [{label: 'Cups', name: 'v', type: 'number', defaultValue: 1}],
  'c-to-f-calc': [{label: 'Celsius', name: 'v', type: 'number', defaultValue: 0}],
  'f-to-c-calc': [{label: 'Fahrenheit', name: 'v', type: 'number', defaultValue: 32}],
  'c-to-k-calc': [{label: 'Celsius', name: 'v', type: 'number', defaultValue: 0}],
  'k-to-c-calc': [{label: 'Kelvin', name: 'v', type: 'number', defaultValue: 273.15}],
  'sqm-to-sqft-calc': [{label: 'Square Meters', name: 'v', type: 'number', defaultValue: 1}],
  'sqft-to-sqm-calc': [{label: 'Square Feet', name: 'v', type: 'number', defaultValue: 1}],
  'acre-to-sqm-calc': [{label: 'Acres', name: 'v', type: 'number', defaultValue: 1}],
  'hectare-to-acre-calc': [{label: 'Hectares', name: 'v', type: 'number', defaultValue: 1}],
  'kmh-to-mph-calc': [{label: 'km/h', name: 'v', type: 'number', defaultValue: 100}],
  'mph-to-kmh-calc': [{label: 'mph', name: 'v', type: 'number', defaultValue: 60}],
  'ms-to-kmh-calc': [{label: 'm/s', name: 'v', type: 'number', defaultValue: 10}],
  'knots-to-mph-calc': [{label: 'Knots', name: 'v', type: 'number', defaultValue: 10}],
  'min-to-hours-calc': [{label: 'Minutes', name: 'v', type: 'number', defaultValue: 60}],
  'mb-to-gb-calc': [{label: 'MB', name: 'v', type: 'number', defaultValue: 1024}],
  'j-to-cal-calc': [{label: 'Joules', name: 'v', type: 'number', defaultValue: 4184}],
  'ratio': [
    { label: 'A', name: 'a', type: 'number', defaultValue: 16  },
    { label: 'B', name: 'b', type: 'number', defaultValue: 9  },
    { label: 'C', name: 'c', type: 'number', defaultValue: 1920  },
  ],
  'percentage-diff': [
    { label: 'Value 1', name: 'v1', type: 'number', defaultValue: 100  },
    { label: 'Value 2', name: 'v2', type: 'number', defaultValue: 120  },
  ],
  'percentage-error': [
    { label: 'Observed Value', name: 'o', type: 'number', defaultValue: 95  },
    { label: 'Exact Value', name: 'e', type: 'number', defaultValue: 100  },
  ],
  'fraction-decimal': [
    { label: 'Conversion Type', name: 'type', type: 'select', defaultValue: 'f2d', options: [{ label: 'Fraction to Decimal', value: 'f2d' }, { label: 'Decimal to Fraction', value: 'd2f' }] },
    { label: 'Numerator', name: 'n', type: 'number', defaultValue: 3, step: 1, condition: { field: 'type', value: 'f2d' } },
    { label: 'Denominator', name: 'd', type: 'number', defaultValue: 4, step: 1, condition: { field: 'type', value: 'f2d' } },
    { label: 'Decimal Value', name: 'decimal', type: 'number', defaultValue: 0.75, step: 0.001, condition: { field: 'type', value: 'd2f' } },
  ],
  'triangle-area': [
    { label: 'Base', name: 'b', type: 'number', defaultValue: 10  },
    { label: 'Height', name: 'h', type: 'number', defaultValue: 5  },
  ],
  'rectangle-area': [
    { label: 'Length', name: 'l', type: 'number', defaultValue: 10  },
    { label: 'Width', name: 'w', type: 'number', defaultValue: 5  },
  ],
  'circle-circumference': [
    { label: 'Radius', name: 'r', type: 'number', defaultValue: 5  },
  ],
  'arc-length': [
    { label: 'Radius', name: 'r', type: 'number', defaultValue: 5  },
    { label: 'Central Angle (degrees)', name: 'a', type: 'number', defaultValue: 45  },
  ],
  'sector-area': [
    { label: 'Radius', name: 'r', type: 'number', defaultValue: 5  },
    { label: 'Central Angle (degrees)', name: 'a', type: 'number', defaultValue: 45  },
  ],
  'sphere-surface-area': [
    { label: 'Radius', name: 'r', type: 'number', defaultValue: 5  },
  ],
  'cylinder-surface-area': [
    { label: 'Radius', name: 'r', type: 'number', defaultValue: 5  },
    { label: 'Height', name: 'h', type: 'number', defaultValue: 10  },
  ],
  'box-surface-area': [
    { label: 'Length', name: 'l', type: 'number', defaultValue: 5  },
    { label: 'Width', name: 'w', type: 'number', defaultValue: 4  },
    { label: 'Height', name: 'h', type: 'number', defaultValue: 3  },
  ],
  'margin-of-error': [
    { label: 'Z-Score (Confidence)', name: 'z', type: 'number', defaultValue: 1.96  },
    { label: 'Population Std Dev', name: 's', type: 'number', defaultValue: 0.5  },
    { label: 'Sample Size', name: 'n', type: 'number', defaultValue: 100  },
  ],
  'rule-of-72': [
    { label: 'Annual Interest Rate (%)', name: 'r', type: 'number', defaultValue: 8, min: 0.1, max: 200, step: 0.1 },
  ],
  'sales-tax': [
    { label: 'Price before tax', name: 'p', type: 'number', defaultValue: 100, min: 0, max: 100000 },
    { label: 'Sales Tax Rate (%)', name: 'r', type: 'number', defaultValue: 7, min: 0, max: 100, step: 0.1 },
  ],
  'vat': [
    { label: 'Net Price', name: 'p', type: 'number', defaultValue: 100, min: 0, max: 100000 },
    { label: 'VAT Rate (%)', name: 'r', type: 'number', defaultValue: 20, min: 0, max: 100, step: 0.1 },
  ],
  'profit-percentage': [
    { label: 'Cost Price', name: 'c', type: 'number', defaultValue: 100  },
    { label: 'Selling Price', name: 's', type: 'number', defaultValue: 150  },
  ],
  'revenue': [
    { label: 'Price per Unit', name: 'p', type: 'number', defaultValue: 50  },
    { label: 'Units Sold', name: 'u', type: 'number', defaultValue: 1000  },
  ],
  'net-income': [
    { label: 'Total Revenue', name: 'r', type: 'number', defaultValue: 50000  },
    { label: 'Total Expenses', name: 'e', type: 'number', defaultValue: 30000  },
  ],
  'inventory-turnover': [
    { label: 'Cost of Goods Sold', name: 'c', type: 'number', defaultValue: 100000  },
    { label: 'Average Inventory', name: 'i', type: 'number', defaultValue: 20000  },
  ],
  'days-in-inventory': [
    { label: 'Average Inventory', name: 'i', type: 'number', defaultValue: 20000  },
    { label: 'Cost of Goods Sold', name: 'c', type: 'number', defaultValue: 100000  },
  ],
  'receivables-turnover': [
    { label: 'Net Credit Sales', name: 's', type: 'number', defaultValue: 200000  },
    { label: 'Average Acct Receivables', name: 'a', type: 'number', defaultValue: 40000  },
  ],
  'return-on-assets': [
    { label: 'Net Income', name: 'i', type: 'number', defaultValue: 50000  },
    { label: 'Total Assets', name: 'a', type: 'number', defaultValue: 500000  },
  ],
  'return-on-equity': [
    { label: 'Net Income', name: 'i', type: 'number', defaultValue: 50000  },
    { label: 'Shareholder Equity', name: 'e', type: 'number', defaultValue: 250000  },
  ],
  'calorie-deficit': [
    { label: 'TDEE (Maintenance Calories)', name: 'tdee', type: 'number', defaultValue: 2500  },
    { label: 'Goal Weekly Loss (lbs)', name: 'w', type: 'number', defaultValue: 1  },
  ],
  'run-pace': [
    { label: 'Distance (miles)', name: 'd', type: 'number', defaultValue: 3.1  },
    { label: 'Time (minutes)', name: 't', type: 'number', defaultValue: 25  },
  ],
  'ideal-weight': [
    { label: 'Height (cm)', name: 'h', type: 'number', defaultValue: 175  },
    { label: 'Gender', name: 'gender', type: 'select', defaultValue: "male" , options: [{"label":"Male","value":"male"},{"label":"Female","value":"female"}] },
  ],
  
  'water-intake': [
  {
    "label": "Weight (kg)",
    "name": "weight",
    "type": "number",
    "defaultValue": 70
  },
  {
    "label": "Exercise (min)",
    "name": "exercise",
    "type": "number",
    "defaultValue": 30
  }
],
  'blood-donation': [
    { label: 'Last Donation Date', name: 'd', type: 'date', defaultValue: "2023-01-01"  },
  ],
  'velocity-calc': [
    { label: 'Displacement (m)', name: 'd', type: 'number', defaultValue: 100  },
    { label: 'Time (s)', name: 't', type: 'number', defaultValue: 10  },
  ],
  'torque-calc': [
    { label: 'Force (N)', name: 'f', type: 'number', defaultValue: 50  },
    { label: 'Radius (m)', name: 'r', type: 'number', defaultValue: 0.5  },
    { label: 'Angle (degrees)', name: 'a', type: 'number', defaultValue: 90  },
  ],
  'mass-energy': [
    { label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 1  },
  ],
  'hookes-law': [
    { label: 'Spring Constant (N/m)', name: 'k', type: 'number', defaultValue: 100  },
    { label: 'Displacement (m)', name: 'x', type: 'number', defaultValue: 0.2  },
  ],
  'kinetic-friction': [
    { label: 'Friction Coefficient (μk)', name: 'u', type: 'number', defaultValue: 0.5  },
    { label: 'Normal Force (N)', name: 'n', type: 'number', defaultValue: 100  },
  ],
  'escape-velocity': [
    { label: 'Mass of Body (kg)', name: 'm', type: 'number', defaultValue: 5.972e+24  },
    { label: 'Radius of Body (m)', name: 'r', type: 'number', defaultValue: 6371000  },
  ],
  'decimal-binary': [
    { label: 'Decimal Number', name: 'n', type: 'number', defaultValue: 42  },
  ],
  'decimal-hex': [
    { label: 'Decimal Number', name: 'n', type: 'number', defaultValue: 255  },
  ],
  'binary-decimal': [
    { label: 'Binary String', name: 'b', type: 'text', defaultValue: "101010"  },
  ],
  'hex-decimal': [
    { label: 'Hex String', name: 'h', type: 'text', defaultValue: "FF"  },
  ],
  'base64-encode': [
    { label: 'Text string', name: 't', type: 'text', defaultValue: "Hello World"  },
  ],
  'words-calculator': [
    { label: 'Text', name: 't', type: 'text', defaultValue: "Type or paste your text here."  },
  ],
  'time-duration': [
    { label: 'Start Time (HH:MM)', name: 's', type: 'text', defaultValue: "09:00"  },
    { label: 'End Time (HH:MM)', name: 'e', type: 'text', defaultValue: "17:30"  },
  ],
  'days-between': [
    { label: 'Start Date', name: 's', type: 'date', defaultValue: "2023-01-01"  },
    { label: 'End Date', name: 'e', type: 'date', defaultValue: "2023-12-31"  },
  ],
  'timestamp-date': [
    { label: 'Unix Timestamp Plugin (s/ms)', name: 't', type: 'number', defaultValue: 1672531200  },
  ],
  'adding-time': [
    { label: 'Start Time (HH:MM)', name: 's', type: 'text', defaultValue: "09:00"  },
    { label: 'Add Hours', name: 'h', type: 'number', defaultValue: 2  },
    { label: 'Add Minutes', name: 'm', type: 'number', defaultValue: 30  },
  ],
  'scientific-notation': [
    { label: 'Value (e.g. 1.5e3)', name: 'v', type: 'text', defaultValue: "1.5e3"  },
  ],
  'molar-mass': [
    { label: 'Moles', name: 'm', type: 'number', defaultValue: 2  },
  ],
  'moles': [
    { label: 'Mass (g)', name: 'm', type: 'number', defaultValue: 36.03  },
  ],

  'pregnancy-due-date': [
    { label: 'First Day of Last Period', name: 'lmp', type: 'date', defaultValue: "2023-01-01"  },
  ],
  'ovulation': [
    { label: 'First Day of Last Period', name: 'lmp', type: 'date', defaultValue: "2023-01-01"  },
    { label: 'Cycle Length (days)', name: 'cycle', type: 'number', defaultValue: 28  },
  ],
  'tdee': [
    { label: 'Weight (kg)', name: 'weight', type: 'number', defaultValue: 70, min: 20, max: 200, step: 0.1 },
    { label: 'Height (cm)', name: 'height', type: 'number', defaultValue: 175, min: 100, max: 250, step: 1 },
    { label: 'Age', name: 'age', type: 'number', defaultValue: 25, min: 15, max: 100, step: 1 },
    { label: 'Gender', name: 'gender', type: 'select', defaultValue: "male" , options: [{"label":"Male","value":"male"},{"label":"Female","value":"female"}] },
    { label: 'Activity Multiplier', name: 'activity', type: 'number', defaultValue: 1.2, min: 1.2, max: 2.0, step: 0.05 },
  ],
  'one-rep-max': [
    { label: 'Weight Lifted', name: 'weight', type: 'number', defaultValue: 100  },
    { label: 'Reps', name: 'reps', type: 'number', defaultValue: 5  },
  ],
  'body-surface-area': [
    { label: 'Weight (kg)', name: 'weight', type: 'number', defaultValue: 70  },
    { label: 'Height (cm)', name: 'height', type: 'number', defaultValue: 175  },
  ],
  'pythagorean': [
    { label: 'Side A', name: 'a', type: 'number', defaultValue: 3  },
    { label: 'Side B', name: 'b', type: 'number', defaultValue: 4  },
  ],
  'sphere-volume': [
    { label: 'Radius', name: 'r', type: 'number', defaultValue: 5  },
  ],
  'cylinder-volume': [
    { label: 'Radius', name: 'r', type: 'number', defaultValue: 5  },
    { label: 'Height', name: 'h', type: 'number', defaultValue: 10  },
  ],
  'cone-volume': [
    { label: 'Radius', name: 'r', type: 'number', defaultValue: 5  },
    { label: 'Height', name: 'h', type: 'number', defaultValue: 10  },
  ],
  'quadratic-equation': [
    { label: 'a', name: 'a', type: 'number', defaultValue: 1  },
    { label: 'b', name: 'b', type: 'number', defaultValue: -3  },
    { label: 'c', name: 'c', type: 'number', defaultValue: 2  },
  ],
  'midpoint': [
    { label: 'X1', name: 'x1', type: 'number', defaultValue: 0  },
    { label: 'Y1', name: 'y1', type: 'number', defaultValue: 0  },
    { label: 'X2', name: 'x2', type: 'number', defaultValue: 10  },
    { label: 'Y2', name: 'y2', type: 'number', defaultValue: 10  },
  ],
  'distance-2d': [
    { label: 'X1', name: 'x1', type: 'number', defaultValue: 0  },
    { label: 'Y1', name: 'y1', type: 'number', defaultValue: 0  },
    { label: 'X2', name: 'x2', type: 'number', defaultValue: 10  },
    { label: 'Y2', name: 'y2', type: 'number', defaultValue: 10  },
  ],
  'slope': [
    { label: 'X1', name: 'x1', type: 'number', defaultValue: 0  },
    { label: 'Y1', name: 'y1', type: 'number', defaultValue: 0  },
    { label: 'X2', name: 'x2', type: 'number', defaultValue: 10  },
    { label: 'Y2', name: 'y2', type: 'number', defaultValue: 10  },
  ],
  'factorial': [
    { label: 'Number', name: 'n', type: 'number', defaultValue: 5  },
  ],
  'combinations': [
    { label: 'n (total items)', name: 'n', type: 'number', defaultValue: 5  },
    { label: 'r (items chosen)', name: 'r', type: 'number', defaultValue: 2  },
  ],
  'permutations': [
    { label: 'n (total items)', name: 'n', type: 'number', defaultValue: 5  },
    { label: 'r (items chosen)', name: 'r', type: 'number', defaultValue: 2  },
  ],
  'prime-factorization': [
    { label: 'Number', name: 'n', type: 'number', defaultValue: 60  },
  ],
  'gcd-lcm': [
    { label: 'Number 1', name: 'a', type: 'number', defaultValue: 12  },
    { label: 'Number 2', name: 'b', type: 'number', defaultValue: 15  },
  ],
  'standard-deviation': [
    { label: 'Comma Separated Values', name: 'vals', type: 'text', defaultValue: "10, 12, 23, 23, 16, 23, 21, 16"  },
  ],
  'kinetic-energy': [
    { label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 10  },
    { label: 'Velocity (m/s)', name: 'v', type: 'number', defaultValue: 5  },
  ],
  'potential-energy': [
    { label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 10  },
    { label: 'Height (m)', name: 'h', type: 'number', defaultValue: 5  },
  ],
  'ohm-law': [
    { label: 'Voltage (V)', name: 'v', type: 'number', defaultValue: ""  },
    { label: 'Current (A)', name: 'i', type: 'number', defaultValue: 5  },
    { label: 'Resistance (Ω)', name: 'r', type: 'number', defaultValue: 10  },
  ],
  'power': [
    { label: 'Voltage (V)', name: 'v', type: 'number', defaultValue: 120  },
    { label: 'Current (A)', name: 'i', type: 'number', defaultValue: 15  },
  ],
  'density': [
    { label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 100  },
    { label: 'Volume (m³)', name: 'v', type: 'number', defaultValue: 2  },
  ],
  'force': [
    { label: 'Mass (kg)', name: 'm', type: 'number', defaultValue: 10  },
    { label: 'Acceleration (m/s²)', name: 'a', type: 'number', defaultValue: 9.8  },
  ],
  'speed-distance-time': [
    { label: 'Distance', name: 'd', type: 'number', defaultValue: ""  },
    { label: 'Speed', name: 's', type: 'number', defaultValue: 60  },
    { label: 'Time', name: 't', type: 'number', defaultValue: 2  },
  ],
  'present-value': [
    { label: 'Future Value', name: 'fv', type: 'number', defaultValue: 10000  },
    { label: 'Rate (%)', name: 'r', type: 'number', defaultValue: 5  },
    { label: 'Periods', name: 'n', type: 'number', defaultValue: 5  },
  ],
  'future-value': [
    { label: 'Present Value', name: 'pv', type: 'number', defaultValue: 10000  },
    { label: 'Rate (%)', name: 'r', type: 'number', defaultValue: 5  },
    { label: 'Periods', name: 'n', type: 'number', defaultValue: 5  },
  ],
  'apy': [
    { label: 'Stated Rate (APR) %', name: 'apr', type: 'number', defaultValue: 5  },
    { label: 'Compounds per year', name: 'n', type: 'number', defaultValue: 12  },
  ],
  'current-yield': [
    { label: 'Annual Coupon Payment', name: 'c', type: 'number', defaultValue: 50  },
    { label: 'Current Bond Price', name: 'p', type: 'number', defaultValue: 950  },
  ],
  'dividend-yield': [
    { label: 'Annual Dividend Per Share', name: 'd', type: 'number', defaultValue: 2.5  },
    { label: 'Share Price', name: 'p', type: 'number', defaultValue: 50  },
  ],
  'wacc': [
    { label: 'Equity Value', name: 'e', type: 'number', defaultValue: 600000  },
    { label: 'Debt Value', name: 'd', type: 'number', defaultValue: 400000  },
    { label: 'Cost of Equity (%)', name: 'ce', type: 'number', defaultValue: 10  },
    { label: 'Cost of Debt (%)', name: 'cd', type: 'number', defaultValue: 5  },
    { label: 'Corporate Tax Rate (%)', name: 't', type: 'number', defaultValue: 21  },
  ],
  'current-ratio': [
    { label: 'Current Assets', name: 'a', type: 'number', defaultValue: 150000  },
    { label: 'Current Liabilities', name: 'l', type: 'number', defaultValue: 100000  },
  ],
  'quick-ratio': [
    { label: 'Current Assets', name: 'a', type: 'number', defaultValue: 150000  },
    { label: 'Inventory', name: 'i', type: 'number', defaultValue: 50000  },
    { label: 'Current Liabilities', name: 'l', type: 'number', defaultValue: 100000  },
  ],
  'debt-to-equity': [
    { label: 'Total Liabilities', name: 'l', type: 'number', defaultValue: 200000  },
    { label: 'Total Shareholder Equity', name: 'e', type: 'number', defaultValue: 500000  },
  ],
  'bra-size': [
    { label: 'Underbust (inches)', name: 'u', type: 'number', defaultValue: 32  },
    { label: 'Bust (inches)', name: 'b', type: 'number', defaultValue: 36  },
  ],
  'shoe-size-converter': [
    { label: 'US Size (Men)', name: 'us', type: 'number', defaultValue: 10  },
  ],
  'temperature-converter': [
    { label: 'Temp', name: 't', type: 'number', defaultValue: 0  },
    { label: 'From Unit', name: 'from', type: 'select', defaultValue: "c" , options: [{"label":"Celsius","value":"c"},{"label":"Fahrenheit","value":"f"},{"label":"Kelvin","value":"k"}] },
  ],
  'weight-converter': [
    { label: 'Weight', name: 'w', type: 'number', defaultValue: 1  },
    { label: 'From Unit', name: 'from', type: 'select', defaultValue: "kg" , options: [{"label":"Kilograms","value":"kg"},{"label":"Pounds","value":"lb"}] },
  ],
  'data-storage-converter': [
    { label: 'Gigabytes (GB)', name: 'gb', type: 'number', defaultValue: 1  },
  ],
  'dog-age': [
    { label: 'Dog Years', name: 'd', type: 'number', defaultValue: 5  },
  ],
  'cat-age': [
    { label: 'Cat Years', name: 'c', type: 'number', defaultValue: 5  },
  ],
  'energy-cost': [
    { label: 'Power (Watts)', name: 'w', type: 'number', defaultValue: 1000  },
    { label: 'Hours per Day', name: 'h', type: 'number', defaultValue: 2  },
    { label: 'Cost per kWh ($)', name: 'c', type: 'number', defaultValue: 0.15  },
  ],
  'pool-volume': [
    { label: 'Length (ft)', name: 'l', type: 'number', defaultValue: 20  },
    { label: 'Width (ft)', name: 'w', type: 'number', defaultValue: 10  },
    { label: 'Average Depth (ft)', name: 'd', type: 'number', defaultValue: 5  },
  ],
  'concrete-volume': [
    { label: 'Length (ft)', name: 'l', type: 'number', defaultValue: 10  },
    { label: 'Width (ft)', name: 'w', type: 'number', defaultValue: 10  },
    { label: 'Thickness (in)', name: 't', type: 'number', defaultValue: 4  },
  ],
  'paint': [
    { label: 'Wall Length (ft)', name: 'l', type: 'number', defaultValue: 12  },
    { label: 'Wall Height (ft)', name: 'h', type: 'number', defaultValue: 8  },
  ],
  'roofing': [
    { label: 'Roof Area (sq ft)', name: 'a', type: 'number', defaultValue: 1500  },
  ],
  'z-score': [
    { label: 'Value (X)', name: 'x', type: 'number', defaultValue: 50  },
    { label: 'Mean (μ)', name: 'm', type: 'number', defaultValue: 40  },
    { label: 'Std Dev (σ)', name: 's', type: 'number', defaultValue: 5  },
  ],
  'expected-value': [
    { label: 'Values (Comma space separated)', name: 'v', type: 'text', defaultValue: "10, 20"  },
    { label: 'Probabilities (Comma space separated, decimals)', name: 'p', type: 'text', defaultValue: "0.5, 0.5"  },
  ],
  'roman-numerals': [
    { label: 'Number', name: 'n', type: 'number', defaultValue: 2024  },
  ],

  
  
  'simple-interest': [{"label":"Principal","name":"principal","type":"number","defaultValue":1000},{"label":"Rate (%)","name":"rate","type":"number","defaultValue":5},{"label":"Time (Yrs)","name":"time","type":"number","defaultValue":2}],
  
  
  'savings-goal': [{"label":"Goal Amount","name":"goal","type":"number","defaultValue":10000},{"label":"Initial Amount","name":"initial","type":"number","defaultValue":1000},{"label":"Time (Months)","name":"months","type":"number","defaultValue":24},{"label":"Interest Rate","name":"rate","type":"number","defaultValue":3}],
  
  
  'discount': [{"label":"Original Price","name":"price","type":"number","defaultValue":100},{"label":"Discount %","name":"discountPercent","type":"number","defaultValue":20},{"label":"Sales Tax %","name":"taxPercent","type":"number","defaultValue":5}],
  
  
  'date-diff': [{"label":"Start Date","name":"startDate","type":"date","defaultValue":"2023-01-01"},{"label":"End Date","name":"endDate","type":"date","defaultValue":"2023-12-31"}],
  
  
  'world-clock': [{"label":"Offset Hours","name":"offset","type":"number","defaultValue":-5}],

  
  
  'lease': [{"label":"Car Price","name":"price","type":"number","defaultValue":30000},{"label":"Residual Value","name":"residual","type":"number","defaultValue":15000},{"label":"Money Factor","name":"moneyFactor","type":"number","defaultValue":0.001},{"label":"Term (Months)","name":"months","type":"number","defaultValue":36}],
  
  
  'heloc': [{"label":"Home Value","name":"homeValue","type":"number","defaultValue":300000},{"label":"Mortgage Balance","name":"mortgage","type":"number","defaultValue":150000},{"label":"Max LTV (%)","name":"maxLtv","type":"number","defaultValue":80}],
  
  
  'exponent': [{"label":"Base","name":"base","type":"number","defaultValue":2},{"label":"Exponent","name":"exponent","type":"number","defaultValue":3}],
  
  
  'logarithm': [{"label":"Base","name":"base","type":"number","defaultValue":10},{"label":"Value","name":"value","type":"number","defaultValue":100}],
  
  
  'basal-metabolic': [{"label":"Weight (kg)","name":"weight","type":"number","defaultValue":70},{"label":"Height (cm)","name":"height","type":"number","defaultValue":175},{"label":"Age (yr)","name":"age","type":"number","defaultValue":30},{"label":"Is Male","name":"isMale","type":"number","defaultValue":1}],
  
  
  'waist-hip': [{"label":"Waist (cm)","name":"waist","type":"number","defaultValue":80},{"label":"Hip (cm)","name":"hip","type":"number","defaultValue":100}],
  
  
  'binary': [{"label":"Decimal Value","name":"decimal","type":"number","defaultValue":15}],
  
  
  'password-strength': [{"label":"Password Length","name":"len","type":"number","defaultValue":12},{"label":"Include Uppercase (1/0)","name":"upper","type":"number","defaultValue":1},{"label":"Include Numbers (1/0)","name":"numbers","type":"number","defaultValue":1},{"label":"Include Symbols (1/0)","name":"symbols","type":"number","defaultValue":1}],
  
  
  'countdown': [{"label":"Target Date","name":"targetDate","type":"date","defaultValue":"2030-01-01"}],
  
  
  'salary-comparison': [{"label":"Salary A","name":"salaryA","type":"number","defaultValue":50000},{"label":"Salary B","name":"salaryB","type":"number","defaultValue":60000},{"label":"Cost of Living Index A","name":"colA","type":"number","defaultValue":100},{"label":"Cost of Living Index B","name":"colB","type":"number","defaultValue":120}],
  
  
  'car-lease': [{"label":"Car Price","name":"price","type":"number","defaultValue":30000},{"label":"Residual Value","name":"residual","type":"number","defaultValue":15000},{"label":"Money Factor","name":"moneyFactor","type":"number","defaultValue":0.001},{"label":"Term (Months)","name":"months","type":"number","defaultValue":36}],
  
  
  'student-loan': [{"label":"Loan Amount","name":"amount","type":"number","defaultValue":30000},{"label":"Interest Rate (%)","name":"rate","type":"number","defaultValue":5},{"label":"Term (Months)","name":"term","type":"number","defaultValue":120}],
  'macros': [
    { label: 'Target Calories', name: 'calories', type: 'number', defaultValue: 2000 }
  ],
  
  
  'unit-converter': [{"label":"Value","name":"value","type":"number","defaultValue":1},{"label":"From Unit","name":"fromUnit","type":"select","defaultValue":"cm","options":[{"label":"cm","value":"cm"},{"label":"m","value":"m"},{"label":"km","value":"km"},{"label":"inch","value":"inch"},{"label":"ft","value":"ft"},{"label":"lb","value":"lb"},{"label":"kg","value":"kg"}]},{"label":"To Unit","name":"toUnit","type":"select","defaultValue":"inch","options":[{"label":"cm","value":"cm"},{"label":"m","value":"m"},{"label":"km","value":"km"},{"label":"inch","value":"inch"},{"label":"ft","value":"ft"},{"label":"lb","value":"lb"},{"label":"kg","value":"kg"}]}],

  'inflation': [
    { label: 'Value 1', name: 'val1', type: 'number', defaultValue: 100 },
    { label: 'Value 2', name: 'val2', type: 'number', defaultValue: 50 },
  ],
  
  'body-fat': [
  {
    "label": "Male=1, Female=0",
    "name": "gender",
    "type": "number",
    "defaultValue": 1
  },
  {
    "label": "Age",
    "name": "age",
    "type": "number",
    "defaultValue": 30
  },
  {
    "label": "Weight (kg)",
    "name": "weight",
    "type": "number",
    "defaultValue": 75
  },
  {
    "label": "Height (cm)",
    "name": "height",
    "type": "number",
    "defaultValue": 175
  },
  {
    "label": "Neck (cm)",
    "name": "neck",
    "type": "number",
    "defaultValue": 40
  },
  {
    "label": "Waist (cm)",
    "name": "waist",
    "type": "number",
    "defaultValue": 85
  },
  {
    "label": "Hip (cm)",
    "name": "hip",
    "type": "number",
    "defaultValue": 100
  }
],
  
  
  
  'probability': [{"label":"Favorable Outcomes","name":"favorable","type":"number","defaultValue":1},{"label":"Total Outcomes","name":"total","type":"number","defaultValue":6}],
  'bonus': [
    { label: 'Value 1', name: 'val1', type: 'number', defaultValue: 100 },
    { label: 'Value 2', name: 'val2', type: 'number', defaultValue: 50 },
  ],
  'property-tax': [
    { label: 'Property Value', name: 'propertyValue', type: 'number', defaultValue: 250000, unit: '$', min: 0, max: 100000000, step: 1000 },
    { label: 'Tax Rate (%)', name: 'taxRate', type: 'number', defaultValue: 1.2, min: 0, max: 100, step: 0.01 },
  ],
  'loan-emi': [
    { label: 'Loan Amount', name: 'principal', type: 'number', defaultValue: 100000, unit: '$' },
    { label: 'Interest Rate', name: 'rate', type: 'number', defaultValue: 7.5, unit: '%' },
    { label: 'Tenure', name: 'tenure', type: 'number', defaultValue: 5, unit: 'Years' },
    { label: 'Unit', name: 'tenureUnit', type: 'select', defaultValue: 'years', options: [{ label: 'Years', value: 'years' }, { label: 'Months', value: 'months' }] },
  ],
  'roi': [
    { label: 'Investment Amount', name: 'cost', type: 'number', defaultValue: 10000, unit: '$' },
    { label: 'Final Value / Revenue', name: 'revenue', type: 'number', defaultValue: 15000, unit: '$' },
  ],
  'markup': [
    { label: 'Product Cost', name: 'cost', type: 'number', defaultValue: 100, unit: '$' },
    { label: 'Selling Price', name: 'revenue', type: 'number', defaultValue: 150, unit: '$' },
  ],
  'crypto-roi': [
    { label: 'Purchase Price', name: 'cost', type: 'number', defaultValue: 50000, unit: '$' },
    { label: 'Current / Selling Price', name: 'revenue', type: 'number', defaultValue: 65000, unit: '$' },
  ],
  'ltv': [
    { label: 'Average Order Value', name: 'avgOrderValue', type: 'number', defaultValue: 50, unit: '$' },
    { label: 'Purchase Frequency (per year)', name: 'purchaseFrequency', type: 'number', defaultValue: 10 },
    { label: 'Lifespan (years)', name: 'lifespanYears', type: 'number', defaultValue: 3 },
  ],
  'cac': [
    { label: 'Total Marketing Spend', name: 'totalMarketingSpend', type: 'number', defaultValue: 10000, unit: '$' },
    { label: 'Customers Acquired', name: 'customersAcquired', type: 'number', defaultValue: 100 },
  ],
  'mutual-fund': [
    { label: 'Monthly SIP Amount', name: 'monthlyInvestment', type: 'number', defaultValue: 500, unit: '$' },
    { label: 'Expected Return (%)', name: 'expectedRate', type: 'number', defaultValue: 12, unit: '%' },
    { label: 'Tenure (Years)', name: 'tenure', type: 'number', defaultValue: 5, unit: 'Years' },
  ],
  'lumpsum': [
    { label: 'One-time Investment', name: 'principal', type: 'number', defaultValue: 10000, unit: '$' },
    { label: 'Expected Return (%)', name: 'rate', type: 'number', defaultValue: 12, unit: '%' },
    { label: 'Tenure (Years)', name: 'tenure', type: 'number', defaultValue: 5, unit: 'Years' },
  ],
  
  
  
  'dividend': [{"label":"Dividend","name":"d","type":"number","defaultValue":2},{"label":"Stock Price","name":"p","type":"number","defaultValue":50},{"label":"Shares Owned","name":"shares","type":"number","defaultValue":100}],
  'monthly-budget': [
    { label: 'Total Income', name: 'grossIncome', type: 'number', defaultValue: 5000, unit: '$' },
    { label: 'Total Expenses', name: 'monthlyDebts', type: 'number', defaultValue: 3000, unit: '$' },
  ],

  'mortgage': [
    { label: 'Home Price', name: 'homePrice', type: 'number', defaultValue: 300000, unit: '$' },
    { label: 'Down Payment', name: 'downPayment', type: 'number', defaultValue: 60000, unit: '$' },
    { label: 'Interest Rate', name: 'rate', type: 'number', defaultValue: 6.5, unit: '%' },
    { label: 'Loan Term', name: 'term', type: 'number', defaultValue: 30, unit: 'Years' },
  ],
  'car-loan': [
    { label: 'Vehicle Price', name: 'vehiclePrice', type: 'number', defaultValue: 25000, unit: '$' },
    { label: 'Down Payment', name: 'downPayment', type: 'number', defaultValue: 5000, unit: '$' },
    { label: 'Interest Rate', name: 'rate', type: 'number', defaultValue: 4.5, unit: '%' },
    { label: 'Loan Tenure', name: 'tenure', type: 'number', defaultValue: 5, unit: 'Years' },
  ],
  'credit-card-payoff': [
    { label: 'Current Balance', name: 'balance', type: 'number', defaultValue: 5000, unit: '$' },
    { label: 'Interest Rate (APR)', name: 'rate', type: 'number', defaultValue: 19.99, unit: '%' },
    { label: 'Monthly Payment', name: 'monthlyPayment', type: 'number', defaultValue: 200, unit: '$' },
  ],
  'debt-to-income': [
    { label: 'Gross Monthly Income', name: 'grossIncome', type: 'number', defaultValue: 5000, unit: '$' },
    { label: 'Total Monthly Debts', name: 'monthlyDebts', type: 'number', defaultValue: 1500, unit: '$' },
  ],
  'home-affordability': [
    { label: 'Annual Gross Income', name: 'annualIncome', type: 'number', defaultValue: 80000, unit: '$' },
    { label: 'Monthly Debt Payments', name: 'monthlyDebts', type: 'number', defaultValue: 500, unit: '$' },
    { label: 'Down Payment', name: 'downPayment', type: 'number', defaultValue: 20000, unit: '$' },
  ],
  'refinance': [
    { label: 'Current Balance', name: 'currentBalance', type: 'number', defaultValue: 250000, unit: '$' },
    { label: 'Current Rate', name: 'currentRate', type: 'number', defaultValue: 7.5, unit: '%' },
    { label: 'Current Term', name: 'currentTerm', type: 'number', defaultValue: 25, unit: 'Years' },
    { label: 'New Rate', name: 'newRate', type: 'number', defaultValue: 6.0, unit: '%' },
    { label: 'New Term', name: 'newTerm', type: 'number', defaultValue: 30, unit: 'Years' },
    { label: 'Closing Costs', name: 'closingCosts', type: 'number', defaultValue: 5000, unit: '$' },
  ],
  'loan-payoff': [
    { label: 'Balance', name: 'balance', type: 'number', defaultValue: 25000, unit: '$' },
    { label: 'Rate', name: 'rate', type: 'number', defaultValue: 5.0, unit: '%' },
    { label: 'Monthly Payment', name: 'monthlyPayment', type: 'number', defaultValue: 500, unit: '$' },
    { label: 'Extra Payment', name: 'extraPayment', type: 'number', defaultValue: 100, unit: '$' },
  ],
  'rent-vs-buy': [
    { label: 'Monthly Rent', name: 'monthlyRent', type: 'number', defaultValue: 2000, unit: '$' },
    { label: 'Home Price', name: 'homePrice', type: 'number', defaultValue: 400000, unit: '$' },
    { label: 'Down Payment', name: 'downPayment', type: 'number', defaultValue: 80000, unit: '$' },
    { label: 'Rate', name: 'rate', type: 'number', defaultValue: 6.5, unit: '%' },
    { label: 'Term', name: 'term', type: 'number', defaultValue: 30, unit: 'Years' },
  ],
  'balloon-loan': [
    { label: 'Principal Amount', name: 'principal', type: 'number', defaultValue: 50000, unit: '$' },
    { label: 'Interest Rate', name: 'rate', type: 'number', defaultValue: 5.5, unit: '%' },
    { label: 'Loan Term', name: 'term', type: 'number', defaultValue: 5, unit: 'Years' },
    { label: 'Balloon Payment', name: 'balloonAmount', type: 'number', defaultValue: 15000, unit: '$' },
  ],
  'tip': [
    { label: 'Bill Amount', name: 'bill', type: 'number', defaultValue: 100, unit: '$' },
    { label: 'Tip Percentage', name: 'tipPercent', type: 'number', defaultValue: 15, unit: '%' },
    { label: 'Split between', name: 'split', type: 'number', defaultValue: 1 },
  ],
  'fuel-cost': [
    { label: 'Distance', name: 'distance', type: 'number', defaultValue: 500, unit: 'km/mi' },
    { label: 'Fuel Efficiency', name: 'efficiency', type: 'number', defaultValue: 12, unit: 'km/L or mpg' },
    { label: 'Fuel Price', name: 'fuelPrice', type: 'number', defaultValue: 1.5, unit: '/unit' },
  ],
  'retirement-fire': [
    { label: 'Current Age', name: 'currentAge', type: 'number', defaultValue: 30 },
    { label: 'Retirement Age', name: 'retireAge', type: 'number', defaultValue: 45 },
    { label: 'Annual Expenses (Future)', name: 'annualExpenses', type: 'number', defaultValue: 40000, unit: '$' },
    { label: 'Current Savings', name: 'currentSavings', type: 'number', defaultValue: 50000, unit: '$' },
  ],
  'sip': [
    { label: 'Monthly Investment', name: 'monthlyInvestment', type: 'number', defaultValue: 500, unit: '$' },
    { label: 'Expected Return Rate', name: 'expectedRate', type: 'number', defaultValue: 12, unit: '%' },
    { label: 'Tenure', name: 'tenure', type: 'number', defaultValue: 10, unit: 'Years' },
  ],
  'compound-interest': [
    { label: 'Principal', name: 'principal', type: 'number', defaultValue: 10000, unit: '$' },
    { label: 'Interest Rate', name: 'rate', type: 'number', defaultValue: 8, unit: '%' },
    { label: 'Tenure', name: 'tenure', type: 'number', defaultValue: 5, unit: 'Years' },
    { label: 'Frequency', name: 'frequency', type: 'select', defaultValue: '12', options: [
      { label: 'Annually', value: '1' },
      { label: 'Semi-Annually', value: '2' },
      { label: 'Quarterly', value: '4' },
      { label: 'Monthly', value: '12' },
    ] },
  ],
  'fd': [
    { label: 'Deposit Amount', name: 'principal', type: 'number', defaultValue: 10000, unit: '$' },
    { label: 'Interest Rate', name: 'rate', type: 'number', defaultValue: 7, unit: '%' },
    { label: 'Tenure', name: 'tenure', type: 'number', defaultValue: 1, unit: 'Years' },
  ],
  'profit-margin': [
    { label: 'Gross Revenue', name: 'revenue', type: 'number', defaultValue: 10000, unit: '$' },
    { label: 'Total Cost of Goods', name: 'cost', type: 'number', defaultValue: 6000, unit: '$' },
  ],
  'break-even': [
    { label: 'Fixed Costs', name: 'fixedCosts', type: 'number', defaultValue: 5000, unit: '$' },
    { label: 'Selling Price Per Unit', name: 'pricePerUnit', type: 'number', defaultValue: 50, unit: '$' },
    { label: 'Variable Cost Per Unit', name: 'variableCostPerUnit', type: 'number', defaultValue: 20, unit: '$' },
  ],
  'salary': [
    { label: 'Hourly Rate', name: 'hourlyRate', type: 'number', defaultValue: 25, unit: '$' },
    { label: 'Hours Per Week', name: 'hoursPerWeek', type: 'number', defaultValue: 40 },
  ],
  'gst': [
    { label: 'Net Amount', name: 'amount', type: 'number', defaultValue: 1000, unit: '$' },
    { label: 'Tax Rate (%)', name: 'rate', type: 'number', defaultValue: 18, unit: '%' },
  ],
  'calorie': [
    { label: 'Weight (kg)', name: 'weight', type: 'number', defaultValue: 70 },
    { label: 'Height (cm)', name: 'height', type: 'number', defaultValue: 175 },
    { label: 'Age', name: 'age', type: 'number', defaultValue: 25 },
    { label: 'Gender', name: 'gender', type: 'select', defaultValue: 'male', options: [{label: 'Male', value:'male'}, {label:'Female', value:'female'}] },
  ],

  'scientific': [
    { label: 'Math Expression', name: 'expression', type: 'text', defaultValue: '2 + 2 * 10' },
  ],
  'stats': [
    { label: 'Data Points (comma separated)', name: 'data', type: 'text', defaultValue: '10, 20, 30, 40, 50' },
  ],
  'bmi': [
    { label: 'Weight', name: 'weight', type: 'number', defaultValue: 70, unit: 'kg/lbs', min: 20, max: 200, step: 0.1 },
    { label: 'Weight Unit', name: 'weightUnit', type: 'select', defaultValue: 'kg', options: [{ label: 'Kilograms (kg)', value: 'kg' }, { label: 'Pounds (lbs)', value: 'lbs' }] },
    { label: 'Height', name: 'height', type: 'number', defaultValue: 175, unit: 'cm/in', min: 100, max: 250, step: 1 },
    { label: 'Height Unit', name: 'heightUnit', type: 'select', defaultValue: 'cm', options: [{ label: 'Centimeters (cm)', value: 'cm' }, { label: 'Inches (in)', value: 'in' }] },
  ],
  
  'percentage': [
  {
    "label": "Value A",
    "name": "valA",
    "type": "number",
    "defaultValue": 50
  },
  {
    "label": "Value B",
    "name": "valB",
    "type": "number",
    "defaultValue": 100
  },
  {
    "label": "Operation",
    "name": "operation",
    "type": "select",
    "defaultValue": "percentage_of",
    "options": [
      {
        "label": "What is P% of V?",
        "value": "percentage_of"
      },
      {
        "label": "X is what % of Y?",
        "value": "what_percent"
      },
      {
        "label": "Percentage Increase",
        "value": "increase"
      },
      {
        "label": "Percentage Decrease",
        "value": "decrease"
      }
    ]
  }
],
  'age': [
    { label: 'Date of Birth', name: 'dob', type: 'date', defaultValue: '1995-01-01' },
  ],
  'commission': [
    { label: 'Total Sales Amount', name: 'salesAmount', type: 'number', defaultValue: 5000, unit: '$' },
    { label: 'Commission Rate (%)', name: 'commissionRate', type: 'number', defaultValue: 5, unit: '%' },
  ],
  'retention': [
    { label: 'Customers at Start of Period', name: 'startCustomers', type: 'number', defaultValue: 1000 },
    { label: 'Customers at End of Period', name: 'endCustomers', type: 'number', defaultValue: 950 },
    { label: 'New Customers Acquired', name: 'newCustomers', type: 'number', defaultValue: 50 },
  ],
  'inventory-turn': [
    { label: 'Cost of Goods Sold (COGS)', name: 'cogs', type: 'number', defaultValue: 100000, unit: '$' },
    { label: 'Average Inventory Value', name: 'avgInventory', type: 'number', defaultValue: 20000, unit: '$' },
  ],
  'markup-margin': [
    { label: 'Markup Percentage (%)', name: 'markup', type: 'number', defaultValue: 25, unit: '%' },
    { label: 'OR Margin Percentage (%)', name: 'margin', type: 'number', defaultValue: 0, unit: '%' },
  ],
  'rule-72': [
    { label: 'Annual Interest Rate (%)', name: 'rate', type: 'number', defaultValue: 8, unit: '%' },
  ],
  'gpa': [
    { label: 'Total Grade Points', name: 'gradeSum', type: 'number', defaultValue: 350 },
    { label: 'Total Credit Hours', name: 'totalCredits', type: 'number', defaultValue: 100 },
  ]
};

export function CalculatorDetail() {
  const { slug } = useParams();
  const calculator = CALCULATORS.find(c => c.slug === slug);
  const category = CATEGORIES.find(cat => cat.id === calculator?.category);

  useEffect(() => {
    if (calculator) {
      const currentYear = new Date().getFullYear().toString();
      let docTitle = calculator.seoTitle || `${calculator.title} Calculator ${currentYear} | CalcWise`;
      docTitle = docTitle.replace('2026', currentYear);
      document.title = docTitle;
      
      // Update Meta description dynamically
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', calculator.seoDescription || calculator.description || `Free online ${calculator.title.toLowerCase()} calculator to help you make better decisions.`);
      
      // Save history
      try {
        const historyStr = localStorage.getItem('calcwise_history');
        let history = historyStr ? JSON.parse(historyStr) : [];
        // Remove if already exists
        history = history.filter((h: any) => h.id !== calculator.id);
        // Add to front
        history.unshift({ id: calculator.id, title: calculator.title, slug: calculator.slug, timestamp: Date.now() });
        // Keep only top 8
        history = history.slice(0, 8);
        localStorage.setItem('calcwise_history', JSON.stringify(history));
      } catch (e) {
        console.error("Failed to save history", e);
      }
    }
  }, [calculator]);

  if (!calculator) {
    return <Navigate to="/" />;
  }

  const logic = LOGIC_MAP[calculator.id] || ((values: Record<string, any>) => [{ label: 'Error', value: 'Not Implemented', helpText: 'This calculator is not yet fully implemented.' }]);
  const inputs = INPUT_MAP[calculator.id] || [];

  const embedCode = `<iframe src="https://calcwise.com/embed/${calculator.slug}" width="100%" height="500" frameborder="0"></iframe>`;

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setToastMessage('Embed code copied to clipboard!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Generate Schema Markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `${calculator.title} Calculator`,
    "operatingSystem": "All",
    "applicationCategory": "WebApplication",
    "description": calculator.seoDescription || calculator.description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = calculator.faqs && calculator.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": calculator.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-bottom-4 z-50">
          <Icons.CheckCircle2 className="h-5 w-5" />
          <span className="font-bold text-sm tracking-wide">{toastMessage}</span>
        </div>
      )}
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-hint mb-8 font-bold uppercase tracking-widest">
        <Link to="/" className="hover:text-primary">Home</Link>
        <Icons.ChevronRight className="h-3 w-3" />
        <Link to={`/category/${calculator.category}`} className="hover:text-primary">{category?.title}</Link>
        <Icons.ChevronRight className="h-3 w-3" />
        <span className="text-body">{calculator.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-heading">
              {calculator.title}
            </h1>
            <p className="text-lg text-body leading-relaxed max-w-2xl">
              {calculator.description}
            </p>
          </div>

          {/* Calculator Widget */}
          <CalculatorWidget
            id={calculator.id}
            title={calculator.title}
            inputs={inputs}
            onCalculate={logic}
          />

          {/* Dynamic Comprehensive SEO Guide */}
          <SEOArticleBlock calculator={calculator} category={category} inputs={inputs} />

          {/* How It Works */}
          {(calculator.howItWorks?.length > 0 || calculator.formula) && (
            <section className="space-y-8">
              <h2 className="text-2xl font-display font-bold text-heading">How It Works</h2>
              <div className="space-y-6 text-body leading-relaxed">
                {calculator.howItWorks?.map((p, i) => <p key={i}>{p}</p>)}
                
                {calculator.formula && (
                  <div className="bg-slate-50 p-8 rounded-2xl border border-border mt-8">
                     <h3 className="text-xs font-bold text-hint uppercase tracking-widest mb-4">Core Formula</h3>
                     <code className="text-lg font-mono text-primary bg-white px-6 py-4 rounded-lg border border-primary/10 block overflow-x-auto">
                       {calculator.formula}
                     </code>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Country Tips */}
          {calculator.countryTips && calculator.countryTips.length > 0 && (
            <section className="space-y-8 bg-light-blue/20 p-10 rounded-3xl border border-primary/5">
              <h2 className="text-2xl font-display font-bold text-heading">Country Adaptation Tips</h2>
              <ul className="space-y-6">
                {calculator.countryTips.map((tip, i) => (
                  <li key={i} className="flex flex-col space-y-1">
                    <span className="text-xs font-black text-primary uppercase">{tip.region}</span>
                    <p className="text-body italic text-sm">{tip.tip}</p>
                  </li>
                ))}
                <li className="pt-4 text-[10px] text-hint uppercase font-bold text-center border-t border-primary/10">
                  ⚠️ Consult a local professional for specific tax or legal advice.
                </li>
              </ul>
            </section>
          )}

          {/* FAQ */}
          {calculator.faqs && calculator.faqs.length > 0 && (
            <section className="space-y-8 pb-12" id="faq">
              <h2 className="text-2xl font-display font-bold text-heading">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {calculator.faqs?.map((faq, i) => (
                  <div key={i} className="card-surface p-6 border border-border/50 hover:border-primary/20 transition-colors">
                    <h3 className="font-bold text-heading mb-3 flex items-start gap-2">
                      <Icons.HelpCircle className="h-4 w-4 text-primary mt-1 shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-sm text-body leading-relaxed pl-6">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Embed */}
          <section className="space-y-8 pb-12">
            <h2 className="text-2xl font-display font-bold text-heading">Embed this Calculator</h2>
            <p className="text-body leading-relaxed">
              Want to add this {calculator.title} calculator to your own website? You can easily embed it using the code below.
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-border">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-hint uppercase tracking-widest">HTML Embed Code</span>
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  className="flex items-center space-x-2 text-primary hover:text-primary-dark text-sm font-bold transition-colors"
                >
                  <Icons.Copy className="h-4 w-4" />
                  <span>Copy Code</span>
                </button>
              </div>
              <code className="text-sm font-mono text-body block break-all whitespace-pre-wrap select-all">
                {embedCode}
              </code>
            </div>
            <p className="text-xs text-hint italic mt-4">
              By using our embed code, you agree that you are using this calculator as-is. We host the calculator and handle the logic so you don't have to.
            </p>
          </section>

        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-12">
          {/* Related Tools */}
          <div className="space-y-6">
            <h3 className="text-lg font-display font-bold text-heading">Related Tools</h3>
            <div className="space-y-3">
              {(calculator.relatedSlugs && calculator.relatedSlugs.length > 0
                ? calculator.relatedSlugs.map(rSlug => CALCULATORS.find(c => c.slug === rSlug)).filter(Boolean)
                : CALCULATORS.filter(c => c.category === calculator.category && c.id !== calculator.id).slice(0, 4)
              ).map(related => {
                if (!related) return null;
                return (
                  <Link 
                    key={related.id} 
                    to={`/calculator/${related.slug}`}
                    className="block p-4 card-surface hover:border-primary hover:shadow-md transition-all group"
                  >
                    <span className="text-xs font-bold text-primary italic group-hover:underline">Try Calculator</span>
                    <h4 className="text-sm font-bold text-heading mt-1">{related.title}</h4>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
