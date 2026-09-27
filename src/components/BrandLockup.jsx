import { brandMeta } from "../content/phase1Product.js";

/** Company name + memorable domain (Notion / notion.so pattern). */
export default function BrandLockup({ nameClassName = "brand-name", domainClassName = "brand-domain" }) {
  return (
    <span className="brand-lockup">
      <span className={nameClassName}>{brandMeta.name.toUpperCase()}</span>
      <span className={domainClassName}>{brandMeta.domain}</span>
    </span>
  );
}
