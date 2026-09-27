import { publicAbout } from "../content/phase1Product.js";

export default function AboutJoule() {
  return (
    <section className="section about-joule-section" id={publicAbout.id} aria-labelledby="about-joule-heading">
      <h2 className="about-joule-heading" id="about-joule-heading">
        {publicAbout.title}
      </h2>
      <p className="about-joule-lead">{publicAbout.lead}</p>
      <ul className="about-joule-list">
        {publicAbout.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <p className="about-joule-audience">{publicAbout.audience}</p>
    </section>
  );
}
