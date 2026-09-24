export const runtimeAsset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const siteData = {
  brand: "Arc'IT AI",
  links: {
    onlinesourdough: "https://onlinesourdough.com",
    gustavOnline: "https://gustavonline.com",
    email: "mailto:hello@arcitai.com",
  },
  inquiry: {
    endpoint: import.meta.env.VITE_INQUIRY_ENDPOINT ?? "https://api.arcitai.com/project-inquiry",
    roles: ["Founder / owner", "Leadership", "Operations", "Product / technology", "Other"],
    companySizes: ["1–5", "6–15", "16–50", "51–150", "150+"],
    revenue: [
      { label: "Pre-revenue", value: "Pre-revenue" },
      { label: "Under DKK 50k", value: "Under DKK 50k / month" },
      { label: "DKK 50–100k", value: "DKK 50–100k / month" },
      { label: "DKK 100–500k", value: "DKK 100–500k / month" },
      { label: "DKK 500k–1m", value: "DKK 500k–1m / month" },
      { label: "DKK 1m+", value: "DKK 1m+ / month" },
    ],
  },
} as const;
