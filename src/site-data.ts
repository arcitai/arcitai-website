export type CtaLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type InquiryField = {
  id: string;
  label: string;
  placeholder: string;
  type: "email" | "select" | "textarea" | "text";
  options?: string[];
};

export type Testimonial = {
  project: string;
  client: string;
  quote: string;
  outcome: string;
  type: string;
};

export const siteData = {
  brand: "Arcade AI",
  legalName: "Arcitai",
  themeStorageKey: "arcitai-theme",
  seo: {
    siteUrl: "https://arcitai.com",
    themeColor: "#061b20",
    title: "Arcade AI | AI-native software, done for you",
    description:
      "Arcade AI is the done-for-you agency lane for AI-native software, automations, internal tools, and systems people can understand and AI can safely extend.",
    ogTitle: "Arcade AI - AI-native software, done for you",
    ogDescription:
      "Project-based software and automation work built for AI-assisted iteration, human ownership, documentation, and handover.",
    ogImage: "/assets/arcitai-mark.svg",
  },
  notion: {
    inquiryDatabaseUrl: "https://app.notion.com/p/145c4bea0b134057abf57fcc03d4545a",
    inquiryDataSourceId: "a156e7e9-8a3a-47bb-93ef-734bfa24361d",
    inquiryFormViewId: "3852e04d-50d1-81ef-9757-000c2aa62940",
    testimonialsDatabaseUrl: "https://app.notion.com/p/fa36f9886cf7421fb2b10c429aba5797",
    testimonialsDataSourceId: "03dc0cc0-a390-4b3a-8158-21646b7794d0",
  },
  hero: {
    eyebrow: "AI-native software studio",
    title: "Software built for AI to extend and humans to own.",
    description:
      "Done-for-you internal tools, automations, prototypes, and architecture cleanup for founders and teams who need the first useful version to work without becoming a black box.",
    primaryCta: {
      label: "Start project inquiry",
      href: "#inquiry",
    },
    secondaryCta: {
      label: "Read the method",
      href: "#method",
    },
    signals: ["AI-native systems", "Readable architecture", "Handover included"],
  },
  inquiry: {
    label: "Project inquiry",
    title: "Send the rough version.",
    description: "A few lines are enough: what should exist, what already exists, and when it needs to be useful.",
    formUrl: "",
    embedTitle: "Arcade AI project inquiry form",
    email: "hello@arcitai.com",
    subject: "Arcade AI project inquiry",
    submitLabel: "Open email inquiry",
    fallbackLabel: "Email directly",
    note: "This opens a prefilled email for now. The public Notion form can replace it once the share link is published.",
    fields: [
      {
        id: "name",
        label: "Name",
        placeholder: "Your name",
        type: "text",
      },
      {
        id: "email",
        label: "Email",
        placeholder: "you@company.com",
        type: "email",
      },
      {
        id: "projectType",
        label: "Project type",
        placeholder: "Choose a lane",
        type: "select",
        options: ["Internal tool", "Automation or agent", "Prototype", "Architecture review", "Not sure yet"],
      },
      {
        id: "context",
        label: "Context",
        placeholder: "What should exist, what already exists, and what would make this a win?",
        type: "textarea",
      },
    ] satisfies InquiryField[],
  },
  testimonials: {
    label: "Project testimonials",
    title: "Project testimonials.",
    description:
      "Approved client quotes and outcomes can be published here as soon as they are ready. Until then, the cards describe the proof this page should collect.",
    items: [
      {
        project: "Internal tool",
        client: "Awaiting approved quote",
        quote: "The work should be easy to operate, easy to explain, and documented well enough that the business is not dependent on the builder.",
        outcome: "Readable system + handover",
        type: "Tooling",
      },
      {
        project: "Automation",
        client: "Awaiting approved quote",
        quote: "Automations should produce concrete outputs and include logs, review points, and failure handling from the start.",
        outcome: "Workflow with ownership",
        type: "Automation",
      },
      {
        project: "Prototype",
        client: "Awaiting approved quote",
        quote: "The first version should be small enough to ship and clear enough for AI to help extend without multiplying confusion.",
        outcome: "First useful version",
        type: "Prototype",
      },
    ] satisfies Testimonial[],
  },
  method: {
    label: "Method",
    title: "AI-first does not mean AI-only.",
    description:
      "Arcade AI builds with AI and for AI where it helps, but the system still needs human-readable architecture, documentation, logs, and ownership. That is the difference between a fast demo and software the business can keep using.",
    points: ["Clear scope before speed", "Small first version before platform", "Documentation before handover"],
  },
  ecosystem: {
    label: "Connected work",
    title: "One ecosystem, three roles.",
    links: [
      {
        label: "Gustav Online",
        href: "https://gustavonline.com",
        description: "Personal brand, notes, content, and public work.",
      },
      {
        label: "onlinesourdough",
        href: "https://onlinesourdough.com",
        description: "The method language for software people can understand and AI can safely extend.",
      },
    ],
  },
  footer: {
    copyright: "© 2026 Arcade AI",
    links: [
      {
        label: "Email",
        href: "mailto:hello@arcitai.com",
      },
      {
        label: "Gustav Online",
        href: "https://gustavonline.com",
        external: true,
      },
      {
        label: "onlinesourdough",
        href: "https://onlinesourdough.com",
        external: true,
      },
    ] satisfies CtaLink[],
  },
};
