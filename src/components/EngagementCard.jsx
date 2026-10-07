import EngagementPrice from "./EngagementPrice.jsx";

export default function EngagementCard({
  offer,
  pricing,
  featured = false,
  children,
}) {
  const showPricing = pricing?.showPricing !== false && Boolean(pricing?.feeAmount);

  return (
    <article
      className={
        featured ? "diagnostic-card diagnostic-card-featured" : "diagnostic-card"
      }
    >
      <div className="card-label">{offer.label}</div>
      {showPricing ? <EngagementPrice pricing={pricing} /> : null}
      {offer.summary ? <p className="engagement-summary">{offer.summary}</p> : null}
      {offer.commitmentLine ? (
        <p className="engagement-commitment">{offer.commitmentLine}</p>
      ) : null}
      <ul className="engagement-features">
        {offer.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {children}
    </article>
  );
}
