"use client";

import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { SelectChip } from "../SelectChip";

interface MarketingChannelsScreenProps {
  value: string[];
  onChange: (value: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

const channelOptions = [
  "Instagram",
  "Facebook",
  "TikTok",
  "LinkedIn",
  "Email",
  "Pinterest",
  "Website",
  "YouTube",
  "Twitter/X",
  "None yet"
];

export function MarketingChannelsScreen({ value, onChange, onContinue, onBack }: MarketingChannelsScreenProps) {
  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="font-['Fraunces'] font-bold text-4xl">
        Where do your customers currently show up online?
      </h1>
      <p className="text-foreground/70 max-w-md">
        This helps tailor your content strategy.
      </p>
      
      <div className="pt-4">
        <div className="flex flex-wrap gap-3">
          {channelOptions.map((option) => (
            <SelectChip
              key={option}
              label={option}
              selected={value.includes(option)}
              onClick={() => toggleOption(option)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
