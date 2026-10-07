import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import {
  answersRecordToTuple,
  evaluatePowerCheck,
  formatPowerCheckEmailSummary,
  scopingSearchFromAnswers,
} from "../lib/powerCheck.ts";
import {
  FORM_RATE_LIMIT_MESSAGE,
  TRAP_FIELD,
  markFormReady,
  recordNetlifyFormSubmit,
  validateHumanSubmit,
} from "../lib/formBotGuard.js";
import { playDiagnosticSelectSound } from "../lib/diagnosticSelectSound.js";
import {
  resetPowerCheckSessionId,
  trackPowerCheckEvent,
} from "../lib/powerCheckAnalytics.ts";
import { HEADROOM_CHECK_ANCHOR, powerHeadroomCheck, PRIVACY_PATH } from "../content/powerHeadroomCheck.js";
import { INTAKE_FORMS } from "../content/phase1Product.js";
import HeadroomVisibilityGaps from "./HeadroomVisibilityGaps.jsx";
import FormRequiredMark from "./FormRequiredMark.jsx";
import ScrollReveal from "./ScrollReveal.jsx";

function encodeEmailFormBody(formName, data) {
  const params = new URLSearchParams();
  params.set("form-name", formName);
  for (const [key, value] of Object.entries(data)) {
    if (value != null) params.set(key, value);
  }
  return params.toString();
}

