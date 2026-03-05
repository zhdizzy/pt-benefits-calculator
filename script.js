import { compensationRates, smcRates, colaHistory, champvaData, chapter35Data, chapter31Data, vaHealthcareData, fundingFeeData, dicData, additionalBenefits, stateBenefits } from './data/benefits-data.js';
import { stateTaxData } from './data/state-tax-data.js';

// --- DOM Elements ---
const currentRatingSelect = document.getElementById('current-rating');
const veteranAgeInput = document.getElementById('veteran-age');
const stateSelect = document.getElementById('state-select');
const isRetireeSelect = document.getElementById('is-retiree');
const maritalStatusSelect = document.getElementById('marital-status');
const numChildrenInput = document.getElementById('num-children');
const numCollegeChildrenInput = document.getElementById('num-college-children');
const dependentParentsSelect = document.getElementById('dependent-parents');
const homeValueInput = document.getElementById('home-value');
const ownsHomeSelect = document.getElementById('owns-home');
const vaLoanAmountInput = document.getElementById('va-loan-amount');
const hasStudentLoansSelect = document.getElementById('has-student-loans');
const studentLoanBalanceInput = document.getElementById('student-loan-balance');
const studentLoanWrapper = document.getElementById('student-loan-amount-wrapper');
const otherIncomeInput = document.getElementById('other-income');
const projectionSlider = document.getElementById('projection-years');
const projectionValueSpan = document.getElementById('projection-value');
const includeColaCheckbox = document.getElementById('include-cola');
const smcLevelSelect = document.getElementById('smc-level');
const smcWrapper = document.getElementById('smc-wrapper');
const smcDescription = document.getElementById('smc-description');

const totalValueCard = document.getElementById('total-value-card');
const totalValueNote = document.getElementById('total-value-note');
const benefitBreakdown = document.getElementById('benefit-breakdown');
const champvaSection = document.getElementById('champva-section');
const champvaScenariosDiv = document.getElementById('champva-scenarios');
const champvaCustomDiv = document.getElementById('champva-custom');
const champvaDetailsDiv = document.getElementById('champva-details');
const ratingComparison = document.getElementById('rating-comparison');
const stateBenefitsDiv = document.getElementById('state-benefits');
const overlookedBenefitsDiv = document.getElementById('overlooked-benefits');
const survivorBenefitsDiv = document.getElementById('survivor-benefits');
const ctaContent = document.getElementById('cta-content');

// --- View state ---
let currentView = 'monthly'; // 'monthly', 'annual', 'lifetime'
let lastCalcResults = null;

// --- Formatting Helpers ---
function fmtInt(value) {
    return '$' + Math.round(value).toLocaleString('en-US');
}

function fmtDec(value) {
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// --- Populate State Dropdown ---
function populateStates() {
    const territoryCodes = new Set(['PR', 'GU', 'VI', 'AS']);
    const entries = Object.entries(stateTaxData);
    const states = entries.filter(([code]) => !territoryCodes.has(code)).sort((a, b) => a[1].name.localeCompare(b[1].name));
    for (const [code, data] of states) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = data.name;
        if (code === 'FL') option.selected = true;
        stateSelect.appendChild(option);
    }
}

// --- Populate SMC Dropdown ---
function populateSMC() {
    for (const [key, data] of Object.entries(smcRates)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = data.label;
        smcLevelSelect.appendChild(option);
    }
    smcLevelSelect.addEventListener('change', () => {
        const level = smcLevelSelect.value;
        const data = smcRates[level];
        smcDescription.textContent = (level !== 'none' && data.description) ? data.description : '';
    });
}

// --- Show/hide SMC based on rating ---
function updateSMCVisibility() {
    const ratingValue = currentRatingSelect.value;
    const show = ratingValue === '100pt' || ratingValue === '100';
    smcWrapper.style.display = show ? 'block' : 'none';
    if (!show) smcLevelSelect.value = 'none';
}

// --- Compute Monthly Compensation (exact 2026 rates) ---
function getMonthlyCompensation(rating, hasSpouse, numChildren, numParents) {
    const rates = compensationRates[rating];
    if (!rates || rating === 0) return 0;

    // For ratings below 30, no dependent additions
    if (rating < 30) return rates.veteran;

    // Build the base from the right column
    let monthly;
    if (hasSpouse && numChildren > 0) {
        monthly = rates.withSpouseAnd1Child;
        if (numChildren > 1) monthly += rates.additionalChildUnder18 * (numChildren - 1);
    } else if (hasSpouse) {
        monthly = rates.withSpouse;
    } else if (numChildren > 0) {
        monthly = rates.with1Child;
        if (numChildren > 1) monthly += rates.additionalChildUnder18 * (numChildren - 1);
    } else {
        monthly = rates.veteran;
    }

    // Add parent additions
    if (numParents === 1) {
        monthly += (rates.with1Parent - rates.veteran);
    } else if (numParents === 2) {
        monthly += (rates.with2Parents - rates.veteran);
    }

    return monthly;
}

// --- COLA projection: total over N years with annual increases ---
function projectWithCola(annualAmount, years, colaRate) {
    let total = 0;
    let current = annualAmount;
    for (let i = 0; i < years; i++) {
        total += current;
        current *= (1 + colaRate / 100);
    }
    return total;
}

// --- Compute Property Tax Savings ---
function resolveExemption(stateData, disabilityRating, hasPT) {
    if (!stateData || !stateData.veteranExemption || !stateData.veteranExemption.tiers) {
        return { type: "none", value: 0, description: "No exemption data available" };
    }
    for (const tier of stateData.veteranExemption.tiers) {
        if (disabilityRating >= tier.minRating) {
            if (tier.requiresPT && !hasPT) continue;
            return tier;
        }
    }
    return { type: "none", value: 0, description: stateData.veteranExemption.defaultDescription || "No exemption at this rating" };
}

function calculatePropertyTax(homePrice, taxRate, exemption, disabilityRating) {
    let taxableValue = homePrice;
    switch (exemption.type) {
        case "full":
            taxableValue = 0;
            break;
        case "fixed_amount": {
            let exemptAmount = exemption.value || 0;
            if (exemption.prorated) exemptAmount = exemptAmount * (disabilityRating / 100);
            taxableValue = Math.max(0, homePrice - exemptAmount);
            break;
        }
        case "percentage": {
            let pct = exemption.value || 0;
            if (exemption.prorated) pct = pct * (disabilityRating / 100);
            taxableValue = homePrice * (1 - pct);
            break;
        }
        case "fixed_tax_credit":
            break;
        case "none":
        default:
            break;
    }
    let annualTax = taxableValue * taxRate;
    if (exemption.type === "fixed_tax_credit") {
        let credit = exemption.value || 0;
        if (exemption.prorated) credit = credit * (disabilityRating / 100);
        annualTax = Math.max(0, annualTax - credit);
    }
    return annualTax;
}

