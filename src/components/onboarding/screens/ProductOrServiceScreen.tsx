"use client";

import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

interface ProductOrServiceScreenProps {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function ProductOrServiceScreen({ value, onChange, onContinue, onBack }: ProductOrServiceScreenProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onContinue();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="font-['Fraunces'] font-bold text-4xl">
        What product or service should we use to build your ICP?
      </h1>
      <p className="text-foreground/70 max-w-md">
        You can change this later.
      </p>
      
      <div className="space-y-4 pt-4">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Marketing software, Handmade jewelry, Design services"
          className="border-[1px] border-black rounded-[10px] px-4 py-6 bg-white text-foreground placeholder:text-foreground/40"
          autoFocus
        />
      </div>
    </div>
  );
}
