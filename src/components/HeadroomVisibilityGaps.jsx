import { useEffect, useMemo, useState } from "react";

const BUFFER_MS = 1100;
const STAGGER_MS = 520;

export default function HeadroomVisibilityGaps({ gaps, gapsMessage, heading, loadingLabel }) {
  const [phase, setPhase] = useState("idle");
  const [revealed, setRevealed] = useState(0);

  const gapKey = useMemo(() => gaps.join("\0"), [gaps]);

  useEffect(() => {
    if (!gaps.length) {
      setPhase("idle");
      setRevealed(0);
      return undefined;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setPhase("done");
      setRevealed(gaps.length);
      return undefined;
    }

    setPhase("buffer");
    setRevealed(0);

    const timers = [];
    timers.push(
      window.setTimeout(() => {
        setPhase("revealing");
        setRevealed(1);
      }, BUFFER_MS),
    );

    for (let i = 1; i < gaps.length; i += 1) {
      timers.push(
        window.setTimeout(() => setRevealed(i + 1), BUFFER_MS + i * STAGGER_MS),
      );
    }

    if (gaps.length > 0) {
      timers.push(
        window.setTimeout(
          () => setPhase("done"),
          BUFFER_MS + (gaps.length - 1) * STAGGER_MS + 400,
        ),
      );
    }

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [gapKey, gaps.length]);

  if (!gaps.length) {
    return (
      <div className="headroom-check-gaps">
        <p className="headroom-check-gaps-heading">{heading}</p>
        <p className="headroom-check-gaps-empty">{gapsMessage}</p>
      </div>
    );
  }

  const isBuffering = phase === "buffer";
  const isRevealing = phase === "revealing" || (phase === "done" && revealed < gaps.length);

  return (
    <div
      aria-busy={isBuffering || isRevealing}
      className={`headroom-check-gaps headroom-check-gaps-stream${phase === "done" ? " is-done" : ""}`}
    >
      <p className="headroom-check-gaps-heading">{heading}</p>
      {isBuffering ? (
        <p aria-live="polite" className="headroom-check-gaps-status">
          {loadingLabel}…
        </p>
      ) : null}
      <ul className="headroom-check-gaps-stream-list">
        {gaps.slice(0, revealed).map((gap, index) => (
          <li
            className={`headroom-check-gaps-stream-item${index === revealed - 1 && phase !== "done" ? " is-latest" : ""}`}
            key={gap}
          >
            {gap}
          </li>
        ))}
      </ul>
    </div>
  );
}
