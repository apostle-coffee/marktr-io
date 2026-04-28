import { useState } from "react";
import { Link } from "react-router-dom";
import { UserCircle, BookOpen, Zap, ArrowRight, Check } from "lucide-react";

const benefits = [
  { id: 0, label: "Start with your ideal customer", panel: "Start with your ideal customer" },
  { id: 1, label: "Generate content in your voice", panel: "Generate content in your voice" },
  { id: 2, label: "Publish and track performance", panel: "Publish and track performance" },
  { id: 3, label: "Replace your agency", panel: "Replace your agency" },
] as const;

export default function Home() {
  const [activeBenefit, setActiveBenefit] = useState(0);

  return (
    <main className="overflow-x-hidden">
      {/* SECTION 2 — Hero */}
      <section className="relative min-h-[100dvh] bg-background overflow-hidden">
        <div className="mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-center px-6 py-20 lg:grid lg:grid-cols-5 lg:items-center lg:gap-12 lg:py-0">
          <div className="relative z-10 lg:col-span-3">
            <div className="mb-6 inline-flex items-center rounded-full border border-primary px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
              Your marketing team, built in
            </div>
            <h1 className="mb-6 font-['Fraunces'] text-5xl font-bold leading-[1.05] text-[#0D1833] sm:text-6xl lg:text-8xl">
              Marketing that knows your customer.
            </h1>
            <p className="mb-10 max-w-xl font-['DM_Sans'] text-xl font-normal text-muted-foreground">
              marktr defines your ideal customer, shapes your story, and creates your content — without the agency price tag.
            </p>
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                to="/onboarding-build"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-center text-lg font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Start free trial
              </Link>
              <a
                href="#modules"
                className="inline-flex items-center justify-center font-['DM_Sans'] text-lg text-foreground underline underline-offset-4"
              >
                See how it works →
              </a>
              <Link
                to="/onboarding-build"
                className="inline-flex items-center justify-center font-['DM_Sans'] text-lg text-foreground underline underline-offset-4 sm:ml-0"
              >
                Generate Free Now
              </Link>
            </div>
            <ul className="flex flex-col gap-2 font-['DM_Sans'] text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-8">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                No credit card required
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                14-day free trial
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                Cancel anytime
              </li>
            </ul>
          </div>

          <div className="relative z-10 mt-16 lg:col-span-2 lg:mt-0">
            <div
              className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(232,101,10,0.35) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />
            <div className="relative space-y-6">
              <div className="rounded-xl bg-card p-6 shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  M
                </div>
                <p className="font-['Fraunces'] text-xl font-bold leading-snug text-[#0D1833] sm:text-2xl">
                  Generate a month of Instagram content for my coffee brand
                </p>
              </div>
              <div className="ml-0 rounded-xl bg-primary px-6 py-5 text-primary-foreground shadow-lg sm:ml-8">
                <p className="font-['Fraunces'] text-4xl font-bold leading-none">+340%</p>
                <p className="mt-1 font-['DM_Sans'] text-sm font-medium opacity-90">Engagement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Social proof */}
      <section className="border-y border-border bg-white py-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="mb-6 font-['DM_Sans'] text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by ambitious founders
          </p>
          <p className="font-['DM_Sans'] text-sm uppercase tracking-widest text-muted-foreground">
            Apostle Coffee · British Log Cabins · The Green · McCartneys LLP · Continental Fireplaces
          </p>
        </div>
      </section>

      {/* SECTION 4 — Module cards */}
      <section id="modules" className="bg-background px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mx-auto max-w-4xl font-['Fraunces'] text-4xl font-bold leading-tight text-[#0D1833] sm:text-5xl lg:text-6xl">
            Everything your marketing team does.
            <br className="hidden sm:block" />
            Built into one platform.
          </h2>
        </div>
        <div className="mx-auto mt-14 grid max-w-6xl gap-8 lg:grid-cols-3">
          {[
            {
              bg: "bg-[var(--feature-amber)]",
              Icon: UserCircle,
              title: "Know your customer",
              body: "Define your ideal customer profile once. Every piece of content is written for them, not everyone.",
            },
            {
              bg: "bg-[var(--feature-teal)]",
              Icon: BookOpen,
              title: "Shape your story",
              body: "Your founding story, brand voice and values — captured once, applied to everything marktr creates.",
            },
            {
              bg: "bg-[var(--feature-coral)]",
              Icon: Zap,
              title: "Grow your business",
              body: "Strategy, content, scheduling and reporting — the full marketing system, without the agency fees.",
            },
          ].map(({ bg, Icon, title, body }) => (
            <div
              key={title}
              className={`relative overflow-hidden rounded-2xl p-8 shadow-sm ${bg}`}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(13,24,51,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(13,24,51,0.06) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />
              <div className="relative">
                <Icon className="mb-5 h-10 w-10 text-[#0D1833]" strokeWidth={1.5} />
                <h3 className="mb-3 font-['Fraunces'] text-2xl font-bold text-[#0D1833]">{title}</h3>
                <p className="mb-6 font-['DM_Sans'] text-base leading-relaxed text-[#0D1833]/80">{body}</p>
                <span className="inline-flex items-center text-primary" aria-hidden>
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — Accordion + placeholder */}
      <section id="why-marktr" className="border-t border-border bg-white px-6 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <h2 className="mb-10 font-['Fraunces'] text-4xl font-bold text-[#0D1833] sm:text-5xl">
              Why founders choose marktr
            </h2>
            <ul className="space-y-1">
              {benefits.map((b) => {
                const active = activeBenefit === b.id;
                return (
                  <li key={b.id}>
                    <button
                      type="button"
                      onClick={() => setActiveBenefit(b.id)}
                      className={`w-full py-3 text-left transition-colors ${
                        active
                          ? "font-['Fraunces'] text-lg font-bold text-primary"
                          : "font-['DM_Sans'] text-base font-normal text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {b.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-muted px-6 py-16 text-center lg:min-h-[360px]">
              <p className="font-['DM_Sans'] text-lg text-muted-foreground">
                Product screenshot — {benefits[activeBenefit].panel}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Proof mosaic */}
      <section className="bg-background px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-['Fraunces'] text-4xl font-bold text-[#0D1833] sm:text-5xl">
            Proven results, real founders
          </h2>
        </div>
        <div className="mx-auto mt-14 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <div className="rounded-2xl bg-[#D4EDE8] p-8 text-left">
            <p className="font-['Fraunces'] text-5xl font-bold text-[#0D1833]">17,000</p>
            <p className="mt-2 font-['DM_Sans'] text-sm text-[#0D1833]/80">Instagram views from the right audience</p>
            <p className="mt-6 font-['DM_Sans'] text-xs font-semibold uppercase tracking-widest text-[#0D1833]/60">
              British Log Cabins
            </p>
          </div>
          <div className="rounded-2xl bg-white p-8 text-left shadow-sm">
            <p className="font-['Fraunces'] text-lg font-medium leading-relaxed text-[#0D1833]">
              &ldquo;marktr helped us tell the story we&apos;d been struggling to articulate for years.&rdquo;
            </p>
            <p className="mt-6 font-['DM_Sans'] text-sm font-semibold text-muted-foreground">— The Green Caravan Park</p>
          </div>
          <div className="rounded-2xl bg-[#FDF0CC] p-8 text-left">
            <p className="font-['Fraunces'] text-5xl font-bold text-[#0D1833]">£10,000</p>
            <p className="mt-2 font-['DM_Sans'] text-sm text-[#0D1833]/80">online course sold from organic content</p>
          </div>
          <div className="rounded-2xl bg-white p-8 text-left shadow-sm">
            <div className="mb-4 aspect-[3/4] max-h-40 w-full rounded-lg bg-muted" aria-hidden />
            <p className="font-['DM_Sans'] text-sm leading-relaxed text-[#0D1833]">
              Apostle Coffee — built from zero to award-winning
            </p>
          </div>
          <div className="rounded-2xl bg-[#FAE8E0] p-8 text-left">
            <p className="font-['Fraunces'] text-5xl font-bold text-[#0D1833]">6 months</p>
            <p className="mt-2 font-['DM_Sans'] text-sm text-[#0D1833]/80">from outdated brand to full digital presence</p>
          </div>
          <div className="rounded-2xl bg-white p-8 text-left shadow-sm">
            <p className="font-['Fraunces'] text-lg font-medium leading-relaxed text-[#0D1833]">
              &ldquo;The strategy was there — we just needed someone to find it.&rdquo;
            </p>
            <p className="mt-6 font-['DM_Sans'] text-sm font-semibold text-muted-foreground">— McCartneys LLP</p>
          </div>
        </div>
      </section>

      {/* SECTION 7 — CTA */}
      <section className="bg-[#0D1833] px-6 py-20 text-center lg:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-['Fraunces'] text-4xl font-bold text-white sm:text-5xl">Your marketing team is ready.</h2>
          <p className="mt-4 font-['DM_Sans'] text-lg text-white/70">Start for free. No agency required.</p>
          <Link
            to="/onboarding-build"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-lg font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start free trial
          </Link>
        </div>
      </section>
    </main>
  );
}
