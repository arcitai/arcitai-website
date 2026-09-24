import { useEffect, useRef } from "react";
import { mountFactoryFlow } from "../factory-interaction";

export function FactoryFlow() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (ref.current) return mountFactoryFlow(ref.current);
  }, []);
  return (
    <figure ref={ref} className="method-figure" aria-describedby="method-caption">
      <button
        className="method-flow motion-scene"
        type="button"
        aria-label="Preview the open factory workflow"
        aria-pressed="false"
        aria-describedby="method-hint"
      >
        <span className="method-mobile-stages" aria-hidden="true">
          <span>Scope &amp; access</span>
          <span>Code &amp; tests</span>
          <span>Review &amp; defence</span>
          <span>Approval &amp; handoff</span>
        </span>
        <svg
          className="method-canvas"
          viewBox="0 0 1000 220"
          role="img"
          aria-label="Scoped access, code and tests, independent review and scoped defence work, then operator approval and handoff. An illustration, not live results."
        >
          <defs>
            <linearGradient
              id="arcit-method-progress"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="1000"
            >
              <stop className="method-stop" offset="0.125" />
              <stop className="method-stop" offset="0.375" />
              <stop className="method-stop" offset="0.625" />
              <stop className="method-stop" offset="0.875" />
            </linearGradient>
          </defs>
          <g className="method-stage" data-stage="0">
            <text x="125" y="22" textAnchor="middle">
              SCOPE &amp; ACCESS
            </text>
            <path className="method-track" d="M60 36H190" />
            <path className="method-bar" d="M60 36H60" />
          </g>
          <g className="method-stage" data-stage="1">
            <text x="375" y="22" textAnchor="middle">
              CODE &amp; TESTS
            </text>
            <path className="method-track" d="M310 36H440" />
            <path className="method-bar" d="M310 36H310" />
          </g>
          <g className="method-stage" data-stage="2">
            <text x="625" y="22" textAnchor="middle">
              REVIEW &amp; DEFENCE
            </text>
            <path className="method-track" d="M560 36H690" />
            <path className="method-bar" d="M560 36H560" />
          </g>
          <g className="method-stage" data-stage="3">
            <text x="875" y="22" textAnchor="middle">
              APPROVAL &amp; HANDOFF
            </text>
            <path className="method-track" d="M810 36H940" />
            <path className="method-bar" d="M810 36H810" />
          </g>
          <path className="method-guide" d="M125 68V206M375 68V206M625 68V206M875 68V206" />
          <path className="method-wall" d="M20 94H980M20 186H980" />
          <g className="method-particles"></g>
        </svg>
      </button>
      <div className="method-controls">
        <p id="method-hint" className="sr-only">
          Scroll down to open, up to close. Or move across.
        </p>
      </div>
      <figcaption id="method-caption">Illustrated workflow · not live project data</figcaption>
    </figure>
  );
}
