import { familyHref } from "./family/preview";

export const runtimeAsset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const siteData = {
  brand: "Arc'IT AI",
  video: {
    walkthrough: import.meta.env.VITE_VSL_VIDEO_URL?.trim() || undefined,
  },
  links: {
    onlinesourdough: familyHref("onlinesourdough"),
    gustavOnline: familyHref("gustavonline"),
    email: "mailto:hello@arcitai.com",
  },
  inquiry: {
    endpoint: import.meta.env.VITE_INQUIRY_ENDPOINT ?? "https://api.arcitai.com/project-inquiry",
    roles: ["Founder / owner", "Leadership", "Operations", "Product / technology", "Other"],
    companySizes: ["1–5", "6–15", "16–50", "51–150", "150+"],
  },
} as const;
