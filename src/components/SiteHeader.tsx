import Link from 'next/link';

const links = [
  { href: '/#collection', label: 'Collection' },
  { href: '/brands', label: 'Manufacturers' },
  { href: '/compare', label: 'Compare' },
  { href: '/methodology', label: 'Methodology' }
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="CultEmergence home">
          <span className="brand-mark" aria-hidden="true">
            CE
          </span>
          <span>CultEmergence</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Open navigation">Menu</summary>
          <nav aria-label="Mobile navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
