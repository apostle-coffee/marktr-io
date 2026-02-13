export type ResourcePost = {
  slug: string;
  title: string;
  description: string;
  introLine?: string;
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
      "Turn your Ideal Customer Profile (ICP) into clear content ideas, stronger messaging, and higher-performing ads using a practical framework.",
    bgColor: "#96CBB6",
    readingTime: "10 min read",
    date: "2026-01-29",
    seoTitle: "How to Turn an ICP Into Better Content and Ads | Practical Marketing Guide",
    metaDescription:
      "Turn your Ideal Customer Profile (ICP) into clear content ideas, stronger messaging, and higher-performing ads using a practical framework.",
    faq: [
      {
        question: "How do you turn an ICP into content ideas?",
        answer:
          "Start with pains, triggers, objections, and desired outcomes. Convert each into Teach, Proof, and Path content so every idea maps to a buyer need and stage.",
      },
      {
        question: "Should each ICP have separate ads?",
        answer:
          "Yes, where segments have different pains, urgency, or buying triggers. Separate ad sets improve message relevance and reduce wasted spend.",
      },
      {
        question: "Can one ICP support multiple content pillars?",
        answer:
          "Yes. One ICP should support multiple angles, but each pillar should still map to a specific decision need such as diagnosis, trust, or next steps.",
      },
      {
        question: "How often should messaging change?",
        answer:
          "Review quarterly or when major signals change, such as conversion quality, churn, pricing shifts, or new market entry.",
      },
      {
        question: "What if ads are not converting?",
        answer:
          "Check ICP-message fit first. If the audience is wrong or the pain is vague, creative tweaks will not fix performance.",
      },
    ],
    body: [
      { type: "h2", text: "Direct Answer Summary" },
      {
        type: "p",
        text:
          "An Ideal Customer Profile (ICP) becomes valuable only when it shapes real marketing decisions: what to say, where to show up, and how to position your offer.",
      },
      {
        type: "p",
        text:
          "An ICP that does not influence content, ads, and targeting is just documentation, not strategy.",
      },
      {
        type: "p",
        text:
          "When you operationalise ICP data, marketing alignment improves, customer segmentation becomes clearer, and performance improves across content, ads, and product-market fit decisions.",
      },
      { type: "h2", text: "Why most ICPs fail to influence marketing" },
      {
        type: "p",
        text: "Most ICPs fail in execution, not definition.",
      },
      {
        type: "ul",
        items: [
          "The ICP is written once and never revisited",
          "Messaging teams do not use it as copy input",
          "Distribution planning is not connected to ICP signals",
          "Sales and marketing teams interpret the ICP differently",
          "There is no validation loop to update assumptions",
        ],
      },
      { type: "h2", text: "How do you turn an ICP into a content strategy?" },
      {
        type: "p",
        text:
          "Use a three-pillar model that maps to your ICP's pains, triggers, and decision process.",
      },
      { type: "h3", text: "1. Teach - Help them understand the problem" },
      {
        type: "p",
        text:
          "Teaching content helps your audience diagnose the problem, name friction clearly, and understand the cost of inaction.",
      },
      {
        type: "ul",
        items: [
          "Educational explainers tied to specific ICP pain points",
          "Content that quantifies commercial cost and delay risk",
          "Plain-language breakdowns of recurring mistakes",
        ],
      },
      {
        type: "p",
        text: "Examples:",
      },
      {
        type: "ul",
        items: [
          "Blog: Why your lead volume is up but qualified demand is down",
          "LinkedIn: 5 signs your targeting is too broad",
          "Lead magnet: ICP messaging diagnostic checklist",
          "Video: 10-minute teardown of weak positioning",
        ],
      },
      { type: "h3", text: "2. Proof - Show outcomes and credibility" },
      {
        type: "p",
        text:
          "Proof content reduces risk by showing what changed, for whom, and why it worked.",
      },
      {
        type: "ul",
        items: [
          "Case studies with before-and-after performance data",
          "Testimonials linked to measurable outcomes",
          "Process breakdowns showing execution steps",
          "Evidence of improved retention, conversion, or LTV",
        ],
      },
      {
        type: "p",
        text: "Example hooks:",
      },
      {
        type: "ul",
        items: [
          "How we reduced churn by fixing ICP mismatch",
          "Before: broad targeting. After: ICP-led campaigns",
          "What changed when sales and marketing used one ICP",
        ],
      },
      { type: "h3", text: "3. Path - Demonstrate the next steps" },
      {
        type: "p",
        text:
          "Path content shows prospects what happens next and how decisions are made.",
      },
      {
        type: "ul",
        items: [
          "Framework content that explains your method",
          "Decision-process content for buyers and stakeholders",
          "Step-by-step expectations from first call to rollout",
          "CTA-aligned content for each stage of readiness",
        ],
      },
      {
        type: "p",
        text: "Examples:",
      },
      {
        type: "ul",
        items: [
          "How our ICP workflow moves from diagnosis to campaign brief",
          "What to do first if ads attract low-fit leads",
          "What the first 30 days of ICP-led alignment looks like",
        ],
      },
      { type: "h2", text: "How do you write ads that match your ICP?" },
      {
        type: "p",
        text:
          "Good ads are compressed ICP insights. If your ICP is accurate, your ad copy should feel uncomfortably specific.",
      },
      {
        type: "p",
        text:
          "Use triggers and pains in the opening line. Mirror ICP language and match urgency to buying context.",
      },
      {
        type: "p",
        text: "Before and after examples:",
      },
      {
        type: "ul",
        items: [
          "Weak: Improve your marketing performance. Strong: Struggling to convert traffic into qualified leads despite increasing spend?",
          "Weak: Scale your SaaS growth faster. Strong: Churn rising after onboarding? Fix ICP mismatch before your next growth push.",
          "Weak: Get better ad results today. Strong: Still paying for clicks from low-fit prospects? Rebuild targeting around your ICP.",
          "Weak: We help teams align marketing and sales. Strong: If sales keeps rejecting marketing leads, your ICP definition is probably too broad.",
          "Weak: Boost ROI with smarter strategy. Strong: Launching a new offer? Use ICP-led messaging before spending on cold traffic.",
        ],
      },
      { type: "h2", text: "How do you choose the right channels using your ICP?" },
      {
        type: "p",
        text:
          "Choose channels based on attention patterns, buying intent, and message depth requirements.",
      },
      {
        type: "ul",
        items: [
          "Map where your ICP already researches solutions",
          "Separate intent channels from interruption channels",
          "Match channel format to decision stage",
          "Allocate budget by segment quality, not only click volume",
        ],
      },
      {
        type: "p",
        text: "Practical mapping:",
      },
      {
        type: "ul",
        items: [
          "Search and high-intent communities for active demand",
          "LinkedIn and newsletters for education and category framing",
          "Webinars and video for proof and process depth",
          "Retargeting for path content and conversion prompts",
        ],
      },
      { type: "h2", text: "When to use ICP Generator for marketing alignment" },
      {
        type: "p",
        text:
          "Manual ICP work often becomes inconsistent or opinion-led. Use ICP Generator when teams need one operational framework.",
      },
      {
        type: "ul",
        items: [
          "A structured decision framework for segment selection",
          "Messaging inputs tied to pains, triggers, and objections",
          "Shared qualification criteria for sales and marketing",
          "A repeatable process for validation and updates",
        ],
      },
      {
        type: "p",
        text:
          "It helps convert ICP definitions into operational decisions across content strategy, ad targeting, and customer segmentation.",
      },
      { type: "h2", text: "Frequently Asked Questions" },
      { type: "h3", text: "How do you turn an ICP into content ideas?" },
      {
        type: "p",
        text:
          "Start with pains, triggers, objections, and desired outcomes. Convert each into Teach, Proof, and Path content so every idea maps to a buyer need and stage.",
      },
      { type: "h3", text: "Should each ICP have separate ads?" },
      {
        type: "p",
        text:
          "Yes, where segments have different pains, urgency, or buying triggers. Separate ad sets improve message relevance and reduce wasted spend.",
      },
      { type: "h3", text: "Can one ICP support multiple content pillars?" },
      {
        type: "p",
        text:
          "Yes. One ICP should support multiple angles, but each pillar should still map to a specific decision need such as diagnosis, trust, or next steps.",
      },
      { type: "h3", text: "How often should messaging change?" },
      {
        type: "p",
        text:
          "Review quarterly or when major signals change, such as conversion quality, churn, pricing shifts, or new market entry.",
      },
      { type: "h3", text: "What if ads are not converting?" },
      {
        type: "p",
        text:
          "Check ICP-message fit first. If the audience is wrong or the pain is vague, creative tweaks will not fix performance.",
      },
      { type: "h2", text: "What is the key takeaway?" },
      {
        type: "p",
        text:
          "An ICP improves marketing only when it is operational. Translate it into content pillars, ad messages, and channel choices, then validate using real performance data.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "how-to-validate-an-icp",
    title: "How to Validate an Ideal Customer Profile (ICP) Using Real Data",
    description:
      "Most ICP definitions are hypotheses. This guide shows you how to test them against real commercial performance data.",
    bgColor: "#FF9922",
    readingTime: "11 min read",
    date: "2025-10-07",
    seoTitle: "How to Validate an ICP Using Real Customer Data | Metrics & Framework",
    metaDescription:
      "Learn how to validate your Ideal Customer Profile (ICP) using conversion, retention and lifetime value data with a practical framework.",
    faq: [
      {
        question: "How long does it take to validate an ICP?",
        answer:
          "Most teams see directional signals in 4-8 weeks if segmentation and baseline tracking are already in place. Strong confidence typically needs at least one full sales and retention cycle.",
      },
      {
        question: "What if you do not have enough data?",
        answer:
          "Use directional indicators first: conversion rate, cycle speed, and early retention. Then run narrower cohort tests to build sample quality before making major strategic changes.",
      },
      {
        question: "Can startups validate an ICP early?",
        answer:
          "Yes. Early teams can validate with smaller datasets if they track segment-level conversion, onboarding outcomes, and short-term retention from day one.",
      },
      {
        question: "Should you validate before or after launching?",
        answer:
          "Both. Start with a pre-launch hypothesis, then validate quickly after launch using behavioural data. ICP validation is iterative, not a one-time exercise.",
      },
      {
        question: "How often should you revalidate?",
        answer:
          "Review quarterly in fast-moving markets, and immediately after major shifts in product, pricing, positioning, or segment focus.",
      },
    ],
    body: [
      { type: "h2", text: "Direct Answer Summary" },
      {
        type: "p",
        text:
          "An Ideal Customer Profile (ICP) is validated when a specific customer segment consistently outperforms others across commercial metrics.",
      },
      {
        type: "p",
        text:
          "Many ICP definitions are assumptions based on preference, anecdotal sales feedback, or aspirational positioning. Validation requires behavioural data from real customers.",
      },
      {
        type: "p",
        text:
          "In commercial terms, validation means repeatable outperformance in conversion rate, retention rate, lifetime value, and revenue quality over time.",
      },
      { type: "h2", text: "Why most ICPs are based on assumptions" },
      {
        type: "ul",
        items: [
          "Founder bias shapes targeting before evidence is reviewed",
          "Aspirational positioning overrides segment performance",
          "Anecdotal sales input is treated as representative",
          "Customer segmentation is shallow or inconsistent",
          "Teams confuse who they want with who performs best",
        ],
      },
      { type: "h2", text: "What does ICP validation actually mean?" },
      {
        type: "p",
        text:
          "Validation is not agreement within your team. It is statistical and behavioural evidence.",
      },
      {
        type: "p",
        text:
          "ICP validation means one segment shows measurable and repeatable performance differences versus alternatives.",
      },
      {
        type: "ul",
        items: [
          "Use comparison groups, not blended averages",
          "Confirm outperformance across multiple metrics",
          "Track consistency over repeated time windows",
          "Use findings to change targeting, messaging, and qualification",
        ],
      },
      { type: "h2", text: "The core metrics to validate an ICP" },
      { type: "h3", text: "Conversion rate by segment" },
      {
        type: "p",
        text:
          "Compare conversion from qualified opportunity to customer by segment. Reliable ICP segments convert at a meaningfully higher rate.",
      },
      {
        type: "ul",
        items: [
          "Formula: customers won / qualified opportunities",
          "Set minimum sample thresholds per segment",
        ],
      },
      { type: "h3", text: "Sales cycle length" },
      {
        type: "p",
        text:
          "Shorter median sales cycles often indicate stronger fit because urgency and decision confidence are higher.",
      },
      {
        type: "ul",
        items: [
          "Track median days from qualified opportunity to close",
          "Review stage-by-stage drop-off by segment",
        ],
      },
      { type: "h3", text: "Retention rate" },
      {
        type: "p",
        text:
          "Poor-fit segments may close initially but churn earlier. Cohort retention exposes fit quality beyond acquisition.",
      },
      {
        type: "ul",
        items: [
          "Track 90-day and 180-day retention by segment",
          "Flag segments with high early churn",
        ],
      },
      { type: "h3", text: "Customer lifetime value (LTV)" },
      {
        type: "p",
        text:
          "Strong ICP segments compound commercial value through better retention, expansion potential, and lower servicing friction.",
      },
      {
        type: "ul",
        items: [
          "Compare gross margin-adjusted LTV by segment",
          "Monitor trend direction, not one-off spikes",
        ],
      },
      { type: "h3", text: "Revenue concentration" },
      {
        type: "p",
        text:
          "Validated ICP segments usually represent a disproportionate share of high-quality recurring revenue.",
      },
      {
        type: "ul",
        items: [
          "Track revenue share by segment each quarter",
          "Assess concentration alongside retention quality",
        ],
      },
      { type: "h3", text: "Expansion and upsell rate" },
      {
        type: "p",
        text:
          "Measure how often customers expand usage, upgrade plans, or increase spend by segment.",
      },
      {
        type: "ul",
        items: [
          "Expansion revenue percentage by cohort",
          "Upgrade rate within the first 6-12 months",
        ],
      },
      {
        type: "p",
        text:
          "Strong ICP segments often expand faster because the product fits more deeply into their workflow.",
      },
      { type: "h2", text: "Step-by-step ICP validation framework" },
      { type: "h3", text: "Step 1: Segment your existing customer base" },
      {
        type: "p",
        text:
          "Group customers by meaningful factors such as use case, business model, maturity, team size, and buying trigger.",
      },
      { type: "h3", text: "Step 2: Define comparison groups" },
      {
        type: "p",
        text:
          "Create distinct cohorts so each segment can be compared on the same definitions and time windows.",
      },
      { type: "h3", text: "Step 3: Measure key performance indicators" },
      {
        type: "p",
        text:
          "Track conversion rate, cycle length, retention, LTV, revenue concentration, and expansion rate for each cohort.",
      },
      { type: "h3", text: "Step 4: Identify outperformance patterns" },
      {
        type: "p",
        text:
          "Look for segments that outperform repeatedly across multiple metrics, not one isolated KPI.",
      },
      { type: "h3", text: "Step 5: Refine ICP definition" },
      {
        type: "p",
        text:
          "Update your ICP to reflect observed fit signals, qualification criteria, and realistic commercial constraints.",
      },
      { type: "h3", text: "Step 6: Test messaging and acquisition against updated ICP" },
      {
        type: "p",
        text:
          "Run controlled messaging and channel tests to confirm the revised ICP improves performance in-market.",
      },
      { type: "h2", text: "What signals indicate you have the wrong ICP?" },
      {
        type: "ul",
        items: [
          "High traffic with persistently low conversion",
          "Strong initial sales but weak retention",
          "Long and inconsistent sales cycles in one target segment",
          "High support burden with low expansion potential",
          "Revenue spread evenly with no dominant high-performing segment",
        ],
      },
      {
        type: "p",
        text:
          "These signals often indicate weak segmentation logic or an ICP that is too broad to guide practical decisions.",
      },
      { type: "h2", text: "When to use ICP Generator for validation" },
      {
        type: "p",
        text:
          "Use ICP Generator when teams need a structured, repeatable way to validate customer segmentation and refine ICP definitions.",
      },
      {
        type: "ul",
        items: [
          "A structured segmentation workflow",
          "Consistent cross-segment metric comparison",
          "Decision criteria for refining ICP definitions",
          "Shared language across marketing, sales, and data",
          "A bridge from analysis to acquisition and messaging changes",
        ],
      },
      { type: "h2", text: "Frequently Asked Questions" },
      { type: "h3", text: "How long does it take to validate an ICP?" },
      {
        type: "p",
        text:
          "Most teams see directional signals in 4-8 weeks if segmentation and baseline tracking are already in place. Strong confidence typically needs at least one full sales and retention cycle.",
      },
      { type: "h3", text: "What if you do not have enough data?" },
      {
        type: "p",
        text:
          "Use directional indicators first: conversion rate, cycle speed, and early retention. Then run narrower cohort tests to build sample quality before making major strategic changes.",
      },
      { type: "h3", text: "Can startups validate an ICP early?" },
      {
        type: "p",
        text:
          "Yes. Early teams can validate with smaller datasets if they track segment-level conversion, onboarding outcomes, and short-term retention from day one.",
      },
      { type: "h3", text: "Should you validate before or after launching?" },
      {
        type: "p",
        text:
          "Both. Start with a pre-launch hypothesis, then validate quickly after launch using behavioural data. ICP validation is iterative, not a one-time exercise.",
      },
      { type: "h3", text: "How often should you revalidate?" },
      {
        type: "p",
        text:
          "Review quarterly in fast-moving markets, and immediately after major shifts in product, pricing, positioning, or segment focus.",
      },
      { type: "h2", text: "What is the key takeaway?" },
      {
        type: "p",
        text:
          "A strong ICP is not declared. It is validated. The segment that repeatedly wins on conversion, retention, lifetime value, expansion, and revenue quality should define your ICP.",
      },
    ],
  },
  {
    slug: "why-your-marketing-isnt-landing",
    title: "Why Your Marketing Isn't Landing (And How to Fix It)",
    description:
      "If your marketing gets clicks but no conversions, the issue is usually ICP clarity. Learn how to fix targeting misalignment and improve conversion rate.",
    introLine:
      "Most marketing problems are not creative problems. They are clarity problems.",
    bgColor: "#FF9922",
    readingTime: "9 min read",
    date: "2025-12-22",
    seoTitle: "Why Your Marketing Isn't Converting (And the Simple Fix)",
    metaDescription:
      "If your marketing gets clicks but no conversions, the issue is usually ICP clarity. Learn how to fix targeting misalignment and improve conversion rate.",
    faq: [
      {
        question: "How do I know if my ICP is wrong?",
        answer:
          "If traffic grows while conversion rate falls, sales quality declines, and retention is weak in new cohorts, your ICP is likely too broad or mis-specified.",
      },
      {
        question: "Should I change my offer or my audience?",
        answer:
          "Test audience clarity first. If segment fit is weak, offer changes may not solve conversion issues. If fit is strong but retention is weak, review offer and onboarding next.",
      },
      {
        question: "Can marketing fail even with a good product?",
        answer:
          "Yes. A strong product can still underperform when targeting, positioning, and channel choice are misaligned with the right segment.",
      },
      {
        question: "How specific is too specific?",
        answer:
          "Specific is useful when it improves lead quality and conversion without collapsing viable demand. If quality rises while volume remains workable, specificity is helping.",
      },
      {
        question: "How long should I test new messaging?",
        answer:
          "Run tests long enough to compare qualified conversion and lead quality by segment. Four to eight weeks often gives directional signal; fuller confidence needs broader cohort data.",
      },
    ],
    body: [
      { type: "h2", text: "Direct Answer Summary" },
      {
        type: "p",
        text:
          "When marketing doesn't convert, it is usually a targeting and clarity problem, not a copywriting problem.",
      },
      {
        type: "p",
        text:
          "Most traction problems come from ICP mismatch: the message reaches people who are not the best commercial fit, or it is too broad to feel relevant to any one segment.",
      },
      {
        type: "p",
        text:
          "Rewriting copy can improve wording, but it rarely fixes root causes. Conversion improves when your Ideal Customer Profile, customer segmentation, and messaging are aligned.",
      },
      { type: "h2", text: "Common symptoms your marketing isn't landing" },
      {
        type: "ul",
        items: [
          "You get clicks but no conversions",
          "People say sounds great but do not act",
          "You keep rewriting the website and nothing changes",
          "Sales says leads are low quality",
          "Messaging feels generic",
        ],
      },
      { type: "h2", text: "Why this happens (and why it's rarely a copy problem)" },
      {
        type: "p",
        text:
          "Marketing fails when the message is broader than the segment it is trying to reach.",
      },
      {
        type: "ul",
        items: [
          "Broad ICP definition makes targeting vague",
          "Positioning is too generic to feel urgent",
          "One message tries to appeal to multiple segments",
          "No timing trigger is included in the message",
          "Channels are misaligned with attention and intent",
        ],
      },
      { type: "h2", text: "The real fix - tighten your ICP" },
      {
        type: "p",
        text:
          "Specificity improves resonance. Narrow segments convert better because pains, triggers, and decision logic are clearer.",
      },
      {
        type: "p",
        text:
          "Your headline should speak to one active pain plus one trigger. Your first paragraph should mirror real frustration in the segment's language.",
      },
      {
        type: "p",
        text: "Examples:",
      },
      {
        type: "ul",
        items: [
          "Weak: We help businesses grow faster. Strong: Struggling to convert traffic into qualified leads despite increasing spend?",
          "Weak: Improve your marketing performance. Strong: Getting clicks but no sales from your paid campaigns?",
          "Weak: Better messaging for modern brands. Strong: Still rewriting your homepage while conversion rate stays flat?",
          "Weak: Scale your SaaS pipeline. Strong: Series A SaaS team with rising CAC and low SQL quality?",
          "Weak: Grow with smarter strategy. Strong: Need to improve retention before your next board review?",
        ],
      },
      { type: "h2", text: "How to rewrite your headline using ICP clarity" },
      {
        type: "p",
        text: "Use this formula:",
      },
      {
        type: "p",
        text: "[Specific segment] + [active pain] + [time pressure or trigger]",
      },
      {
        type: "p",
        text:
          "Example: Series A SaaS founders struggling with rising churn before your next funding round?",
      },
      {
        type: "ul",
        items: [
          "Name one segment only",
          "Name one current pain",
          "Add one timing signal",
          "Remove generic claims",
        ],
      },
      { type: "h2", text: "When to use ICP Generator to fix misalignment" },
      {
        type: "p",
        text:
          "Use ICP Generator when conversion stalls and teams need a shared diagnostic framework.",
      },
      {
        type: "ul",
        items: [
          "Clarify segment definition with structured inputs",
          "Use one decision framework for targeting choices",
          "Align sales and marketing on lead quality criteria",
          "Diagnose where targeting misalignment reduces conversion",
        ],
      },
      {
        type: "p",
        text:
          "It works as a clarity and alignment tool that links customer segmentation to practical execution.",
      },
      { type: "h2", text: "Frequently Asked Questions" },
      { type: "h3", text: "How do I know if my ICP is wrong?" },
      {
        type: "p",
        text:
          "If traffic rises while conversion rate falls, sales quality declines, and new-customer retention is weak, your ICP is probably too broad or poorly defined.",
      },
      { type: "h3", text: "Should I change my offer or my audience?" },
      {
        type: "p",
        text:
          "Start by testing audience clarity. If segment fit is weak, offer changes will not solve the core issue. If fit is strong but retention is weak, review the offer and onboarding.",
      },
      { type: "h3", text: "Can marketing fail even with a good product?" },
      {
        type: "p",
        text:
          "Yes. A strong product can underperform if targeting, positioning, and channel choice are misaligned with the right segment.",
      },
      { type: "h3", text: "How specific is too specific?" },
      {
        type: "p",
        text:
          "Specificity is useful when it improves lead quality and conversion without eliminating viable demand. If quality rises while volume stays workable, specificity is helping.",
      },
      { type: "h3", text: "How long should I test new messaging?" },
      {
        type: "p",
        text:
          "Run tests long enough to compare qualified conversion and lead quality by segment. Four to eight weeks usually gives directional signal; stronger confidence needs broader cohort data.",
      },
      { type: "h2", text: "What is the key takeaway?" },
      {
        type: "p",
        text: "Clarity beats cleverness. Specificity beats breadth. ICP drives resonance.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "stop-wasting-ad-spend",
    title: "Stop Wasting Ad Spend: How ICPs Improve Targeting",
    description:
      "If your ads are underperforming, the issue is usually ICP clarity. Learn how better segment definition improves targeting and reduces wasted spend.",
    introLine:
      "Most underperforming ad accounts do not have a creative problem. They have a targeting clarity problem.",
    bgColor: "#F57BBE",
    readingTime: "10 min read",
    date: "2025-09-26",
    seoTitle: "Stop Wasting Ad Spend | How ICPs Improve Ad Targeting",
    metaDescription:
      "If your ads are underperforming, the issue is usually ICP clarity. Learn how better segment definition improves targeting and reduces wasted spend.",
    faq: [
      {
        question: "Why do my ads get clicks but no sales?",
        answer:
          "Clicks without sales usually indicate message-to-segment mismatch. The audience is interested enough to click but not a strong commercial fit to convert.",
      },
      {
        question: "Should I broaden or narrow targeting?",
        answer:
          "Narrow first around validated high-fit segments. Broaden only after conversion quality is stable and segment-level performance is clear.",
      },
      {
        question: "Do lookalike audiences still work?",
        answer:
          "Yes, if seed quality is strong. Lookalikes built from validated high-fit customers usually outperform lookalikes built from mixed-quality cohorts.",
      },
      {
        question: "How do I know if my ICP is wrong?",
        answer:
          "If cost per acquisition rises, conversion quality falls, sales rejects leads, and retention weakens in paid cohorts, your ICP is likely too broad or misaligned.",
      },
      {
        question: "How long should I test new targeting?",
        answer:
          "Run tests long enough to compare qualified conversion by segment. Four to eight weeks often gives directional signal; stronger confidence needs broader cohort data.",
      },
    ],
    body: [
      { type: "h2", text: "Direct Answer Summary" },
      {
        type: "p",
        text:
          "Better targeting is not about adding more interests. It is about improving the quality of your inputs.",
      },
      {
        type: "p",
        text:
          "Ads underperform when they are shown to low-fit audiences that are unlikely to buy, retain, or expand. That usually inflates cost per acquisition and weakens conversion rate.",
      },
      {
        type: "p",
        text:
          "A clear Ideal Customer Profile (ICP) improves audience quality, strengthens optimisation signals, and reduces wasted ad spend by concentrating delivery on segments with validated commercial fit.",
      },
      { type: "h2", text: "Why ads underperform even when creative looks strong" },
      {
        type: "ul",
        items: [
          "Broad targeting that mixes high-fit and low-fit audiences",
          "Weak lookalike seed audiences built from blended customer lists",
          "Vague messaging that does not match segment pain",
          "No trigger alignment between message and buying timing",
          "Offer-to-segment mismatch despite strong creative execution",
        ],
      },
      { type: "h2", text: "Why ICP clarity fixes targeting" },
      {
        type: "p",
        text:
          "A strong ICP improves paid media performance because it improves input quality before launch.",
      },
      {
        type: "p",
        text:
          "Paid platforms optimise based on signals you provide. If the inputs are broad, the learning will be broad.",
      },
      {
        type: "ul",
        items: [
          "Segment specificity improves algorithm learning",
          "Higher conversion signals improve optimisation",
          "Clear exclusion criteria remove low-fit traffic",
          "Cleaner audience construction improves repeatability",
          "Stronger message-market fit improves conversion quality",
        ],
      },
      {
        type: "h2",
        text: "Practical targeting wins from a strong ICP",
      },
      { type: "h3", text: "Cleaner lookalike seeds" },
      {
        type: "p",
        text:
          "Use only validated high-fit customers in seed audiences. Segment-specific seeds typically outperform blended cohorts.",
      },
      {
        type: "ul",
        items: [
          "Seed from customers with strong retention and LTV",
          "Avoid mixed-quality or high-churn seed lists",
          "Build separate lookalikes by segment where possible",
        ],
      },
      { type: "h3", text: "Creative that matches real triggers and objections" },
      {
        type: "p",
        text:
          "Use opening lines tied to real pains and objections observed in the target segment.",
      },
      {
        type: "ul",
        items: [
          "Lead with pain and timing trigger in the first line",
          "Address common objections directly in copy",
          "Use segment-specific language to improve CTR and CVR",
        ],
      },
      { type: "h3", text: "Fewer wasted impressions" },
      {
        type: "p",
        text:
          "Use ICP criteria to exclude low-fit segments and reduce spend leakage.",
      },
      {
        type: "ul",
        items: [
          "Exclude incompatible industries and maturity stages",
          "Narrow geography when fit varies by market",
          "Focus budget on segments with validated LTV",
        ],
      },
      { type: "h3", text: "Better optimisation signals" },
      {
        type: "p",
        text:
          "Higher conversion quality improves algorithm learning and shortens feedback loops.",
      },
      {
        type: "ul",
        items: [
          "Better conversion rate improves optimisation quality",
          "Faster learning reduces iteration waste",
          "Cost per qualified acquisition usually declines",
        ],
      },
      { type: "h2", text: "How to translate your ICP into targeting inputs" },
      {
        type: "ul",
        items: [
          "Define segment variables clearly (industry, stage, use case, urgency)",
          "Identify a validated high-fit customer list",
          "Map pains and triggers by segment",
          "Translate pain and trigger patterns into ad hooks",
          "Build segment-specific campaigns instead of blended ad sets",
          "Exclude low-fit signals explicitly",
          "Measure performance by segment, not just blended totals",
        ],
      },
      { type: "h2", text: "When to use ICP Generator to improve ad performance" },
      {
        type: "p",
        text:
          "Use ICP Generator as a clarity framework before scaling spend, especially when paid performance stalls.",
      },
      {
        type: "ul",
        items: [
          "A clarity tool before budget expansion",
          "A structured input system for targeting decisions",
          "A way to align paid media with validated segments",
          "A way to refine targeting before creative iteration",
        ],
      },
      { type: "h2", text: "Frequently Asked Questions" },
      { type: "h3", text: "Why do my ads get clicks but no sales?" },
      {
        type: "p",
        text:
          "Clicks without sales usually indicate message-to-segment mismatch. The audience is interested enough to click but not a strong commercial fit to convert.",
      },
      { type: "h3", text: "Should I broaden or narrow targeting?" },
      {
        type: "p",
        text:
          "Narrow first around validated high-fit segments. Broaden only after conversion quality is stable and segment-level performance is clear.",
      },
      { type: "h3", text: "Do lookalike audiences still work?" },
      {
        type: "p",
        text:
          "Yes, if seed quality is strong. Lookalikes built from validated high-fit customers usually outperform lookalikes built from mixed-quality cohorts.",
      },
      { type: "h3", text: "How do I know if my ICP is wrong?" },
      {
        type: "p",
        text:
          "If cost per acquisition rises, conversion quality falls, sales rejects leads, and retention weakens in paid cohorts, your ICP is likely too broad or misaligned.",
      },
      { type: "h3", text: "How long should I test new targeting?" },
      {
        type: "p",
        text:
          "Run tests long enough to compare qualified conversion by segment. Four to eight weeks often gives directional signal; stronger confidence needs broader cohort data.",
      },
      { type: "h2", text: "What is the key takeaway?" },
      {
        type: "p",
        text:
          "Clear ICP -> cleaner targeting -> higher conversion -> lower wasted spend.",
      },
      {
        type: "p",
        text:
          "Paid performance improves when inputs improve. Fix the segment first, then scale the spend.",
      },
      { type: "cta" },
    ],
  },
  {
    slug: "why-we-built-icp-generator",
    title: "Why We Built the ICP Generator (And How It Helps You Win)",
    description:
      "The story behind the tool - and how deeper audience clarity leads to better content, smarter targeting, and faster growth.",
    introLine: "Most marketing problems start with unclear audience definition.",
    bgColor: "#FFD336",
    readingTime: "8 min read",
    date: "2025-11-05",
    seoTitle: "Why We Built ICP Generator | Clearer Targeting, Smarter Growth",
    metaDescription:
      "Why we built ICP Generator and how structured Ideal Customer Profile clarity leads to better content, smarter targeting, and faster growth.",
    faq: [
      {
        question: "Is ICP Generator only for SaaS?",
        answer:
          "No. ICP Generator is useful for SaaS, agencies, consultancies, e-commerce brands, and B2B service teams that need stronger audience clarity and segmentation.",
      },
      {
        question: "Do I need existing data to use it?",
        answer:
          "No. You can begin with a structured hypothesis, then improve it with conversion, retention, and revenue data as evidence accumulates.",
      },
      {
        question: "Can agencies use it with clients?",
        answer:
          "Yes. Agencies can use ICP Generator to standardise discovery, align messaging strategy, and improve targeting consistency across client campaigns.",
      },
      {
        question: "Is this just another persona tool?",
        answer:
          "No. Persona tools often focus on descriptive profiles. ICP Generator focuses on operational decisions tied to commercial fit, customer segmentation, and execution.",
      },
      {
        question: "How long does it take to get clarity?",
        answer:
          "Most teams can establish a usable ICP quickly, then strengthen it through validation cycles over subsequent weeks.",
      },
    ],
    body: [
      { type: "h2", text: "Direct Answer Summary" },
      {
        type: "p",
        text:
          "ICP Generator was built to remove guesswork from Ideal Customer Profile definition and turn audience clarity into structured, repeatable decisions.",
      },
      {
        type: "p",
        text:
          "Founders should not need to become marketing experts to define who they serve best. Audience clarity should be structured, not instinctive.",
      },
      {
        type: "p",
        text:
          "When ICP clarity is operational, execution improves everywhere: content becomes sharper, targeting gets cleaner, validation becomes measurable, and growth decisions become more consistent.",
      },
      { type: "h2", text: "The problem we kept seeing" },
      {
        type: "ul",
        items: [
          "Founders rewriting websites repeatedly without conversion improvement",
          "Paid ads underperforming despite frequent creative changes",
          "Sales rejecting leads as low quality",
          "Teams disagreeing on who the target audience actually is",
          "ICP documents existing but not influencing execution",
        ],
      },
      { type: "h2", text: "Why traditional persona exercises fail" },
      {
        type: "p",
        text:
          "Most persona exercises optimise for storytelling, not commercial performance.",
      },
      {
        type: "ul",
        items: [
          "They are too demographic and weak on commercial fit signals",
          "They are rarely tied to conversion rate, retention, or lifetime value",
          "They are disconnected from customer segmentation and validation",
          "They are not integrated into content, targeting, or campaign decisions",
        ],
      },
      { type: "h2", text: "What ICP Generator actually gives you" },
      { type: "h3", text: "A structured ICP you can actually use" },
      {
        type: "p",
        text:
          "You get a clear segment definition with commercial variables and decision criteria that teams can apply consistently.",
      },
      { type: "h3", text: "Segments, pains, and messaging angles" },
      {
        type: "p",
        text:
          "You can translate clarity into content and ad execution by mapping real pains, triggers, objections, and segment-specific messaging angles.",
      },
      { type: "h3", text: "Clear next steps to turn it into marketing" },
      {
        type: "p",
        text:
          "The output supports content pillars, ad inputs, segmented campaigns, and a validation loop so ICP clarity drives ongoing optimisation.",
      },
      {
        type: "p",
        text:
          "Clarity does not just improve messaging. It improves the entire growth system.",
      },
      { type: "h2", text: "How deeper audience clarity helps you win" },
      {
        type: "ul",
        items: [
          "Better resonance with the right customers",
          "Higher conversion from clearer message-market fit",
          "Lower wasted spend through tighter targeting",
          "Faster learning from cleaner segment signals",
          "Stronger product-market fit decisions",
          "Improved marketing and sales alignment",
        ],
      },
      { type: "h2", text: "When ICP Generator is most useful" },
      {
        type: "ul",
        items: [
          "Early-stage founders without deep marketing background",
          "Teams scaling paid acquisition",
          "Companies entering new segments",
          "Periods where performance stalls",
          "When marketing feels inconsistent across channels",
        ],
      },
      {
        type: "p",
        text:
          "In these scenarios, ICP Generator works as clarity infrastructure for repeatable growth decisions.",
      },
      { type: "h2", text: "Frequently Asked Questions" },
      { type: "h3", text: "Is ICP Generator only for SaaS?" },
      {
        type: "p",
        text:
          "No. ICP Generator is useful for SaaS, agencies, consultancies, e-commerce brands, and B2B service teams that need stronger audience clarity and segmentation.",
      },
      { type: "h3", text: "Do I need existing data to use it?" },
      {
        type: "p",
        text:
          "No. You can begin with a structured hypothesis, then improve it with conversion, retention, and revenue data as evidence accumulates.",
      },
      { type: "h3", text: "Can agencies use it with clients?" },
      {
        type: "p",
        text:
          "Yes. Agencies can use ICP Generator to standardise discovery, align messaging strategy, and improve targeting consistency across client campaigns.",
      },
      { type: "h3", text: "Is this just another persona tool?" },
      {
        type: "p",
        text:
          "No. Persona tools often focus on descriptive profiles. ICP Generator focuses on operational decisions tied to commercial fit, customer segmentation, and execution.",
      },
      { type: "h3", text: "How long does it take to get clarity?" },
      {
        type: "p",
        text:
          "Most teams can establish a usable ICP quickly, then strengthen it through validation cycles over subsequent weeks.",
      },
      { type: "h2", text: "What is the next step?" },
      {
        type: "p",
        text:
          "If your marketing feels inconsistent, start with clarity. Everything else becomes easier.",
      },
      {
        type: "p",
        text:
          "Clarity reduces noise, improves focus, and gives your team a shared foundation for growth decisions.",
      },
      { type: "cta" },
    ],
  },
];

export function getResourceBySlug(slug: string) {
  return RESOURCE_POSTS.find((p) => p.slug === slug) ?? null;
}
