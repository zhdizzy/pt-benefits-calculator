/**
 * VA Benefits Data for 100% P&T Calculator
 *
 * Sources:
 *   - VA Compensation Rates (2026, effective Dec 1 2025, 2.8% COLA):
 *     https://www.va.gov/disability/compensation-rates/veteran-rates/
 *   - CHAMPVA: https://www.va.gov/family-and-caregiver-benefits/health-and-disability/champva/
 *   - Chapter 35 DEA: https://www.va.gov/family-and-caregiver-benefits/education-and-careers/dependents-education-assistance/rates/
 *   - Chapter 31 VR&E: https://www.benefits.va.gov/vocrehab/vrerates26.asp
 *   - VA Funding Fee: https://www.va.gov/housing-assistance/home-loans/funding-fee-and-closing-costs/
 *   - DIC Rates: https://www.va.gov/family-and-caregiver-benefits/survivor-compensation/dependency-indemnity-compensation/survivor-rates/
 *   - State benefits: Compiled from state VA websites, VA Claims Insider, Veterans United
 *   - Civilian insurance costs: KFF 2025 Employer Health Benefits Survey
 *
 * Last verified: March 2026
 */

// --- VA Disability Compensation Monthly Rates (2026) ---
// Exact rates from VA rate tables, effective December 1, 2025 (2.8% COLA)
// Structure: compensationRates[rating] = { veteran, withSpouse, with1Child, withSpouseAnd1Child, ... }
export const compensationRates = {
    0:   { veteran: 0, withSpouse: 0, with1Child: 0, withSpouseAnd1Child: 0, additionalChildUnder18: 0, additionalChildOver18: 0, with1Parent: 0, with2Parents: 0, spouseAA: 0 },
    10:  { veteran: 175.51, withSpouse: 175.51, with1Child: 175.51, withSpouseAnd1Child: 175.51, additionalChildUnder18: 0, additionalChildOver18: 0, with1Parent: 175.51, with2Parents: 175.51, spouseAA: 0 },
    20:  { veteran: 346.89, withSpouse: 346.89, with1Child: 346.89, withSpouseAnd1Child: 346.89, additionalChildUnder18: 0, additionalChildOver18: 0, with1Parent: 346.89, with2Parents: 346.89, spouseAA: 0 },
    30:  { veteran: 537.42, withSpouse: 599.42, with1Child: 579.42, withSpouseAnd1Child: 641.42, additionalChildUnder18: 30, additionalChildOver18: 97, with1Parent: 583.42, with2Parents: 629.42, spouseAA: 52 },
    40:  { veteran: 774.07, withSpouse: 854.07, with1Child: 822.07, withSpouseAnd1Child: 902.07, additionalChildUnder18: 40, additionalChildOver18: 129, with1Parent: 832.07, with2Parents: 890.07, spouseAA: 70 },
    50:  { veteran: 1102.04, withSpouse: 1200.04, with1Child: 1156.04, withSpouseAnd1Child: 1254.04, additionalChildUnder18: 51, additionalChildOver18: 162, with1Parent: 1172.04, with2Parents: 1242.04, spouseAA: 87 },
    60:  { veteran: 1395.07, withSpouse: 1511.07, with1Child: 1455.07, withSpouseAnd1Child: 1571.07, additionalChildUnder18: 61, additionalChildOver18: 194, with1Parent: 1477.07, with2Parents: 1559.07, spouseAA: 105 },
    70:  { veteran: 1759.92, withSpouse: 1893.92, with1Child: 1826.92, withSpouseAnd1Child: 1960.92, additionalChildUnder18: 72, additionalChildOver18: 226, with1Parent: 1853.92, with2Parents: 1947.92, spouseAA: 122 },
    80:  { veteran: 2045.53, withSpouse: 2197.53, with1Child: 2118.53, withSpouseAnd1Child: 2270.53, additionalChildUnder18: 82, additionalChildOver18: 259, with1Parent: 2151.53, with2Parents: 2257.53, spouseAA: 140 },
    90:  { veteran: 2299.52, withSpouse: 2469.52, with1Child: 2378.52, withSpouseAnd1Child: 2548.52, additionalChildUnder18: 92, additionalChildOver18: 291, with1Parent: 2417.52, with2Parents: 2535.52, spouseAA: 157 },
    100: { veteran: 3938.58, withSpouse: 4158.17, with1Child: 4085.43, withSpouseAnd1Child: 4318.99, additionalChildUnder18: 109.11, additionalChildOver18: 352.45, with1Parent: 4114.82, with2Parents: 4291.06, spouseAA: 201.41 }
};

