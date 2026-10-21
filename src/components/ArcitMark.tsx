import { currentArcitVariant, type ArcitVariant } from "../arcit-brand";

function Pieces() {
  return (
    <>
      <path d="M26 2h14l-6 14H20Z" />
      <path d="M19 18h14l-6 14H13Z" />
      <path d="M12 34h14l-6 14H6Z" />
      <rect x="42" y="2" width="14" height="14" />
      <rect x="36" y="18" width="14" height="14" />
      <rect x="48" y="34" width="14" height="14" />
    </>
  );
}
export function ArcitMark({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="4 -4 60 60" width="88" height="88" aria-hidden="true">
      <Pieces />
    </svg>
  );
}
export function ArcitBadge({
  className = "",
  variant = currentArcitVariant(),
}: {
  className?: string;
  variant?: ArcitVariant;
}) {
  return (
    <svg
      className={`arcit-badge arcit-badge-${variant} ${className}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <rect className="badge-ground" x="1" y="1" width="98" height="98" rx="16" />
      <path className="badge-grid" d="M20 8v84M50 8v84M80 8v84M8 20h84M8 50h84M8 80h84" />
      <g className="badge-pieces" transform="translate(15 22) scale(1.1)">
        <Pieces />
      </g>
    </svg>
  );
}