export default function PowerHeadroomCheck({ scopingPath = INTAKE_FORMS.assessment.path }) {
  const { questions } = powerHeadroomCheck;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [botField, setBotField] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [emailStatus, setEmailStatus] = useState("idle");
  const [emailError, setEmailError] = useState("");
  const emailInputRef = useRef(null);
  const roleInputRef = useRef(null);
  const startAnchorRef = useRef(null);
  const pendingScrollToStartRef = useRef(false);
  const startedTrackedRef = useRef(false);
  const completedTrackedRef = useRef(false);
  const [role, setRole] = useState("");

  const isComplete = step >= questions.length;
  const answerTuple = useMemo(() => answersRecordToTuple(answers), [answers]);
  const result = useMemo(
    () => (isComplete && answerTuple ? evaluatePowerCheck(answerTuple) : null),
    [answerTuple, isComplete],
  );

  const currentQuestion = !isComplete ? questions[step] : null;

  const scopingTo = useMemo(() => {
    if (!result) return scopingPath;
    return {
      pathname: scopingPath,
      search: `?${scopingSearchFromAnswers(result.answers)}`,
    };
  }, [result, scopingPath]);

  useEffect(() => {
    if (!isComplete || !result) return;
    markFormReady("headroom-check-email");
  }, [isComplete, result]);

  useEffect(() => {
    if (!isComplete || !result || emailStatus === "success") return;
    const id = window.requestAnimationFrame(() => {
      roleInputRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, [emailStatus, isComplete, result]);

  useEffect(() => {
    if (!isComplete || !result || completedTrackedRef.current) return;
    completedTrackedRef.current = true;
    trackPowerCheckEvent({
      kind: "completed",
      tier: result.tier,
      score: result.score,
      q6: result.answers[5],
      gapCount: result.gaps.length,
    });
  }, [isComplete, result]);

  useEffect(() => {
    if (!pendingScrollToStartRef.current || step !== 0 || isComplete) return;
    pendingScrollToStartRef.current = false;
    const id = window.requestAnimationFrame(() => {
      startAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(id);
  }, [isComplete, step]);

  const pickOption = useCallback(
    (optionIndex) => {
      const question = questions[step];
      if (!question) return;

      const isLastQuestion = step >= questions.length - 1;
      playDiagnosticSelectSound({ complete: isLastQuestion });

      const nextAnswers = { ...answers, [question.id]: optionIndex };
      setAnswers(nextAnswers);

      if (!startedTrackedRef.current) {
        startedTrackedRef.current = true;
        trackPowerCheckEvent({ kind: "started" });
      }
      trackPowerCheckEvent({
        kind: "answer",
        questionId: question.id,
        answerValue: optionIndex,
        stepIndex: step,
      });

      if (!isLastQuestion) {
        setStep((s) => s + 1);
        return;
      }

      setStep(questions.length);
    },
    [answers, questions, step],
  );

  const goBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const resultContext = useMemo(() => {
    if (!result) return null;
    return {
      tier: result.tier,
      score: result.score,
      q6: result.answers[5],
      gapCount: result.gaps.length,
      role: role.trim() || undefined,
    };
  }, [role, result]);

  const restart = useCallback(() => {
    trackPowerCheckEvent({ kind: "retake" });
    resetPowerCheckSessionId();
    startedTrackedRef.current = false;
    completedTrackedRef.current = false;
    setAnswers({});
    setStep(0);
    setEmail("");
    setBotField("");
    setCompanyWebsite("");
    setEmailStatus("idle");
    setEmailError("");
    setRole("");
    pendingScrollToStartRef.current = true;
  }, []);

  const onScopingClick = useCallback(() => {
    if (!resultContext) return;
    trackPowerCheckEvent({ kind: "scoping_click", ...resultContext });
  }, [resultContext]);

  const onEmailSubmit = async (event) => {
    event.preventDefault();
    setEmailError("");
    if (!result) return;
    const guard = validateHumanSubmit(
      "headroom-check-email",
      { "bot-field": botField, [TRAP_FIELD]: companyWebsite },
      { minMs: 2500 },
    );
    if (!guard.ok) {
      if (guard.silent) {
        setEmailStatus("success");
        return;
      }
      setEmailError(guard.message ?? FORM_RATE_LIMIT_MESSAGE);
      return;
    }
    if (!role.trim()) {
      setEmailError("Enter your role.");
      return;
    }
    if (!email.trim()) {
      setEmailError("Enter a work email.");
      return;
    }
    setEmailStatus("submitting");
    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeEmailFormBody("headroom-check-email", {
          email: email.trim(),
          role: role.trim(),
          headroomCheckSummary: formatPowerCheckEmailSummary(result),
          "bot-field": "",
          [TRAP_FIELD]: "",
        }),
      });
      if (!response.ok) throw new Error("submit failed");
      recordNetlifyFormSubmit("headroom-check-email");
      if (resultContext) {
        trackPowerCheckEvent({ kind: "email_sent", ...resultContext });
      }
      setEmailStatus("success");
    } catch {
      setEmailStatus("idle");
      setEmailError("Something went wrong. Email hello@joule.lat and we will follow up.");
    }
  };

  const gapCount = result?.gaps.length ?? 0;
  const emailLedeWithGaps = useMemo(() => {
    if (gapCount < 1) return "";
    return powerHeadroomCheck.ctaEmailLedeWithGaps.replace("{n}", String(gapCount));
  }, [gapCount]);

  return (
    <ScrollReveal
      as="section"
      className="headroom-check headroom-check-interactive headroom-check-open"
      delay={60}
      id={HEADROOM_CHECK_ANCHOR.slice(1)}
    >
      <header className="headroom-check-header headroom-check-start" id="headroom-check-start" ref={startAnchorRef}>
        <p className="headroom-check-eyebrow">
          {powerHeadroomCheck.eyebrow} · {powerHeadroomCheck.duration}
        </p>
        <h3 className="headroom-check-title">{powerHeadroomCheck.title}</h3>
        <p className="headroom-check-intro">{powerHeadroomCheck.intro}</p>
      </header>

      {currentQuestion ? (
        <div className="headroom-check-question">
          <div className="headroom-check-progress" aria-hidden>
            <span
              className="headroom-check-progress-fill"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="headroom-check-step">
            {powerHeadroomCheck.progressLabel} {step + 1} / {questions.length}
          </p>
          <h3 className="headroom-check-prompt">{currentQuestion.prompt}</h3>
          <div className="headroom-check-options">
            {currentQuestion.options.map((option, index) => {
              const selected = answers[currentQuestion.id] === index;
              return (
                <button
                  aria-pressed={selected}
                  className={`headroom-check-option${selected ? " is-selected" : ""}`}
                  key={option}
                  onClick={() => pickOption(index)}
                  type="button"
                >
                  {option}
                </button>
              );
            })}
          </div>
          {step > 0 ? (
            <div className="headroom-check-nav headroom-check-nav-minimal">
              <button className="headroom-check-back" onClick={goBack} type="button">
                {powerHeadroomCheck.backLabel}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {isComplete && result ? (
        <div className="headroom-check-result" role="status">
          <h3 className="headroom-check-result-title">
            {result.title}
            <span className="headroom-check-score-inline">
              {result.score} / {result.maxScore}
            </span>
          </h3>
          <p className="headroom-check-result-body">{result.body}</p>

          <HeadroomVisibilityGaps
            gaps={result.gaps}
            gapsMessage={result.gapsMessage}
            heading={powerHeadroomCheck.gapsHeading}
            loadingLabel={powerHeadroomCheck.gapsLoadingLabel}
          />

          <div className="headroom-check-urgency">
            <p className="headroom-check-gaps-heading">{powerHeadroomCheck.urgencyHeading}</p>
            <p className="headroom-check-urgency-note">{result.urgencyLine}</p>
          </div>

          <Link
            className="diagnostic-cta headroom-check-cta-primary"
            onClick={onScopingClick}
            to={scopingTo}
          >
            {powerHeadroomCheck.ctaAssessment}
            <ArrowUpRight aria-hidden size={16} strokeWidth={2} />
          </Link>

          <div className="headroom-check-email-card">
            {emailStatus === "success" ? (
              <p className="headroom-check-email-success">{powerHeadroomCheck.ctaEmailSuccess}</p>
            ) : (
              <>
                <div className="headroom-check-email-card-head">
                  <span className="headroom-check-email-icon" aria-hidden>
                    <Mail size={20} strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="headroom-check-email-eyebrow">{powerHeadroomCheck.ctaEmailEyebrow}</p>
                    <p className="headroom-check-email-title">{powerHeadroomCheck.ctaEmailTitle}</p>
                  </div>
                </div>
                <p className="headroom-check-email-lede">
                  {result.gaps.length ? emailLedeWithGaps : powerHeadroomCheck.ctaEmailLedeNoGaps}
                </p>
                <div className="headroom-check-email-preview">
                  <p className="headroom-check-email-preview-label">
                    {powerHeadroomCheck.ctaEmailPreviewLabel}
                  </p>
                  <ul className="headroom-check-email-preview-list">
                    {powerHeadroomCheck.ctaEmailPreviewItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <form
                  className="headroom-check-email-form"
                  name="headroom-check-email"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={onEmailSubmit}
                >
                  <input type="hidden" name="form-name" value="headroom-check-email" />
                  <input
                    type="hidden"
                    name="headroomCheckSummary"
                    value={formatPowerCheckEmailSummary(result)}
                    readOnly
                  />
                  <p className="intake-honeypot" hidden aria-hidden="true">
                    <label>
                      Do not fill:{" "}
                      <input
                        name="bot-field"
                        value={botField}
                        onChange={(e) => setBotField(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>
                    <label>
                      Company website:{" "}
                      <input
                        name={TRAP_FIELD}
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </label>
                  </p>
                  <label className="headroom-check-email-field">
                    <span className="headroom-check-email-field-label">
                      {powerHeadroomCheck.ctaEmailRoleLabel} <FormRequiredMark />
                    </span>
                    <input
                      ref={roleInputRef}
                      autoComplete="organization-title"
                      name="role"
                      placeholder={powerHeadroomCheck.ctaEmailRolePlaceholder}
                      required
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </label>
                  <div className="headroom-check-email-row">
                    <label className="headroom-check-email-field headroom-check-email-field-grow">
                      <span className="headroom-check-email-field-label">
                        {powerHeadroomCheck.ctaEmailWorkEmailLabel} <FormRequiredMark />
                      </span>
                      <input
                        ref={emailInputRef}
                        autoComplete="email"
                        name="email"
                        placeholder={powerHeadroomCheck.ctaEmailPlaceholder}
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                    <button
                      className="diagnostic-cta headroom-check-email-submit"
                      disabled={emailStatus === "submitting"}
                      type="submit"
                    >
                      {emailStatus === "submitting" ? "Sending…" : powerHeadroomCheck.ctaEmailSubmit}
                    </button>
                  </div>
                  {emailError ? (
                    <p className="intake-error" role="alert">
                      {emailError}
                    </p>
                  ) : null}
                  <p className="headroom-check-email-note">
                    {powerHeadroomCheck.ctaEmailNoteBeforeLink}
                    <Link className="headroom-check-email-privacy" to={PRIVACY_PATH}>
                      {powerHeadroomCheck.ctaEmailPrivacyLinkLabel}
                    </Link>
                  </p>
                </form>
              </>
            )}
          </div>

          <div className="headroom-check-actions">
            <button className="headroom-check-restart" onClick={restart} type="button">
              {powerHeadroomCheck.restartLabel}
            </button>
          </div>
        </div>
      ) : null}
    </ScrollReveal>
  );
}
