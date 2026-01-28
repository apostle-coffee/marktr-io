import { ArrowRight } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

interface ResourceCard {
  title: string;
  description: string;
  bgColor: string;
  link: string;
}

export function ResourcesSection() {
  const resources: ResourceCard[] = [
    {
      title: "What an ICP Really Is (and Why Most Brands Get It Wrong)",
      description:
        "Most founders think they know their audience — until the data says otherwise. Get a simple breakdown of what an Ideal Customer Profile actually is and how to build one that drives real results.",
      bgColor: "#BBA0E5",
      link: "#",
    },
    {
      title: "How to Turn an ICP Into Better Content and Ads",
      description:
        "Learn how to transform your ICP into ready-to-use content ideas, stronger messaging, and higher-performing ads. A practical guide to creating marketing your customers actually respond to.",
      bgColor: "#96CBB6",
      link: "#",
    },
    {
      title: "Why Your Marketing Isn't Landing (And How to Fix It)",
      description:
        "Struggling to get traction? It's often a sign you're speaking to the wrong crowd. Discover the key mistakes founders make when defining their audience — and the simple way to fix them.",
      bgColor: "#FF9922",
      link: "#",
    },
    {
      title: "Stop Wasting Ad Spend: How ICPs Improve Targeting",
      description:
        "If you're reaching the wrong people, your ads will always underperform. Learn how ICP-driven insights create more accurate Meta Audiences and help you get more from every pound spent.",
      bgColor: "#F57BBE",
      link: "#",
    },
    {
      title: "Why We Built the ICP Generator (And How It Helps You Win)",
      description:
        "The story behind the tool — and the problem it was designed to solve. See how knowing your audience more deeply leads to better content, smarter targeting, and faster growth.",
      bgColor: "#FFD336",
      link: "#",
    },
  ];

  return (
    <section id="resources" className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-left">
          <h2 className="mb-4 font-['Fraunces'] text-3xl sm:text-4xl lg:text-5xl opacity-0 animate-fade-in-up font-bold">
            Resources
          </h2>
          <p className="max-w-2xl text-lg text-foreground/70 opacity-0 animate-fade-in-up delay-100">
            Everything you need to create content and ads your customers actually care about.
          </p>
        </div>

        {/* Masonry Grid */}
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 768: 2, 1024: 3 }}
        >
          <Masonry gutter="1.5rem">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                className="group relative block p-6 sm:p-8 rounded-design border border-black transition-all duration-300 hover:scale-[1.02] hover:shadow-lg opacity-0 animate-fade-in-up cursor-pointer"
                style={{
                  backgroundColor: resource.bgColor,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {/* Arrow Icon */}
                <div className="absolute top-6 right-6 sm:top-8 sm:right-8 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8 text-text-dark" />
                </div>

                {/* Content */}
                <div className="pr-8">
                  <h3 className="mb-4 font-['Fraunces'] text-xl sm:text-2xl text-text-dark">
                    {resource.title}
                  </h3>
                  <p className="text-text-dark/80 leading-relaxed">
                    {resource.description}
                  </p>
                </div>
              </a>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </section>
  );
}
