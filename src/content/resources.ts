export type ResourcePost = {
  slug: string;
  title: string;
  description: string;
  bgColor: string; // used to match homepage resource cards
  readingTime?: string;
  date?: string; // ISO string
  seoTitle?: string;
  metaDescription?: string;
  faq?: Array<{ question: string; answer: string }>;
  body: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "h3"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "links"; items: Array<{ text: string; href: string }> }
    | { type: "cta" }
    | { type: "callout"; title: string; text: string }
  >;
};

/**
 * Add/edit posts here.
 * - These power /resources and /resources/:slug
 * - bgColor keeps the same colourful card vibe as the homepage ResourcesSection
 */
export const RESOURCE_POSTS: ResourcePost[] = [
  {
    slug: "what-an-icp-really-is",
    title: "What Is an Ideal Customer Profile (ICP)?",
    description:
      "Learn what an Ideal Customer Profile (ICP) is, how it differs from an ideal customer persona or avatar, and how to define and validate the right segment.",
    bgColor: "#BBA0E5",
    readingTime: "9 min read",
    date: "2026-02-13",
    seoTitle:
      "What Is an Ideal Customer Profile (ICP)? Definition, Framework and Validation Guide",
    metaDescription:
      "Learn what an Ideal Customer Profile (ICP) is, how it differs from an ideal customer persona or avatar, and how to define and validate the right segment.",
    faq: [
      {
        question: "What is the difference between an ICP and a buyer persona?",
        answer:
          "An ICP defines the best-fit segment for your business. A buyer persona describes the individual decision-maker within that segment. Define the ICP first, then build personas inside it.",
      },
      {
        question: "How do you validate an ICP?",
        answer:
          "Validate with behavioural and commercial outcomes: conversion rate by segment, sales cycle length, retention rate, customer lifetime value, and revenue contribution. Consistent outperformance is evidence of ICP fit.",
      },
      {
        question: "Can an ICP change over time?",
        answer:
          "Yes. ICPs should be reviewed when product, pricing, market conditions, or customer behaviour changes.",
      },
      {
        question: "Is an ICP only for SaaS companies?",
        answer:
          "No. ICPs are useful for SaaS, agencies, consultancies, e-commerce brands, and B2B service businesses.",
      },
      {
        question: "How often should you update an ICP?",
        answer:
          "Review at least quarterly in fast-moving markets, and after major changes such as repositioning, pricing updates, or market expansion.",
      },
    ],
    body: [
      { type: "h2", text: "Direct Answer Summary" },
      {
        type: "p",
        text:
          "An Ideal Customer Profile (ICP) is a clear, evidence-based description of the customer segment that is the best commercial fit for your offer.",
      },
      {
        type: "p",
        text:
          "The right ICP identifies the customers who convert faster, stay longer, generate higher lifetime value, and achieve better outcomes.",
      },
      {
        type: "p",
        text:
          "Without a defined ICP, businesses struggle with product-market fit, attract low-quality leads, and make inconsistent marketing and sales decisions.",
      },
      { type: "h2", text: "What is an Ideal Customer Profile?" },
      {
        type: "p",
        text:
          "An Ideal Customer Profile defines the type of customer that delivers the strongest commercial outcomes for your business.",
      },
      {
        type: "p",
        text:
          "It is not a general audience description. It is a prioritisation framework.",
      },
      {
        type: "ul",
        items: [
          "Commercial context (revenue, size, maturity)",
          "Active pain points",
          "Buying triggers",
          "Objections and friction",
          "Channels of attention",
          "Measurable performance signals",
        ],
      },
      { type: "h2", text: "Why does an ICP matter for growth?" },
      {
        type: "p",
        text:
          "Without an ICP, teams often target anyone who might buy. That increases waste and reduces consistency.",
      },
      {
        type: "ul",
        items: [
          "Lower conversion rates",
          "Higher acquisition costs",
          "Longer sales cycles",
          "Higher churn in new customers",
          "Unclear product and messaging decisions",
        ],
      },
      {
        type: "p",
        text: "A strong ICP improves:",
      },
      {
        type: "ul",
        items: [
          "Targeting accuracy",
          "Sales qualification",
          "Retention and lifetime value",
          "Product-market fit decisions",
          "Cross-team alignment",
        ],
      },
      { type: "h2", text: "ICP vs buyer persona: what's the difference?" },
      {
        type: "p",
        text: "Use both, but in the right order.",
      },
      {
        type: "ul",
        items: [
          "ICP defines the best-fit customer segment for your business.",
          "Buyer persona defines the individual decision-maker inside that segment.",
          "ICP answers: who should we target?",
          "Persona answers: how does this person decide?",
        ],
      },
      {
        type: "p",
        text: "Practical order:",
      },
      {
        type: "ul",
        items: [
          "Define ICP using commercial fit and performance signals.",
          "Build personas within that ICP.",
          "Tailor messaging to each persona without changing segment focus.",
        ],
      },
      {
        type: "h2",
        text: "Is an Ideal Customer Profile the same as an ideal customer persona or avatar?",
      },
      {
        type: "p",
        text:
          "The terms Ideal Customer Profile (ICP), ideal customer persona, and ideal customer avatar are often used interchangeably, but they are not identical.",
      },
      {
        type: "p",
        text:
          "An Ideal Customer Profile defines the best-fit customer segment for your business.",
      },
      {
        type: "p",
        text:
          "An ideal customer persona focuses on the individual decision-maker within that segment and how they evaluate and purchase solutions.",
      },
      {
        type: "p",
        text:
          "An ideal customer avatar is typically a simplified marketing label for a fictionalised representation of your target buyer.",
      },
      {
        type: "p",
        text: "In practical terms:",
      },
      {
        type: "ul",
        items: [
          "ICP = strategic segment definition",
          "Persona = individual behaviour and decision process",
          "Avatar = simplified marketing shorthand",
        ],
      },
      {
        type: "p",
        text:
          "For structured growth decisions, defining the ICP first is critical. Personas and avatars are built within that definition, not instead of it.",
      },
      { type: "cta" },
      { type: "h2", text: "How do you build an ICP step by step?" },
      { type: "h3", text: "1) What goals are they trying to achieve?" },
      {
        type: "p",
        text: "Define measurable outcomes your best customers care about.",
      },
      {
        type: "ul",
        items: [
          "Improve conversion rate",
          "Reduce churn",
          "Increase qualified demand",
          "Grow revenue predictably",
        ],
      },
      { type: "h3", text: "2) What pains are frustrating or costly right now?" },
      {
        type: "p",
        text: "Map active friction, not generic challenges.",
      },
      {
        type: "ul",
        items: [
          "Marketing is not converting",
          "Sales cycles are too long",
          "Positioning is unclear",
          "Wrong-fit leads are entering the funnel",
        ],
      },
      { type: "h3", text: "3) What triggers make them look for help?" },
      {
        type: "p",
        text: "Identify events that create urgency.",
      },
      {
        type: "ul",
        items: [
          "Revenue plateau",
          "Product launch",
          "Investor pressure",
          "Team changes",
          "Declining performance metrics",
        ],
      },
      { type: "h3", text: "4) What objections could stop them buying?" },
      {
        type: "p",
        text: "Capture recurring objections early.",
      },
      {
        type: "ul",
        items: [
          "We can do this internally.",
          "This is not urgent yet.",
          "The cost feels high.",
          "We tried this before.",
        ],
      },
      {
        type: "h3",
        text: "5) Where do they spend attention and how can you reach them?",
      },
      {
        type: "p",
        text: "Turn the ICP into channel and content choices.",
      },
      {
        type: "ul",
        items: [
          "Channels (for example LinkedIn, newsletters, communities)",
          "Formats (guides, case studies, webinars, podcasts)",
          "Trusted voices and sources",
        ],
      },
      { type: "h2", text: "What does a strong ICP look like in practice?" },
      {
        type: "p",
        text: "Weak ICP: B2B SaaS companies with 10-50 employees.",
      },
      {
        type: "p",
        text:
          "Strong ICP: B2B SaaS founders with GBP500k-GBP2m ARR, churn above 8% monthly, and a recent Customer Success hire, aiming to improve retention before their next funding round.",
      },
      {
        type: "p",
        text: "Why the stronger version works:",
      },
      {
        type: "ul",
        items: [
          "Clear commercial context",
          "Clear active pain",
          "Clear timing trigger",
          "Clear qualification criteria",
        ],
      },
      { type: "h2", text: "What are common ICP mistakes?" },
      {
        type: "ul",
        items: [
          "Making the ICP too broad",
          "Using aspiration instead of data",
          "Confusing industry with fit",
          "Ignoring timing and buying triggers",
          "Skipping validation against outcomes",
          "Not updating the ICP as the business evolves",
        ],
      },
      { type: "h2", text: "What are signs you have the wrong ICP?" },
      {
        type: "ul",
        items: [
          "High traffic but weak conversion",
          "Long sales cycles with low close rates",
          "Churn rising in new accounts",
          "Messaging changes every quarter",
          "Sales and marketing disagree on lead quality",
        ],
      },
      {
        type: "p",
        text:
          "Quick sentence test: We help [specific customer type] with [specific problem] achieve [specific outcome]. If this stays vague, your ICP needs refining.",
      },
      { type: "h2", text: "When should you use ICP Generator?" },
      {
        type: "p",
        text:
          "Manual ICP documents often become inconsistent, outdated or influenced by opinion rather than data.",
      },
      {
        type: "p",
        text: "Use a structured ICP system when:",
      },
      {
        type: "ul",
        items: [
          "Teams disagree on who the real target customer is",
          "Marketing attracts volume but not qualified demand",
          "Sales cycles are unpredictable",
          "Churn is rising in new accounts",
          "Product-market fit feels unstable",
          "You are repositioning, launching, or entering a new segment",
        ],
      },
      {
        type: "p",
        text: "ICP Generator provides:",
      },
      {
        type: "ul",
        items: [
          "A structured decision-making framework",
          "A repeatable validation process",
          "Clear qualification criteria",
          "Shared language across marketing, sales and product",
        ],
      },
      {
        type: "p",
        text:
          "It turns ICP work from a brainstorming exercise into an operational growth system.",
      },
      { type: "h2", text: "Frequently Asked Questions" },
      { type: "h3", text: "What is the difference between an ICP and a buyer persona?" },
      {
        type: "p",
        text:
          "An ICP defines the best-fit segment for your business. A buyer persona describes the individual decision-maker within that segment. Define the ICP first, then build personas inside it.",
      },
      { type: "h3", text: "How do you validate an ICP?" },
      {
        type: "p",
        text: "Validate with behavioural and commercial outcomes:",
      },
      {
        type: "ul",
        items: [
          "Conversion rate by segment",
          "Sales cycle length",
          "Retention rate",
          "Customer lifetime value",
          "Revenue contribution",
        ],
      },
      {
        type: "p",
        text: "Consistent outperformance is evidence of ICP fit.",
      },
      { type: "h3", text: "Can an ICP change over time?" },
      {
        type: "p",
        text:
          "Yes. ICPs should be reviewed when product, pricing, market conditions, or customer behaviour changes.",
      },
      { type: "h3", text: "Is an ICP only for SaaS companies?" },
      {
        type: "p",
        text:
          "No. ICPs are useful for SaaS, agencies, consultancies, e-commerce brands, and B2B service businesses.",
      },
      { type: "h3", text: "How often should you update an ICP?" },
      {
        type: "p",
        text:
          "Review at least quarterly in fast-moving markets, and after major changes such as repositioning, pricing updates, or market expansion.",
      },
      { type: "h2", text: "Related resources" },
      {
        type: "links",
        items: [
          {
            text: "How to Turn an ICP Into Better Content and Ads",
            href: "/resources/turn-an-icp-into-better-content-and-ads",
          },
          {
            text: "Why Your Marketing Isn't Landing (And How to Fix It)",
            href: "/resources/why-your-marketing-isnt-landing",
          },
          {
            text: "Stop Wasting Ad Spend: How ICPs Improve Targeting",
            href: "/resources/stop-wasting-ad-spend",
          },
          {
            text: "Why We Built the ICP Generator (And How It Helps You Win)",
            href: "/resources/why-we-built-icp-generator",
          },
          {
            text: "Build your ICP step by step",
            href: "/onboarding-build",
          },
          {
            text: "Compare plans",
            href: "/pricing",
          },
        ],
      },
      {
        type: "h2",
        text: "What is the key takeaway?",
      },
      {
        type: "p",
        text:
          "An ICP is not a demographic profile. It is a practical commercial filter for who to prioritise, how to position, and where to focus growth.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "turn-an-icp-into-better-content-and-ads",
    title: "How to Turn an ICP Into Better Content and Ads",
    description:
      "Transform your ICP into ready-to-use content ideas, stronger messaging, and higher-performing ads.",
    bgColor: "#96CBB6",
    readingTime: "8 min read",
    date: "2026-02-13",
    body: [
      {
        type: "p",
        text:
          "Once you've got a clear ICP, you can turn it into decisions: what to say, where to show up, and what to create next.",
      },
      { type: "h2", text: "Start with 3 content pillars" },
      {
        type: "ul",
        items: [
          "Teach: help them understand the problem",
          "Proof: show outcomes, examples, and credibility",
          "Path: demonstrate the next steps and your approach",
        ],
      },
      { type: "h2", text: "Write ads that match their reality" },
      {
        type: "p",
        text:
          "Use their triggers and pains as the opening line. Make the first sentence feel like it was written for them specifically.",
      },
    ],
  },
  {
    slug: "why-your-marketing-isnt-landing",
    title: "Why Your Marketing Isn't Landing (And How to Fix It)",
    description:
      "If you're struggling to get traction, it's often a sign you're speaking to the wrong crowd - here's the simple fix.",
    bgColor: "#FF9922",
    readingTime: "7 min read",
    date: "2026-02-13",
    body: [
      {
        type: "p",
        text:
          "When your messaging doesn't land, it's rarely a copywriting problem. It's usually a targeting and clarity problem.",
      },
      { type: "h2", text: "Common symptoms" },
      {
        type: "ul",
        items: [
          "You get clicks but no conversions",
          "People say sounds great but don't take action",
          "You keep rewriting the website, and nothing changes",
        ],
      },
      { type: "h2", text: "The fix" },
      {
        type: "p",
        text:
          "Tighten your ICP. Then make your headline and first paragraph speak directly to the pains that push them to act.",
      },
    ],
  },
  {
    slug: "stop-wasting-ad-spend",
    title: "Stop Wasting Ad Spend: How ICPs Improve Targeting",
    description:
      "If you're reaching the wrong people, your ads will always underperform. ICP-driven insights fix that.",
    bgColor: "#F57BBE",
    readingTime: "5 min read",
    date: "2026-02-13",
    body: [
      {
        type: "p",
        text:
          "Better targeting isn't more interests. It's clearer inputs. Your ICP gives you the language, pains, and contexts to target properly.",
      },
      { type: "h2", text: "Practical targeting wins" },
      {
        type: "ul",
        items: [
          "Cleaner lookalike seeds (based on the right customer set)",
          "Ad creative that matches real triggers and objections",
          "Fewer wasted impressions on people who'll never convert",
        ],
      },
    ],
  },
  {
    slug: "why-we-built-icp-generator",
    title: "Why We Built the ICP Generator (And How It Helps You Win)",
    description:
      "The story behind the tool - and how deeper audience clarity leads to better content, smarter targeting, and faster growth.",
    bgColor: "#FFD336",
    readingTime: "4 min read",
    date: "2026-02-13",
    body: [
      {
        type: "p",
        text:
          "We built ICP Generator to remove the guesswork. Founders shouldn't have to be marketing people to get a clear audience plan.",
      },
      { type: "h2", text: "What you get out of it" },
      {
        type: "ul",
        items: [
          "A structured ICP you can actually use",
          "Segments, pains, and messaging angles",
          "Clear next steps to turn it into marketing",
        ],
      },
      {
        type: "callout",
        title: "Next step",
        text:
          "If your marketing feels inconsistent, start with clarity - everything else becomes easier.",
      },
    ],
  },
];

export function getResourceBySlug(slug: string) {
  return RESOURCE_POSTS.find((p) => p.slug === slug) ?? null;
}
