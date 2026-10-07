import { useCallback, useRef, useState } from "react";
import { Activity, ArrowUpRight, Radar, ShieldCheck, Zap } from "lucide-react";
import BrandLockup from "../components/BrandLockup.jsx";
import BrandTagline from "../components/BrandTagline.jsx";
import PowerHeadroomCheck from "../components/PowerHeadroomCheck.jsx";
import ScrollReveal from "../components/ScrollReveal.jsx";
import { useBrandMeta } from "../hooks/useBrandMeta.js";
import { useHeroPointerGlow } from "../hooks/useHeroPointerGlow.js";
import { useNavSectionSpy } from "../hooks/useNavSectionSpy.js";
import { useScrollToHash } from "../hooks/useScrollToHash.js";
import { HEADROOM_CHECK_SECTION_ID, powerHeadroomCheck } from "../content/powerHeadroomCheck.js";
import { scrollToSectionById } from "../lib/scrollToSection.js";
import { brandMeta, phase1Product, SCOPING_CTA } from "../content/phase1Product.js";

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
    <div className="deliverable-cell space-y-3 p-6 sm:p-8">
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
        <span className="deliverable-cell-output text-[#61b8a9]">{output}</span>
      </div>
    </div>
  );
}

function DeliverableSpecGrid({ items }) {
  const rows = [items.slice(0, 2), items.slice(2, 4)];
  return (
    <div className="deliverables-spec">
      {rows.map((row, rowIndex) => (
        <div className="deliverables-spec-row" key={rowIndex}>
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
    <ScrollReveal className="product-figure product-figure-interactive" delay={120}>
      <figure>
        <img alt={alt} decoding="async" loading="lazy" src={src} />
      </figure>
    </ScrollReveal>
  );
}

function SectionIntro({ eyebrow, title, bridge, titleTone = "light" }) {
  const titleClass =
    titleTone === "amber" ? "section-intro-title section-intro-title-amber" : "section-intro-title";
  return (
    <ScrollReveal as="header" className="section-intro">
      <p className="section-intro-eyebrow">{eyebrow}</p>
      <h2 className={titleClass}>{title}</h2>
      {bridge ? <p className="section-intro-bridge">{bridge}</p> : null}
    </ScrollReveal>
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
    deliverables,
    deliverablesSection,
    principal,
    footer,
  } = phase1Product;

  const conversationHref = SCOPING_CTA.href;
  const heroRef = useRef(null);
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);
  const activeNavSection = useNavSectionSpy();

  useBrandMeta();
  useHeroPointerGlow(heroRef);
  useScrollToHash();

  const activateTimelineStep = useCallback((index) => {
    setActiveTimelineStep(index);
  }, []);

  const onTimelineKeyDown = useCallback((event, index) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveTimelineStep(index);
    }
  }, []);

  return (
    <main className="site-shell site-shell-interactive">
      <div className="ambient-glow" aria-hidden />
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label={`${brandMeta.name} home`}>
          <span className="brand-mark">J</span>
          <span className="brand-stack">
            <BrandLockup
              layout="inline"
              nameVariant="logotype"
              nameClassName="brand-name brand-name-logotype"
              domainClassName="brand-domain brand-domain-nav"
              parenClassName="brand-domain-paren brand-domain-paren-nav"
              showDomain={false}
            />
            <BrandTagline className="brand-tagline-nav" variant="capacity" />
          </span>
        </a>
        <div className="nav-links">
          <a className={activeNavSection === "problem" ? "nav-link-active" : undefined} href="#problem">
            Problem
          </a>
          <a
            className={activeNavSection === "how-it-works" ? "nav-link-active" : undefined}
            href="#how-it-works"
          >
            How it works
          </a>
          <a
            className={activeNavSection === "deliverables" ? "nav-link-active" : undefined}
            href="#deliverables"
          >
            Deliverables
          </a>
          <a
            className={activeNavSection === "engagements" ? "nav-link-active" : undefined}
            href="#engagements"
          >
            Get started
          </a>
          <a className="nav-cta" href={conversationHref}>
            {SCOPING_CTA.label} <ArrowUpRight size={14} />
          </a>
        </div>
      </nav>

      <section className="hero hero-interactive" id="top" ref={heroRef}>
        <div className="hero-underlay" aria-hidden="true">
          <img alt="" className="hero-underlay-img" decoding="async" src={hero.visual.src} />
        </div>
        <div className="hero-main">
          <div className="eyebrow eyebrow-tagline">
            <span className="pulse-dot" /> {hero.eyebrow}
          </div>
          <h1>
            {hero.titleLine1}
            {hero.titleEmphasis ? (
              <>
                {" "}
                <em>{hero.titleEmphasis}</em>
              </>
            ) : null}
          </h1>
          <p className="hero-lede">{hero.lede}</p>
          <button
            className="diagnostic-cta hero-primary-cta"
            type="button"
            onClick={() => scrollToSectionById(HEADROOM_CHECK_SECTION_ID)}
          >
            {powerHeadroomCheck.heroCtaLabel}
          </button>
        </div>
        <div className="hero-signals" aria-label="Product capabilities">
          {hero.signals.map(({ icon, label }) => {
            const Icon = signalIcons[icon];
            return (
              <div className="hero-signal hero-signal-interactive" key={label}>
                <span className="hero-signal-icon-wrap" aria-hidden>
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <span className="hero-signal-label">{label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section problem-section" id="problem">
        <SectionIntro eyebrow={problem.eyebrow} bridge={problem.bridge} title={problem.title} />
        <ScrollReveal className="measurement-gap-grid measurement-gap-grid-interactive">
          <div className="measurement-gap-col measurement-gap-col--blind">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                [ {problem.facility.stateLabel} ]
              </div>
              <h3 className="mt-1 text-base font-medium text-neutral-300">{problem.facility.columnTitle}</h3>
              <p className="mt-0.5 font-mono text-xs text-neutral-500">{problem.facility.columnHint}</p>
            </div>
            <div className="measurement-gap-insights">
              {problem.facility.insights.map((item) => (
                <div className="measurement-gap-insight" key={item.title}>
                  <h4 className="text-sm font-medium text-neutral-300">{item.title}</h4>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-neutral-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="measurement-gap-col measurement-gap-col--joule">
            <div>
              <div className="measurement-gap-state measurement-gap-state--joule">
                <span className="measurement-gap-pulse-dot" aria-hidden />
                <span>[ {problem.joule.stateLabel} ]</span>
              </div>
              <h3 className="mt-1 text-base font-semibold text-white">{problem.joule.columnTitle}</h3>
              <p className="mt-0.5 font-mono text-xs text-neutral-400">{problem.joule.columnHint}</p>
            </div>
            <div className="measurement-gap-insights">
              {problem.joule.insights.map((item) => (
                <div className="measurement-gap-insight measurement-gap-insight--joule" key={item.title}>
                  <h4 className="text-sm font-medium text-neutral-100">{item.title}</h4>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-neutral-400">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
        <ProductFigure alt={illustrations.utilizationGoodput.alt} src={illustrations.utilizationGoodput.src} />
      </section>

      <section className="section audience-matrix-section" id="audience">
        <SectionIntro
          eyebrow={audience.eyebrow}
          bridge={audience.bridge}
          title={audience.title}
          titleTone="amber"
        />
        <div className="audience-matrix">
            {audience.profiles.map((profile, index) => (
              <ScrollReveal as="div" className="audience-card audience-card-interactive" delay={index * 90} key={profile.id}>
                <div className="audience-card-header">
                  <div className="audience-card-icon">{audienceTopologyIcons[profile.icon]}</div>
                  <span className="audience-card-tag">[ {profile.scopeTag} ]</span>
                </div>
                <div className="audience-card-body">
                  <h4>{profile.title}</h4>
                  <p>{profile.body}</p>
                </div>
                <div className="audience-card-footer">{profile.footer}</div>
              </ScrollReveal>
            ))}
        </div>
      </section>

      <section className="section practice-section" id="how-it-works">
        <SectionIntro eyebrow={stack.eyebrow} bridge={stack.bridge} title={stack.title} />
        <div className="mx-auto max-w-6xl">
          <ol className="stack-timeline stack-timeline-interactive m-0 list-none p-0">
            {stack.pillars.map((pillar, index) => (
              <li
                aria-pressed={activeTimelineStep === index}
                className={`stack-timeline-step stack-timeline-step-interactive ${index % 2 === 0 ? "stack-timeline-step--left" : "stack-timeline-step--right"}${activeTimelineStep === index ? " is-active" : ""}${index < activeTimelineStep ? " is-complete" : ""}`}
                key={pillar.id}
                onClick={() => activateTimelineStep(index)}
                onKeyDown={(event) => onTimelineKeyDown(event, index)}
                role="button"
                tabIndex={0}
              >
                <div className="stack-timeline-node" aria-hidden>
                  <span className="stack-timeline-node-dot" />
                </div>
                <div className="stack-timeline-content space-y-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-orange-500">
                    {String(index + 1).padStart(2, "0")} / {pillar.id}
                  </div>
                  <ul className="list-disc">
                    {pillar.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <ProductFigure
          alt={illustrations.infrastructureBoundary.alt}
          src={illustrations.infrastructureBoundary.src}
        />
      </section>

      <section className="section outputs-section" id="deliverables">
        <SectionIntro
          eyebrow={deliverablesSection.eyebrow}
          bridge={deliverablesSection.bridge}
          title={deliverablesSection.title}
          titleTone="amber"
        />
        <ScrollReveal className="deliverables-spec-wrap" delay={80}>
          <DeliverableSpecGrid items={deliverables} />
        </ScrollReveal>
      </section>

      <section className="section engagement-section" id="engagements">
        <SectionIntro
          eyebrow={engagements.eyebrow}
          bridge={engagements.bridge}
          title={engagements.title}
        />
        <PowerHeadroomCheck scopingPath={conversationHref} />
        <ScrollReveal className="engagement-panel engagement-panel-interactive" delay={100}>
          <div className="engagement-panel-main">
            <div className="engagement-panel-copy">
              <p className="engagement-panel-eyebrow">{engagements.start.eyebrow}</p>
              <h3 className="engagement-panel-heading">{engagements.start.heading}</h3>
              <p className="engagement-panel-lede">{engagements.start.body}</p>
              <ul className="engagement-outcomes" aria-label="Assessment outcomes">
                {engagements.start.outcomes.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
              <p className="engagement-panel-assurance">{engagements.start.detail}</p>
            </div>
            <aside className="engagement-panel-followon" aria-labelledby="engagement-followon-heading">
              <p className="engagement-panel-eyebrow engagement-panel-eyebrow-muted">
                {engagements.then.eyebrow}
              </p>
              <h3 className="engagement-panel-followon-heading" id="engagement-followon-heading">
                {engagements.then.heading}
              </h3>
              <p className="engagement-panel-followon-body">{engagements.then.body}</p>
            </aside>
          </div>
          <div className="engagement-panel-action">
            <p className="engagement-panel-fee">{engagements.fixedFeeLine}</p>
            <a className="diagnostic-cta engagement-panel-cta" href={conversationHref}>
              {SCOPING_CTA.buttonLabel}
            </a>
          </div>
        </ScrollReveal>
      </section>

      <footer className="site-footer site-footer-institutional site-footer-after-engagements">
        <p className="site-footer-principal">
          {principal.line}{" "}
          <a href={principal.linkHref} target="_blank" rel="noreferrer">
            {principal.linkLabel} →
          </a>
        </p>
        <p className="site-footer-line site-footer-domain">{footer.line}</p>
        <BrandTagline as="p" className="site-footer-line site-footer-tagline" variant="capacity" />
        <p className="site-footer-line site-footer-contact">
          <a href={`mailto:${footer.contactEmail}`}>{footer.contactEmail}</a>
        </p>
        <small className="site-footer-legal">{footer.legal}</small>
      </footer>
    </main>
  );
}