// --- Estimate tax advantage ---
function estimateTaxAdvantage(annualComp, otherIncome) {
    // Approximate marginal federal + state tax rate based on other income
    let marginalRate;
    if (otherIncome <= 0) marginalRate = 0;
    else if (otherIncome <= 23200) marginalRate = 0.10;  // 10% bracket (MFJ)
    else if (otherIncome <= 94300) marginalRate = 0.17;   // ~12% federal + ~5% state
    else if (otherIncome <= 201050) marginalRate = 0.27;  // ~22% federal + ~5% state
    else if (otherIncome <= 383900) marginalRate = 0.29;  // ~24% federal + ~5% state
    else marginalRate = 0.37;
    return annualComp * marginalRate;
}

// --- Main Calculate Function ---
function calculate() {
    const ratingValue = currentRatingSelect.value;
    const currentRating = ratingValue === 'none' ? 0 : ratingValue === '100pt' ? 100 : parseInt(ratingValue);
    const currentIsPT = ratingValue === '100pt';
    const age = parseInt(veteranAgeInput.value) || 35;
    const stateCode = stateSelect.value;
    const stateData = stateTaxData[stateCode];
    const isRetiree = isRetireeSelect.value === 'yes';
    const hasSpouse = maritalStatusSelect.value === 'married';
    const numChildren = parseInt(numChildrenInput.value) || 0;
    const numCollegeChildren = Math.min(parseInt(numCollegeChildrenInput.value) || 0, numChildren);
    const numParents = parseInt(dependentParentsSelect.value) || 0;
    const homeValue = parseFloat(homeValueInput.value) || 0;
    const ownsHome = ownsHomeSelect.value === 'yes';
    const vaLoanAmount = parseFloat(vaLoanAmountInput.value) || 0;
    const hasStudentLoans = hasStudentLoansSelect.value === 'yes';
    const studentLoanBalance = hasStudentLoans ? (parseFloat(studentLoanBalanceInput.value) || 0) : 0;
    const otherIncome = parseFloat(otherIncomeInput.value) || 0;
    const projectionYears = parseInt(projectionSlider.value);
    const includeCola = includeColaCheckbox.checked;
    const colaRate = includeCola ? colaHistory.historicalAverage : 0;

    const smcLevel = smcLevelSelect.value;
    const hasDependents = hasSpouse || numChildren > 0;

    // --- Calculate each benefit at 100% P&T ---

    // 1. Tax-free disability compensation (with SMC if applicable)
    let monthlyComp100 = getMonthlyCompensation(100, hasSpouse, numChildren, numParents);

    // Apply SMC
    const smcData = smcRates[smcLevel];
    let smcMonthly = 0;
    if (smcLevel !== 'none' && smcData) {
        if (smcData.isAddOn) {
            // SMC-K is added on top of the base rate
            smcMonthly = smcData.veteran;
            monthlyComp100 += smcMonthly;
        } else {
            // All other SMC levels replace the base 100% rate
            let smcBase;
            if (hasSpouse && numChildren > 0 && smcData.withSpouseAnd1Child) {
                smcBase = smcData.withSpouseAnd1Child;
                if (numChildren > 1) smcBase += smcData.additionalChildUnder18 * (numChildren - 1);
            } else if (hasSpouse && smcData.withSpouse) {
                smcBase = smcData.withSpouse;
            } else if (numChildren > 0 && smcData.with1Child) {
                smcBase = smcData.with1Child;
                if (numChildren > 1) smcBase += smcData.additionalChildUnder18 * (numChildren - 1);
            } else {
                smcBase = smcData.veteran;
            }
            // Add parent additions (approximate using same delta as base 100%)
            if (numParents === 1 && smcData.with1Parent) {
                smcBase += (smcData.with1Parent - smcData.veteran);
            } else if (numParents === 2 && smcData.with2Parents) {
                smcBase += (smcData.with2Parents - smcData.veteran);
            }
            smcMonthly = smcBase - getMonthlyCompensation(100, hasSpouse, numChildren, numParents);
            monthlyComp100 = smcBase;
        }
    }

    const annualComp100 = monthlyComp100 * 12;
    const lifetimeComp = includeCola ? projectWithCola(annualComp100, projectionYears, colaRate) : annualComp100 * projectionYears;

    // 2. Tax advantage (equivalent pre-tax value of tax-free income)
    const annualTaxAdvantage = estimateTaxAdvantage(annualComp100, otherIncome);
    const lifetimeTaxAdvantage = includeCola ? projectWithCola(annualTaxAdvantage, projectionYears, colaRate) : annualTaxAdvantage * projectionYears;

    // 3. CHAMPVA savings
    const annualCivilianCost = hasDependents ? champvaData.civilianFamilyAnnualCost : 0;
    const annualCHAMPVACost = hasDependents ? champvaData.annualCatastrophicCap : 0;
    const annualCHAMPVASavings = Math.max(0, annualCivilianCost - annualCHAMPVACost);
    const lifetimeCHAMPVA = annualCHAMPVASavings * projectionYears;

    // 4. Property tax savings
    let annualPropTaxSavings = 0;
    if (ownsHome && homeValue > 0) {
        const exemption100PT = resolveExemption(stateData, 100, true);
        const taxNoExemption = homeValue * stateData.avgPropertyTaxRate;
        const taxWithExemption = calculatePropertyTax(homeValue, stateData.avgPropertyTaxRate, exemption100PT, 100);
        annualPropTaxSavings = taxNoExemption - taxWithExemption;
    }
    const lifetimePropTax = annualPropTaxSavings * projectionYears;

    // 5. Chapter 35 DEA
    const ch35Total = numCollegeChildren * chapter35Data.fullTime * chapter35Data.maxMonths;

    // 6. VA Healthcare + Dental
    const annualVAHealthcare = vaHealthcareData.annualValue;
    const lifetimeVAHealthcare = annualVAHealthcare * projectionYears;
    const annualDental = vaHealthcareData.dentalAnnualValue;
    const lifetimeDental = annualDental * projectionYears;

    // 7. VA Loan Funding Fee Waiver (one-time)
    const fundingFeeSaved = ownsHome && vaLoanAmount > 0 ? vaLoanAmount * (fundingFeeData.firstUse.zeroDown / 100) : 0;

    // 8. Student Loan Forgiveness (one-time)
    const studentLoanSaved = studentLoanBalance;

    // 9. State extras (vehicle reg, etc.)
    const stateExtras = stateBenefits[stateCode];
    let annualStateExtras = 0;
    if (stateExtras && stateExtras.vehicleReg && stateExtras.vehicleReg.exempt) {
        annualStateExtras += stateExtras.vehicleReg.savings;
    }
    const lifetimeStateExtras = annualStateExtras * projectionYears;

    // 10. Commissary/Exchange savings
    const annualCommissary = additionalBenefits.commissaryExchange.annualSavings;
    const lifetimeCommissary = annualCommissary * projectionYears;

    // 11. DIC (Survivor Benefits) — estimated lifetime value for surviving spouse
    const annualDIC = dicData.baseSurvivorSpouse * 12;
    const dicEstimatedYears = 20;
    const lifetimeDIC = hasSpouse ? annualDIC * dicEstimatedYears : 0;

    // --- Grand Total ---
    const grandTotal = lifetimeComp + lifetimeTaxAdvantage + lifetimeCHAMPVA + lifetimePropTax +
        ch35Total + lifetimeVAHealthcare + lifetimeDental + fundingFeeSaved + studentLoanSaved +
        lifetimeStateExtras + lifetimeCommissary + lifetimeDIC;

    // Store results for view toggling
    lastCalcResults = {
        monthlyComp100, annualComp100, lifetimeComp,
        annualTaxAdvantage, lifetimeTaxAdvantage,
        annualCHAMPVASavings, lifetimeCHAMPVA, hasDependents,
        annualPropTaxSavings, lifetimePropTax, ownsHome,
        ch35Total, numCollegeChildren,
        annualVAHealthcare, lifetimeVAHealthcare,
        annualDental, lifetimeDental,
        fundingFeeSaved, vaLoanAmount,
        studentLoanSaved, hasStudentLoans,
        annualStateExtras, lifetimeStateExtras,
        annualCommissary, lifetimeCommissary,
        projectionYears, grandTotal,
        currentRating, currentIsPT, ratingValue,
        hasSpouse, numChildren, numParents, numCollegeChildren,
        stateCode, stateData, homeValue,
        annualDIC, lifetimeDIC, dicEstimatedYears,
        isRetiree, otherIncome, includeCola, colaRate,
        smcLevel, smcMonthly
    };

    // --- Render Everything ---
    renderHeroCard(grandTotal, projectionYears, includeCola);
    renderBenefitBreakdown();
    renderRatingComparison();
    renderCHAMPVA();
    renderStateBenefits();
    renderOverlookedBenefits();
    renderSurvivorBenefits();
    renderCTA();
}

