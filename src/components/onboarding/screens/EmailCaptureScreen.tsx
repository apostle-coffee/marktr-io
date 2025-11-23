"use client";

import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";

interface EmailCaptureScreenProps {
  email: string;
  emailTips: boolean;
  onEmailChange: (value: string) => void;
  onEmailTipsChange: (value: boolean) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function EmailCaptureScreen({ 
  email, 
  emailTips, 
  onEmailChange, 
  onEmailTipsChange, 
  onContinue, 
  onBack 
}: EmailCaptureScreenProps) {
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidEmail(email)) {
      onContinue();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="font-['Fraunces'] font-bold text-4xl">
        Where should we send your ICP?
      </h1>
      <p className="text-foreground/70 max-w-md">
        It's 100% free. We'll email it so you don't lose it.
      </p>
      
      <div className="space-y-4 pt-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="your@email.com"
          className="border-[1px] border-black rounded-[10px] px-4 py-6 bg-white text-foreground placeholder:text-foreground/40"
          autoFocus
        />
        
        <div className="flex items-start gap-3 pt-2">
          <Checkbox
            id="email-tips"
            checked={emailTips}
            onCheckedChange={(checked) => onEmailTipsChange(checked === true)}
            className="mt-1 border-black data-[state=checked]:bg-button-green data-[state=checked]:border-black"
          />
          <label
            htmlFor="email-tips"
            className="text-sm text-foreground/70 cursor-pointer leading-relaxed"
          >
            Send me tips to get the most out of my ICP
          </label>
        </div>
      </div>
    </div>
  );
}