// --- Special Monthly Compensation (SMC) Rates (2026) ---
// Rates effective December 1, 2025 (2.8% COLA)
// Source: https://www.va.gov/disability/compensation-rates/special-monthly-compensation-rates/
// SMC is paid INSTEAD of the standard 100% rate (except SMC-K which is added on top)
export const smcRates = {
    "none":  { label: "None (standard 100%)", veteran: 0, isAddOn: false },
    "K":     { label: "SMC-K (loss of use)", veteran: 139.87, isAddOn: true, description: "Added to any rate. For loss of use of one hand, one foot, both buttocks, one or both eyes, or reproductive organ." },
    "S":     { label: "SMC-S (Housebound)", veteran: 4408.53, withSpouse: 4628.12, with1Child: 4555.38, withSpouseAnd1Child: 4788.94, additionalChildUnder18: 109.11, additionalChildOver18: 352.45, with1Parent: 4584.77, with2Parents: 4761.01, isAddOn: false, description: "100% schedular + 60% or more for separate disability, OR permanently housebound." },
    "L":     { label: "SMC-L (Aid & Attendance)", veteran: 4900.83, withSpouse: 5120.42, with1Child: 5047.68, withSpouseAnd1Child: 5281.24, additionalChildUnder18: 109.11, additionalChildOver18: 352.45, with1Parent: 5077.07, with2Parents: 5253.31, isAddOn: false, description: "Need regular aid and attendance of another person due to service-connected disability." },
    "L-1/2": { label: "SMC-L 1/2", veteran: 5154.00, withSpouse: 5373.59, with1Child: 5300.85, withSpouseAnd1Child: 5534.41, additionalChildUnder18: 109.11, additionalChildOver18: 352.45, with1Parent: 5330.24, with2Parents: 5506.48, isAddOn: false, description: "Between L and M levels." },
    "M":     { label: "SMC-M", veteran: 5408.55, withSpouse: 5628.14, with1Child: 5555.40, withSpouseAnd1Child: 5788.96, additionalChildUnder18: 109.11, additionalChildOver18: 352.45, with1Parent: 5584.79, with2Parents: 5761.03, isAddOn: false, description: "Loss of use of both hands, both legs, one hand and one leg, blindness in both eyes with 5/200 or less, or permanently bedridden." },
    "M-1/2": { label: "SMC-M 1/2", veteran: 5780.00, withSpouse: 5999.59, with1Child: 5926.85, withSpouseAnd1Child: 6160.41, additionalChildUnder18: 109.11, additionalChildOver18: 352.45, with1Parent: 5956.24, with2Parents: 6132.48, isAddOn: false, description: "Between M and N levels." },
    "N":     { label: "SMC-N", veteran: 6152.64, withSpouse: 6372.23, with1Child: 6299.49, withSpouseAnd1Child: 6533.05, additionalChildUnder18: 109.11, additionalChildOver18: 352.45, with1Parent: 6328.88, with2Parents: 6505.12, isAddOn: false, description: "Loss of use of both hands and one foot, both legs and one hand, blindness and loss of use of one hand, or blindness and loss of one foot." },
    "N-1/2": { label: "SMC-N 1/2", veteran: 6514.00, withSpouse: 6733.59, with1Child: 6660.85, withSpouseAnd1Child: 6894.41, additionalChildUnder18: 109.11, additionalChildOver18: 352.45, with1Parent: 6690.24, with2Parents: 6866.48, isAddOn: false, description: "Between N and O levels." },
    "O/P":   { label: "SMC-O/P", veteran: 6877.12, withSpouse: 7096.71, with1Child: 7023.97, withSpouseAnd1Child: 7257.53, additionalChildUnder18: 109.11, additionalChildOver18: 352.45, with1Parent: 7053.36, with2Parents: 7229.60, isAddOn: false, description: "Conditions requiring highest level of aid and attendance beyond N." },
    "R.1":   { label: "SMC-R.1 (Higher A&A)", veteran: 9826.88, withSpouse: 10046.47, with1Child: 9973.73, withSpouseAnd1Child: 10207.29, additionalChildUnder18: 109.11, additionalChildOver18: 352.45, with1Parent: 10003.12, with2Parents: 10179.36, isAddOn: false, description: "Need higher level of aid and attendance, such as nursing home level care." },
    "R.2":   { label: "SMC-R.2 (A&A + Housebound)", veteran: 11271.67, withSpouse: 11491.26, with1Child: 11418.52, withSpouseAnd1Child: 11652.08, additionalChildUnder18: 109.11, additionalChildOver18: 352.45, with1Parent: 11447.91, with2Parents: 11624.15, isAddOn: false, description: "Entitled to R.1 AND is housebound." }
};

