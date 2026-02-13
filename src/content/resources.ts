export type ResourcePost = {
  slug: string;
  title: string;
  description: string;
  bgColor: string; // used to match homepage resource cards
  readingTime?: string;
  date?: string; // ISO string
  body: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "ul"; items: string[] }
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
    title: "What an ICP Really Is (and Why Most Brands Get It Wrong)",
    description:
      "Most founders think they know their audience — until the data says otherwise. Here’s what an Ideal Customer Profile actually is, and how to build one that drives real results.",
    bgColor: "#BBA0E5",
    readingTime: "6 min read",
    date: "2026-02-13",
    body: [
      {
        type: "p",
        text:
          "An Ideal Customer Profile (ICP) is a clear description of the customers who are the best fit for what you sell — the ones who buy faster, stay longer, and get the best outcomes.",
      },
      { type: "h2", text: "What most people get wrong" },
      {
        type: "p",
        text:
          "They describe ‘everyone’ or a vague demographic. A useful ICP is about motivations, triggers, and context — not just age, job title, or industry.",
      },
      { type: "h2", text: "A simple framework" },
      {
        type: "ul",
        items: [
          "Goals: what they’re trying to achieve",
          "Pains: what’s frustrating or expensive right now",
          "Triggers: what makes them look for help",
          "Objections: what would stop them buying",
          "Where they hang out: channels and content that reach them",
        ],
      },
      {
        type: "callout",
        title: "Quick test",
        text:
          "If you can’t explain who it’s for in one sentence, you don’t have an ICP yet — you have a guess.",
      },
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
          "Once you’ve got a clear ICP, you can turn it into decisions: what to say, where to show up, and what to create next.",
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
    title: "Why Your Marketing Isn’t Landing (And How to Fix It)",
    description:
      "If you’re struggling to get traction, it’s often a sign you’re speaking to the wrong crowd — here’s the simple fix.",
    bgColor: "#FF9922",
    readingTime: "7 min read",
    date: "2026-02-13",
    body: [
      {
        type: "p",
        text:
          "When your messaging doesn’t land, it’s rarely a ‘copywriting problem’. It’s usually a targeting and clarity problem.",
      },
      { type: "h2", text: "Common symptoms" },
      {
        type: "ul",
        items: [
          "You get clicks but no conversions",
          "People say ‘sounds great’ but don’t take action",
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
          "Better targeting isn’t ‘more interests’. It’s clearer inputs. Your ICP gives you the language, pains, and contexts to target properly.",
      },
      { type: "h2", text: "Practical targeting wins" },
      {
        type: "ul",
        items: [
          "Cleaner lookalike seeds (based on the right customer set)",
          "Ad creative that matches real triggers and objections",
          "Fewer wasted impressions on people who’ll never convert",
        ],
      },
    ],
  },
  {
    slug: "why-we-built-icp-generator",
    title: "Why We Built the ICP Generator (And How It Helps You Win)",
    description:
      "The story behind the tool — and how deeper audience clarity leads to better content, smarter targeting, and faster growth.",
    bgColor: "#FFD336",
    readingTime: "4 min read",
    date: "2026-02-13",
    body: [
      {
        type: "p",
        text:
          "We built ICP Generator to remove the guesswork. Founders shouldn’t have to be ‘marketing people’ to get a clear audience plan.",
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
          "If your marketing feels inconsistent, start with clarity — everything else becomes easier.",
      },
    ],
  },
];

export function getResourceBySlug(slug: string) {
  return RESOURCE_POSTS.find((p) => p.slug === slug) ?? null;
}
