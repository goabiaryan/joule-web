/** Fee line with optional leading copy, superscript *, and footnote. */
export default function EngagementPrice({ pricing, className }) {
  const showStar = pricing.showFootnoteStar !== false;

  return (
    <>
      <p className={className ? `price ${className}` : "price"}>
        {pricing.feeLead}
        {pricing.feeAmount}
        {showStar ? <sup className="price-sup">*</sup> : null}
        {pricing.feeTail}
      </p>
      {pricing.feeFootnote ? (
        <p className="price-footnote">
          {showStar ? (
            <>
              <span className="price-footnote-mark">*</span> {pricing.feeFootnote}
            </>
          ) : (
            pricing.feeFootnote
          )}
        </p>
      ) : null}
    </>
  );
}
