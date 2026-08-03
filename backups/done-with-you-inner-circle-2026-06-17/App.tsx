import { useEffect, useState } from "react";
import {
  FaBookOpenReader,
  FaFileLines,
  FaLaptopCode,
  FaSquareCheck,
} from "react-icons/fa6";
import { SiYoutube } from "react-icons/si";
import { Header } from "../components/Header";
import { menuItems, siteCopy } from "../site-data";

type MenuItem = (typeof menuItems)[number];

function MenuCard({ item, onLearnMore }: { item: MenuItem; onLearnMore: (item: MenuItem) => void }) {
  const cardSlug = item.title.toLowerCase().replaceAll(" ", "-");
  const isContentCard = item.visual === "content";
  const isLibraryCard = item.visual === "access";
  const isCollaborationCard = item.visual === "with-you";
  const isDirectLinkCard = item.visual === "content" || item.visual === "access";
  const actionBadge = isContentCard ? item.subscriberCount : undefined;
  const actionIcon = isCollaborationCard ? <span className="menu-card-action-icon" aria-hidden="true" /> : null;
  const openItem = () => {
    if (isDirectLinkCard) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }

    onLearnMore(item);
  };

  return (
    <article
      className={`menu-card menu-card-${cardSlug} menu-card-visual-${item.visual}`}
      role={isDirectLinkCard ? "link" : "button"}
      tabIndex={0}
      onClick={openItem}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openItem();
        }
      }}
      aria-label={isDirectLinkCard ? `Open ${item.title}` : `${siteCopy.cardAriaPrefix} ${item.title}`}
    >
      <div className="menu-card-stickers" aria-hidden="true">
        {item.stickers.map((sticker, index) => (
          <span className={`menu-card-sticker-${index + 1}`} key={sticker}>
            {sticker}
          </span>
        ))}
        {!isContentCard && !isLibraryCard && !isCollaborationCard ? (
          <span className={`menu-card-icon-sticker menu-card-icon-sticker-${item.visual}`}>
            <StickerIcon type={item.visual} />
          </span>
        ) : null}
      </div>
      <div className="menu-card-icon">
        <MenuSymbol type={item.visual} />
      </div>
      <div className="menu-card-copy">
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        {item.commercial ? <p className="menu-card-commercial">{item.commercial}</p> : null}
      </div>
      <div className="menu-card-actions">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            openItem();
          }}
        >
          {actionIcon}
          <span className={isDirectLinkCard ? "menu-card-action-label" : undefined}>{item.cta ?? siteCopy.cardCta}</span>
          {actionBadge ? (
            <span className="menu-card-action-badge">{actionBadge}</span>
          ) : null}
        </button>
      </div>
    </article>
  );
}

export function App() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  return (
    <div className="page-shell">
      <Header />

      <main id="top" className="main-panel">
        <section aria-labelledby="intro-title">
          <div className="intro-block">
            <h1 id="intro-title">{siteCopy.heroTitle}</h1>
            <p>{siteCopy.heroDescription}</p>
          </div>
        </section>

        <section id="menu" aria-label={siteCopy.menuAriaLabel} className="menu-list">
          <div className="menu-label">{siteCopy.menuLabel}</div>
          {menuItems.map((item) => (
            <MenuCard key={item.title} item={item} onLearnMore={setSelectedItem} />
          ))}
        </section>
      </main>
      {selectedItem ? <OfferModal item={selectedItem} onClose={() => setSelectedItem(null)} /> : null}
    </div>
  );
}

function OfferModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="offer-modal" role="dialog" aria-modal="true" aria-labelledby="offer-modal-title">
      <button className="offer-modal-backdrop" type="button" onClick={onClose} aria-label={siteCopy.closeModalLabel} />
      <article className="offer-modal-panel">
        <button className="offer-modal-close" type="button" onClick={onClose} aria-label={siteCopy.closeModalLabel}>
          ×
        </button>
        <div className="offer-modal-label">
          <MenuSymbol type={item.visual} compact />
          <span>{item.status}</span>
        </div>
        <div className="offer-modal-commercial">{item.commercial}</div>
        <h2 id="offer-modal-title">{item.title}</h2>
        <p>{item.modalIntro}</p>
        <div className="offer-modal-callouts">
          <section>
            <h3>{siteCopy.modalBestForLabel}</h3>
            <p>{item.bestFor}</p>
          </section>
          <section>
            <h3>{siteCopy.modalSmallPrintLabel}</h3>
            <p>{item.note}</p>
          </section>
        </div>
        <ul className="offer-modal-features">
          {item.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <a href={item.href}>
          <span>{item.meta}</span>
        </a>
      </article>
    </div>
  );
}

