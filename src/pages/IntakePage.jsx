import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBrandMeta } from "../hooks/useBrandMeta.js";
import {
  buildPowerCheckSubmissionPayload,
  decodeAnswers,
  evaluatePowerCheck,
  formatScopingCheckSummary,
} from "../lib/powerCheck.ts";
import FormRequiredMark from "../components/FormRequiredMark.jsx";
import { trackPowerCheckEvent } from "../lib/powerCheckAnalytics.ts";
import {
  FORM_RATE_LIMIT_MESSAGE,
  TRAP_FIELD,
  markFormReady,
  recordNetlifyFormSubmit,
  validateHumanSubmit,
} from "../lib/formBotGuard.js";
import {
  ASSESSMENT_FORM_OPTIONS,
  brandMeta,
  INTAKE_FORMS,
} from "../content/phase1Product.js";

function encodeFormBody(formName, data) {
  const params = new URLSearchParams();
  params.set("form-name", formName);
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) {
      params.set(key, value);
    }
  }
  return params.toString();
}

function AssessmentIntakeForm({ checkResult, config, onClearCheck, status, setStatus, setError }) {
  const initial = useMemo(
    () => ({
      name: "",
      email: "",
      company: "",
      fleetSize: "",
      powerMw: "",
      gpuTypes: "",
      servingEngines: "",
      mainConcern: checkResult?.mainConcern ?? "",
      timeline: "",
      anythingElse: "",
      power_check: checkResult
        ? JSON.stringify(buildPowerCheckSubmissionPayload(checkResult.answers))
        : "",
      "bot-field": "",
      [TRAP_FIELD]: "",
    }),
    [checkResult],
  );
  const [fields, setFields] = useState(initial);

  useEffect(() => {
    markFormReady(config.formName);
  }, [config.formName]);
  const [gpuTypes, setGpuTypes] = useState([]);
  const [servingEngines, setServingEngines] = useState([]);
  const [formError, setFormError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCheckbox = (group, value, setter) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFormError("");

    if (!gpuTypes.length) {
      setFormError("Select at least one GPU type.");
      return;
    }
    if (!servingEngines.length) {
      setFormError("Select at least one serving engine.");
      return;
    }

    const guard = validateHumanSubmit(config.formName, fields, { minMs: 4000 });
    if (!guard.ok) {
      if (guard.silent) {
        setStatus("success");
        window.history.replaceState({}, "", `${config.path}?submitted=1`);
        return;
      }
      setFormError(guard.message ?? FORM_RATE_LIMIT_MESSAGE);
      return;
    }

    setStatus("submitting");

    const payload = {
      ...fields,
      gpuTypes: gpuTypes.join(", "),
      servingEngines: servingEngines.join(", "),
    };

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormBody(config.formName, payload),
      });

      if (!response.ok) {
        throw new Error("submit failed");
      }

      recordNetlifyFormSubmit(config.formName);
      setFields(initial);
      setGpuTypes([]);
      setServingEngines([]);
      setStatus("success");
      window.history.replaceState({}, "", `${config.path}?submitted=1`);
    } catch {
      setStatus("idle");
      setError("Something went wrong. Email hello@joule.lat and we will follow up.");
    }
  };

  const formKey = checkResult ? checkResult.answers.join("-") : "none";

  return (
    <>
      {checkResult ? (
        <aside className="intake-check-summary" aria-labelledby="intake-check-summary-heading">
          <p className="intake-check-summary-heading" id="intake-check-summary-heading">
            {formatScopingCheckSummary(checkResult)}
          </p>
          {checkResult.gaps.length ? (
            <ul className="intake-check-summary-gaps">
              {checkResult.gaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          ) : (
            <p className="intake-check-summary-empty">{checkResult.gapsMessage}</p>
          )}
          <button className="intake-check-summary-clear" onClick={onClearCheck} type="button">
            Clear
          </button>
        </aside>
      ) : null}

      <form
        key={formKey}
        className="intake-form"
        name={config.formName}
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={onSubmit}
        noValidate
      >
        <input type="hidden" name="form-name" value={config.formName} />
        <input type="hidden" name="power_check" value={fields.power_check} readOnly />
        <p className="intake-honeypot" hidden aria-hidden="true">
          <label>
            Do not fill:{" "}
            <input
              name="bot-field"
              value={fields["bot-field"]}
              onChange={onChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
          <label>
            Company website:{" "}
            <input
              name={TRAP_FIELD}
              value={fields[TRAP_FIELD]}
              onChange={onChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </p>
        <label className="intake-field">
          <span>
            Name <FormRequiredMark />
          </span>
          <input name="name" type="text" required autoComplete="name" value={fields.name} onChange={onChange} />
        </label>
        <label className="intake-field">
          <span>
            Work email <FormRequiredMark />
          </span>
          <input name="email" type="email" required autoComplete="email" value={fields.email} onChange={onChange} />
        </label>
        <label className="intake-field">
          <span>
            Company <FormRequiredMark />
          </span>
          <input
            name="company"
            type="text"
            required
            autoComplete="organization"
            value={fields.company}
            onChange={onChange}
          />
        </label>
        <label className="intake-field">
          <span>
            Fleet size <FormRequiredMark />
          </span>
          <select name="fleetSize" required value={fields.fleetSize} onChange={onChange}>
            <option value="">Select one</option>
            {ASSESSMENT_FORM_OPTIONS.fleetSize.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="intake-field">
          <span>Power envelope in MW (optional)</span>
          <input
            name="powerMw"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={fields.powerMw}
            onChange={onChange}
          />
        </label>
        <fieldset className="intake-fieldset">
          <legend>
            GPU types <FormRequiredMark />
          </legend>
          <div className="intake-fieldset-options">
            {ASSESSMENT_FORM_OPTIONS.gpuTypes.map((option) => (
              <label className="intake-checkbox" key={option}>
                <input
                  type="checkbox"
                  checked={gpuTypes.includes(option)}
                  onChange={() => toggleCheckbox("gpuTypes", option, setGpuTypes)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="intake-fieldset">
          <legend>
            Serving engines <FormRequiredMark />
          </legend>
          <div className="intake-fieldset-options">
            {ASSESSMENT_FORM_OPTIONS.servingEngines.map((option) => (
              <label className="intake-checkbox" key={option}>
                <input
                  type="checkbox"
                  checked={servingEngines.includes(option)}
                  onChange={() => toggleCheckbox("servingEngines", option, setServingEngines)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="intake-field">
          <span>
            Main concern <FormRequiredMark />
          </span>
          <select name="mainConcern" required value={fields.mainConcern} onChange={onChange}>
            <option value="">Select one</option>
            {ASSESSMENT_FORM_OPTIONS.mainConcern.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="intake-field">
          <span>
            Timeline <FormRequiredMark />
          </span>
          <select name="timeline" required value={fields.timeline} onChange={onChange}>
            <option value="">Select one</option>
            {ASSESSMENT_FORM_OPTIONS.timeline.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="intake-field">
          <span>Anything else (optional)</span>
          <textarea name="anythingElse" rows={4} value={fields.anythingElse} onChange={onChange} />
        </label>
        {formError ? (
          <p className="intake-error" role="alert">
            {formError}
          </p>
        ) : null}
        <button className="diagnostic-cta diagnostic-cta-block intake-submit" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : config.submitLabel}
        </button>
      </form>
    </>
  );
}

export default function IntakePage() {
  const config = INTAKE_FORMS.assessment;
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState(searchParams.get("submitted") === "1" ? "success" : "idle");
  const [error, setError] = useState("");

  const checkAnswers = useMemo(() => decodeAnswers(searchParams), [searchParams]);
  const checkResult = useMemo(
    () => (checkAnswers ? evaluatePowerCheck(checkAnswers) : null),
    [checkAnswers],
  );

  const clearCheck = () => {
    setSearchParams({}, { replace: true });
  };

  const scopingLandingTracked = useRef(false);
  useEffect(() => {
    if (!checkResult || scopingLandingTracked.current) return;
    scopingLandingTracked.current = true;
    trackPowerCheckEvent({
      kind: "scoping_landed",
      tier: checkResult.tier,
      score: checkResult.score,
      q6: checkResult.answers[5],
      gapCount: checkResult.gaps.length,
    });
  }, [checkResult]);

  useBrandMeta({
    pageTitle: `${config.title} · ${brandMeta.documentTitle}`,
  });

  return (
    <main className="site-shell intake-page">
      <div className="ambient-glow" aria-hidden />
      <Link className="intake-back" to="/">
        ← {brandMeta.name}
      </Link>
      <div className="intake-panel">
        <p className="intake-eyebrow">{config.eyebrow}</p>
        <h1>{config.title}</h1>
        <p className="intake-intro">{config.intro}</p>

        {status === "success" ? (
          <div className="intake-success" role="status">
            <p>{config.successMessage}</p>
            <Link className="intake-success-link" to="/">
              Back to product overview
            </Link>
          </div>
        ) : (
          <>
            {error ? (
              <p className="intake-error" role="alert">
                {error}
              </p>
            ) : null}
            <AssessmentIntakeForm
              checkResult={checkResult}
              config={config}
              onClearCheck={clearCheck}
              setError={setError}
              setStatus={setStatus}
              status={status}
            />
          </>
        )}
      </div>
    </main>
  );
}