// --- Render Functions ---

let costOfWaitingInterval = null;

function renderHeroCard(total, years, withCola) {
    const r = lastCalcResults;

    // Equivalent salary: based on recurring annual benefits only (not one-time or survivor benefits)
    const recurringAnnual = r ? (r.annualComp100 + r.annualTaxAdvantage + r.annualCHAMPVASavings +
        r.annualPropTaxSavings + r.annualVAHealthcare + r.annualDental + r.annualCommissary + r.annualStateExtras) : total / years;
    const effectiveTaxRate = r && r.otherIncome > 0 ? 0.25 : 0.22;
    const equivalentSalary = recurringAnnual / (1 - effectiveTaxRate);

    // Cost of waiting — per second loss rate based on gap between current rating and 100% P&T
    const showCostOfWaiting = r && r.ratingValue !== '100pt';
    let costPerSecond = 0;
    if (showCostOfWaiting) {
        const currentMonthly = r.currentRating > 0 ? getMonthlyCompensation(r.currentRating, r.hasSpouse, r.numChildren, r.numParents) : 0;
        const monthlyGap = r.monthlyComp100 - currentMonthly;
        costPerSecond = (monthlyGap * 12) / (365.25 * 24 * 60 * 60);
    }

    totalValueCard.innerHTML = `
        <div class="hero-value-card">
            <p class="hero-label">Estimated Lifetime Value of 100% P&T</p>
            <p class="hero-amount">${fmtInt(total)}</p>
            <p class="hero-detail">Over ${years} years, tax-free</p>
            <p class="hero-detail">Civilian equivalent: a <strong>${fmtInt(equivalentSalary)}/year salary</strong> to match these benefits after taxes</p>
            ${showCostOfWaiting ? `<p class="hero-ticker" id="cost-of-waiting-ticker"></p>` : ''}
        </div>
    `;

    // Start the live ticker
    if (costOfWaitingInterval) clearInterval(costOfWaitingInterval);
    if (showCostOfWaiting && costPerSecond > 0) {
        let lost = 0;
        const tickerEl = document.getElementById('cost-of-waiting-ticker');
        if (tickerEl) {
            tickerEl.textContent = `Since you opened this page, you've missed out on: $0.00`;
            costOfWaitingInterval = setInterval(() => {
                lost += costPerSecond;
                tickerEl.textContent = `Since you opened this page, you've missed out on: $${lost.toFixed(2)}`;
            }, 1000);
        }
    }

    if (withCola) {
        totalValueNote.textContent = `Includes estimated ${colaHistory.historicalAverage}% annual COLA adjustments on compensation. COLA applies automatically each year based on inflation.`;
    } else {
        totalValueNote.textContent = `Conservative estimate using today's rates. Enable COLA adjustments above to see projected values with annual inflation increases (~2.6%/year historical average).`;
    }
}

