import { BRAND_TAGLINE } from "../content/phase1Product.js";

export default function BrandTagline({ as: Tag = "span", className = "" }) {
  const classes = ["brand-tagline-line", className].filter(Boolean).join(" ");
  return <Tag className={classes}>{BRAND_TAGLINE}</Tag>;
}
