"use client";

export function HumanSupport() {
  return (
    <section className="bg-background pt-4 pb-16 sm:pt-5 sm:pb-20 lg:pt-6 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-left">
          <h2 className="mb-4 font-['Fraunces'] text-3xl sm:text-4xl lg:text-5xl opacity-0 animate-fade-in-up font-bold">
            Human Support, Always
          </h2>
          <p className="max-w-2xl text-lg text-foreground/70 opacity-0 animate-fade-in-up delay-100 font-bold">
            From people who've been exactly where you are.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl space-y-6 opacity-0 animate-fade-in-up delay-200">
          <p className="text-lg">
            ICP Generator was created by a small team of founders and marketers who kept running into the same problem:
            at the start of every content plan or ad campaign, we were still asking; who is our ideal customer, really?
          </p>

          <p className="text-lg">
            We built this tool because we were tired of guessing.
          </p>

          <p className="text-lg">
            We wanted clarity, confidence, and a way to create marketing that actually speaks to the right people.
          </p>

          <p className="text-lg">
            And because we've been through it ourselves, we're here to help you every step of the way.
          </p>

          <p className="text-lg">
            If you ever get stuck, hit a bug, or just want to share what's working, our inbox is always open.
          </p>

          <p className="text-lg">
            Good, bad, or brilliant - we want to hear it.
          </p>

          {/* Button */}
          <div className="pt-6">
            <button className="rounded-[10px] border border-black bg-[rgb(255,255,255)] px-8 py-3 transition-all hover:scale-105 hover:shadow-lg active:scale-95">
              Get in touch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
