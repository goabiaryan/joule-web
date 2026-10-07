/** Canonical copy for joule.lat: Phase 1 product and assessment motion. */

export const BRAND_NAME = "Joule";
export const BRAND_DOMAIN = "joule.lat";
/** Hero + page title; appears once on the home page (h1). */
export const BRAND_HEADLINE = "Efficiency down to the metal.";
/** Header and footer subline (once each). */
export const BRAND_TAGLINE = "More capacity on the power you already have.";
export const BRAND_CATEGORY = "Inference power economics";

const META_LEDE =
  "See which watts in your inference fleet are safe to reclaim, and which ones would break your SLOs.";

/** Crawlers, meta tags, and llms.txt should match this narrative. */
export const brandMeta = {
  name: BRAND_NAME,
  domain: BRAND_DOMAIN,
  siteUrl: `https://${BRAND_DOMAIN}/`,
  tagline: BRAND_HEADLINE,
  documentTitle: `${BRAND_NAME} · ${BRAND_HEADLINE}`,
  metaDescription: `${BRAND_HEADLINE} ${META_LEDE}`,
  schemaDescription: `${BRAND_HEADLINE} ${META_LEDE} Phase-aware inference power economics on your infrastructure.`,
  shareImageAlt: `${BRAND_NAME}: ${BRAND_HEADLINE} Phase-aware inference power economics and SLO goodput.`,
  slogan: BRAND_HEADLINE,
  contactEmail: "hello@joule.lat",
};

export const ASSESSMENT_FORM_OPTIONS = {
  fleetSize: [
    "Under 256 GPUs",
    "256–2,000 GPUs",
    "2,000+ GPUs",
    "Not sure",
  ],
  gpuTypes: [
    "NVIDIA H100/H200",
    "NVIDIA B200/GB200",
    "AMD Instinct",
    "Other",
  ],
  servingEngines: ["vLLM", "SGLang", "TensorRT-LLM", "Other"],
  mainConcern: [
    "More capacity within our power envelope",
    "Grid connection or curtailment",
    "Cost per token",
    "Not sure yet",
  ],
  timeline: ["This quarter", "Next quarter", "Exploring"],
};

export const INTAKE_FORMS = {
  assessment: {
    path: "/scoping",
    formName: "power-slo-assessment",
    eyebrow: "Power & SLO assessment",
    title: "Request an assessment",
    intro: "Tell us about your fleet. We use this to scope the engagement before a short call.",
    submitLabel: "Request an assessment",
    successMessage:
      "Thanks. We'll reply within two business days to set up a scoping call.",
  },
};

export const SCOPING_CTA = {
  label: "Request an assessment",
  buttonLabel: "Request an assessment",
  href: import.meta.env.VITE_SCOPING_CTA_URL || INTAKE_FORMS.assessment.path,
  qrTarget: "https://joule.lat/scoping",
  contactEmail: "hello@joule.lat",
};

