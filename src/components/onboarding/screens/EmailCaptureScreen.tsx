import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Input } from "../../ui/input";

interface EmailCaptureScreenProps {
  email: string;
  onEmailChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
  onTokenChange?: (token: string | null) => void;
  /** When Turnstile is configured, Enter must not bypass the widget (same rules as the main CTA). */
  turnstileRequired?: boolean;
  hasTurnstileToken?: boolean;
}

export function EmailCaptureScreen({ 
  email, 
  onEmailChange, 
  onContinue,
  onTokenChange,
  turnstileRequired = false,
  hasTurnstileToken = false,
}: EmailCaptureScreenProps) {
  const scriptLoadedRef = useRef(false);
  const widgetIdRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    if (!isValidEmail(email)) return;
    if (turnstileRequired && !hasTurnstileToken) {
      e.preventDefault();
      return;
    }
    onContinue();
  };

  // Load Turnstile script once and render widget once (StrictMode safe)
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const renderTurnstile = () => {
      if (!(window as any).turnstile || !containerRef.current || widgetIdRef.current) return;

      widgetIdRef.current = (window as any).turnstile.render(containerRef.current, {
        sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          if (import.meta.env.DEV) console.debug("[Turnstile] token", token);
          onTokenChange?.(token);
        },
        "expired-callback": () => {
          if (import.meta.env.DEV) console.debug("[Turnstile] expired");
          onTokenChange?.(null);
        },
        "error-callback": () => {
          if (import.meta.env.DEV) console.debug("[Turnstile] error");
          onTokenChange?.(null);
        },
      });
    };

    if ((window as any).turnstile) {
      renderTurnstile();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = renderTurnstile;
    document.body.appendChild(script);

    return () => {
      if ((window as any).turnstile && widgetIdRef.current) {
        (window as any).turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onTokenChange]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="font-['Fraunces'] font-bold text-4xl">
        Enter your email to access your ICPs
      </h1>
      <p className="text-foreground/70 max-w-md">
        Enter your email to generate your ICP and unlock access to it in your dashboard.
      </p>
      
      <div className="space-y-4 pt-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="your@email.com"
          className="border border-black rounded-design px-4 py-6 bg-white text-foreground placeholder:text-foreground/40"
          autoFocus
        />

        <div ref={containerRef} id="turnstile-container" className="pt-2" />

        <p className="text-xs text-foreground/60 max-w-md">
          By continuing, you agree to our{" "}
          <Link to="/privacy-policy" className="underline text-foreground">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/terms-of-service" className="underline text-foreground">
            Terms &amp; Conditions
          </Link>.
        </p>
      </div>
    </div>
  );
}