// --- COLA History (for projection calculations) ---
export const colaHistory = {
    2017: 2.0, 2018: 2.8, 2019: 1.6, 2020: 1.3, 2021: 5.9,
    2022: 8.7, 2023: 3.2, 2024: 2.5, 2025: 2.8,
    historicalAverage: 2.6 // ~2.6% average over recent decade
};

// --- CHAMPVA Data ---
export const champvaData = {
    annualCatastrophicCap: 3000,
    costSharePercent: 25,          // 25% cost share for outpatient
    annualDeductibleIndividual: 50,
    annualDeductibleFamily: 100,
    inpatientDeductible: 0,
    medsByMailCost: 0,             // $0 for Meds by Mail prescriptions
    retailPharmacyCostShare: 25,   // 25% at OptumRx retail

    // Civilian insurance costs (KFF 2025 Employer Health Benefits Survey)
    civilianFamilyPremiumTotal: 26993,    // Total annual family premium
    civilianFamilyPremiumWorker: 6850,    // Worker's annual share
    civilianSinglePremiumWorker: 1164,    // Worker's annual share (~$97/mo)
    civilianFamilyPremiumMonthly: 571,    // Worker's monthly share (~$6,850/12)
    civilianSinglePremiumMonthly: 97,
    civilianAverageDeductible: 1886,      // Average single deductible
    civilianAverageOOPMax: 5000,          // Typical family OOP max

    // For calculator: simplified annual civilian cost (worker premiums + average OOP)
    civilianFamilyAnnualCost: 10850,      // $6,850 premiums + ~$4,000 OOP
    civilianSingleAnnualCost: 2664,       // $1,164 premiums + ~$1,500 OOP

    // Equivalent market value (what you'd pay without employer subsidy)
    civilianFamilyFullPremiumMonthly: 2250, // Full unsubsidized family plan (~$27K/yr)
    civilianSingleFullPremiumMonthly: 750,

    // ACA marketplace comparison
    acaFamilyPremiumMonthly: 1800,   // Before subsidies
    acaOOPMax2025: 9200,             // ACA individual OOP max (2025)

    // Real scenarios for impact display
    scenarios: [
        {
            label: "ER Visit — Broken Arm",
            totalBill: 7500,
            champvaCost: 200,
            civilianCost: 3500,
            description: "Emergency room visit, X-rays, cast, and follow-up. CHAMPVA: 25% cost share after $50 deductible."
        },
        {
            label: "ACL Surgery + Rehab",
            totalBill: 35000,
            champvaCost: 1200,
            civilianCost: 8000,
            description: "Knee surgery plus 3 months of physical therapy. CHAMPVA cost share stays well under the $3,000 annual cap."
        },
        {
            label: "Childbirth (Uncomplicated)",
            totalBill: 18000,
            champvaCost: 600,
            civilianCost: 4500,
            description: "Hospital delivery, prenatal care, and postnatal follow-up. CHAMPVA covers maternity comprehensively."
        },
        {
            label: "Emergency C-Section + Hospital Stay",
            totalBill: 203000,
            champvaCost: 3000,
            civilianCost: 50000,
            description: "Month-long hospital stay with emergency c-section. CHAMPVA catastrophic cap limits your total annual cost to $3,000."
        },
        {
            label: "Cancer Treatment (1 Year)",
            totalBill: 150000,
            champvaCost: 3000,
            civilianCost: 30000,
            description: "Chemotherapy, radiation, surgery, and follow-up care for a full year. The $3,000 cap means predictable costs."
        },
        {
            label: "Weekly Therapy (1 Year)",
            totalBill: 10000,
            champvaCost: 750,
            civilianCost: 4000,
            description: "52 sessions of mental health therapy. CHAMPVA covers mental health with standard 25% cost share."
        },
        {
            label: "NICU Stay (30+ Days)",
            totalBill: 1200000,
            champvaCost: 3000,
            civilianCost: 100000,
            description: "Extended NICU care for a newborn. Even with a 7-figure bill, your max out-of-pocket is $3,000 for the year."
        },
        {
            label: "Any Catastrophic Event",
            totalBill: 500000,
            champvaCost: 3000,
            civilianCost: 75000,
            description: "Regardless of how catastrophic the scenario, your family's max out-of-pocket is $3,000/year. Period."
        }
    ]
};

