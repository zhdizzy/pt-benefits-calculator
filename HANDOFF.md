# 100% P&T Lifetime Benefits Calculator — AI Handoff Document

## What This Tool Does
An interactive calculator that shows veterans the **total lifetime dollar value** of being rated 100% Permanent & Total (P&T) by the VA. The goal is to convince veterans who haven't filed (or stopped at a low rating) to file their claims by showing them exactly how much money they're leaving on the table.

## Current State: Scaffold Complete, Needs Data + Polish

The tool is **structurally complete and runnable** but needs data verification, expanded state coverage, and visual polish before going live.

### Files Created

```
PT-Benefits-Calculator/
├── index.html              # Full page structure with all sections
├── style.css               # Complete styling matching TBV brand
├── script.js               # All calculation logic + render functions
└── data/
    ├── benefits-data.js    # VA compensation rates, CHAMPVA, Chapter 35, state extras
    └── state-tax-data.js   # Copy of property tax data from VA Loan Calculator
```

### What Works Right Now
- Full input form (rating, age, marital status, children, state, home value, projection period)
- Tax-free compensation calculation using VA rate tables
- CHAMPVA savings calculation (vs. civilian insurance costs)
- Property tax exemption calculations (reuses VA Loan Calculator logic for all 50 states)
- Chapter 35 DEA education benefit calculations
- VA healthcare value estimation
- State-specific extras (vehicle registration, plates, education, income tax) — **only TX and FL populated**
- Rating comparison: side-by-side of current rating vs. 100% P&T
- CHAMPVA scenario cards showing real medical bills ($203K c-section, $1.2M NICU, etc.)
- CTA section with links to VA.gov claims portal and VSO finder
- Cross-links to other TBV tools (VA Loan Calculator, MBA tool)
- Responsive design for mobile
- Slider with dynamic fill (same pattern as VA Loan Calculator)

### What Needs To Be Done

#### Priority 1: Data Verification (CRITICAL before launch)
- [ ] **Verify 2026 VA compensation rates** in `benefits-data.js` → `compensationRates` object
  - Current values are based on 2025 rates + estimated COLA
  - Source: https://www.va.gov/disability/compensation-rates/veteran-rates/
  - The rate table uses a simplified model (base + spouseAdd + childAdd). The VA's actual tables have different rates for each combination. Consider replacing with exact tables for accuracy.
- [ ] **Verify CHAMPVA catastrophic cap** is still $3,000/year for 2026
  - Source: https://www.va.gov/health-care/family-caregiver-benefits/champva/
- [ ] **Verify Chapter 35 DEA monthly rate** (~$1,600/mo for full-time)
  - Source: https://www.va.gov/education/survivor-dependent-benefits/dependents-education-assistance/
- [ ] **Verify civilian health insurance cost estimates** (currently $1,850/mo family, $650/mo single)
  - Source: KFF Employer Health Benefits Survey (latest available)

#### Priority 2: Expand State Data (13 more states minimum)
- [ ] Add state-specific benefits for: CA, VA, NC, GA, CO, WA, AZ, TN, SC, OH, NY, PA, IL
  - Data needed per state in `benefits-data.js` → `stateBenefits` object:
    - `vehicleReg`: { exempt: bool, savings: number (annual dollar amount), description: string }
    - `plates`: { free: bool, description: string }
    - `education`: { available: bool, description: string, monthlyValue: number }
    - `incomeTax`: { militaryRetirementExempt: bool, description: string }
    - `other`: [{ name: string, description: string }]
  - Sources: State VA websites, state DMV sites, state tax authority sites
  - Only TX and FL are currently populated as templates

#### Priority 3: Enhancements
- [ ] **COLA adjustment**: Add estimated 2-3% annual COLA increase to compensation over the projection period (currently uses flat annual rates)
- [ ] **Investment value of tax savings**: Show what the tax-free savings would be worth if invested (e.g., "If you invest your $45K/yr tax savings at 7%, it's worth $X in 30 years")
- [ ] **SMC (Special Monthly Compensation)**: Add optional SMC levels (S, K, L, etc.) for veterans with higher compensation
- [ ] **Print/Share**: Add a "Print My Benefits" or "Share" button
- [ ] **Chart**: Consider adding a stacked bar chart or waterfall chart showing how each benefit contributes to the total

#### Priority 4: Deployment
- [ ] Copy completed tool into `tbv-tools/100-pt/` directory
- [ ] Push to both `PT-Benefits-Calculator` repo and `tbv-tools` repo
- [ ] Tool will auto-deploy to `tools.thebetterveteran.com/100-pt`
- [ ] No DNS or Netlify config changes needed (see CLAUDE.md for deployment workflow)

---

## Architecture & Patterns

### Shared Code with VA Loan Calculator
The property tax calculation logic (`resolveExemption`, `calculatePropertyTax`) is **duplicated** from `VA-Loan-Calculator/script.js`. The `state-tax-data.js` file is a direct copy. In the future, consider extracting to a shared module, but for now each tool is self-contained for simpler deployment.

### Brand Consistency
The CSS uses the same `:root` variables as the VA Loan Calculator and MBA tool:
- `--primary: #1a365d` (navy)
- `--primary-light: #2b6cb0` (lighter blue)
- `--accent-gold: #C4A55A` (gold for "Veteran" in brand name)
- `--green / --green-light` for positive values

### Input → Calculate → Render Pattern
Same pattern as VA Loan Calculator:
1. All inputs have `input` and `change` event listeners
2. Every input change triggers `calculate()`
3. `calculate()` reads all inputs, computes all values, and calls render functions
4. Each section has its own render function (`renderHeroCard`, `renderBenefitBreakdown`, `renderCHAMPVA`, `renderRatingComparison`, `renderStateBenefits`, `renderCTA`)

### Compensation Rate Model
The current model is simplified: `base + spouseAdd + childAdd`. The VA's actual rate tables have specific amounts for each exact combination (e.g., "veteran with spouse, 2 children, and 1 parent"). For MVP, the simplified model is close enough. For production accuracy, consider importing the exact VA rate tables.

### Key File: `data/benefits-data.js`
This is where all the data lives. It exports:
- `compensationRates` — VA disability compensation by rating
- `champvaData` — CHAMPVA rules, costs, and real-world scenarios
- `chapter35Data` — DEA education benefit rates
- `vaHealthcareData` — Estimated annual value of VA healthcare
- `stateBenefits` — State-specific extras (only TX and FL populated)

---

## Owner's Personal Story (For Newsletter / Tool Messaging)
The tool owner (Zak) is a 100% P&T veteran in Florida whose wife had a month-long hospital stay with an emergency c-section ($203,000 bill) and whose daughter was in the NICU (7-figure bill). Their total out-of-pocket was capped at $3,000 thanks to CHAMPVA's catastrophic cap. This story is baked into the CHAMPVA scenarios as real data points.

## Deployment Info
- **Tools hub**: All tools served from `tbv-tools` Netlify site at `tools.thebetterveteran.com`
- **This tool URL**: `tools.thebetterveteran.com/100-pt`
- **Deployment**: Copy into `tbv-tools/100-pt/`, push to GitHub, Netlify auto-deploys
- **No additional DNS or Netlify config needed**

## Testing
To test locally:
```bash
cd PT-Benefits-Calculator
python3 -m http.server 8083
# Open http://localhost:8083
```

## Related Files
- `CLAUDE.md` — Project-wide instructions and deployment workflow
- `VA-Loan-Calculator/` — Sibling tool with shared state tax data and brand styling
- `tbv-tools/` — Netlify deployment repo (copy finished tool here)
- `emails/` — Newsletter drafts
