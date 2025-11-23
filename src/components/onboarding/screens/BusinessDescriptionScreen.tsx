"use client";

import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";

interface BusinessDescriptionScreenProps {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function BusinessDescriptionScreen({ value, onChange, onContinue, onBack }: BusinessDescriptionScreenProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onContinue();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="font-['Fraunces'] font-bold text-4xl">
        Describe your business in one sentence.
      </h1>
      <p className="text-foreground/70 max-w-md">
        Just like you'd explain it to a friend.
      </p>
      
      <div className="space-y-4 pt-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="We help..."
          className="border-[1px] border-black rounded-[10px] px-4 py-4 bg-white text-foreground placeholder:text-foreground/40 min-h-[120px] resize-none"
          autoFocus
        />
      </div>
    </div>
  );
}
