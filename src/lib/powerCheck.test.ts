import { describe, expect, it } from "vitest";
import {
  decodeAnswers,
  encodeAnswers,
  evaluatePowerCheck,
  gapsFromAnswers,
  scorePowerCheck,
  tierFromScore,
  type PowerCheckAnswers,
} from "./powerCheck.js";

describe("scorePowerCheck", () => {
  it("ignores q6", () => {
    const base: PowerCheckAnswers = [2, 2, 2, 2, 2, 0];
    const withQ6Two: PowerCheckAnswers = [2, 2, 2, 2, 2, 2];
    expect(scorePowerCheck(base)).toBe(10);
    expect(scorePowerCheck(withQ6Two)).toBe(10);
  });
});

describe("tierFromScore", () => {
  it("uses blind, partial, and ready boundaries", () => {
    expect(tierFromScore(3)).toBe("blind");
    expect(tierFromScore(4)).toBe("partial");
    expect(tierFromScore(7)).toBe("partial");
    expect(tierFromScore(8)).toBe("ready");
  });
});

describe("gapsFromAnswers", () => {
  it("includes only q1–q5 answers of 0 or 1, in order", () => {
    const answers: PowerCheckAnswers = [0, 1, 2, 0, 1, 2];
    const gaps = gapsFromAnswers(answers);
    expect(gaps).toHaveLength(4);
    expect(gaps[0]).toContain("per-GPU power");
    expect(gaps[1]).toContain("goodput falls");
    expect(gaps[2]).toContain("measured cap response");
    expect(gaps[3]).toContain("production-like traffic");
  });
});

describe("encodeAnswers / decodeAnswers", () => {
  it("round-trips", () => {
    const answers: PowerCheckAnswers = [2, 1, 0, 1, 0, 2];
    const params = new URLSearchParams();
    params.set("check", "v1");
    params.set("a", encodeAnswers(answers));
    expect(decodeAnswers(params)).toEqual(answers);
  });

  it("rejects wrong version", () => {
    const params = new URLSearchParams("check=v2&a=2,1,0,1,0,2");
    expect(decodeAnswers(params)).toBeNull();
  });

  it("rejects wrong length", () => {
    const params = new URLSearchParams("check=v1&a=2,1,0");
    expect(decodeAnswers(params)).toBeNull();
  });

  it("rejects values outside 0..2", () => {
    const params = new URLSearchParams("check=v1&a=2,1,0,1,0,3");
    expect(decodeAnswers(params)).toBeNull();
  });

  it("rejects non-integers", () => {
    const params = new URLSearchParams("check=v1&a=2,1.5,0,1,0,2");
    expect(decodeAnswers(params)).toBeNull();
  });
});

describe("evaluatePowerCheck", () => {
  it("matches example partial tier at 6/10", () => {
    const answers: PowerCheckAnswers = [2, 1, 0, 1, 0, 2];
    const result = evaluatePowerCheck(answers);
    expect(result.score).toBe(4);
    expect(result.tier).toBe("partial");
    expect(result.title).toBe("Partial visibility");
  });
});
