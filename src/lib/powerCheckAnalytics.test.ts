import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  getPowerCheckSessionId,
  POWER_CHECK_ANALYTICS_FORM,
  resetPowerCheckSessionId,
  trackPowerCheckEvent,
} from "./powerCheckAnalytics.js";

function mockStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    clear: () => store.clear(),
  };
}

describe("powerCheckAnalytics", () => {
  beforeEach(() => {
    vi.stubGlobal("window", globalThis);
    vi.stubGlobal("sessionStorage", mockStorage());
    vi.stubGlobal("localStorage", mockStorage());
    vi.stubGlobal("navigator", { sendBeacon: vi.fn(() => true) });
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("persists session id in sessionStorage", () => {
    const a = getPowerCheckSessionId();
    const b = getPowerCheckSessionId();
    expect(a).toBe(b);
    expect(a.length).toBeGreaterThan(8);
  });

  it("resetPowerCheckSessionId starts a new session", () => {
    const a = getPowerCheckSessionId();
    const b = resetPowerCheckSessionId();
    expect(b).not.toBe(a);
  });

  it("never POSTs to Netlify (no sendBeacon or fetch)", () => {
    trackPowerCheckEvent({ kind: "started" });
    trackPowerCheckEvent({
      kind: "answer",
      questionId: "q1",
      answerValue: 0,
      stepIndex: 0,
    });
    trackPowerCheckEvent({
      kind: "completed",
      tier: "partial",
      score: 4,
      q6: 2,
      gapCount: 3,
    });
    trackPowerCheckEvent({ kind: "scoping_click", tier: "partial" });
    expect(navigator.sendBeacon).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("uses power-check-analytics form name constant for Netlify registration", () => {
    expect(POWER_CHECK_ANALYTICS_FORM).toBe("power-check-analytics");
  });
});
