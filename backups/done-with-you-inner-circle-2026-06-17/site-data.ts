export const siteCopy = {
  heroTitle: "Same value. Different deliveries.",
  heroDescription:
    "AI writes code, but struggles with abstraction. I'll help you connect the dots so going AI-first doesn't scale tech debt with every new release. Learn for free, access monthly updates and frameworks, work with me directly, or just hand me the project so you can focus on growing your business.",
  menuLabel: "deliveries",
  menuAriaLabel: "Arcitai deliveries",
  cardCta: "Learn more →",
  cardAriaPrefix: "Open details for",
  modalBestForLabel: "Best for",
  modalSmallPrintLabel: "Small print",
  closeModalLabel: "Close offer details",
};

export type MenuItem = {
  title: string;
  status: string;
  commercial: string;
  cta?: string;
  subscriberCount?: string;
  stickers: string[];
  description: string;
  meta: string;
  visual: "content" | "access" | "with-you" | "for-you";
  href: string;
  details: string;
  modalIntro: string;
  bestFor: string;
  note: string;
  features: string[];
};

export const menuItems: MenuItem[] = [
  {
    title: "Content",
    status: "Open now",
    commercial: "",
    cta: "Subscribe",
    subscriberCount: "38",
    stickers: [],
    description: "Watch the thinking behind AI-first IT architecture, software and business development.",
    meta: "start here",
    visual: "content",
    href: "https://www.youtube.com/@gustavonline",
    details:
      "The public layer connected to Gustav Online. I share the thinking, small experiments and useful pieces from the work before it becomes a template, a course or a client project.",
    modalIntro:
      "This is the free layer. It is not polished course content. It is the visible part of the work: notes, videos, examples and the occasional useful mess.",
    bestFor: "You want to watch first, borrow ideas and decide if my way of thinking is useful.",
    note: "Start here if you have more curiosity than budget right now.",
    features: [
      "Videos, notes and public examples",
      "Open-source templates when they are useful enough to share",
      "Good for deciding whether my way of working makes sense to you",
    ],
  },
  {
    title: "Do-it-yourself",
    status: "Open now",
    commercial: "",
    cta: "Access now",
    stickers: [],
    description: "Practical library of frameworks, systems and agents you can use today.",
    meta: "access now",
    visual: "access",
    href: "https://diy.arcitai.com",
    details:
      "Monthly access to the resources behind the work: courses, templates, ebooks and small technical playbooks. Not made to turn you into a full-time developer. Made so you stop feeling blind when software, AI and automation enter the room.",
    modalIntro:
      "Monthly access to the things I would otherwise explain again and again: templates, walkthroughs, small courses, ebooks and practical maps.",
    bestFor: "You have time to learn and want enough technical understanding to ask better questions.",
    note: "Not a magic shortcut. More like a toolbox with fewer buzzwords.",
    features: [
      "Courses, templates, ebooks and walkthroughs",
      "Reusable maps for turning ideas into first versions",
      "Plain-language technical explanations without tool hype",
      "Low monthly access when the library opens",
    ],
  },
  {
    title: "Done-with-you",
    status: "Limited availability",
    commercial: "",
    cta: "Limited availability",
    stickers: [],
    description: "Private 1:1 access for direct communication, calls and pair programming.",
    meta: "email me",
    visual: "with-you",
    href: "mailto:hello@arcitai.com?subject=Arcitai%201:1%20consultancy",
    details:
      "A fixed 3, 6 or 12 month commitment paid upfront. This is the closer lane: your work, your questions, your pace, with me close enough to review the messy parts before they become expensive.",
    modalIntro:
      "This is not a weekly coaching call and good luck. It is a private lane where I can look over your shoulder, review decisions and help you avoid building yourself into a corner.",
    bestFor: "You can do parts yourself, but want someone technical close enough to catch the expensive mistakes early.",
    note: "Private life still exists. The access is real, but it is reasonable-use access.",
    features: [
      "Private Slack channel with direct text communication",
      "24-hour response time on weekdays",
      "Unlimited Slack huddles when that is the right format",
      "Pair programming and over-the-shoulder sessions",
      "Reviews, debugging and technical decisions",
      "Reasonable-use access: close collaboration, not 24/7 employment",
      "For people who want to become more technical while still moving the work forward",
    ],
  },
  {
    title: "Done-for-you",
    status: "By request",
    commercial: "Project estimate + monthly maintenance optional",
    stickers: ["AI First Development", "Docs > magic", "Built for handoff"],
    description: "When the problem is clear enough and your time is better spent growing the business.",
    meta: "email me",
    visual: "for-you",
    href: "mailto:hello@arcitai.com?subject=Arcitai%20agency%20service",
    details:
      "The project format. We estimate the work, build the first working version and make handover, documentation and simple maintenance part of the development from day one. I do not want you stuck with a magic box only I understand.",
    modalIntro:
      "AI-first development means I build with AI and for AI where it makes sense: faster iteration, cheaper operation, easier handover and less mystery around what was made.",
    bestFor: "You know roughly what should exist, but you do not have the time to become technical before it needs to work.",
    note: "The goal is not a fancy black box. The goal is something useful, documented, maintainable and safe enough to keep using.",
    features: [
      "Project estimate before the build starts",
      "Internal tools, automations, prototypes or integrations",
      "Documentation, handover and simple maintenance built into the process",
      "Monthly maintenance, support and feature work available after delivery",
      "For teams with more money than time, or a need that is already clear enough",
    ],
  },
];
