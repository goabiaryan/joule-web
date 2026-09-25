import { Activity, ArrowDown, ArrowUpRight, Radar, ShieldCheck, Zap } from "lucide-react";
import EngagementCard from "../components/EngagementCard.jsx";
import { phase1Product, RETAINER_CTA, SCOPING_CTA } from "../content/phase1Product.js";

const signalIcons = {
  zap: Zap,
  radar: Radar,
  shield: ShieldCheck,
  activity: Activity,
};

const audienceTopologyIcons = {
  chip: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
      />
    </svg>
  ),
  server: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
      />
    </svg>
  ),
  chart: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
};

function DeliverableCell({ index, title, badge, body, output }) {
  return (
    <div className="space-y-3 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-xs font-semibold text-orange-500">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        <span className="shrink-0 font-mono text-[10px] font-medium uppercase tracking-widest text-orange-400/90">
          [ {badge} ]
        </span>
      </div>
      <p className="font-sans text-xs leading-relaxed text-neutral-400">{body}</p>
      <div className="pt-2 font-mono text-[11px]">
        <span className="text-neutral-500">Output:</span>{" "}
        <span className="text-[#61b8a9]">{output}</span>
      </div>
    </div>
  );
}

function DeliverableSpecGrid({ items }) {
  const rows = [items.slice(0, 2), items.slice(2, 4)];
  return (
    <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-lg border border-neutral-800/80 bg-neutral-950/40">
      {rows.map((row, rowIndex) => (
        <div
          className={`grid grid-cols-1 divide-y divide-neutral-800/80 md:grid-cols-2 md:divide-x md:divide-y-0 ${rowIndex === 0 ? "border-b border-neutral-800/80" : ""}`}
          key={rowIndex}
        >
          {row.map((item, columnIndex) => {
            const index = rowIndex * 2 + columnIndex;
            return (
              <DeliverableCell
                badge={item.badge}
                body={item.body}
                index={index}
                key={item.title}
                output={item.output}
                title={item.title}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ProductFigure({ alt, src }) {
  return (
    <figure className="product-figure">
      <img alt={alt} decoding="async" loading="lazy" src={src} />
    </figure>
  );
}

function SectionHeadingTitle({ text, as: Tag = "h2", size = "lg", tone = "light" }) {
  const sizeClass = size === "sm" ? " section-heading-title-sm" : "";
  const toneClass = tone === "amber" ? " section-heading-title-amber" : " section-heading-title-light";
  return (
    <Tag className={`section-heading-title${sizeClass}${toneClass}`}>
      {text}
    </Tag>
  );
}

export default function ProductHome() {
  const {
    hero,
    illustrations,
    problem,
    audience,
    stack,
    engagements,
    designPartnerProgram,
    retainer,
    deliverables,
    deliverablesSection,
    principal,
    contactIntro,
    footer,
  } = phase1Product;

  const mail = SCOPING_CTA.contactEmail;
  const conversationHref = SCOPING_CTA.href;

  return (
    <main className="site-shell">
      <div className="ambient-glow" aria-hidden />
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Joule home">
          <span className="brand-mark">J</span>
          <span>
            JOULE<span className="brand-muted">.LAT</span>
          </span>
        </a>
        <div className="nav-links">
          <a href="#problem">Problem</a>
          <a href="#how-it-works">How it works</a>
          <a href="#deliverables">Deliverables</a>
          <a href="#engagements">Engagements</a>
          <a className="nav-cta" href={conversationHref}>
            {SCOPING_CTA.label} <ArrowUpRight size={14} />
          </a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-signals" aria-label="Product capabilities">
          {hero.signals.map(({ icon, label }) => {
            const Icon = signalIcons[icon];
            return (
              <div className="hero-signal" key={label}>
                <Icon size={16} strokeWidth={1.75} aria-hidden />
                <span className="hero-signal-label">{label}</span>
              </div>
            );
          })}
        </div>
        <div className="eyebrow">
          <span className="pulse-dot" /> {hero.eyebrow}
        </div>
        <h1>
          {hero.titleLine1}
          <br />
          <em>{hero.titleEmphasis}</em>
        </h1>
        <p className="hero-lede">{hero.lede}</p>
        <p className="hero-keywords" aria-label="What we measure">
          {hero.keywords.map((term, index) => (
            <span key={term} className="hero-keywords-item">
              {index > 0 ? <span className="hero-keywords-sep" aria-hidden="true"> · </span> : null}
              {term}
            </span>
          ))}
        </p>
        <a className="hero-link" href="#engagements">
          Design partner program <ArrowDown size={18} strokeWidth={2} />
        </a>
      </section>

      <section className="section problem-section" id="problem">
        <div className="section-heading section-heading-prominent">
          <SectionHeadingTitle text={problem.title} tone="light" />
        </div>
        <div className="grid grid-cols-1 gap-10 pt-6 md:grid-cols-2">
          <div className="space-y-6 border-l border-neutral-800 pl-6">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                [ {problem.facility.stateLabel} ]
              </div>
              <h3 className="mt-1 text-base font-medium text-neutral-300">{problem.facility.columnTitle}</h3>
              <p className="mt-0.5 font-mono text-xs text-neutral-500">{problem.facility.columnHint}</p>
            </div>
            <div className="space-y-4 pt-2">
              {problem.facility.insights.map((item) => (
                <div key={item.title}>
                  <h4 className="text-sm font-medium text-neutral-300">{item.title}</h4>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-neutral-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 border-l-2 border-orange-500/80 bg-gradient-to-r from-orange-500/[0.03] to-transparent pl-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-orange-500">
                <span className="measurement-gap-pulse-dot h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden />
                [ {problem.joule.stateLabel} ]
              </div>
              <h3 className="mt-1 text-base font-semibold text-white">{problem.joule.columnTitle}</h3>
              <p className="mt-0.5 font-mono text-xs text-neutral-400">{problem.joule.columnHint}</p>
            </div>
            <div className="space-y-4 pt-2">
              {problem.joule.insights.map((item) => (
                <div key={item.title}>
                  <h4 className="text-sm font-medium text-neutral-100">{item.title}</h4>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-neutral-400">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ProductFigure alt={illustrations.utilizationGoodput.alt} src={illustrations.utilizationGoodput.src} />
      </section>

      <section className="section audience-matrix-section" id="audience">
        <div className="section-heading section-heading-prominent">
          <SectionHeadingTitle text={audience.title} tone="amber" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {audience.profiles.map((profile) => (
              <div
                className="relative space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/50 p-6 transition-colors hover:border-neutral-700"
                key={profile.id}
              >
                <div className="flex items-center justify-between">
                  <div className="rounded border border-orange-500/20 bg-orange-500/10 p-2 text-orange-400">
                    {audienceTopologyIcons[profile.icon]}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                    [ {profile.scopeTag} ]
                  </span>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-neutral-100">{profile.title}</h4>
                  <p className="text-xs leading-relaxed text-neutral-400">{profile.body}</p>
                </div>
                <div className="border-t border-neutral-900 pt-3 font-mono text-[11px] text-orange-400/80">
                  {profile.footer}
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="section practice-section" id="how-it-works">
        <div className="section-heading section-heading-prominent">
          <SectionHeadingTitle text={stack.title} tone="light" />
        </div>
        <div className="mx-auto max-w-6xl">
          <ol className="stack-timeline m-0 list-none p-0 pt-6">
            {stack.pillars.map((pillar, index) => (
              <li
                className={`stack-timeline-step ${index % 2 === 0 ? "stack-timeline-step--left" : "stack-timeline-step--right"}`}
                key={pillar.id}
              >
                <div className="stack-timeline-node" aria-hidden>
                  <span className="stack-timeline-node-dot" />
                </div>
                <div className="stack-timeline-content space-y-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-orange-500">
                    {String(index + 1).padStart(2, "0")} / {pillar.id}
                  </div>
                  <h3 className="text-base font-medium text-white">{pillar.title}</h3>
                  <ul className="list-inside list-disc space-y-2 font-sans text-xs leading-relaxed text-neutral-400">
                    {pillar.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <ProductFigure alt={illustrations.vpcBoundary.alt} src={illustrations.vpcBoundary.src} />
      </section>

      <section className="section outputs-section" id="deliverables">
        <div className="section-heading section-heading-prominent">
          <SectionHeadingTitle text={deliverablesSection.title} tone="amber" />
        </div>
        <DeliverableSpecGrid items={deliverables} />
      </section>

      <section className="section engagement-section" id="engagements">
        <div className="section-heading section-heading-prominent">
          <SectionHeadingTitle text={engagements.title} tone="light" />
        </div>
        <div className="engagement-cards mx-auto pt-6">
          <div className="engagement-stack">
            <EngagementCard offer={designPartnerProgram} pricing={designPartnerProgram} featured>
              <div className="pilot-cta-row">
                <a className="diagnostic-cta diagnostic-cta-block" href={conversationHref}>
                  {SCOPING_CTA.buttonLabel}
                </a>
              </div>
            </EngagementCard>
            <p className="engagement-program-contact">
              {contactIntro}{" "}
              <a href={`mailto:${mail}`}>{mail}</a>
            </p>
          </div>
          <EngagementCard offer={retainer} pricing={retainer}>
            <div className="pilot-cta-row">
              <a className="diagnostic-cta diagnostic-cta-block diagnostic-cta-secondary" href={RETAINER_CTA.href}>
                {RETAINER_CTA.buttonLabel}
              </a>
            </div>
          </EngagementCard>
        </div>
      </section>

      <footer className="site-footer site-footer-institutional site-footer-after-engagements">
        <p className="site-footer-principal">
          {principal.line}{" "}
          <a href={principal.linkHref} target="_blank" rel="noreferrer">
            {principal.linkLabel} →
          </a>
        </p>
        <p className="site-footer-line">{footer.line}</p>
        <p className="site-footer-line site-footer-secondary">{footer.tagline}</p>
        <small className="site-footer-legal">{footer.legal}</small>
      </footer>
    </main>
  );
}
