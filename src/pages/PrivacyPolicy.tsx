import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Policy | ICP Generator";

    let meta = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Read the ICP Generator privacy policy and how Bullfinch Digital LTD collects, uses, stores, and protects personal data.";
  }, []);

  return (
    <main className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Link to="/" className="text-sm underline font-['Fraunces']">
            ← Back to Home
          </Link>

          <header className="mt-6 rounded-design border border-black bg-accent-grey/20 p-6 sm:p-8">
            <h1 className="font-['Fraunces'] text-3xl sm:text-4xl lg:text-5xl font-bold text-text-dark">
              Privacy Policy
            </h1>
            <p className="mt-4 text-text-dark/80 leading-relaxed text-lg">
              Bullfinch Digital LTD
            </p>
            <p className="mt-2 text-text-dark/70">Last updated: 13 February 2026</p>
          </header>

          <article className="mt-8 rounded-design border border-black bg-white p-6 sm:p-8">
            <h2 className="mt-2 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              1. Introduction
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Bullfinch Digital LTD (“we”, “us”, “our”) operates the ICP
              Generator application and associated website (the “Service”).
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We are committed to protecting your personal data and handling it
              responsibly in accordance with UK data protection law, including
              the UK GDPR and the Data Protection Act 2018.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              This Privacy Policy explains:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>What information we collect</li>
              <li>How we use it</li>
              <li>How it is stored and processed</li>
              <li>Your rights in relation to your data</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              By using ICP Generator, you agree to the terms of this Privacy
              Policy.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              2. Who We Are
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Bullfinch Digital LTD is a company registered in the United
              Kingdom.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              For the purposes of UK data protection law, Bullfinch Digital LTD
              is the data controller of your personal data.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              If you have any questions about this policy, you can contact us
              at:
            </p>
            <p className="mt-2 text-foreground/80 leading-relaxed">
              Email:{" "}
              <a className="underline" href="mailto:hello@bullfinchdigital.com">
                hello@bullfinchdigital.com
              </a>
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              3. What Data We Collect
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We collect and process the following categories of information:
            </p>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">
              3.1 Account Information
            </h3>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Name</li>
              <li>Email address</li>
            </ul>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">
              3.2 Payment Information
            </h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              All payment processing is handled by Stripe. We do not store your
              full payment details.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Stripe may collect:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Billing name</li>
              <li>Billing address</li>
              <li>Card details</li>
              <li>Transaction history</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Stripe acts as an independent data processor in accordance with
              its own privacy policy.
            </p>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">
              3.3 ICP and User-Generated Content
            </h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We collect and store the information you input into the platform,
              including:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>ICP definitions</li>
              <li>Segment data</li>
              <li>Goals, pains, triggers, objections</li>
              <li>Messaging notes</li>
              <li>Any edits or updates you make</li>
              <li>Library content you generate or store</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              This content is stored securely in our database (Supabase).
            </p>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">
              3.4 Usage Data
            </h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We collect usage and performance data including:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Pages visited</li>
              <li>Features used</li>
              <li>Device information</li>
              <li>Browser type</li>
              <li>IP address (anonymised where possible)</li>
              <li>Session duration</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              This helps us improve platform performance and usability.
            </p>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">
              3.5 Cookies and Tracking Technologies
            </h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We use cookies and similar technologies to:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Operate the platform</li>
              <li>Improve user experience</li>
              <li>Analyse usage</li>
              <li>Measure marketing performance</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              This includes:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Google Analytics</li>
              <li>Facebook Pixel</li>
              <li>LinkedIn Insight Tag</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              These tools may collect device identifiers, browsing behaviour,
              and interaction data.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              You can control cookies via your browser settings.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              4. How We Use Your Data
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We process your data to:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Provide access to the ICP Generator platform</li>
              <li>Enable ICP creation and editing</li>
              <li>Deliver AI-generated outputs</li>
              <li>Manage free and paid accounts</li>
              <li>Process payments</li>
              <li>Improve product performance</li>
              <li>Send account-related communications</li>
              <li>Send marketing emails (where permitted)</li>
              <li>Analyse usage and improve marketing performance</li>
            </ul>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              5. AI Processing
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              ICP Generator uses OpenAI’s API to generate outputs based on the
              information you input.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Your submitted content may be transmitted to OpenAI for
              processing. OpenAI acts as a data processor.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We may use anonymised or aggregated data to improve system
              performance and model quality. We do not sell your personal data.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              6. Marketing Communications
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              By creating an account, you agree to receive marketing emails from
              us.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              You may unsubscribe at any time using the unsubscribe link in any
              email.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Marketing emails are delivered via Klaviyo, which acts as a data
              processor.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              7. Free Access and Paid Accounts
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Users may generate one ICP for free. Editing features require a
              paid account following a 7-day free access period.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Account data is retained in accordance with this policy whether on
              free or paid plans.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              8. Lawful Basis for Processing
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Under UK GDPR, we rely on:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Contractual necessity (to provide the Service)</li>
              <li>
                Legitimate interests (to improve our platform and prevent
                misuse)
              </li>
              <li>
                Consent (for marketing communications and certain cookies)
              </li>
              <li>
                Legal obligation (for accounting and regulatory compliance)
              </li>
            </ul>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              9. Data Storage and Security
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We use reputable third-party providers including:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Supabase (database hosting)</li>
              <li>Vercel (application hosting)</li>
              <li>Stripe (payments)</li>
              <li>Klaviyo (email marketing)</li>
              <li>OpenAI (AI processing)</li>
              <li>Google Analytics</li>
              <li>Meta (Facebook Pixel)</li>
              <li>LinkedIn Insight Tag</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              These providers may process data outside the UK. Where data is
              transferred internationally, we rely on appropriate safeguards
              such as Standard Contractual Clauses or equivalent mechanisms.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We take reasonable technical and organisational measures to
              protect your data from loss, misuse, or unauthorised access.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              10. Data Retention
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We retain personal data:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>For as long as your account remains active</li>
              <li>As required for legal, tax, or regulatory obligations</li>
              <li>
                For a reasonable period after account closure unless deletion is
                requested
              </li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              You may request deletion of your account and associated data at
              any time.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              11. Your Rights
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Under UK data protection law, you have the right to:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request erasure</li>
              <li>Restrict processing</li>
              <li>Object to processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent (where applicable)</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              To exercise your rights, contact us at the email listed above.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              You also have the right to lodge a complaint with the Information
              Commissioner’s Office (ICO).
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              12. Data Sharing
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We do not sell your personal data.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We may share data with:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Service providers listed above</li>
              <li>Legal authorities where required</li>
              <li>Professional advisers where necessary</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We may use anonymised or aggregated data for product improvement
              and internal analytics.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              13. Cookies Policy
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We use cookies to:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Maintain session functionality</li>
              <li>Improve user experience</li>
              <li>Analyse traffic</li>
              <li>Measure marketing effectiveness</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              You may disable cookies in your browser settings. Disabling
              essential cookies may limit functionality.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              14. Changes to This Policy
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We may update this Privacy Policy from time to time.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Where changes are material, we will notify users through the
              platform or via email.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              The “Last updated” date will reflect the most recent revision.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              15. Contact
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              If you have questions about this Privacy Policy or your data,
              contact:
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Bullfinch Digital LTD
            </p>
            <p className="mt-2 text-foreground/80 leading-relaxed">
              Email:{" "}
              <a className="underline" href="mailto:hello@bullfinchdigital.com">
                hello@bullfinchdigital.com
              </a>
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}
