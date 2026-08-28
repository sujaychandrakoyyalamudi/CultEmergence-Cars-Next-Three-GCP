import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'The CultEmergence website privacy posture.',
  alternates: { canonical: '/privacy' }
};

export default function PrivacyPage() {
  return (
    <div className="inner-page section-shell prose-page">
      <header className="inner-hero">
        <p className="eyebrow">Privacy by default</p>
        <h1>
          No account.
          <span>No hidden profile.</span>
        </h1>
      </header>
      <section>
        <h2>What this build collects</h2>
        <p>
          The application contains no account system, lead form, advertising pixel or client-side
          analytics. Comparison selections remain in browser memory and are not transmitted as a user
          profile.
        </p>
      </section>
      <section>
        <h2>Hosting logs</h2>
        <p>
          Google Cloud load-balancer and Cloud Run logs may process standard request information such as
          IP address, user agent, route, timestamp, status and latency for security and operations. Set a
          documented retention period before production.
        </p>
      </section>
      <section>
        <h2>Remote photography</h2>
        <p>
          The browser requests vehicle photographs from Wikimedia’s image host, which can receive standard
          request metadata. The request uses a no-referrer policy. If it fails, a local illustration is
          shown. A production owner may mirror properly licensed derivatives to eliminate that request.
        </p>
      </section>
      <section>
        <h2>Future changes</h2>
        <p>
          Adding analytics, contact forms, personalization, advertising or accounts requires a separate
          privacy review, updated notice, data map, retention policy, consent analysis and Content Security
          Policy change.
        </p>
      </section>
    </div>
  );
}
