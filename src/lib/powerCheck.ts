/** Power headroom check: pure scoring, copy, and URL handoff (no UI). */

export const POWER_CHECK_PARAM = "check";
export const POWER_CHECK_VERSION = "v1";
export const POWER_CHECK_ANSWERS_PARAM = "a";

export const SCORED_QUESTION_IDS = ["q1", "q2", "q3", "q4", "q5"] as const;
export const QUESTION_IDS = [...SCORED_QUESTION_IDS, "q6"] as const;

export type ScoredQuestionId = (typeof SCORED_QUESTION_IDS)[number];
export type QuestionId = (typeof QUESTION_IDS)[number];
export type PowerCheckAnswer = 0 | 1 | 2;
export type PowerCheckAnswers = [
  PowerCheckAnswer,
  PowerCheckAnswer,
  PowerCheckAnswer,
  PowerCheckAnswer,
  PowerCheckAnswer,
  PowerCheckAnswer,
];

export type PowerCheckTier = "blind" | "partial" | "ready";

export type PowerCheckQuestion = {
  id: QuestionId;
  prompt: string;
  options: readonly [string, string, string];
  scored: boolean;
};

export const POWER_CHECK_QUESTIONS: readonly PowerCheckQuestion[] = [
  {
    id: "q1",
    prompt: "Can you see GPU power per device, live?",
    options: ["No", "Facility or rack level only", "Per GPU"],
    scored: true,
  },
  {
    id: "q2",
    prompt: "Do you track goodput (tokens that met your latency SLO), not just utilization?",
    options: ["No", "Partly", "Yes"],
    scored: true,
  },
  {
    id: "q3",
    prompt: "Can you see queue depth and KV-cache occupancy alongside power?",
    options: ["No", "One of them", "Both, on one timeline"],
    scored: true,
  },
  {
    id: "q4",
    prompt: "If you lowered power caps by 20% tomorrow, could you predict what happens to TTFT?",
    options: ["No idea", "Rough guess", "Yes, measured"],
    scored: true,
  },
  {
    id: "q5",
    prompt: "Have you tested a power cap on production-like traffic, with rollback?",
    options: ["Never", "Once, informally", "Yes, routinely"],
    scored: true,
  },
  {
    id: "q6",
    prompt: "Is power a constraint for you?",
    options: [
      "Not yet",
      "Expanding soon or power-limited site",
      "Grid curtailment or a flexible connection is on the table",
    ],
    scored: false,
  },
];

const GAP_LINES: Record<ScoredQuestionId, { weak: string; partial: string }> = {
  q1: {
    weak: "Without per-GPU power you can't tie watts to the work being done.",
    partial:
      "Aggregate power hides hot devices: a cap can look safe on average while individual GPUs throttle.",
  },
  q2: {
    weak: "Without goodput, utilization counts busy time, not tokens that met your SLO.",
    partial:
      "Incomplete goodput leaves blind spots: caps can preserve utilization while goodput falls.",
  },
  q3: {
    weak: "Without queue and KV on one timeline you can't see which part of serving a cap affects first.",
    partial:
      "Split signals for queue and KV make cause and effect hard: you won't know whether a cap is building the queue or filling the KV cache first.",
  },
  q4: {
    weak: "Without a measured cap response, headroom is a forecast, not a number you can defend.",
    partial:
      "A rough guess tends to miss the tail: P99 TTFT can move under a cap before the average does.",
  },
  q5: {
    weak: "Without controlled cap tests, the first real experiment is still in production.",
    partial:
      "Without trials on production-like traffic with rollback, your next cap change is a live experiment.",
  },
};

const TIER_COPY: Record<
  PowerCheckTier,
  { title: string; body: string; minScore: number; maxScore: number }
> = {
  blind: {
    minScore: 0,
    maxScore: 3,
    title: "Flying blind",
    body:
      "You're watching utilization and facility power. Your power decisions today rest mostly on estimates. Start with a baseline.",
  },
  partial: {
    minScore: 4,
    maxScore: 7,
    title: "Partial visibility",
    body:
      "You can see load, but not the state that decides what a power cap will do. That gap is a common source of unsafe caps and missed headroom.",
  },
  ready: {
    minScore: 8,
    maxScore: 10,
    title: "Ready to reclaim",
    body:
      "You have the signals. What's left is measuring the response under controlled tests to see how much headroom you actually have.",
  },
};

const URGENCY_LINES: Record<PowerCheckAnswer, string> = {
  0: "As inference grows, power can become the limit before hardware does. Setting up the telemetry now is cheaper than adding it once power is tight.",
  1: "You are growing inside a fixed MW envelope. Extra capacity usually shows up first as watts you already pay for but do not turn into SLO-good work. The question is how much throughput you can recover there before you order more racks or a larger power feed.",
  2: "You'll need to know what load you can shed, and at what latency cost. Rank workloads by power and SLO risk before the first curtailment event.",
};

