import { Link } from "react-router-dom";
import { useBrandMeta } from "../hooks/useBrandMeta.js";
import { brandMeta } from "../content/phase1Product.js";
import { privacyLegal } from "../content/privacyLegal.js";

export default function PrivacyPage() {
  useBrandMeta({
    pageTitle: `Privacy · ${brandMeta.documentTitle}`,
  });

  const { dataController, registeredAddress, privacyEmail, lastUpdated, headroomEmailRetention } =
    privacyLegal;

  return (
    <main className="site-shell intake-page privacy-page">
      <div className="ambient-glow" aria-hidden />
      <Link className="intake-back" to="/">
        ← {brandMeta.name}
      </Link>
      <div className="intake-panel privacy-panel">
        <p className="intake-eyebrow">Privacy</p>
        <h1>Privacy policy</h1>
        <p className="privacy-updated">Last updated: {lastUpdated}</p>
        <div className="privacy-prose">
          <p>
            Joule is operated at joule.lat by {dataController}, {registeredAddress}. This policy
            describes how we handle personal data when you use the site.
          </p>

          <h2>Who is responsible for your data</h2>
          <p>
            <strong>{dataController}</strong>
            <br />
            {registeredAddress}
            <br />
            Privacy requests:{" "}
            <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>
          </p>

          <h2>Processors and international transfers</h2>
          <p>
            We use <strong>Netlify, Inc.</strong> (United States) to host joule.lat, run form
            submissions (including the power headroom check readout and anonymous analytics events),
            and send notification email to our team when a form is submitted. Your data may be
            processed outside the European Economic Area. Where required, we rely on appropriate
            safeguards such as the EU Standard Contractual Clauses.
          </p>
          <p>
            Outbound email to you (for example your diagnostic readout) is sent through the same
            hosting and forms stack unless we tell you otherwise on the form.
          </p>

          <h2>Anonymous diagnostic analytics</h2>
          <p>
            When you use the power headroom check, we record anonymous funnel events (for example
            which question you reached, your self-reported tier, and whether you opened scoping or
            requested the email readout). Events use a random ID in session storage only for that
            visit, not cookies. We do not put your email in analytics events.
          </p>

          <h2>Power headroom check email</h2>
          <p>
            If you enter your email after the diagnostic, we use your address to send your result and
            to follow up with you about it. We do not add you to a marketing list. The message
            includes your self-reported result, visibility gaps, and implication line as plain text.
          </p>
          <p>{headroomEmailRetention}</p>

          <h2>Assessment request (/scoping)</h2>
          <p>
            When you request an assessment, we process the fields you submit to scope a call. We keep
            that data for as long as needed to handle the request and any follow-up engagement.
          </p>

          <h2>Legal basis</h2>
          <p>
            We process personal data to respond to your request (GDPR Article 6(1)(b)) and, where
            applicable, for our legitimate interest in operating and improving the service (Article
            6(1)(f)).
          </p>

          <h2>Your rights</h2>
          <p>
            Under GDPR you have the right to access, rectification, erasure, restriction of
            processing, objection, and data portability. You may exercise these rights, or ask us to
            stop processing your data in line with EU data protection law, by emailing{" "}
            <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>. You also have the right to lodge a
            complaint with a supervisory authority. In Portugal this is the Comissão Nacional de
            Proteção de Dados (CNPD).
          </p>

          <h2>Contact</h2>
          <p>
            General product contact:{" "}
            <a href={`mailto:${brandMeta.contactEmail}`}>{brandMeta.contactEmail}</a>
            <br />
            Privacy: <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>
          </p>
        </div>
      </div>
    </main>
  );
}
