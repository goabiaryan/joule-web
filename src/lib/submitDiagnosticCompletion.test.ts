import { describe, expect, it } from "vitest";
import { evaluatePowerCheck } from "./powerCheck.js";
import { encodeDiagnosticCompletionBody } from "./submitDiagnosticCompletion.js";

describe("submitDiagnosticCompletion", () => {
  it("encodes lead payload with contact_provided=yes", () => {
    const result = evaluatePowerCheck([0, 0, 0, 0, 0, 1]);
    const body = encodeDiagnosticCompletionBody(result, {
      contactProvided: true,
      email: "ops@example.com",
      role: "VP Infra",
    });
    expect(body).toContain("form-name=diagnostic-completion");
    expect(body).toContain("contact_provided=yes");
    expect(body).toContain("email=ops");
    expect(body).toContain("headroomCheckSummary=");
  });
});