export const MAIN_CONCERN_BY_Q6: Record<PowerCheckAnswer, string> = {
  0: "Not sure yet",
  1: "More capacity within our power envelope",
  2: "Grid connection or curtailment",
};

export const NO_GAPS_MESSAGE = "No visibility gaps from your answers.";
export const POWER_CHECK_MAX_SCORE = 10;

export type PowerCheckResult = {
  answers: PowerCheckAnswers;
  score: number;
  maxScore: typeof POWER_CHECK_MAX_SCORE;
  tier: PowerCheckTier;
  title: string;
  body: string;
  gaps: string[];
  gapsMessage: string;
  urgencyLine: string;
  mainConcern: string;
};

export function isPowerCheckAnswer(value: number): value is PowerCheckAnswer {
  return value === 0 || value === 1 || value === 2;
}

export function scorePowerCheck(answers: PowerCheckAnswers): number {
  return answers[0] + answers[1] + answers[2] + answers[3] + answers[4];
}

export function tierFromScore(score: number): PowerCheckTier {
  if (score <= 3) return "blind";
  if (score <= 7) return "partial";
  return "ready";
}

export function gapsFromAnswers(answers: PowerCheckAnswers): string[] {
  const gaps: string[] = [];
  for (let i = 0; i < SCORED_QUESTION_IDS.length; i += 1) {
    const value = answers[i];
    if (value === 0 || value === 1) {
      const id = SCORED_QUESTION_IDS[i];
      gaps.push(value === 0 ? GAP_LINES[id].weak : GAP_LINES[id].partial);
    }
  }
  return gaps;
}

export function evaluatePowerCheck(answers: PowerCheckAnswers): PowerCheckResult {
  const score = scorePowerCheck(answers);
  const tier = tierFromScore(score);
  const { title, body } = TIER_COPY[tier];
  const gaps = gapsFromAnswers(answers);
  const q6 = answers[5];

  return {
    answers,
    score,
    maxScore: POWER_CHECK_MAX_SCORE,
    tier,
    title,
    body,
    gaps,
    gapsMessage: gaps.length ? "" : NO_GAPS_MESSAGE,
    urgencyLine: URGENCY_LINES[q6],
    mainConcern: MAIN_CONCERN_BY_Q6[q6],
  };
}

export function encodeAnswers(answers: PowerCheckAnswers): string {
  return answers.join(",");
}

export function decodeAnswers(searchParams: URLSearchParams): PowerCheckAnswers | null {
  if (searchParams.get(POWER_CHECK_PARAM) !== POWER_CHECK_VERSION) {
    return null;
  }
  const raw = searchParams.get(POWER_CHECK_ANSWERS_PARAM);
  if (!raw) return null;

  const parts = raw.split(",");
  if (parts.length !== 6) return null;

  const parsed: number[] = [];
  for (const part of parts) {
    if (!/^\d+$/.test(part.trim())) return null;
    const n = Number(part);
    if (!isPowerCheckAnswer(n)) return null;
    parsed.push(n);
  }

  return parsed as PowerCheckAnswers;
}

export type PowerCheckSubmissionPayload = {
  version: typeof POWER_CHECK_VERSION;
  answers: PowerCheckAnswers;
  score: number;
  tier: PowerCheckTier;
};

export function buildPowerCheckSubmissionPayload(
  answers: PowerCheckAnswers,
): PowerCheckSubmissionPayload {
  return {
    version: POWER_CHECK_VERSION,
    answers,
    score: scorePowerCheck(answers),
    tier: tierFromScore(scorePowerCheck(answers)),
  };
}

export function formatPowerCheckEmailSummary(result: PowerCheckResult): string {
  const lines = [
    "Power headroom check (from joule.lat)",
    `Result: ${result.title} (${result.score}/${result.maxScore})`,
    result.urgencyLine,
  ];
  if (result.gaps.length) {
    lines.push("Gaps:");
    result.gaps.forEach((gap) => lines.push(`- ${gap}`));
  } else {
    lines.push(result.gapsMessage);
  }
  return lines.join("\n");
}

export function formatScopingCheckSummary(result: PowerCheckResult): string {
  return `From your power headroom check: ${result.title} (${result.score} / ${result.maxScore})`;
}

export function scopingSearchFromAnswers(answers: PowerCheckAnswers): string {
  const params = new URLSearchParams();
  params.set(POWER_CHECK_PARAM, POWER_CHECK_VERSION);
  params.set(POWER_CHECK_ANSWERS_PARAM, encodeAnswers(answers));
  return params.toString();
}

/** Map UI step answers keyed by question id to ordered tuple. */
export function answersRecordToTuple(
  byId: Partial<Record<QuestionId, PowerCheckAnswer>>,
): PowerCheckAnswers | null {
  const tuple: PowerCheckAnswer[] = [];
  for (const id of QUESTION_IDS) {
    const value = byId[id];
    if (value === undefined || !isPowerCheckAnswer(value)) return null;
    tuple.push(value);
  }
  return tuple as PowerCheckAnswers;
}
