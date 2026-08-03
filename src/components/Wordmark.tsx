import { siteData } from "../site-data";

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" aria-label={siteData.brand}>
      <div className="arc-mark">
        <span className="arc-mark-orb arc-mark-orb-a" />
        <span className="arc-mark-orb arc-mark-orb-b" />
        <span className="arc-mark-letter">Ʌ</span>
      </div>
      {!compact ? (
        <span className="text-[15px] font-bold tracking-normal text-[var(--text)]">{siteData.brand}</span>
      ) : null}
    </div>
  );
}