function renderBenefitBreakdown() {
    const r = lastCalcResults;
    if (!r) return;
    const years = r.projectionYears;

    const benefits = [];

    // Compensation
    if (r.smcLevel !== 'none' && r.smcMonthly !== 0) {
        const baseMonthly = r.monthlyComp100 - r.smcMonthly;
        const smcLabel = smcRates[r.smcLevel].label;
        benefits.push({
            title: "Tax-Free Disability Compensation",
            monthly: baseMonthly,
            annual: baseMonthly * 12,
            lifetime: r.lifetimeComp - (r.smcMonthly * 12 * (r.includeCola ? 1 : 1) * r.projectionYears), // approximate
            desc: `Base 100% P&T compensation. Tax-free — no federal, state, or local income tax.`
        });
        benefits.push({
            title: `Special Monthly Compensation (${r.smcLevel})`,
            monthly: r.smcMonthly > 0 ? r.smcMonthly : r.monthlyComp100 - baseMonthly,
            annual: (r.monthlyComp100 - baseMonthly) * 12,
            lifetime: (r.monthlyComp100 - baseMonthly) * 12 * r.projectionYears,
            desc: `${smcLabel} — additional compensation above the standard 100% rate. Also tax-free.`
        });
    } else {
        benefits.push({
            title: "Tax-Free Disability Compensation",
            monthly: r.monthlyComp100,
            annual: r.annualComp100,
            lifetime: r.lifetimeComp,
            desc: `Monthly compensation from the VA. 100% tax-free — no federal, state, or local income tax. Current rate: ${fmtDec(r.monthlyComp100)}/month.`
        });
    }

    // Tax advantage
    if (r.annualTaxAdvantage > 0) {
        benefits.push({
            title: "Tax-Free Advantage",
            monthly: r.annualTaxAdvantage / 12,
            annual: r.annualTaxAdvantage,
            lifetime: r.lifetimeTaxAdvantage,
            desc: `Because VA comp is tax-free, you'd need to earn ${fmtInt(r.annualComp100 + r.annualTaxAdvantage)}/year in taxable income to match it. This is the tax savings.`
        });
    }

    // CHAMPVA
    if (r.hasDependents) {
        benefits.push({
            title: "CHAMPVA (Dependent Healthcare)",
            monthly: r.annualCHAMPVASavings / 12,
            annual: r.annualCHAMPVASavings,
            lifetime: r.lifetimeCHAMPVA,
            desc: `Healthcare for your spouse and children. $0 premiums, $3,000/year max out-of-pocket vs. ~${fmtInt(champvaData.civilianFamilyAnnualCost)}/year for civilian family coverage.`
        });
    }

    // Property tax
    if (r.ownsHome && r.annualPropTaxSavings > 0) {
        benefits.push({
            title: "Property Tax Exemption",
            monthly: r.annualPropTaxSavings / 12,
            annual: r.annualPropTaxSavings,
            lifetime: r.lifetimePropTax,
            desc: `State-specific property tax exemption on your ${fmtInt(r.homeValue)} home in ${r.stateData.name}. Based on statewide average tax rates — your actual savings depend on your county and assessed value.`
        });
    }

    // VA Healthcare
    benefits.push({
        title: "Free VA Healthcare (For You)",
        monthly: r.annualVAHealthcare / 12,
        annual: r.annualVAHealthcare,
        lifetime: r.lifetimeVAHealthcare,
        desc: "Priority Group 1 comprehensive care: prescriptions, mental health, specialty care, vision, hearing aids — all at $0 copay."
    });

    // Dental
    benefits.push({
        title: "Comprehensive Dental (Class IV)",
        monthly: r.annualDental / 12,
        annual: r.annualDental,
        lifetime: r.lifetimeDental,
        desc: "Full dental coverage: cleanings, fillings, crowns, implants, dentures, orthodontics — all free through VA dental clinics."
    });

    // Chapter 35
    if (r.numCollegeChildren > 0) {
        benefits.push({
            title: `Chapter 35 DEA (${r.numCollegeChildren} dependent${r.numCollegeChildren > 1 ? 's' : ''})`,
            monthly: chapter35Data.fullTime * r.numCollegeChildren,
            annual: chapter35Data.fullTime * 12 * r.numCollegeChildren,
            lifetime: r.ch35Total,
            desc: `Up to 36 months of education benefits per dependent at ${fmtDec(chapter35Data.fullTime)}/month full-time. Total: ${fmtInt(chapter35Data.totalPerDependent)} per child.`,
            isOneTime: false
        });
    }

    // Funding fee waiver
    if (r.fundingFeeSaved > 0) {
        benefits.push({
            title: "VA Loan Funding Fee Waiver",
            monthly: 0,
            annual: 0,
            lifetime: r.fundingFeeSaved,
            desc: `${fundingFeeData.firstUse.zeroDown}% funding fee waived on your ${fmtInt(r.vaLoanAmount)} VA loan. Applies every time you use a VA loan.`,
            isOneTime: true
        });
    }

    // Commissary
    benefits.push({
        title: "Commissary & Exchange Savings",
        monthly: r.annualCommissary / 12,
        annual: r.annualCommissary,
        lifetime: r.lifetimeCommissary,
        desc: "Full commissary, exchange, and MWR privileges. ~20-30% savings on groceries vs. civilian stores."
    });

    // State extras
    if (r.annualStateExtras > 0) {
        benefits.push({
            title: "Vehicle Registration & State Extras",
            monthly: r.annualStateExtras / 12,
            annual: r.annualStateExtras,
            lifetime: r.lifetimeStateExtras,
            desc: `Vehicle registration exemption and other state-specific benefits in ${r.stateData.name}.`
        });
    }

    // Student loan forgiveness (show card even if user said no — show what's available)
    if (r.hasStudentLoans && r.studentLoanSaved > 0) {
        benefits.push({
            title: "Student Loan Forgiveness",
            monthly: 0,
            annual: 0,
            lifetime: r.studentLoanSaved,
            desc: "100% of federal student loans forgiven through TPD discharge. Automatic — the Dept. of Education identifies you. Includes Parent PLUS loans. Tax-free.",
            isOneTime: true
        });
    }

    // DIC (Survivor Benefits)
    if (r.hasSpouse) {
        benefits.push({
            title: "Survivor Benefits (DIC)",
            monthly: dicData.baseSurvivorSpouse,
            annual: r.annualDIC,
            lifetime: r.lifetimeDIC,
            desc: `Tax-free monthly payments to your surviving spouse — estimated over ${r.dicEstimatedYears} years. Spouse also keeps CHAMPVA and may retain property tax exemptions.`
        });
    }

    // Render cards
    let cards = '';
    for (const b of benefits) {
        let displayValue, displayLabel;
        if (b.isOneTime) {
            displayValue = fmtInt(b.lifetime);
            displayLabel = 'one-time savings';
        } else if (currentView === 'monthly') {
            displayValue = fmtInt(b.monthly);
            displayLabel = '/month';
        } else if (currentView === 'annual') {
            displayValue = fmtInt(b.annual);
            displayLabel = '/year';
        } else {
            displayValue = fmtInt(b.lifetime);
            displayLabel = `over ${years} yrs`;
        }

        cards += `
            <div class="benefit-card">
                <h3>${b.title}</h3>
                <p class="benefit-amount">${displayValue}<span class="benefit-period">${displayLabel}</span></p>
                <p class="benefit-desc">${b.desc}</p>
            </div>
        `;
    }

    benefitBreakdown.innerHTML = `<div class="benefit-grid">${cards}</div>`;
}