export const phase1Product = {
  brand: BRAND_NAME,
  hero: {
    eyebrow: BRAND_CATEGORY,
    titleLine1: "Efficiency down to the",
    titleEmphasis: "metal.",
    lede: META_LEDE,
    signals: [
      { icon: "zap", label: "$/M tokens beside SLOs" },
      { icon: "radar", label: "Prefill vs decode attribution" },
      { icon: "shield", label: "Safe power headroom" },
      { icon: "activity", label: "Goodput per watt" },
    ],
    visual: {
      src: "/images/hero-signal-panel.svg",
      alt: "Illustrative panel: prefill and decode latency traces, GPU power line, and goodput metrics.",
    },
  },

  illustrations: {
    utilizationGoodput: {
      src: "/images/3-utilization-vs-goodput-dark.svg",
      alt: "Comparison of GPU utilization versus Joule goodput over sixty seconds, showing busy time is not the same as SLO-meeting token output.",
    },
    infrastructureBoundary: {
      src: "/images/joule-runs-in-your-tenant.svg",
      alt: "Diagram: Joule runtime in your tenant reads serving metrics and device power. Readouts stay in your accounts with no default egress to Joule. Power caps only with your approval and automatic rollback.",
    },
  },

  problem: {
    eyebrow: "Why it matters",
    title: "The Measurement Gap",
    bridge:
      "Facility telemetry sees megawatts. Serving metrics see tokens and latency. Neither alone tells you what a power decision will cost.",
    facility: {
      stateLabel: "State: Blind Spot",
      columnTitle: "Facility & DCGM Telemetry",
      columnHint: "Gross signal · Megawatts and raw utilization without serving context",
      insights: [
        {
          title: "Gross utilization is deceptive",
          body:
            "High GPU % often hides head-of-line blocking, KV-cache preemption, and memory-bound idle bubbles rather than productive tokens.",
        },
        {
          title: "Facility meters stop at the rack",
          body:
            "Reports megawatt draw at the PDU, but lacks visibility into TTFT, TPOT, and per-token efficiency trade-offs.",
        },
      ],
    },
    joule: {
      stateLabel: "State: Joule Runtime Telemetry",
      columnTitle: "Serving runtime & device power",
      columnHint:
        "Per-token signal · Watts tied to TTFT, TPOT and the requests behind them",
      insights: [
        {
          title: "Goodput, not utilization",
          body:
            "Counts the tokens that met the SLO, and splits the rest into queueing, low-batch decode, preemption and idle. Prefill and decode power estimated separately.",
        },
        {
          title: "Headroom you can trust",
          body:
            "Reads the state that decides what a power cap will do (KV occupancy, queue depth, cache contents) and flags where telemetry alone can't tell.",
        },
      ],
    },
  },

  audience: {
    eyebrow: "Who it's for",
    title: "Built For",
    bridge: "Operators, inference leads and finance teams share one fleet. They need different readouts from the same signal.",
    profiles: [
      {
        id: "inference",
        icon: "chip",
        scopeTag: "Runtimes",
        title: "Production Inference Leads",
        body:
          "Engineers running high-throughput LLM serving who need to know what a power, batching or caching change will do to TTFT and TPOT before it ships.",
        footer: "vLLM · SGLang · Prefill/decode attribution",
      },
      {
        id: "colo",
        icon: "server",
        scopeTag: "Capacity",
        title: "Neoclouds & AI Hosts",
        body:
          "Operators running managed inference, or hosting tenants who opt in, who need more sellable capacity inside a fixed power envelope and curtailment that doesn't break tenant SLOs.",
        footer: "Managed inference · Power envelope · SLO-safe curtailment",
      },
      {
        id: "capex",
        icon: "chart",
        scopeTag: "Unit Economics",
        title: "Capacity & Finance Leads",
        body:
          "Turns megawatts into $/M tokens, and shows how much power headroom is safely recoverable for more capacity or for grid flexibility.",
        footer: "$/M tokens · Tokens/W · Safe power headroom",
      },
    ],
  },

  stack: {
    eyebrow: "How it works",
    title: "How Joule works",
    bridge: "Three steps. Nothing changes in production until you approve it.",
    pillars: [
      {
        id: "OBSERVE",
        items: [
          "Shadow mode on your serving runtime alongside device power: KV occupancy, queue depth, cache and watts. No production writes. Telemetry stays on your infrastructure.",
        ],
      },
      {
        id: "ATTRIBUTE",
        items: [
          "Estimates power by inference phase and ties physical draw to TTFT, TPOT and goodput, not raw utilization.",
        ],
      },
      {
        id: "DECIDE",
        items: [
          "Safe power headroom: where capacity can be reclaimed and where a cap would break SLOs. Trade-offs are measured with controlled tests on a pool you choose, with automatic rollback, including on-demand load shedding and its latency cost.",
        ],
      },
    ],
  },

  engagements: {
    eyebrow: "Engagement",
    title: "Get started",
    bridge: "Start with a fixed-fee assessment. Scope ongoing work once you have the numbers.",
    start: {
      eyebrow: "Phase 1",
      heading: "Start with an assessment",
      body:
        "In six weeks, we measure how much power your fleet can safely give up, what that capacity is worth, and where the limits are.",
      outcomes: ["Recoverable capacity", "Safe power headroom", "SLO risk map"],
      detail:
        "Shadow mode first, then controlled tests with automatic rollback. Nothing changes in production without your approval, and your telemetry stays on your infrastructure.",
    },
    then: {
      eyebrow: "What's next",
      heading: "Then keep it running.",
      body: "Continuous measurement and control as your fleet, traffic and engines change.",
    },
    fixedFeeLine: "Fixed-fee engagements, scoped to your fleet.",
  },

  deliverablesSection: {
    eyebrow: "Phase 1 output",
    title: "Deliverables",
    bridge: "What you get at the end of six weeks.",
  },

  deliverables: [
    {
      title: "Serving Economics Baseline",
      badge: "Baseline",
      body:
        "Documented readout of physical power draw and $/M tokens across your production traffic shapes, contrasting actual serving cost against gross device utilization.",
      output: "$/M tokens · Tokens/W · Prefill vs. decode attribution",
    },
    {
      title: "Recoverable Capacity Report",
      badge: "Audit",
      body:
        "Prioritized map of recoverable capacity: where power headroom is safe to reclaim, where telemetry alone is ambiguous, and where caps would break SLOs, covering idle bubbles, inefficient batch regimes, and estimated decode-heavy phases.",
      output: "Recoverable capacity · Safe headroom · Ambiguity flags",
    },
    {
      title: "Policy Scenarios & Controlled Tests",
      badge: "Evaluation",
      body:
        "Batching, prefix-cache and power-cap scenarios, measured with controlled tests on a pool you choose or on a replica with your recorded traffic, alongside offline simulation. Always with automatic rollback.",
      output: "Policy evaluation matrix · Measured vs. predicted response",
    },
    {
      title: "SLOs & Energy Unified View",
      badge: "Dashboard",
      body:
        "Unified view of TTFT, TPOT, and P99 beside $/M tokens and goodput per watt, shared in program readouts and invited review sessions.",
      output: "Gated Telemetry Dashboard · Correlated SLO Timeline",
    },
  ],

  principal: {
    line: "Joule is built by Abi Aryan and team.",
    linkLabel: "Full bio, books, and speaking",
    linkHref: "https://abiaryan.com",
  },

  footer: {
    line: BRAND_DOMAIN,
    contactEmail: brandMeta.contactEmail,
    legal: `© ${new Date().getFullYear()} Bruma Celeste Unipessoal Lda.`,
    tagline: BRAND_TAGLINE,
  },
};
