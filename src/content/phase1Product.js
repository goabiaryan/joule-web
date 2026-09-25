/** Canonical copy for joule.lat: Phase 1 product and design partner motion. */

export const INTAKE_FORMS = {
  designPartner: {
    path: "/scoping",
    formName: "design-partner-program",
    eyebrow: "Design partner program",
    title: "Request design partner program",
    intro:
      "Share your inference stack and goals. We reply with scope and deliverables before any install.",
    contextLabel: "Context",
    contextPlaceholder:
      "Runtime (vLLM, SGLang, etc.), cluster scale, SLOs, and what you want to improve ($/M tokens, tokens/W, capacity).",
    submitLabel: "Submit request",
    successMessage:
      "Received. We will follow up with scope and next steps at the email you provided.",
  },
  retainer: {
    path: "/retainer",
    formName: "retainer-inquiry",
    eyebrow: "Ongoing telemetry program",
    title: "Discuss ongoing telemetry program",
    intro:
      "For teams with a completed program or verified baseline. Tell us your upgrade cadence and review needs.",
    contextLabel: "What you need ongoing",
    contextPlaceholder:
      "Telemetry goals, traffic patterns, config review cadence, and who joins working sessions.",
    submitLabel: "Submit inquiry",
    successMessage:
      "Received. We will follow up to confirm fit and program scope.",
  },
};

export const SCOPING_CTA = {
  label: "Design partner program",
  buttonLabel: "Request Design Partner Program",
  href: import.meta.env.VITE_SCOPING_CTA_URL || INTAKE_FORMS.designPartner.path,
  qrTarget: "https://joule.lat/scoping",
  contactEmail: "hello@joule.lat",
};

export const RETAINER_CTA = {
  buttonLabel: "Discuss Ongoing Program",
  href: import.meta.env.VITE_RETAINER_CTA_URL || INTAKE_FORMS.retainer.path,
};