// --- Chapter 35 DEA (Dependents' Educational Assistance) ---
// Rates effective October 1, 2025 - September 30, 2026
export const chapter35Data = {
    fullTime: 1574.00,
    threeQuarter: 1244.00,
    halfTime: 912.00,
    maxMonths: 36,
    // Age eligibility: no upper limit if eligible after Aug 1, 2023
    // Legacy: ages 18-26 (or 23 if not in school)
    childAgeLimitLegacy: 26,
    spouseDurationYears: 10,         // 10 years from eligibility date (20 if P&T 3+ years after discharge)
    totalPerDependent: 1574.00 * 36, // $56,664 at full-time
    description: "Up to 36 months of education benefits for eligible dependents. Covers tuition and provides a monthly stipend."
};

// --- Chapter 31 VR&E (Veteran Readiness & Employment) ---
// Rates effective October 1, 2025 - September 30, 2026
export const chapter31Data = {
    subsistence: {
        fullTime: { noDeps: 812.84, oneDep: 1008.24, twoDeps: 1188.15, additionalDep: 86.58 },
        threeQuarter: { noDeps: 610.76, oneDep: 757.28, twoDeps: 888.32, additionalDep: 66.60 },
        halfTime: { noDeps: 408.66, oneDep: 506.32, twoDeps: 595.16, additionalDep: 44.42 }
    },
    coversFullTuition: true,  // No cap, unlike GI Bill
    coversBooksSupplies: true,
    coversEquipment: true,    // Laptops, software, tools
    estimatedDegreeValue: 100000, // Conservative estimate for 4-year degree
    description: "Covers 100% of tuition (no cap), books, supplies, equipment, and pays a monthly subsistence allowance. Often more valuable than the GI Bill."
};

// --- VA Healthcare Value ---
export const vaHealthcareData = {
    annualValue: 12000,     // Priority Group 1 comprehensive care including dental
    dentalAnnualValue: 3000, // Class IV comprehensive dental (separate line item)
    travelReimbursementPerMile: 0.415,
    description: "Free comprehensive VA healthcare: prescriptions, mental health, dental (Class IV), vision, hearing aids, specialty care. Priority Group 1 — highest priority."
};

// --- VA Home Loan Funding Fee ---
export const fundingFeeData = {
    // Fee percentages waived for service-connected disabled veterans
    firstUse: { zeroDown: 2.15, fiveDown: 1.50, tenDown: 1.25 },
    subsequentUse: { zeroDown: 3.30, fiveDown: 1.50, tenDown: 1.25 },
    cashOutRefi: { firstUse: 2.15, subsequentUse: 3.30 },
    irrrl: 0.50,
    description: "VA loan funding fee is completely waived for veterans with any service-connected disability rating."
};

// --- Survivor Benefits (DIC) ---
// Rates effective December 1, 2025 (2.8% COLA)
export const dicData = {
    baseSurvivorSpouse: 1699.36,          // Monthly base DIC for surviving spouse
    add8YearBonus: 360.85,               // If veteran was 100% for 8+ continuous years
    addPerChildUnder18: 421.00,
    addAidAndAttendance: 421.00,
    addHousebound: 197.22,
    transitionalBenefit: 359.00,          // First 2 years if spouse has child under 18
    remarriageAgeThreshold: 57,
    description: "Tax-free monthly payments to surviving spouse and dependents. Spouse keeps CHAMPVA, Chapter 35 DEA, property tax exemptions in many states."
};

