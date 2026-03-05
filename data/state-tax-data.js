/**
 * State Property Tax Data for All 50 States + DC
 *
 * Primary Source: Veterans United Home Loans (2025/2026)
 *   https://www.veteransunited.com/futurehomeowners/veteran-property-tax-exemptions-by-state/
 *
 * Each entry contains:
 *   - name: Full state name
 *   - avgPropertyTaxRate: Average effective property tax rate (decimal)
 *   - veteranExemption: Object with tiers (ordered highest minRating first) and defaultDescription
 *
 * Exemption tier types:
 *   "full"            — 100% of property tax eliminated
 *   "fixed_amount"    — Dollar amount deducted from assessed value
 *   "fixed_tax_credit" — Dollar amount deducted from the tax bill
 *   "percentage"      — Decimal (0.5 = 50%) of assessed value that is exempt
 *   "none"            — No exemption
 *
 * Optional tier fields:
 *   prorated: true    — Value is prorated by (disabilityRating / 100)
 *
 * Flagged states needing user verification are marked with:
 *   flagged: true + flagNote: "reason"
 */

export const stateTaxData = {
  "AL": {
    name: "Alabama",
    avgPropertyTaxRate: 0.0033,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "full", description: "Full exemption on homestead up to 160 acres (P&T)" },
        { minRating: 100, requiresPT: false, type: "full", description: "Full exemption on single-family home (100% rated)" }
      ],
      defaultDescription: "No veteran property tax exemption below 100%"
    }
  },

  "AK": {
    name: "Alaska",
    avgPropertyTaxRate: 0.0104,
    veteranExemption: {
      tiers: [
        { minRating: 50, requiresPT: false, type: "fixed_amount", value: 150000, description: "First $150,000 of assessed value exempt" }
      ],
      defaultDescription: "No veteran exemption below 50%"
    }
  },

  "AZ": {
    name: "Arizona",
    avgPropertyTaxRate: 0.0072,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "fixed_amount", value: 4188, description: "Up to $4,188 exemption (assessed value cannot exceed $28,458)" }
      ],
      defaultDescription: "No veteran exemption below 100% P&T"
    }
  },

  "AR": {
    name: "Arkansas",
    avgPropertyTaxRate: 0.0052,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full exemption on homestead (100% disabled, lost limb, or total blindness)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "CA": {
    name: "California",
    avgPropertyTaxRate: 0.0074,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_amount", value: 175298, description: "$175,298 off assessed value (up to $262,950 if household income ≤$78,718)" }
      ],
      defaultDescription: "No veteran-specific disability exemption below 100%"
    }
  },

  "CO": {
    name: "Colorado",
    avgPropertyTaxRate: 0.0060,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_amount", value: 100000, description: "50% of first $200,000 of actual value exempt ($100,000)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "CT": {
    name: "Connecticut",
    avgPropertyTaxRate: 0.0163,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "full", description: "Full exemption (service-connected P&T, FY2026)" }
      ],
      defaultDescription: "Some towns offer small exemptions for qualifying veterans"
    }
  },

  "DE": {
    name: "Delaware",
    avgPropertyTaxRate: 0.0043,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Tax credit against 100% of non-vocational school district property tax (3-year DE residency required)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "FL": {
    name: "Florida",
    avgPropertyTaxRate: 0.0097,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "full", description: "Full exemption on primary residence (100% P&T)" },
        { minRating: 10, requiresPT: false, type: "fixed_amount", value: 5000, description: "$5,000 deduction from assessed value" }
      ],
      defaultDescription: "No veteran exemption at 0%"
    }
  },

  "GA": {
    name: "Georgia",
    avgPropertyTaxRate: 0.0083,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_amount", value: 109986, description: "Up to $109,986 off assessed value (indexed annually; verify current year amount)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "HI": {
    name: "Hawaii",
    avgPropertyTaxRate: 0.0026,
    flagged: true,
    flagNote: "Exemptions vary by county. Kauai: 80%+ full (min $150 tax), <80% $50K off assessed. Maui: 70%+ full (min $150). Honolulu & Hawaii County: 100% only (min ~$300). Showing most common threshold (100%).",
    sources: [
      { label: "Kauai County", url: "https://www.kauai.gov/Government/Departments-Agencies/Department-of-Finance/Real-Property-Assessment-Division/Exemptions" },
      { label: "Maui County", url: "https://www.mauicounty.gov/1888/Real-Property-Tax-Exemptions" },
      { label: "Honolulu County", url: "https://www.honolulu.gov/budget/realproperty.html" },
      { label: "Hawaii County", url: "https://www.hawaiipropertytax.com/" }
    ],
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full exemption on primary residence (all counties; minimum tax $150–$300 may still apply)" },
        { minRating: 80, requiresPT: false, type: "full", description: "Full exemption in Kauai County (min $150 tax); verify eligibility in other counties" },
        { minRating: 70, requiresPT: false, type: "full", description: "Full exemption in Maui County (min $150 tax; 'severely disabled' per MCC 3.48.475); other counties require higher rating" }
      ],
      defaultDescription: "Kauai: <80% disabled veterans get $50,000 off assessed value. Other counties: no exemption below thresholds listed."
    }
  },

  "ID": {
    name: "Idaho",
    avgPropertyTaxRate: 0.0069,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_tax_credit", value: 1500, description: "$1,500 property tax reduction (must own and occupy before April 15)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "IL": {
    name: "Illinois",
    avgPropertyTaxRate: 0.0173,
    veteranExemption: {
      tiers: [
        { minRating: 70, requiresPT: false, type: "full", description: "Full exemption (property EAV under $250,000)" },
        { minRating: 50, requiresPT: false, type: "fixed_amount", value: 5000, description: "$5,000 off EAV" },
        { minRating: 30, requiresPT: false, type: "fixed_amount", value: 2500, description: "$2,500 off EAV" }
      ],
      defaultDescription: "No veteran exemption below 30%"
    }
  },

  "IN": {
    name: "Indiana",
    avgPropertyTaxRate: 0.0085,
    flagged: true,
    flagNote: "Three deduction tiers based on service era and disability. Wartime (WWII/Korea/Vietnam/Gulf War) + 10%+: $24,960. Total disability or age 62+ with 10%+: $14,000 (home under $240K). Both combined: $38,960 (home under $240K).",
    sources: [
      { label: "IN DVA Property Tax Deduction", url: "https://www.in.gov/dva/benefits-and-services/financial-assistance/disabled-veteran-property-tax-deduction/" }
    ],
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_amount", value: 38960, description: "$38,960 off assessed value (wartime + total disability combined; home under $240K)" },
        { minRating: 10, requiresPT: false, type: "fixed_amount", value: 24960, description: "$24,960 off assessed value (wartime service with 10%+ rating)" }
      ],
      defaultDescription: "No veteran exemption at 0%"
    }
  },

  "IA": {
    name: "Iowa",
    avgPropertyTaxRate: 0.0129,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "full", description: "Full exemption on homestead (≤40 acres rural or ≤½ acre urban)" }
      ],
      defaultDescription: "Small general veteran credit available (not disability-specific)"
    }
  },

  "KS": {
    name: "Kansas",
    avgPropertyTaxRate: 0.0129,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "fixed_tax_credit", value: 700, description: "Up to $700 tax refund (household income ≤$42,600)" }
      ],
      defaultDescription: "No veteran exemption below 100% P&T (income limits apply)"
    }
  },

  "KY": {
    name: "Kentucky",
    avgPropertyTaxRate: 0.0072,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_amount", value: 49100, description: "$49,100 off assessed value (indexed for inflation)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "LA": {
    name: "Louisiana",
    avgPropertyTaxRate: 0.0018,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full parish property tax exemption on homestead" },
        { minRating: 10, requiresPT: false, type: "fixed_amount", value: 120000, prorated: true, description: "Up to $120,000 off assessed value, prorated by rating" }
      ],
      defaultDescription: "No veteran exemption at 0%"
    }
  },

  "ME": {
    name: "Maine",
    avgPropertyTaxRate: 0.0109,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_amount", value: 50000, description: "$50,000 off assessed value (specially adapted housing with federal grant)" },
        { minRating: 0, requiresPT: false, type: "fixed_amount", value: 6000, description: "$6,000 off assessed value (age 62+ or any disability)" }
      ],
      defaultDescription: "$6,000 exemption available to qualifying veterans"
    }
  },

  "MD": {
    name: "Maryland",
    avgPropertyTaxRate: 0.0087,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full exemption on primary residence (apply by September for following year)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "MA": {
    name: "Massachusetts",
    avgPropertyTaxRate: 0.0104,
    flagged: true,
    flagNote: "Exemptions are tax credits (off the bill, not assessed value). Amounts shown are state minimums — municipalities may double them under the HERO Act. Full exemption only for paraplegic or 100% service-connected blindness.",
    sources: [
      { label: "MA DOR Property Tax Exemptions", url: "https://www.mass.gov/info-details/local-property-tax-exemptions-for-veterans" }
    ],
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_tax_credit", value: 1500, description: "$1,500 off tax bill (specially adapted housing); full exemption for paraplegia or 100% blindness" },
        { minRating: 100, requiresPT: false, type: "fixed_tax_credit", value: 1000, description: "$1,000 off tax bill (100% service-connected disability)" },
        { minRating: 10, requiresPT: false, type: "fixed_tax_credit", value: 400, description: "$400 off tax bill (10%+ disability or Purple Heart)" }
      ],
      defaultDescription: "No veteran exemption at 0%"
    }
  },

  "MI": {
    name: "Michigan",
    avgPropertyTaxRate: 0.0162,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "full", description: "Full exemption on primary residence (must re-apply annually)" }
      ],
      defaultDescription: "No veteran exemption below 100% P&T"
    }
  },

  "MN": {
    name: "Minnesota",
    avgPropertyTaxRate: 0.0105,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "fixed_amount", value: 300000, description: "$300,000 off market value (P&T)" },
        { minRating: 70, requiresPT: false, type: "fixed_amount", value: 150000, description: "$150,000 off market value" }
      ],
      defaultDescription: "No veteran exemption below 70%"
    }
  },

  "MS": {
    name: "Mississippi",
    avgPropertyTaxRate: 0.0052,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "full", description: "Full exemption on homestead (service-connected P&T)" }
      ],
      defaultDescription: "No veteran exemption below 100% P&T"
    }
  },

  "MO": {
    name: "Missouri",
    avgPropertyTaxRate: 0.0091,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_tax_credit", value: 1100, description: "Tax credit up to $1,100 on primary residence (100% or POW)" }
      ],
      defaultDescription: "No veteran property tax benefit below 100%"
    }
  },

  "MT": {
    name: "Montana",
    avgPropertyTaxRate: 0.0083,
    flagged: true,
    flagNote: "100% disability required. Tax reduction is income-based (not a flat exemption). Single: 100% reduction if income ≤$48,152, 80% if ≤$52,968, 70% if ≤$57,781, 50% if ≤$62,598. Married/HoH caps at $72,229. Must occupy home 7+ months/year.",
    sources: [
      { label: "MT Revenue Property Tax Help", url: "https://mtrevenue.gov/property/property-tax-help/" },
      { label: "MCA 15-6-211 (Statute)", url: "https://leg.mt.gov/bills/mca/title_0150/chapter_0060/part_0020/section_0110/0150-0060-0020-0110.html" }
    ],
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "percentage", value: 1.0, description: "50%–100% tax reduction based on income (100% reduction if single income ≤$48,152; see flag note for full tiers)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "NE": {
    name: "Nebraska",
    avgPropertyTaxRate: 0.0176,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "100% exemption — no income or home value limits (Category 4V; file Form 458, refile every 5 years)" }
      ],
      defaultDescription: "No veteran-specific exemption below 100% (general homestead exemption may apply based on income)"
    }
  },

  "NV": {
    name: "Nevada",
    avgPropertyTaxRate: 0.0084,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_amount", value: 34400, description: "$34,400 off assessed value (indexed annually by NV Tax Commission)" },
        { minRating: 80, requiresPT: false, type: "fixed_amount", value: 25800, description: "$25,800 off assessed value (indexed annually)" },
        { minRating: 60, requiresPT: false, type: "fixed_amount", value: 17200, description: "$17,200 off assessed value (indexed annually)" }
      ],
      defaultDescription: "No disability-specific exemption below 60%"
    }
  },

  "NH": {
    name: "New Hampshire",
    avgPropertyTaxRate: 0.0186,
    flagged: true,
    flagNote: "RSA 72:36-a: full exemption for blind/paraplegic/double amputee veterans with VA-assisted specially adapted homestead. RSA 72:35: $700 standard credit for total & permanent disability; towns may adopt $701–$5,000 instead. Credit applies to principal residence only.",
    sources: [
      { label: "Concord NH Disabled Veterans Credit", url: "https://www.concordnh.gov/1084/Disabled-Veterans-Credit" },
      { label: "NH RSA 72:35 (Statute)", url: "https://www.gencourt.state.nh.us/rsa/html/V/72/72-35.htm" }
    ],
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full exemption on specially adapted homestead (blind, paraplegic, or double amputee; VA-assisted home per RSA 72:36-a)" },
        { minRating: 100, requiresPT: false, type: "fixed_tax_credit", value: 700, description: "$700 tax credit (standard; town may adopt up to $5,000 per RSA 72:35)" }
      ],
      defaultDescription: "Standard $50 veterans' credit available (town may adopt up to $750)"
    }
  },

  "NJ": {
    name: "New Jersey",
    avgPropertyTaxRate: 0.0189,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "full", description: "Full annual tax exemption on primary residence (100% P&T during active duty)" },
        { minRating: 0, requiresPT: false, type: "fixed_tax_credit", value: 250, description: "$250 annual property tax deduction (all veterans)" }
      ],
      defaultDescription: "$250 deduction available to all veterans"
    }
  },

  "NM": {
    name: "New Mexico",
    avgPropertyTaxRate: 0.0055,
    veteranExemption: {
      tiers: [
        { minRating: 10, requiresPT: false, type: "percentage", value: 1.0, prorated: true, description: "Exemption = disability rating % of taxable value (e.g., 50% rating = 50% exempt; per DVS Form 1, revised March 2025)" },
        { minRating: 0, requiresPT: false, type: "fixed_amount", value: 10000, description: "$10,000 off taxable value (all qualifying veterans; per DVS Form 1, revised March 2025)" }
      ],
      defaultDescription: "$10,000 exemption available to all qualifying veterans"
    }
  },

  "NY": {
    name: "New York",
    avgPropertyTaxRate: 0.0123,
    flagged: true,
    flagNote: "S1183 (signed Dec 2025, effective Jan 2, 2026) allows municipalities to grant full exemption to 100% disabled veterans — but it's opt-in by locality. Below 100%, the Alternative Veterans' Exemption (RPTL §458-a) provides: 15% off assessed value for wartime service (cap $12K), +10% for combat zone (cap $8K), +half of disability rating off assessed value (cap $40K base, up to $250K in high-appreciation areas). All caps vary by municipality. Must apply by March 1.",
    sources: [
      { label: "NY Veterans Property Tax Exemptions", url: "https://veterans.ny.gov/content/property-tax-exemptions" },
      { label: "NY Tax Dept Alt Veterans' Exemption", url: "https://www.tax.ny.gov/research/property/assess/manuals/vol4/pt2/sec4_01/sec4_01-12.htm" }
    ],
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full exemption if municipality has adopted S1183 (effective 2026); also includes TDIU. Check with local assessor." },
        { minRating: 10, requiresPT: false, type: "fixed_amount", value: 40000, prorated: true, description: "Up to $40,000 off assessed value (half of disability rating × assessed value; cap varies by municipality up to $250K)" }
      ],
      defaultDescription: "Wartime veterans without disability may still qualify for 15% off assessed value (capped by municipality)"
    }
  },

  "NC": {
    name: "North Carolina",
    avgPropertyTaxRate: 0.0078,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_amount", value: 45000, description: "First $45,000 of appraised value exempt (100% or specially adapted housing)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "ND": {
    name: "North Dakota",
    avgPropertyTaxRate: 0.0142,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_tax_credit", value: 8100, description: "$8,100 property tax credit" },
        { minRating: 50, requiresPT: false, type: "fixed_tax_credit", value: 4050, description: "$4,050–$8,100 tax credit (varies by rating)" }
      ],
      defaultDescription: "No veteran exemption below 50%"
    }
  },

  "OH": {
    name: "Ohio",
    avgPropertyTaxRate: 0.0136,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_amount", value: 52300, description: "$52,300 off market value on primary residence (indexed annually)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "OK": {
    name: "Oklahoma",
    avgPropertyTaxRate: 0.0074,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full exemption from ad valorem taxes on primary residence" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "OR": {
    name: "Oregon",
    avgPropertyTaxRate: 0.0087,
    veteranExemption: {
      tiers: [
        { minRating: 40, requiresPT: false, type: "fixed_amount", value: 26303, description: "$26,303–$31,565 off assessed value (varies by income; increases ~3% annually)" }
      ],
      defaultDescription: "No veteran exemption below 40%"
    }
  },

  "PA": {
    name: "Pennsylvania",
    avgPropertyTaxRate: 0.0135,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full exemption on primary residence (must demonstrate financial need; presumed if income <$114,637)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "RI": {
    name: "Rhode Island",
    avgPropertyTaxRate: 0.0135,
    flagged: true,
    flagNote: "RIGL 44-3-4: 7 exemption categories, ALL amounts set by each municipality (no statewide standard). Full exemption only for specially adapted housing (VA-assisted, permanently disabled). Totally disabled (100%) credit varies wildly: $90–$250,000 across 36 municipalities (median $10,000). See RI Municipal Finance Veterans-Senior-Exemptions-Report for your town's amount.",
    sources: [
      { label: "RI Veterans Property Tax Exemptions", url: "https://vets.ri.gov/i-am-find-your-benefits/world-war-ii-korean-war-veteran/property-tax-exemptions" },
      { label: "RI Municipal Finance Exemptions Report", url: "https://municipalfinance.ri.gov/sites/g/files/xkgbur546/files/documents/data/exemptions/Veterans-Senior-Exemptions-Report.pdf" }
    ],
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full exemption on specially adapted housing acquired with VA assistance (RIGL 44-3-4)" },
        { minRating: 100, requiresPT: false, type: "fixed_tax_credit", value: 10000, description: "~$10,000 median credit (actual varies $90–$250,000 by municipality). Check with your town assessor." }
      ],
      defaultDescription: "Basic veteran credit available (amount set by municipality; typically $90–$500)"
    }
  },

  "SC": {
    name: "South Carolina",
    avgPropertyTaxRate: 0.0050,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "full", description: "Full exemption on home and up to 5 acres; also covers up to 2 vehicles" }
      ],
      defaultDescription: "No veteran exemption below 100% P&T"
    }
  },

  "SD": {
    name: "South Dakota",
    avgPropertyTaxRate: 0.0128,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_amount", value: 200000, description: "$200,000 off assessed value on primary residence" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "TN": {
    name: "Tennessee",
    avgPropertyTaxRate: 0.0068,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "fixed_amount", value: 175000, description: "Property tax relief on primary residence (max $175,000 market value for calculation)" }
      ],
      defaultDescription: "No veteran exemption below 100% P&T"
    }
  },

  "TX": {
    name: "Texas",
    avgPropertyTaxRate: 0.0181,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full exemption on homestead (100% or TDIU)" },
        { minRating: 70, requiresPT: false, type: "fixed_amount", value: 12000, description: "$12,000 off assessed value" },
        { minRating: 50, requiresPT: false, type: "fixed_amount", value: 10000, description: "$10,000 off assessed value" },
        { minRating: 30, requiresPT: false, type: "fixed_amount", value: 7500, description: "$7,500 off assessed value" },
        { minRating: 10, requiresPT: false, type: "fixed_amount", value: 5000, description: "$5,000 off assessed value" }
      ],
      defaultDescription: "No veteran exemption at 0%"
    }
  },

  "UT": {
    name: "Utah",
    avgPropertyTaxRate: 0.0060,
    veteranExemption: {
      tiers: [
        { minRating: 10, requiresPT: false, type: "fixed_amount", value: 535459, prorated: true, description: "Up to $535,459 off taxable value, prorated by disability rating (statewide; primary residence + 1 acre; apply by Sept 1)" }
      ],
      defaultDescription: "No veteran exemption at 0%"
    }
  },

  "VT": {
    name: "Vermont",
    avgPropertyTaxRate: 0.0159,
    veteranExemption: {
      tiers: [
        { minRating: 50, requiresPT: false, type: "fixed_amount", value: 40000, description: "Up to $40,000 off grand list (local option; minimum $10,000)" }
      ],
      defaultDescription: "No veteran exemption below 50%"
    }
  },

  "VA": {
    name: "Virginia",
    avgPropertyTaxRate: 0.0074,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "full", description: "Full exemption on primary residence up to 1 acre (apply Jan 1 – Mar 31)" }
      ],
      defaultDescription: "No veteran exemption below 100% P&T"
    }
  },

  "WA": {
    name: "Washington",
    avgPropertyTaxRate: 0.0092,
    flagged: true,
    flagNote: "Income-based program (not a flat exemption). Currently 80%+ disability required; HB 1106 (signed May 2025) lowers to 40%+ for taxes due 2027. Relief = frozen assessed value + exemption from excess/regular levies depending on income tier. Tiers and income limits vary by county. VA disability comp excluded from income calculation. SB5398 (tiered flat exemptions + full at 100%) still in committee — not law.",
    sources: [
      { label: "WA DVA Property Tax Relief", url: "https://www.dva.wa.gov/veterans-their-families/veterans-benefits/housing-resources/property-tax-relief" },
      { label: "WA DOR Property Tax Exemption", url: "https://dor.wa.gov/education/industry-guides/property-tax-exemptions" }
    ],
    veteranExemption: {
      tiers: [
        { minRating: 80, requiresPT: false, type: "percentage", value: 0.30, description: "~30% property tax reduction (estimate; actual varies by county income tier and levy structure). Frozen assessed value + excess levy exemption." }
      ],
      defaultDescription: "No veteran exemption below 80% (drops to 40% in 2027 per HB 1106)"
    }
  },

  "WV": {
    name: "West Virginia",
    avgPropertyTaxRate: 0.0049,
    veteranExemption: {
      tiers: [
        { minRating: 90, requiresPT: true, type: "full", description: "Full property tax credit (DVRPTC, TSD 455; claim via Form DV-1 on income tax return; must pay taxes timely)" }
      ],
      defaultDescription: "No veteran exemption below 90% P&T"
    }
  },

  "WI": {
    name: "Wisconsin",
    avgPropertyTaxRate: 0.0176,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full property tax credit on primary residence ≤1 acre (5-year WI residency or entered service from WI)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "WY": {
    name: "Wyoming",
    avgPropertyTaxRate: 0.0058,
    veteranExemption: {
      tiers: [
        { minRating: 0, requiresPT: false, type: "fixed_amount", value: 6000, description: "$6,000 off assessed value (3-year WY residency required; unused amount applies to vehicle license fee)" }
      ],
      defaultDescription: "$6,000 exemption available to all qualifying veterans"
    }
  },

  "DC": {
    name: "District of Columbia",
    avgPropertyTaxRate: 0.0046,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "fixed_amount", value: 445000, description: "$445,000 off assessed value (household AGI ≤$159,750; must occupy as principal residence with ≥50% ownership)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  // --- U.S. Territories ---

  "PR": {
    name: "Puerto Rico",
    avgPropertyTaxRate: 0.0081,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full exemption on primary residence (≤1,000 sq m urban / 1 cuerda rural)" },
        { minRating: 50, requiresPT: false, type: "fixed_amount", value: 50000, description: "$50,000 off appraised value" },
        { minRating: 0, requiresPT: false, type: "fixed_amount", value: 5000, description: "$5,000 off appraised value (all qualifying veterans)" }
      ],
      defaultDescription: "$5,000 exemption available to all qualifying veterans"
    }
  },

  "GU": {
    name: "Guam",
    avgPropertyTaxRate: 0.0050,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: false, type: "full", description: "Full exemption on primary residence (100% disabled or TDIU)" }
      ],
      defaultDescription: "No veteran exemption below 100%"
    }
  },

  "VI": {
    name: "U.S. Virgin Islands",
    avgPropertyTaxRate: 0.0125,
    veteranExemption: {
      tiers: [
        { minRating: 100, requiresPT: true, type: "full", description: "Full exemption (100% total & permanent)" },
        { minRating: 0, requiresPT: false, type: "fixed_tax_credit", value: 650, description: "$650 tax credit (income <$30K individual / <$50K household)" }
      ],
      defaultDescription: "$650 tax credit available to qualifying veterans (income limits apply)"
    }
  },

  "AS": {
    name: "American Samoa",
    avgPropertyTaxRate: 0.0050,
    veteranExemption: {
      tiers: [],
      defaultDescription: "No veteran property tax exemption program in American Samoa"
    }
  }
};