function renderRatingComparison() {
    const r = lastCalcResults;
    if (!r) return;

    if (r.currentRating === 100 && r.currentIsPT) {
        ratingComparison.innerHTML = `<p class="already-pt">You're at 100% P&T — you have access to the full suite of benefits above. Make sure you're using them all.</p>`;
        return;
    }

    const currentMonthly = getMonthlyCompensation(r.currentRating, r.hasSpouse, r.numChildren, r.numParents);
    const targetMonthly = r.monthlyComp100;
    const monthlyDiff = targetMonthly - currentMonthly;
    const annualDiff = monthlyDiff * 12;

    const currentLabel = r.currentRating === 0 ? "No Rating" : `${r.currentRating}%`;

    // Benefits unlocked only at 100% P&T
    const ptOnlyBenefits = [
        { label: "CHAMPVA for dependents", current: r.currentRating === 100 && r.currentIsPT, value: r.hasDependents ? `${fmtInt(r.annualCHAMPVASavings)}/yr saved` : 'N/A (no dependents)' },
        { label: "Chapter 35 DEA education", current: false, value: r.numCollegeChildren > 0 ? `${fmtInt(r.ch35Total)} total` : 'N/A (no children)' },
        { label: "Comprehensive dental", current: r.currentRating === 100, value: `${fmtInt(r.annualDental)}/yr value` },
        { label: "Full property tax exemption", current: false, value: r.ownsHome ? `${fmtInt(r.annualPropTaxSavings)}/yr saved` : 'N/A' }
    ];

    let ptRows = '';
    for (const b of ptOnlyBenefits) {
        ptRows += `
            <div class="comparison-row">
                <span class="comp-label">${b.label}</span>
                <span class="comp-current">${b.current ? 'Yes' : 'No'}</span>
                <span class="comp-target">${b.value}</span>
            </div>
        `;
    }

    ratingComparison.innerHTML = `
        <div class="comparison-table">
            <div class="comparison-header">
                <span></span>
                <span class="comp-current-header">${currentLabel}</span>
                <span class="comp-target-header">100% P&T</span>
            </div>
            <div class="comparison-row">
                <span class="comp-label">Monthly compensation</span>
                <span class="comp-current">${fmtInt(currentMonthly)}/mo</span>
                <span class="comp-target">${fmtInt(targetMonthly)}/mo</span>
            </div>
            <div class="comparison-row">
                <span class="comp-label">Annual compensation</span>
                <span class="comp-current">${fmtInt(currentMonthly * 12)}/yr</span>
                <span class="comp-target">${fmtInt(targetMonthly * 12)}/yr</span>
            </div>
            ${ptRows}
        </div>
        <div class="difference-card">
            <p class="diff-label">Every month you don't file, you're leaving on the table:</p>
            <p class="diff-amount">${fmtInt(monthlyDiff)}/month</p>
            <p class="diff-detail">That's ${fmtInt(annualDiff)}/year in compensation alone — plus CHAMPVA, education, dental, and property tax benefits not shown in this number</p>
        </div>
    `;
}

function renderCHAMPVA() {
    const r = lastCalcResults;
    if (!r) return;

    if (!r.hasDependents) {
        champvaSection.innerHTML = `<p class="champva-intro">CHAMPVA provides healthcare coverage for dependents of 100% P&T veterans. Add a spouse or children above to see the full impact.</p>`;
        champvaScenariosDiv.innerHTML = '';
        champvaCustomDiv.innerHTML = '';
        champvaDetailsDiv.innerHTML = '';
        return;
    }

    champvaSection.innerHTML = `
        <div class="champva-intro">
            <p>CHAMPVA covers your spouse and children with <strong>$0 monthly premiums</strong> and a <strong>$3,000 annual catastrophic cap</strong>. No matter what happens — emergency surgery, NICU stays, cancer treatment — your family's maximum out-of-pocket cost for the entire year is $3,000.</p>
            <p>The average American family pays <strong>${fmtInt(champvaData.civilianFamilyAnnualCost)}/year</strong> in health insurance premiums and out-of-pocket costs. Your CHAMPVA cost: up to $3,000.</p>
        </div>
    `;

    // Scenario cards
    let scenarioCards = '';
    for (const s of champvaData.scenarios) {
        scenarioCards += `
            <div class="scenario-card">
                <p class="scenario-label">${s.label}</p>
                <div class="scenario-numbers">
                    <div class="scenario-col">
                        <span class="scenario-col-label">Total Bill</span>
                        <span class="scenario-bill">${fmtInt(s.totalBill)}</span>
                    </div>
                    <div class="scenario-col">
                        <span class="scenario-col-label">You Pay (CHAMPVA)</span>
                        <span class="scenario-you-pay">${fmtInt(s.champvaCost)}</span>
                    </div>
                    <div class="scenario-col">
                        <span class="scenario-col-label">You Save</span>
                        <span class="scenario-saved">${fmtInt(s.totalBill - s.champvaCost)}</span>
                    </div>
                </div>
                <p class="scenario-desc">${s.description}</p>
            </div>
        `;
    }
    champvaScenariosDiv.innerHTML = `
        <h3 class="scenario-heading">See CHAMPVA in Action</h3>
        <div class="champva-scenario-grid">${scenarioCards}</div>
    `;

    // Custom scenario input
    champvaCustomDiv.innerHTML = `
        <div class="custom-scenario">
            <label for="custom-bill">Enter any medical bill amount:</label>
            <div class="custom-input-row">
                <span class="custom-dollar">$</span>
                <input type="number" id="custom-bill" value="" placeholder="e.g. 80000" min="0" step="1000">
                <span id="custom-result"></span>
            </div>
            <p class="custom-note">Under CHAMPVA, your max out-of-pocket is $3,000/year — regardless of the bill.</p>
        </div>
    `;

    // Attach custom scenario listener
    const customBillInput = document.getElementById('custom-bill');
    const customResult = document.getElementById('custom-result');
    customBillInput.addEventListener('input', () => {
        const bill = parseFloat(customBillInput.value) || 0;
        if (bill > 0) {
            const youPay = Math.min(bill * 0.25 + 100, 3000); // 25% cost share, capped at $3K
            customResult.innerHTML = `You'd pay: <strong>${fmtInt(youPay)}</strong> | You save: <strong>${fmtInt(bill - youPay)}</strong>`;
        } else {
            customResult.innerHTML = '';
        }
    });

    // CHAMPVA details (expandable)
    champvaDetailsDiv.innerHTML = `
        <button class="expand-btn" data-target="champva-detail-content">CHAMPVA Coverage Details</button>
        <div class="expandable-content" id="champva-detail-content">
            <div class="detail-grid">
                <div class="detail-item"><span class="detail-label">Monthly Premium</span><span class="detail-value highlight-green">$0</span></div>
                <div class="detail-item"><span class="detail-label">Annual Deductible (Individual)</span><span class="detail-value highlight-green">$50</span></div>
                <div class="detail-item"><span class="detail-label">Annual Deductible (Family)</span><span class="detail-value highlight-green">$100</span></div>
                <div class="detail-item"><span class="detail-label">Cost Share</span><span class="detail-value highlight-green">25% of allowable amount</span></div>
                <div class="detail-item"><span class="detail-label">Annual Catastrophic Cap</span><span class="detail-value highlight-green">$3,000/family</span></div>
                <div class="detail-item"><span class="detail-label">Prescriptions (Meds by Mail)</span><span class="detail-value highlight-green">$0</span></div>
                <div class="detail-item"><span class="detail-label">Preventive Care</span><span class="detail-value highlight-green">$0 cost share</span></div>
                <div class="detail-item"><span class="detail-label">Inpatient Deductible</span><span class="detail-value highlight-green">$0</span></div>
                <div class="detail-item"><span class="detail-label">Network</span><span class="detail-value highlight-green">Any willing provider (no network)</span></div>
                <div class="detail-item"><span class="detail-label">At Age 65</span><span class="detail-value highlight-green">Must enroll in Medicare A+B to keep CHAMPVA</span></div>
            </div>
            <p class="detail-note">CHAMPVA covers: inpatient, outpatient, mental health, prescriptions, maternity/childbirth, emergency care, and preventive care. Dental is NOT covered (available separately through VADIP at $9-$53/month).</p>
        </div>
    `;
}