// --- Additional Benefits ---
export const additionalBenefits = {
    clothingAllowance: {
        annual2026: 1053.19,
        description: "Annual payment for veterans whose prosthetic/orthopedic devices or medications damage clothing."
    },
    studentLoanForgiveness: {
        description: "100% of federal student loans forgiven through Total & Permanent Disability (TPD) discharge. Automatic process — Department of Education identifies eligible veterans. Includes Parent PLUS loans. Tax-free through 2025.",
        taxFree: true
    },
    nationalParksPass: {
        annualValue: 80, // Cost of the America the Beautiful pass
        description: "Free lifetime Access Pass to all 2,000+ national parks, wildlife refuges, and federal recreational lands."
    },
    spaceATravel: {
        description: "Space-Available military flights within the US (CONUS, Alaska, Hawaii, territories). Category 6 priority. Spouse can fly with veteran.",
        domesticOnly: true
    },
    commissaryExchange: {
        annualSavings: 1500, // Realistic estimate: ~$125/mo savings based on biweekly shopping with 20-25% savings vs. civilian grocery stores
        description: "Full commissary, exchange (BX/PX/NEX), and MWR privileges. Estimated 20-25% savings on groceries vs. civilian stores."
    },
    federalHiringPreference: {
        description: "10-point hiring preference for federal jobs. Schedule A non-competitive hiring authority. Veterans Recruitment Appointment (VRA)."
    },
    speciallyAdaptedHousing: {
        sahGrant2026: 126526,
        shaGrant2026: 25350,
        description: "Grants up to $126,526 (SAH) or $25,350 (SHA) for home modifications. Can be used up to 6 times."
    },
    autoAllowance: {
        amount2026: 27074.99,
        description: "One-time automobile allowance for veterans with qualifying severe disabilities (loss of limb, permanent vision impairment, severe burns)."
    }
};

