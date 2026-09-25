import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { INTAKE_FORMS } from "../content/phase1Product.js";

function encodeFormBody(formName, data) {
  const params = new URLSearchParams();
  params.set("form-name", formName);
  for (const [key, value] of Object.entries(data)) {
    params.set(key, value);
  }
  return params.toString();
}

export default function IntakePage({ variant }) {
  const config = INTAKE_FORMS[variant];
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(searchParams.get("submitted") === "1" ? "success" : "idle");
  const [error, setError] = useState("");

  const initial = useMemo(
    () => ({
      name: "",
      email: "",
      company: "",
      role: "",
      baseline: "",
      context: "",
      "bot-field": "",
    }),
    [],
  );
  const [fields, setFields] = useState(initial);

  if (!config) {
    return null;
  }

  const onChange = (event) => {
    const { name, value } = event.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("submitting");

    if (fields["bot-field"]?.trim()) {
      setStatus("success");
      return;
    }

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormBody(config.formName, fields),
      });

      if (!response.ok) {
        throw new Error("submit failed");
      }

      setFields(initial);
      setStatus("success");
      window.history.replaceState({}, "", `${config.path}?submitted=1`);
    } catch {
      setStatus("idle");
      setError("Something went wrong. Email hello@joule.lat and we will follow up.");
    }
  };

  return (
    <main className="site-shell intake-page">
      <div className="ambient-glow" aria-hidden />
      <Link className="intake-back" to="/">
        ← Joule.lat
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
          <form className="intake-form" onSubmit={onSubmit} noValidate>
            <input type="hidden" name="form-name" value={config.formName} />
            <p className="intake-honeypot" hidden>
              <label>
                Do not fill: <input name="bot-field" value={fields["bot-field"]} onChange={onChange} tabIndex={-1} autoComplete="off" />
              </label>
            </p>
            <label className="intake-field">
              <span>Name</span>
              <input name="name" type="text" required autoComplete="name" value={fields.name} onChange={onChange} />
            </label>
            <label className="intake-field">
              <span>Work email</span>
              <input name="email" type="email" required autoComplete="email" value={fields.email} onChange={onChange} />
            </label>
            <label className="intake-field">
              <span>Company</span>
              <input name="company" type="text" required autoComplete="organization" value={fields.company} onChange={onChange} />
            </label>
            <label className="intake-field">
              <span>Role</span>
              <input name="role" type="text" required autoComplete="organization-title" value={fields.role} onChange={onChange} />
            </label>
            {variant === "retainer" ? (
              <label className="intake-field">
                <span>Program or baseline</span>
                <select name="baseline" required value={fields.baseline} onChange={onChange}>
                  <option value="">Select one</option>
                  <option value="Completed design partner program">Completed design partner program</option>
                  <option value="Verified baseline (no program)">Verified baseline (no program)</option>
                  <option value="Not yet — discuss fit">Not yet — discuss fit</option>
                </select>
              </label>
            ) : null}
            <label className="intake-field">
              <span>{config.contextLabel}</span>
              <textarea
                name="context"
                rows={5}
                required
                value={fields.context}
                onChange={onChange}
                placeholder={config.contextPlaceholder}
              />
            </label>
            {error ? (
              <p className="intake-error" role="alert">
                {error}
              </p>
            ) : null}
            <button className="diagnostic-cta diagnostic-cta-block intake-submit" type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : config.submitLabel}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
