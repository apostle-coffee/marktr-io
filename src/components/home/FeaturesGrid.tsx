import { FeatureCard } from "../cards/FeatureCard";

export function FeaturesGrid() {
  const features = [
    {
      color: "purple",
      title: "Generate your ideal customer profile",
      description:
        "Create a detailed, accurate Ideal Customer Profile in seconds. Powered by AI and informed by real behaviour patterns - so you finally know who your customers are and what they care about.",
      isLocked: false,
      screenshot: "/images/features/ft-01.png",
    },
    {
      color: "green",
      title: "Understand buying habits & behaviour",
      description:
        "Learn what motivates your customers, where they spend their time, what brands they trust, and the triggers that make them buy. Clear insights that take the guesswork out of your marketing.",
      isLocked: false,
      screenshot: "/images/features/ft-03.png",
    },
    {
      color: "yellow",
      title: "Build a strategic content plan",
      description:
        "Every ICP comes with actionable content pillars, messaging angles, and social ideas - giving you a solid blueprint for your next high-performing marketing campaign.",
      isLocked: false,
      screenshot: "/images/features/ft-02.png",
    },
    {
      color: "orange",
      title: "Create targeted Meta Ads audiences",
      description:
        "Instantly generate accurate, lookalike-friendly audience data for Facebook & Instagram ads. Built from your unique Ideal Customer Profile, ready to export and use.",
      isLocked: false,
      screenshot: "/images/features/ft-04.png",
    },
    {
      color: "pink",
      title: "Conversational onboarding",
      description:
        "No long forms or complicated surveys. Just a quick, friendly chat that turns your brand story into deep customer insight - in under a minute.",
      isLocked: false,
      screenshot: "/images/features/ft-05.png",
    },
    {
      color: "brown",
      title: "Save, edit & refine your ICPs over time",
      description:
        "Your customers evolve - and your ICPs can too. Update, adjust, and improve your profiles as your business grows, without starting from scratch.",
      isLocked: false,
      screenshot: "/images/features/ft-06.png",
    },
  ];

  return (
    <section id="features" className="bg-background pt-4 pb-16 sm:pt-5 sm:pb-20 lg:pt-6 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-left">
          <h2 className="mb-4 font-['Fraunces'] text-3xl sm:text-4xl lg:text-5xl opacity-0 animate-fade-in-up font-bold">
            Features
          </h2>
          <p className="max-w-2xl text-lg text-foreground/70 opacity-0 animate-fade-in-up delay-100">
            Discover the tools that help you understand, reach, and convert your ideal customers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              color={feature.color}
              title={feature.title}
              description={feature.description}
              isLocked={feature.isLocked}
              delay={index * 0.1}
              screenshot={feature.screenshot}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
