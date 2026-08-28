import Link from 'next/link';
import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="eyebrow">Independent editorial project</p>
          <p className="footer-statement">
            Researched vehicle data, open-license photography and an original procedural 3D
            experience. Not affiliated with any automaker.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/brands">Manufacturer rankings</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/credits">Image credits</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
      <div className="footer-meta">
        <span>© 2026 CultEmergence</span>
        <span>{site.domain}</span>
        <span>Data checked {site.checkedOn}</span>
      </div>
    </footer>
  );
}
