import { brandMeta } from "../content/phase1Product.js";

/** Company name + domain: stacked in footer contexts, inline `Joule (joule.lat)` in chrome/hero. */
export default function BrandLockup({
  layout = "stack",
  /** `logotype` = tracked JOULE in nav; `wordmark` = Joule in hero. */
  nameVariant = "wordmark",
  nameClassName = "brand-name",
  domainClassName = "brand-domain",
  parenClassName = "brand-domain-paren",
}) {
  const displayName = nameVariant === "logotype" ? brandMeta.name.toUpperCase() : brandMeta.name;

  if (layout === "inline") {
    return (
      <span className="brand-lockup brand-lockup-inline">
        <span className={nameClassName}>{displayName}</span>
        <span className={parenClassName}>
          {" ("}
          <span className={domainClassName}>{brandMeta.domain}</span>
          {")"}
        </span>
      </span>
    );
  }

  return (
    <span className="brand-lockup">
      <span className={nameClassName}>{displayName}</span>
      <span className={domainClassName}>{brandMeta.domain}</span>
    </span>
  );
}