function StickerIcon({ type }: { type: MenuItem["visual"] }) {
  return (
    <span className="loose-icon-layer loose-icon-layer-for-you">
      <FaLaptopCode className="loose-react-icon loose-icon-ai-dev" />
      <FaFileLines className="loose-react-icon loose-icon-docs" />
      <FaSquareCheck className="loose-react-icon loose-icon-check" />
    </span>
  );
}

function MenuSymbol({ type, compact = false }: { type: MenuItem["visual"]; compact?: boolean }) {
  if (type === "content" && !compact) {
    return (
      <span className="menu-symbol menu-symbol-content menu-symbol-youtube" aria-hidden="true">
        <SiYoutube className="menu-symbol-youtube-icon" />
      </span>
    );
  }

  if (type === "access" && !compact) {
    return (
      <span className="menu-symbol menu-symbol-library" aria-hidden="true">
        <FaBookOpenReader className="menu-symbol-library-icon" />
      </span>
    );
  }

  if (type === "with-you" && !compact) {
    return (
      <span className="menu-symbol menu-symbol-with-you-simple" aria-hidden="true">
        <svg className="menu-symbol-inner-circle-art" viewBox="0 0 150 150" focusable="false">
          <path className="inner-circle-arc" d="M0 67C38 32 111 35 150 88" />
          <text className="inner-circle-word inner-circle-word-top" x="63" y="89" textAnchor="middle" textLength="78" lengthAdjust="spacingAndGlyphs">
            INNER
          </text>
          <text className="inner-circle-word inner-circle-word-bottom" x="84" y="113" textAnchor="middle" textLength="78" lengthAdjust="spacingAndGlyphs">
            CIRCLE
          </text>
        </svg>
      </span>
    );
  }

  return (
    <span className={`menu-symbol menu-symbol-${type} ${compact ? "menu-symbol-compact" : ""}`} aria-hidden="true">
      <svg className="menu-symbol-art" viewBox="0 0 160 160" focusable="false">
        <rect className="symbol-mark-tile" x="24" y="24" width="112" height="112" rx="29" />
        <circle className="symbol-mark-orb symbol-mark-orb-large" cx="88" cy="70" r="31" />
        <circle className="symbol-mark-orb symbol-mark-orb-small" cx="66" cy="88" r="22" />
        <path className="symbol-mark-a" d="M54 105 70 56h14l-16 49H54Zm30-49h14l17 49h-15L84 56Z" />

        {type === "content" ? (
          <>
            <path className="symbol-service-line" d="M45 116h27M86 116h28" />
            <path className="symbol-service-fill" d="M104 47v17l15-8.5L104 47Z" />
            <circle className="symbol-service-dot" cx="43" cy="55" r="5" />
          </>
        ) : null}

        {type === "access" ? (
          <>
            <rect className="symbol-service-card symbol-library-tile symbol-library-video" x="39" y="42" width="30" height="25" rx="7" />
            <path className="symbol-service-fill symbol-library-play" d="M51 49v11l10-5.5L51 49Z" />
            <rect className="symbol-service-card symbol-library-tile symbol-library-doc" x="91" y="43" width="30" height="25" rx="7" />
            <path className="symbol-service-line symbol-library-line" d="M98 53h15M98 59h10" />
            <rect className="symbol-service-card symbol-library-tile symbol-library-code" x="42" y="94" width="30" height="25" rx="7" />
            <path className="symbol-service-line symbol-library-line" d="m53 101-5 5 5 5M61 101l5 5-5 5" />
            <circle className="symbol-service-node symbol-library-agent" cx="106" cy="107" r="13" />
            <path className="symbol-service-line symbol-library-agent-line" d="M99 107h14M106 100v14" />
          </>
        ) : null}

        {type === "with-you" ? (
          <>
            <circle className="symbol-service-node" cx="44" cy="55" r="8" />
            <circle className="symbol-service-node" cx="116" cy="59" r="8" />
            <circle className="symbol-service-node symbol-service-node-fill" cx="103" cy="111" r="8" />
            <path className="symbol-service-line" d="M52 56c18-12 38-12 56 1M80 99c7 7 14 11 23 12" />
          </>
        ) : null}

        {type === "for-you" ? (
          <>
            <rect className="symbol-service-card symbol-service-window" x="38" y="42" width="38" height="27" rx="8" />
            <path className="symbol-service-line" d="M47 56h20M87 111l10 10 22-28" />
            <circle className="symbol-service-dot" cx="115" cy="49" r="5" />
          </>
        ) : null}
      </svg>
    </span>
  );
}
