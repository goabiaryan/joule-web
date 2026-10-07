import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { evaluatePowerCheck } from "./powerCheck.js";
import { submitDiagnosticCompletion } from "./submitDiagnosticCompletion.js";

function mockStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    clear: () => store.clear(),
  };
}

describe("submitDiagnosticCompletion", () => {
  beforeEach(() => {
    vi.stubGlobal("window", globalThis);
    vi.stubGlobal("sessionStorage", mockStorage());
    vi.stubGlobal("localStorage", mockStorage());
    vi.stubGlobal("navigator", { sendBeacon: vi.fn(() => true) });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("beacons result-only payload when contact not provided", async () => {
    const result = evaluatePowerCheck([0, 0, 0, 0, 0, 1]);
    submitDiagnosticCompletion(result, { contactProvided: false });
    expect(navigator.sendBeacon).toHaveBeenCalledOnce();
    const [, blob] = vi.mocked(navigator.sendBeacon).mock.calls[0];
    const text = await (blob as Blob).text();
    expect(text).toContain("contact_provided=no");
    expect(text).toContain("form-name=diagnostic-completion");
    expect(text).toContain("headroomCheckSummary=");
  });
});
