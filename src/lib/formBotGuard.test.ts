import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  HONEYPOT_FIELD,
  TRAP_FIELD,
  markFormReady,
  validateHumanSubmit,
} from "./formBotGuard.js";

function mockStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    clear: () => store.clear(),
  };
}

describe("formBotGuard", () => {
  beforeEach(() => {
    vi.stubGlobal("window", globalThis);
    vi.stubGlobal("sessionStorage", mockStorage());
    vi.stubGlobal("localStorage", mockStorage());
    markFormReady("test-form", Date.now() - 10_000);
  });

  it("rejects honeypot fills silently", () => {
    const result = validateHumanSubmit("test-form", { [HONEYPOT_FIELD]: "spam" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.silent).toBe(true);
  });

  it("rejects trap field fills silently", () => {
    const result = validateHumanSubmit("test-form", { [TRAP_FIELD]: "https://evil.test" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.silent).toBe(true);
  });

  it("accepts clean submit after min time", () => {
    const result = validateHumanSubmit("test-form", {}, { minMs: 1000 });
    expect(result).toEqual({ ok: true });
  });
});
