import Link from 'next/link';
export default function NotFound() { return <div className="status-page section-shell"><p className="eyebrow">404</p><h1>That road ends here.</h1><p>The requested page is not part of this collection.</p><Link className="button button-dark" href="/">Return home</Link></div>; }
