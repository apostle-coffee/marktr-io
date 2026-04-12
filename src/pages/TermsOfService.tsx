import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Terms of Service | ICP Generator";

    let meta = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Read the ICP Generator Terms of Service for subscription terms, acceptable use, billing, refunds, and legal conditions.";
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
              Terms of Service
            </h1>
            <p className="mt-4 text-text-dark/80 leading-relaxed text-lg">
              ICP Generator
            </p>
            <p className="mt-2 text-text-dark/70">Operated by Bullfinch Digital LTD</p>
            <p className="mt-2 text-text-dark/70">Last updated: 18 February 2026</p>
          </header>

          <article className="mt-8 rounded-design border border-black bg-white p-6 sm:p-8">
            <h2 className="mt-2 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              1. Introduction
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of ICP Generator
              ("the Service"), operated by Bullfinch Digital LTD, a company registered in the
              United Kingdom.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              By accessing or using ICP Generator, you agree to be bound by these Terms. If you do
              not agree, you must not use the Service.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">For legal notices, please contact:</p>
            <p className="mt-2 text-foreground/80 leading-relaxed">
              <a className="underline" href="mailto:hello@bullfinchdigital.com">
                hello@bullfinchdigital.com
              </a>
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">2. Eligibility</h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">You must:</p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Be at least 18 years old</li>
              <li>Have the legal capacity to enter into a binding agreement</li>
              <li>Provide accurate and complete account information</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We reserve the right to suspend or terminate accounts that provide false information.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              3. Description of the Service
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              ICP Generator is a subscription-based marketing intelligence tool that enables users
              to:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Build Ideal Customer Profiles (ICPs)</li>
              <li>Create brand pages</li>
              <li>Generate marketing strategies</li>
              <li>Export materials as PDFs</li>
              <li>Develop structured marketing frameworks</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              The Service provides marketing guidance only. It does not provide legal, financial,
              tax, or business advice. We make no guarantees regarding business outcomes, revenue,
              ad performance, or commercial success.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              4. Subscriptions, Billing and Payments
            </h2>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">4.1 Subscription Model</h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              ICP Generator is offered on a monthly or annual subscription basis, both subject to
              VAT in addition to listed prices.
            </p>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">4.2 Free Trial</h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">We offer a 7-day free trial.</p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              At the end of the trial period, your subscription will automatically convert into a
              paid subscription unless cancelled before the trial ends.
            </p>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">4.3 Billing</h3>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>All payments are processed securely via Stripe.</li>
              <li>By subscribing, you authorise recurring payments.</li>
              <li>VAT is added where applicable.</li>
            </ul>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">4.4 Cancellation</h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              You may cancel your subscription at any time. Cancellation stops future billing but
              your access will continue until the end of your current billing cycle (monthly or
              annual).
            </p>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">
              4.5 14-Day Money-Back Guarantee
            </h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              If you are dissatisfied, you may request a refund within 14 days of your initial paid
              subscription by emailing:
            </p>
            <p className="mt-2 text-foreground/80 leading-relaxed">
              <a className="underline" href="mailto:hello@bullfinchdigital.com">
                hello@bullfinchdigital.com
              </a>
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Refunds are granted at our discretion in good faith and apply only to first-time
              purchases.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">5. User Accounts</h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">You are responsible for:</p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>All activity under your account</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">We may suspend or terminate accounts if you:</p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Breach these Terms</li>
              <li>Use the Service unlawfully</li>
              <li>Attempt to exploit, reverse-engineer, or misuse the platform</li>
              <li>Engage in abusive, fraudulent, or harmful behaviour</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Team accounts may be supported upon request. Please contact us to arrange team
              access.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">6. Acceptable Use</h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">You agree not to use ICP Generator to:</p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Generate unlawful, harmful, or defamatory content</li>
              <li>Infringe intellectual property rights</li>
              <li>Upload or distribute malicious software</li>
              <li>Attempt unauthorised access to systems</li>
              <li>Use the Service in a way that disrupts or harms others</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We reserve the right to restrict or terminate access where misuse occurs.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              7. Intellectual Property and Content Ownership
            </h2>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">7.1 Your Content</h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              You retain ownership of the ICPs, brand pages, marketing strategies, and other
              materials you generate using the Service.
            </p>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">7.2 Our Platform</h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              All platform software, branding, design, content frameworks, and system architecture
              remain the intellectual property of Bullfinch Digital LTD.
            </p>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">
              7.3 Use of Anonymised Data
            </h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">You grant us the right to:</p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Use anonymised and aggregated outputs</li>
              <li>Analyse usage patterns</li>
              <li>Improve product performance and functionality</li>
            </ul>

            <h3 className="mt-8 font-['Fraunces'] text-xl sm:text-2xl font-bold">7.4 AI Training</h3>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Content generated or submitted may be used in anonymised form to improve AI systems
              and model performance. No personally identifiable information will be intentionally
              used for external model training.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              8. Data Protection and Privacy
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Your use of ICP Generator is also governed by our{" "}
              <Link className="underline" to="/privacy-policy">
                Privacy Policy
              </Link>
              , which explains how we collect, process, and protect your data.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              By using the Service, you agree to the practices described in our Privacy Policy.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We process personal data in accordance with UK GDPR and applicable UK data protection
              laws.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              9. Service Availability
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We aim to provide reliable access but do not guarantee uninterrupted availability.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">We may:</p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Modify or update features</li>
              <li>Temporarily suspend access for maintenance</li>
              <li>Improve or discontinue aspects of the Service</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We are not liable for downtime beyond our reasonable control.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              10. Limitation of Liability
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              To the maximum extent permitted by UK law:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>The Service is provided "as is" without warranties of specific outcomes.</li>
              <li>
                We do not guarantee marketing results, advertising performance, revenue, or
                business success.
              </li>
              <li>
                Bullfinch Digital LTD shall not be liable for indirect, consequential, or
                loss-of-profit damages.
              </li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Our total liability arising from your use of the Service shall not exceed the amount
              you paid in subscription fees during the preceding 12 months.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Nothing in these Terms excludes liability for fraud, death, or personal injury caused
              by negligence where prohibited by law.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">11. Termination</h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              You may stop using the Service at any time.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">We may suspend or terminate your access if you:</p>
            <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">
              <li>Breach these Terms</li>
              <li>Engage in misuse</li>
              <li>Fail to pay subscription fees</li>
            </ul>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Upon termination, your right to access paid features will cease at the end of your
              billing period.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">
              12. Changes to These Terms
            </h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              We may update these Terms from time to time. Material changes will be communicated via
              the platform or email.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Continued use of the Service after changes constitutes acceptance of the revised Terms.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">13. Governing Law</h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              These Terms are governed by and interpreted in accordance with the laws of England and
              Wales.
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Any disputes shall be subject to the exclusive jurisdiction of the courts of England
              and Wales.
            </p>

            <h2 className="mt-10 font-['Fraunces'] text-2xl sm:text-3xl font-bold">14. Contact</h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">For legal or contractual queries:</p>
            <p className="mt-4 text-foreground/80 leading-relaxed">Bullfinch Digital LTD</p>
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