export const phase1Product = {
  brand: "Joule.Latency",
  hero: {
    eyebrow: "Inference power intelligence",
    titleLine1: "Phase-aware inference",
    titleEmphasis: "power economics.",
    lede:
      "Facility meters report total GPU draw at the rack. Joule ties that draw to each LLM request and to cost per million tokens.",
    keywords: ["$/M tokens", "tokens/W", "TTFT", "TPOT"],
    signals: [
      { icon: "zap", label: "$/M tokens beside SLOs" },
      { icon: "radar", label: "Prefill vs decode" },
      { icon: "shield", label: "What-if within SLO limits" },
      { icon: "activity", label: "Energy and latency trade-offs" },
    ],
  },

  problem: {
    title: "The Measurement Gap",
    facility: {
      stateLabel: "State: Blind Spot",
      columnTitle: "Facility & DCGM Telemetry",
      columnHint: "Gross signal · Megawatts and raw utilization without serving context",
      insights: [
        {
          title: "Gross utilization is deceptive",
          body:
            "High GPU % often hides queueing locks, KV-cache thrashing, and memory-bound idle bubbles rather than productive tokens.",
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
      columnTitle: "Phase-Aware Economics",
      columnHint: "Token economics · Prefill vs. decode attribution on the serving path",
      insights: [
        {
          title: "Prefill vs. decode separation",
          body:
            "Classifies power draw by inference phase to pinpoint exact decode-heavy waste and un-optimized batch regimes.",
        },
        {
          title: "Recoverable spend mapping",
          body:
            "Ties $/M tokens and tokens/watt directly to SLO attainment, simulating policy trade-offs before touching production clusters.",
        },
      ],
    },
  },

  audience: {
    title: "Built For",
    profiles: [
      {
        id: "inference",
        icon: "chip",
        scopeTag: "Runtimes",
        title: "Production Inference Leads",
        body:
          "Engineers managing high-throughput LLM clusters seeking phase-level prefill and decode attribution.",
        footer: "TRT-LLM · TorchDynamo · SGLang/vLLM",
      },
      {
        id: "colo",
        icon: "server",
        scopeTag: "Capacity",
        title: "Neoclouds & GPU Colo",
        body:
          "GPU colo and neocloud operators who host production LLM serving and need tenant-facing $/M tokens and tokens/W, not rack megawatts alone.",
        footer: "Inference tenants · Phase economics · SLO-safe capacity",
      },
      {
        id: "capex",
        icon: "chart",
        scopeTag: "Unit Economics",
        title: "Hyperscale Capex Directors",
        body:
          "Platform leaders managing multi-million-dollar compute budgets wanting to maximize goodput per watt.",
        footer: "$/M tokens · Tokens/W · P99 SLO Defense",
      },
    ],
  },

  stack: {
    title: "How Joule works",
    pillars: [
      {
        id: "DEPLOY",
        title: "Measure in your perimeter",
        items: [
          "Licensed joule-agent and joule-core run on agreed isolated hosts in your VPC. Operated by Joule under your security rules.",
          "Telemetry stays in your tenant. No default export to Joule systems.",
          "We align on scope and data handling before anything goes live.",
        ],
      },
      {
        id: "MEASURE",
        title: "Tie power to live inference",
        items: [
          "Each request is tracked with tokens, batch size, and latency, not facility totals alone.",
          "GPU draw and utilization are linked to useful output on the serving path.",
          "You see recoverable spend mapped against the SLOs you care about.",
        ],
      },
      {
        id: "SIMULATE",
        title: "Stress-test policies offline",
        items: [
          "Model batching, clock speed, prefix cache, and routing on your traffic history.",
          "Phase 1 is evaluation-only: no automatic changes to production controls.",
          "Working sessions and readouts with your team throughout the program.",
        ],
      },
    ],
  },

  engagements: {
    title: "Engagements",
  },

  designPartnerProgram: {
    label: "Design partner program",
    feeAmount: "$25,000",
    feeTail: " USD flat · 8-week technical deployment",
    feeFootnote: "Excl. VAT · USD or EUR invoice",
    items: [
      "In-perimeter deployment of licensed joule-agent and joule-core on isolated nodes",
      "Baseline prefill vs. decode split correlated with physical PDU power draw",
      "Recoverable spend mapping ($/M tokens, tokens/W, and goodput under P99 SLOs)",
      "SLO-safe policy simulation matrix and executive findings roadmap",
    ],
  },

  retainer: {
    label: "Ongoing telemetry program",
    feeLead: "From ",
    feeAmount: "$8,000",
    feeTail: " USD / month · 6-month or annual commitment",
    feeFootnote: "Excl. VAT · USD or EUR invoice",
    items: [
      "Persistent telemetry monitoring across cluster upgrades and traffic shifts",
      "2× monthly working sessions with platform engineering and infrastructure leads",
      "Asynchronous review of runtime configurations, batching policies, and engine migrations",
      "Requires completed Design Partner Program or verified telemetry baseline",
    ],
  },

  deliverablesSection: {
    title: "Deliverables",
  },

  deliverables: [
    {
      title: "Serving Economics Baseline",
      badge: "Baseline",
      body:
        "Documented readout of physical power draw and $/M tokens across your production traffic shapes, contrasting actual serving cost against gross device utilization.",
      output: "$/M tokens · Tokens/W · Prefill vs. Decode Split",
    },
    {
      title: "Recoverable Spend Report",
      badge: "Audit",
      body:
        "Prioritized audit of inference path waste: idle bubbles, sub-optimal dynamic batch regimes, and decode-heavy churn mapped to recoverable compute spend.",
      output: "Quantified Recoverable Spend Model",
    },
    {
      title: "Policy Scenarios & Simulation",
      badge: "Simulation",
      body:
        "Offline simulation of dynamic batching, prefix-cache thresholds, and clock frequencies against historical traces before making any production cluster changes.",
      output: "Policy Evaluation Matrix (Zero Write-Back)",
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

  contactIntro:
    "We share scope and deliverables before we start. Questions?",

  footer: {
    line: "Joule.Latency",
    legal: `© ${new Date().getFullYear()} Bruma Celeste Unipessoal Lda.`,
    tagline: "Inference Power Intelligence",
  },
};
