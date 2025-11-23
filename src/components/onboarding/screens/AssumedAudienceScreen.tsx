"use client";

import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { SelectChip } from "../SelectChip";
import { Input } from "../../ui/input";

interface AssumedAudienceScreenProps {
  value: string[];
  customAudience: string;
  onChange: (value: string[]) => void;
  onCustomAudienceChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

const audienceOptions = [
  "Founders",
  "Creators",
  "SMB owners",
  "Parents",
  "Students",
  "Professionals",
  "Freelancers",
  "Agencies",
  "E-commerce",
  "Not sure"
];

export function AssumedAudienceScreen({ 
  value, 
  customAudience,
  onChange, 
  onCustomAudienceChange,
  onContinue, 
  onBack 
}: AssumedAudienceScreenProps) {
  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (value.length > 0 || customAudience.trim())) {
      onContinue();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="font-['Fraunces'] font-bold text-4xl">
        Who do you think your customer is today?
      </h1>
      <p className="text-foreground/70 max-w-md">
        We'll refine and validate this for you.
      </p>
      
      <div className="pt-4 space-y-6">
        <div className="flex flex-wrap gap-3">
          {audienceOptions.map((option) => (
            <SelectChip
              key={option}
              label={option}
              selected={value.includes(option)}
              onClick={() => toggleOption(option)}
            />
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm text-foreground/70">
            Or specify your own:
          </label>
          <Input
            type="text"
            value={customAudience}
            onChange={(e) => onCustomAudienceChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Tech-savvy millennials, Small business accountants"
            className="border-[1px] border-black rounded-[10px] px-4 py-6 bg-white text-foreground placeholder:text-foreground/40"
          />
        </div>
      </div>
    </div>
  );
}
