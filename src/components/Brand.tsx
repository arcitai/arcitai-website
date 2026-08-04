import { runtimeAsset, siteData } from "../site-data";

type BrandProps = {
  footer?: boolean;
};

export function Brand({ footer = false }: BrandProps) {
  return (
    <a
      className={footer ? "footer-brand" : "brand-lockup"}
      href="#top"
      aria-label={`${siteData.brand}, ${footer ? "back to top" : "top"}`}
    >
      <img className="brand-mark" src={runtimeAsset("assets/arcitai-mark-final.svg")} alt="" />
      <span className={footer ? undefined : "brand-wordmark"}>{siteData.brand}</span>
    </a>
  );
}
