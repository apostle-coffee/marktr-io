import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function CheckEmail() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6 animate-fade-in-up">
        <h1 className="font-['Fraunces'] text-3xl font-bold">Nearly there ✨</h1>
        <p className="text-foreground/70">
          We’ve sent a confirmation link to{email ? ` ${email}` : " your email"}.
        </p>
        <p className="text-foreground/70">
          Confirm your email and your ICPs will be waiting right here.
        </p>

        <div className="space-y-3">
          <Button
            type="button"
            onClick={() => window.open("https://mail.google.com", "_blank", "noreferrer")}
            className="w-full bg-button-green hover:bg-button-green/90 border border-black rounded-design px-8 py-6"
          >
            Open my inbox
          </Button>

          <p className="text-sm text-foreground/60">
            Already confirmed? <Link className="underline" to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
