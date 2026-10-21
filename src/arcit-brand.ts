import { localReview } from "./family/preview";

export type ArcitVariant = "outline" | "tonal" | "github";
export function currentArcitVariant(): ArcitVariant {
  const value = localReview ? new URLSearchParams(window.location.search).get("brand") : null;
  return value === "outline" || value === "tonal" ? value : "github";
}