// --- State-Specific Benefits ---
// Property tax data imported separately from state-tax-data.js
// This object holds additional state benefits beyond property tax
export const stateBenefits = {
    "AL": {
        vehicleReg: { exempt: true, savings: 100, description: "Free license plate and registration" },
        plates: { free: true, description: "Free disabled veteran plates" },
        huntingFishing: { free: true, description: "Free hunting and fishing license" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt from state income tax" },
        other: []
    },
    "AK": {
        vehicleReg: { exempt: true, savings: 100, description: "Free registration for 50%+ disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting and fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Alaska has no state income tax" },
        other: []
    },
    "AZ": {
        vehicleReg: { exempt: true, savings: 75, description: "Reduced registration fees for disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free combination hunt/fish license for 100% disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt up to $3,500" },
        other: [{ name: "State Parks", description: "Free annual state park pass" }]
    },
    "AR": {
        vehicleReg: { exempt: true, savings: 50, description: "Free vehicle registration for 100% disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free lifetime hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "CA": {
        vehicleReg: { exempt: true, savings: 250, description: "Exempt from ALL registration and license fees on 1 vehicle" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: false, description: "Reduced-fee license for 50%+ service-connected disability" },
        education: { available: true, description: "CalVet Fee Waiver — tuition and fees waived at CA public colleges/universities for dependents", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: false, description: "Military retirement pay is taxed as regular income" },
        other: [{ name: "State Parks", description: "Free or reduced-fee state park pass for disabled veterans" }]
    },
    "CO": {
        vehicleReg: { exempt: true, savings: 75, description: "One set of free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free small game and fishing license for 60%+ disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt up to $24,000 (under 55) or fully exempt (55+)" },
        other: []
    },
    "CT": {
        vehicleReg: { exempt: true, savings: 100, description: "Free registration for 100% disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "DE": {
        vehicleReg: { exempt: true, savings: 40, description: "Free registration for disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for 60%+ disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt under $12,500 (under 60) or fully exempt (60+)" },
        other: []
    },
    "FL": {
        vehicleReg: { exempt: true, savings: 225, description: "Free vehicle registration and plate for 100% P&T" },
        plates: { free: true, description: "Free disabled veteran license plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for 100% P&T veterans" },
        education: { available: true, description: "Dependents get tuition waiver at FL state colleges and universities", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Florida has no state income tax" },
        other: [
            { name: "Toll Roads", description: "Free SunPass transponder" },
            { name: "State Parks", description: "Free annual state park pass for 100% P&T veterans" }
        ]
    },
    "GA": {
        vehicleReg: { exempt: true, savings: 75, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt up to $35,000 (under 62) or fully exempt (62+)" },
        other: []
    },
    "HI": {
        vehicleReg: { exempt: true, savings: 50, description: "Free registration for disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: false, description: "No specific disabled veteran exemption" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "ID": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates for 100% P&T" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for 100% disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt (deduction available)" },
        other: []
    },
    "IL": {
        vehicleReg: { exempt: true, savings: 150, description: "Free DV plates + registration fee waiver" },
        plates: { free: true, description: "Free disabled veteran plates" },
        huntingFishing: { free: true, description: "No license required for 10%+ disabled veterans (any state)" },
        education: { available: true, description: "Illinois Veterans Grant — tuition-free at IL public colleges for eligible veterans", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "IN": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting on designated days" },
        education: { available: true, description: "Remission of fees for children of disabled veterans at IN state schools", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt up to $6,250" },
        other: []
    },
    "IA": {
        vehicleReg: { exempt: true, savings: 50, description: "Free registration for disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: true, description: "War Orphans Educational Aid for children of deceased/100% disabled veterans", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "KS": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "KY": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for 100% disabled veterans" },
        education: { available: true, description: "Tuition waiver for children/spouses of 100% P&T veterans at KY state schools", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "LA": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates for 50%+ disabled" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "ME": {
        vehicleReg: { exempt: true, savings: 50, description: "Free registration for disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: true, description: "Tuition waiver at University of Maine for dependents of 100% P&T veterans", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt (for those receiving VA disability)" },
        other: []
    },
    "MD": {
        vehicleReg: { exempt: true, savings: 75, description: "Free registration for 100% disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: true, description: "Edward T. Conroy Memorial Scholarship for dependents of disabled veterans", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt up to $12,500 (or fully if 55+)" },
        other: []
    },
    "MA": {
        vehicleReg: { exempt: true, savings: 75, description: "Free registration for 100% disabled veterans" },
        plates: { free: true, description: "Free DV plates with handicap designation" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: true, description: "Tuition waiver at MA state colleges/universities for disabled veterans", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt (pension exclusion)" },
        other: []
    },
    "MI": {
        vehicleReg: { exempt: true, savings: 100, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for 100% disabled veterans" },
        education: { available: true, description: "Tuition assistance for dependents of 100% disabled veterans at MI state schools", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "MN": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: true, description: "Tuition waiver at MN state colleges for children of deceased/100% disabled veterans", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt (Social Security subtraction)" },
        other: [{ name: "State Parks", description: "Free annual state park permit for disabled veterans" }]
    },
    "MS": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free lifetime hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "MO": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing permit for disabled veterans" },
        education: { available: true, description: "Wartime Veterans Survivors Grant for dependents", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "MT": {
        vehicleReg: { exempt: true, savings: 50, description: "Reduced registration for disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for 60%+ disabled veterans" },
        education: { available: true, description: "Fee waiver at MT university system for dependents of 100% disabled veterans", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay partially exempt" },
        other: []
    },
    "NE": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing permit for disabled veterans" },
        education: { available: true, description: "Waiver of tuition at NE state colleges for dependents of 100% disabled veterans", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt (phased in)" },
        other: []
    },
    "NV": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Nevada has no state income tax" },
        other: []
    },
    "NH": {
        vehicleReg: { exempt: true, savings: 50, description: "Free registration for 100% disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "New Hampshire has no income tax on earned income" },
        other: []
    },
    "NJ": {
        vehicleReg: { exempt: true, savings: 100, description: "Free registration for 100% disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "NM": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: true, description: "Vietnam Veterans Scholarship for dependents at NM state schools", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "NY": {
        vehicleReg: { exempt: true, savings: 100, description: "Registration fee exemption for disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: false, description: "Reduced-fee license for 40%+ disability" },
        education: { available: true, description: "Military Enhanced Recognition Incentive and Tribute (MERIT) scholarship for dependents", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: [{ name: "State Parks", description: "Free state park access for disabled veterans" }]
    },
    "NC": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free disabled veteran plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for 100% disabled veterans" },
        education: { available: true, description: "Scholarships available for dependents of disabled veterans", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt (for those with 5+ years of service before 1989)" },
        other: []
    },
    "ND": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: true, description: "Tuition waiver for dependents of 100% disabled veterans at ND state schools", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay partially exempt" },
        other: []
    },
    "OH": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free fishing, hunting, fur taker, deer, turkey permits and stamps (5-year renewable)" },
        education: { available: true, description: "Ohio War Orphans Scholarship for children of disabled veterans", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt" },
        other: []
    },
    "OK": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: true, description: "Tuition waiver for dependents of 100% disabled veterans at OK state schools", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "OR": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: false, description: "Military retirement pay is taxed (no special exemption)" },
        other: []
    },
    "PA": {
        vehicleReg: { exempt: true, savings: 75, description: "Free registration for 100% disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: true, description: "Educational Gratuity for children of deceased/100% disabled veterans at PA state schools", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt (PA exempts all retirement income)" },
        other: []
    },
    "RI": {
        vehicleReg: { exempt: true, savings: 50, description: "Free registration for disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay partially exempt" },
        other: []
    },
    "SC": {
        vehicleReg: { exempt: true, savings: 200, description: "Up to 2 vehicles exempt from property tax + free plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: true, description: "Free tuition at SC state colleges for dependents of certain disabled veterans", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "SD": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: true, description: "Free tuition at SD state schools for dependents of 100% P&T veterans", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "South Dakota has no state income tax" },
        other: []
    },
    "TN": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Tennessee has no state income tax" },
        other: []
    },
    "TX": {
        vehicleReg: { exempt: true, savings: 75, description: "Free vehicle registration for 100% P&T" },
        plates: { free: true, description: "Free disabled veteran license plates" },
        huntingFishing: { free: true, description: "Free Super Combo hunting/fishing license ($68 value)" },
        education: { available: true, description: "Hazelwood Act — up to 150 hours of free tuition at TX public colleges for veterans and dependents", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Texas has no state income tax" },
        other: [
            { name: "State Parks", description: "Free Texas State Parks Pass" }
        ]
    },
    "UT": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay credit available" },
        other: []
    },
    "VT": {
        vehicleReg: { exempt: true, savings: 50, description: "Free registration for disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt up to $10,000" },
        other: []
    },
    "VA": {
        vehicleReg: { exempt: true, savings: 100, description: "One vehicle registration fee waiver + free DV plates" },
        plates: { free: true, description: "Free disabled veteran plates" },
        huntingFishing: { free: true, description: "Free lifetime hunting and fishing license" },
        education: { available: true, description: "Virginia Military Survivors and Dependents Education Program — tuition waiver at VA public schools", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt (phased in, fully exempt by 2025)" },
        other: []
    },
    "WA": {
        vehicleReg: { exempt: true, savings: 100, description: "Exempt from license fees on 1 vehicle per year" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: false, description: "Reduced fees for 30%+ service-connected disability" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Washington has no state income tax" },
        other: []
    },
    "WV": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay fully exempt" },
        other: []
    },
    "WI": {
        vehicleReg: { exempt: true, savings: 75, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: true, description: "WI GI Bill Tuition Remission for dependents at UW system schools", monthlyValue: 0 },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt" },
        other: []
    },
    "WY": {
        vehicleReg: { exempt: true, savings: 50, description: "Free DV plates" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: true, description: "Free hunting/fishing license for disabled veterans" },
        education: { available: false, description: "No state-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Wyoming has no state income tax" },
        other: []
    },
    "DC": {
        vehicleReg: { exempt: true, savings: 75, description: "Free registration for disabled veterans" },
        plates: { free: true, description: "Free DV plates" },
        huntingFishing: { free: false, description: "N/A" },
        education: { available: false, description: "No DC-specific education benefit" },
        incomeTax: { militaryRetirementExempt: true, description: "Military retirement pay exempt" },
        other: []
    }
};
