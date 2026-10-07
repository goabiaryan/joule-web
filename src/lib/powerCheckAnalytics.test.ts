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

  it("sendBeacon posts analytics form with kind and no email field", () => {
    trackPowerCheckEvent({
      kind: "completed",
      tier: "partial",
      score: 4,
      q6: 2,
      gapCount: 3,
    });
    expect(navigator.sendBeacon).toHaveBeenCalledOnce();
    const [, blob] = vi.mocked(navigator.sendBeacon).mock.calls[0];
    expect(blob).toBeInstanceOf(Blob);
  });

  it("uses power-check-analytics form name in encoded body", () => {
    const params = new URLSearchParams();
    params.set("form-name", POWER_CHECK_ANALYTICS_FORM);
    expect(POWER_CHECK_ANALYTICS_FORM).toBe("power-check-analytics");
  });
});