function renderStateBenefits() {
    const r = lastCalcResults;
    if (!r) return;

    const extras = stateBenefits[r.stateCode];
    let cards = '';

    // Property tax
    if (r.ownsHome && r.homeValue > 0) {
        const exemption = resolveExemption(r.stateData, 100, true);
        cards += `
            <div class="state-benefit-card">
                <h4>Property Tax</h4>
                <p class="state-val">${r.annualPropTaxSavings > 0 ? fmtInt(r.annualPropTaxSavings) + '/yr saved' : 'See details'}</p>
                <p class="state-desc">${exemption.description || 'Contact your state VA office for details'}</p>
            </div>
        `;
    }

    if (extras) {
        if (extras.vehicleReg) {
            cards += `
                <div class="state-benefit-card">
                    <h4>Vehicle Registration</h4>
                    <p class="state-val">${extras.vehicleReg.exempt ? fmtInt(extras.vehicleReg.savings) + '/yr saved' : 'Not exempt'}</p>
                    <p class="state-desc">${extras.vehicleReg.description}</p>
                </div>
            `;
        }
        if (extras.plates) {
            cards += `
                <div class="state-benefit-card">
                    <h4>License Plates</h4>
                    <p class="state-val">${extras.plates.free ? 'Free' : 'Available'}</p>
                    <p class="state-desc">${extras.plates.description}</p>
                </div>
            `;
        }
        if (extras.huntingFishing) {
            cards += `
                <div class="state-benefit-card">
                    <h4>Hunting & Fishing</h4>
                    <p class="state-val">${extras.huntingFishing.free ? 'Free' : 'Reduced'}</p>
                    <p class="state-desc">${extras.huntingFishing.description}</p>
                </div>
            `;
        }
        if (extras.education) {
            cards += `
                <div class="state-benefit-card">
                    <h4>State Education Benefits</h4>
                    <p class="state-val">${extras.education.available ? 'Available' : 'None'}</p>
                    <p class="state-desc">${extras.education.description}</p>
                </div>
            `;
        }
        if (extras.incomeTax) {
            cards += `
                <div class="state-benefit-card">
                    <h4>Military Retirement Income Tax</h4>
                    <p class="state-val">${extras.incomeTax.militaryRetirementExempt ? 'Exempt' : 'Taxed'}</p>
                    <p class="state-desc">${extras.incomeTax.description}</p>
                </div>
            `;
        }
        if (extras.other && extras.other.length > 0) {
            for (const item of extras.other) {
                cards += `
                    <div class="state-benefit-card">
                        <h4>${item.name}</h4>
                        <p class="state-val">Included</p>
                        <p class="state-desc">${item.description}</p>
                    </div>
                `;
            }
        }
    }

    if (!cards) {
        cards = `<p class="no-data">Detailed state benefit data for ${r.stateData.name} is coming soon. Property tax exemption data is shown in the breakdown above.</p>`;
    }

    stateBenefitsDiv.innerHTML = `
        <div class="state-benefit-grid">${cards}</div>
        <p class="source-note">
            Sources: Compiled from state VA offices, <a href="https://www.veteransunited.com/futurehomeowners/veteran-property-tax-exemptions-by-state/" target="_blank" rel="noopener noreferrer">Veterans United</a>, and <a href="https://www.va.gov/statedva.htm" target="_blank" rel="noopener noreferrer">VA.gov State Directory</a>. Benefits vary by eligibility — verify details with your state VA office.
        </p>
    `;
}

