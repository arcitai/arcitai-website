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
  process: {
    chapters: [
      {
        time: "00:00 / THE BUSINESS",
        title: "Understand the work",
        description: "Value, people, decisions, tools, and handoffs.",
      },
      {
        time: "00:35 / THE CONTEXT",
        title: "Define what success looks like",
        description: "Data, rules, examples, exceptions, and evidence.",
      },
      {
        time: "01:05 / THE BUILD",
        title: "Ship the smallest real version",
        description: "Reduce the scope. Keep the standards.",
      },
      {
        time: "01:40 / THE ROLLOUT",
        title: "Make it part of the work",
        description: "Deploy, document, train, observe, and improve.",
      },
    ],
  },
  scope: [
    {
      step: "Spec",
      title: "Understand the outcome before choosing the solution",
      description:
        "Define the constraint, users, current work, and the change that would make the build worthwhile.",
      proof: "AIOS / DISCOVERY + CONTEXT",
      symbol: "◇",
    },
    {
      step: "Build",
      title: "Ship the smallest complete slice",
      description:
        "Choose the right shape, then implement real behaviour from interface to integration, testing, and deployment.",
      proof: "SOLUTION TEMPLATE / BUILD",
      symbol: "▦",
    },
    {
      step: "Review",
      title: "Check the result against the work",
      description:
        "Review correctness, failure paths, security, evidence, and complexity against the original intent.",
      proof: "REVIEW / DOCUMENTATION",
      symbol: "⌜",
    },
    {
      step: "Ship",
      title: "Launch with a recovery path",
      description:
        "Release, verify on real work, document the operating path, and hand over access, knowledge, and recovery.",
      proof: "SHIP / HANDOVER",
      symbol: "+",
    },
  ],
} as const;
