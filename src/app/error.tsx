'use client';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="status-page section-shell">
      <p className="eyebrow">Something went wrong</p>
      <h1>The experience stalled.</h1>
      <p>The static content remains safe; retry the route or return home.</p>
      {error.digest ? <p className="error-reference">Reference: {error.digest}</p> : null}
      <button className="button button-dark" type="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