function renderOverlookedBenefits() {
    const r = lastCalcResults;
    if (!r) return;

    const items = [
        {
            title: "Federal Student Loan Forgiveness",
            value: r.hasStudentLoans ? fmtInt(r.studentLoanSaved) + " forgiven" : "If applicable",
            desc: "100% of federal student loans forgiven through TPD discharge. The Department of Education automatically identifies eligible veterans. Includes Parent PLUS loans. Tax-free.",
            url: "https://studentaid.gov/tpd-discharge/",
            show: true
        },
        {
            title: "Chapter 31 Vocational Rehabilitation",
            value: "Up to " + fmtInt(chapter31Data.estimatedDegreeValue) + "+",
            desc: "Covers 100% of tuition (no cap, unlike GI Bill), books, supplies, equipment, and pays a monthly subsistence allowance. Often more valuable than the Post-9/11 GI Bill.",
            url: "https://www.va.gov/careers-employment/vocational-rehabilitation/",
            show: true
        },
        {
            title: "National Parks Lifetime Pass",
            value: "Free (saves $80/yr)",
            desc: "Free Access Pass to all 2,000+ national parks, wildlife refuges, and federal recreational lands. Covers entrance and standard amenity fees.",
            url: "https://www.nps.gov/subjects/accessibility/interagency-access-pass.htm",
            show: true
        },
        {
            title: "Space-A Military Flights",
            value: "Free domestic flights",
            desc: "Space-Available flights within the US (CONUS, Alaska, Hawaii, territories) as Category 6. Spouse can fly with you. Must have DoD ID card.",
            url: "https://www.amc.af.mil/AMC-Travel-Site/",
            show: true
        },
        {
            title: "10-Point Federal Hiring Preference",
            value: "Career advantage",
            desc: "10-point hiring preference for all federal government jobs. Plus Schedule A non-competitive hiring authority — agencies can hire you directly.",
            url: "https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/",
            show: true
        },
        {
            title: "Travel Reimbursement",
            value: "$0.415/mile",
            desc: "Reimbursed for travel to and from VA medical appointments. $3 deductible each way, capped at $18/month in deductibles.",
            url: "https://www.va.gov/health-care/get-reimbursed-for-travel-pay/",
            show: true
        },
        {
            title: "Clothing Allowance",
            value: fmtInt(additionalBenefits.clothingAllowance.annual2026) + "/year",
            desc: "Annual payment if prosthetic devices or skin medications damage your clothing. Apply by August 1 each year.",
            url: "https://www.va.gov/disability/eligibility/special-claims/clothing-allowance/",
            show: true
        },
        {
            title: "COLA: Automatic Annual Raises",
            value: "~2.6%/year average",
            desc: "VA compensation increases automatically every year with Social Security COLA. No action needed. The 2026 increase was 2.8%. Over time, this significantly increases your benefits.",
            url: "https://www.va.gov/disability/compensation-rates/veteran-rates/",
            show: true
        },
        {
            title: "Concurrent Retirement & Disability Pay (CRDP)",
            value: "Full retirement + full VA disability",
            desc: "Military retirees with 50%+ VA disability receive both full military retirement pay AND full VA disability compensation — no offset. Automatic enrollment.",
            url: "https://www.dfas.mil/retiredmilitary/disability/crdp/",
            show: r.isRetiree
        },
        {
            title: "Combat-Related Special Compensation (CRSC)",
            value: "Tax-free combat pay",
            desc: "Military retirees with combat-related disabilities (including training injuries, airborne ops, and hazardous duty) can receive tax-free CRSC payments instead of taxable retirement pay. Requires a separate application to your branch — process varies by service. You receive whichever is higher: CRDP or CRSC.",
            url: "https://www.dfas.mil/retiredmilitary/disability/crsc/",
            show: r.isRetiree
        },
        {
            title: "$0 VA Healthcare — What It Really Means",
            value: "$0 copays across the board",
            desc: "Priority Group 1 = zero copays for everything: ER visits ($2,200 avg civilian cost), ambulance ($1,200), surgeries, mental health ($200/session), prescriptions ($150/mo avg), and preventive care. All through VA facilities or VA-authorized community care.",
            url: "https://www.va.gov/health-care/about-va-health-benefits/",
            show: true
        },
        {
            title: "VA Life Insurance (VALife)",
            value: "Up to $40,000 coverage",
            desc: "Guaranteed-issue whole life insurance — no health exam, no health questions. Available to veterans with any service-connected disability. Critical if your disabilities make you uninsurable on the civilian market. Premiums based on age, not health.",
            url: "https://www.va.gov/life-insurance/options-eligibility/valife/",
            show: true
        },
        {
            title: "Service Dog — Free Veterinary Care",
            value: "Free care for your service dog",
            desc: "The VA provides service dogs for qualifying veterans with PTSD, mobility impairments, and other conditions. Once enrolled, the VA covers all veterinary care, equipment, and training for your service dog.",
            url: "https://www.prosthetics.va.gov/ServiceAndGuideDogs.asp",
            show: true
        },
        {
            title: "Veterans Treatment Courts",
            value: "Legal protection",
            desc: "Over 600 Veterans Treatment Courts nationwide offer an alternative to traditional criminal courts. Eligible veterans get treatment-focused programs instead of incarceration, with access to VA services, mentors, and case dismissal upon completion. Free legal help is also available through VA-accredited attorneys and legal clinics.",
            url: "https://www.va.gov/homeless/vjo.asp",
            show: true
        },
        {
            title: "ABLE Accounts — Tax-Free Savings",
            value: "Up to $18,000/yr tax-free",
            desc: "Tax-advantaged savings accounts for veterans with disabilities. Contributions up to $18,000/year grow tax-free, withdrawals for qualified expenses are tax-free, and the balance doesn't count against VA pension or SSI asset limits. Available in every state — many run through Fidelity or Vanguard.",
            url: "https://www.ablenrc.org/what-is-able/",
            show: true
        }
    ];

    let html = '<div class="overlooked-grid">';
    for (const item of items) {
        if (!item.show) continue;
        html += `
            <div class="overlooked-card">
                <div class="overlooked-header">
                    <h4>${item.title}</h4>
                    <span class="overlooked-value">${item.value}</span>
                </div>
                <p class="overlooked-desc">${item.desc}</p>
                ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="overlooked-link">Learn more</a>` : ''}
            </div>
        `;
    }
    html += '</div>';
    overlookedBenefitsDiv.innerHTML = html;
}

function renderSurvivorBenefits() {
    const r = lastCalcResults;
    if (!r) return;

    let monthlyDIC = dicData.baseSurvivorSpouse;
    let details = [`Base DIC: ${fmtDec(dicData.baseSurvivorSpouse)}/mo`];

    details.push(`+ ${fmtDec(dicData.add8YearBonus)}/mo if you were 100% for 8+ continuous years`);

    if (r.numChildren > 0) {
        const childAdd = dicData.addPerChildUnder18 * r.numChildren;
        monthlyDIC += childAdd;
        details.push(`+ ${fmtDec(childAdd)}/mo for ${r.numChildren} child${r.numChildren > 1 ? 'ren' : ''}`);
    }

    survivorBenefitsDiv.innerHTML = `
        <div class="survivor-content">
            <p class="survivor-intro">When a 100% P&T veteran passes, their surviving spouse and dependents may receive Dependency and Indemnity Compensation (DIC) — tax-free monthly payments.</p>
            <div class="survivor-amount">
                <span class="survivor-label">Estimated Monthly DIC</span>
                <span class="survivor-value">${fmtDec(monthlyDIC)}/mo</span>
                <span class="survivor-annual">(${fmtInt(monthlyDIC * 12)}/year, tax-free)</span>
            </div>
            <div class="survivor-details">
                ${details.map(d => `<p>${d}</p>`).join('')}
            </div>
            <div class="survivor-also">
                <h4>Your survivors also keep:</h4>
                <ul>
                    <li>CHAMPVA healthcare eligibility</li>
                    <li>Chapter 35 DEA education benefits for dependents</li>
                    <li>Property tax exemption (in many states)</li>
                    <li>Commissary and exchange access</li>
                </ul>
                <p class="survivor-note">If the surviving spouse remarries before age 57, DIC benefits end. At 57 or older, benefits continue.</p>
            </div>
        </div>
    `;
}

function renderCTA() {
    const r = lastCalcResults;
    if (!r) return;

    const notFiled = r.ratingValue === 'none';
    const alreadyPT = r.ratingValue === '100pt';

    let message;
    if (alreadyPT) {
        message = `<p class="cta-message">You've already earned these benefits. Make sure you're taking full advantage — especially CHAMPVA for your dependents, property tax exemptions in ${r.stateData.name}, Chapter 35 education benefits for your children, and comprehensive dental care.</p>`;
    } else if (notFiled) {
        message = `<p class="cta-message">You haven't filed yet — and that's okay. But <strong>${fmtInt(r.grandTotal)}</strong> in potential benefits over ${r.projectionYears} years is waiting for you.</p>`;
    } else {
        message = `<p class="cta-message">You're currently at ${r.currentRating}%, but there's <strong>${fmtInt(r.grandTotal)}</strong> in potential benefits waiting at 100% P&T.</p>`;
    }

    // Myth-busting section — show for anyone not already at 100% P&T
    const myths = !alreadyPT ? `
        <div class="myth-busters">
            <h3>What stops most veterans from filing</h3>
            <div class="myth-grid">
                <div class="myth-card">
                    <p class="myth-quote">"Others had it worse than me."</p>
                    <p class="myth-fact">Disability compensation isn't about who had it worst. It's earned compensation for damage done to your body during service. A bad knee from airborne ops is just as valid as a combat wound. If the military broke it, the VA owes you for it.</p>
                </div>
                <div class="myth-card">
                    <p class="myth-quote">"I don't want to take money from veterans who need it more."</p>
                    <p class="myth-fact">VA disability compensation is mandatory spending — like Social Security. Congress is required by law to fund every approved claim. There is no cap, no limited pool, and no "running out." Your claim does not reduce anyone else's benefits. Not by a single dollar.</p>
                </div>
                <div class="myth-card">
                    <p class="myth-quote">"The VA will just deny me."</p>
                    <p class="myth-fact">The VA approves the majority of claims. The most commonly rated conditions — tinnitus, hearing loss, back pain, knee injuries, PTSD, sleep apnea, migraines — affect millions of veterans. A free accredited VSO can help you file correctly the first time.</p>
                </div>
                <div class="myth-card">
                    <p class="myth-quote">"It's too complicated and takes too long."</p>
                    <p class="myth-fact">A VSO (Veterans Service Organization) will file your claim for free — they handle the paperwork, gather evidence, and represent you. You don't need a lawyer. You don't need to pay anyone. Find one below.</p>
                </div>
            </div>
        </div>
    ` : '';

    ctaContent.innerHTML = `
        ${message}
        ${myths}
        <div class="cta-links">
            <a href="https://www.va.gov/disability/file-disability-claim-form-21-526ez/" target="_blank" rel="noopener" class="cta-btn cta-btn-primary">File a VA Disability Claim</a>
            <a href="https://www.va.gov/vso/" target="_blank" rel="noopener" class="cta-btn cta-btn-secondary">Find a Free VSO Near You</a>
        </div>
        <div class="other-tools">
            <p>Explore more veteran financial tools:</p>
            <a href="https://tools.thebetterveteran.com/va-loan">VA Loan Calculator</a>
            <a href="https://tools.thebetterveteran.com/mba">MBA Comparison Tool</a>
        </div>
    `;
}

// --- Slider Fill ---
function updateSliderFill() {
    const pct = ((projectionSlider.value - projectionSlider.min) / (projectionSlider.max - projectionSlider.min)) * 100;
    projectionSlider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, #ddd ${pct}%, #ddd 100%)`;
}

