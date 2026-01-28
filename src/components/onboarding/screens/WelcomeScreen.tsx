interface WelcomeScreenProps {
  onContinue: () => void;
}

export function WelcomeScreen({}: WelcomeScreenProps) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="font-['Fraunces'] font-bold text-4xl">
        Let's build your Ideal Customer Profile
      </h1>
      <p className="text-foreground/70 max-w-md">
        This takes less than a minute. Just a few simple questions.
      </p>
    </div>
  );
}
