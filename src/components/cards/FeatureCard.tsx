import { Lock } from "lucide-react";
import svgPaths from "@/imports/svg-datep0tu2p";

interface FeatureCardProps {
  color: string;
  title: string;
  description: string;
  isLocked?: boolean;
  badge?: string;
  delay?: number;
  screenshot?: string;
}

const colorMap: Record<string, string> = {
  purple: "#BBA0E5",
  orange: "#FF9922",
  green: "#B0ED9D",
  pink: "#FFADAD",
  yellow: "#FFD336",
  brown: "#C4A57B",
};

export function FeatureCard({
  color,
  title,
  description,
  isLocked = false,
  badge,
  delay = 0,
  screenshot,
}: FeatureCardProps) {
  const bgColor = colorMap[color] || "#BBA0E5";

  return (
    <div
      className={`relative rounded-design border border-black bg-white overflow-hidden opacity-0 animate-fade-in-up group transition-all hover:shadow-lg ${
        isLocked ? "opacity-60" : ""
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Colored Section at Top */}
      <div className="relative h-[280px] w-full flex flex-col bg-[#FF9922]">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 540 535"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d={svgPaths.pa924280}
            fill={bgColor}
            stroke="none"
          />
        </svg>
        
        {/* Badge */}
        {badge && (
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white border border-black px-3 py-1 text-xs text-black z-10">
            {badge}
          </div>
        )}

        {/* Lock icon */}
        {isLocked && (
          <div className="absolute bottom-4 left-20 flex items-center h-[26px] z-10">
            <Lock className="h-5 w-5 text-black" />
          </div>
        )}

        {/* Title */}
        <div className="relative top-8 px-6 z-10">
          <h3 className="-mt-2 font-['Fraunces'] leading-tight text-[24px] font-normal">
            {title}
          </h3>
        </div>

        {/* Screenshot */}
        {screenshot && (
          <div className="absolute bottom-0 right-0 w-[65%] h-auto z-10">
            <img 
              src={screenshot} 
              alt={title}
              className="w-full h-auto object-contain"
            />
          </div>
        )}
      </div>

      {/* Text Content Section */}
      <div className="p-6 pt-8">
        <p className="text-foreground/70">{description}</p>
      </div>
    </div>
  );
}