// --- Collapsible Input Groups ---
function setupCollapsibles() {
    document.querySelectorAll('.input-group-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isOpen);
            target.classList.toggle('collapsed', isOpen);
            btn.querySelector('.toggle-indicator').textContent = isOpen ? '\u25B6' : '\u25BC';
        });
    });
}

// --- Expandable Detail Sections ---
function setupExpandables() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('expand-btn')) {
            const targetId = e.target.dataset.target;
            const content = document.getElementById(targetId);
            if (content) {
                content.classList.toggle('expanded');
                e.target.classList.toggle('active');
            }
        }
    });
}

// --- View Toggle (monthly/annual/lifetime) ---
function setupViewToggle() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            renderBenefitBreakdown();
        });
    });
}

// --- Student Loan Toggle ---
function setupStudentLoanToggle() {
    hasStudentLoansSelect.addEventListener('change', () => {
        studentLoanWrapper.style.display = hasStudentLoansSelect.value === 'yes' ? 'block' : 'none';
    });
}

// --- Print ---
function setupPrint() {
    document.getElementById('print-btn').addEventListener('click', () => window.print());
    document.getElementById('share-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            const btn = document.getElementById('share-btn');
            btn.textContent = 'Link Copied!';
            setTimeout(() => { btn.textContent = 'Copy Link to Share'; }, 2000);
        });
    });
}

// --- Event Listeners ---
const allInputs = [
    currentRatingSelect, veteranAgeInput, stateSelect, isRetireeSelect, smcLevelSelect,
    maritalStatusSelect, numChildrenInput, numCollegeChildrenInput, dependentParentsSelect,
    homeValueInput, ownsHomeSelect, vaLoanAmountInput, hasStudentLoansSelect,
    studentLoanBalanceInput, otherIncomeInput, projectionSlider, includeColaCheckbox
];

allInputs.forEach(input => {
    input.addEventListener('input', calculate);
    input.addEventListener('change', calculate);
});

projectionSlider.addEventListener('input', () => {
    projectionValueSpan.textContent = projectionSlider.value + ' years';
    updateSliderFill();
});

currentRatingSelect.addEventListener('change', updateSMCVisibility);

// --- Initialize ---
populateStates();
populateSMC();
updateSMCVisibility();
setupCollapsibles();
setupExpandables();
setupViewToggle();
setupStudentLoanToggle();
setupPrint();
updateSliderFill();
calculate();
