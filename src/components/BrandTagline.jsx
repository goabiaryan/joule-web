import { BRAND_CATEGORY, BRAND_TAGLINE } from "../content/phase1Product.js";

export default function BrandTagline({ as: Tag = "span", className = "", variant = "capacity" }) {
  const classes = ["brand-tagline-line", className].filter(Boolean).join(" ");
  const text = variant === "category" ? BRAND_CATEGORY : BRAND_TAGLINE;
  return <Tag className={classes}>{text}</Tag>;
}
