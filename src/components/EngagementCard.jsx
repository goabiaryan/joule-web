import EngagementPrice from "./EngagementPrice.jsx";

export default function EngagementCard({
  offer,
  pricing,
  featured = false,
  children,
}) {
  return (
    <article
      className={
        featured ? "diagnostic-card diagnostic-card-featured" : "diagnostic-card"
      }
    >
      <div className="card-label">{offer.label}</div>
      <EngagementPrice pricing={pricing} />
      <ul className="engagement-features">
        {offer.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {children}
    </article>
  );
}
