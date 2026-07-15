import { memo } from 'react';
import { Globe2 } from './icons.jsx';
import { Link } from 'react-router';

const PRODUCT_LINKS = [
  { to: '/compare',        label: 'Compare Cities' },
  { to: '/visa-predictor', label: 'Visa Predictor' },
  { to: '/culture-guide',  label: 'Culture Guide' },
  { to: '/checklist',      label: 'Checklist' },
];

const ACCOUNT_LINKS = [
  { to: '/signup',  label: 'Sign Up' },
  { to: '/login',   label: 'Log In' },
  { to: '/saved',   label: 'Saved Comparisons' },
  { to: '/profile', label: 'Profile' },
];

function FooterLinkColumn({ title, links, ariaLabel }) {
  return (
    <div>
      <p className="footer-col-title">{title}</p>
      <nav className="footer-links" aria-label={ariaLabel}>
        {links.map(({ to, label }) => (
          <Link key={to} to={to}>{label}</Link>
        ))}
      </nav>
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-expanded mt-auto">
      <div className="footer-grid">

        <div>
          <Link to="/" className="flex items-center gap-2 mb-3" aria-label="MetroScope Flow home">
            <Globe2 size={18} className="text-brand-500" />
            <span className="font-display text-base font-bold gradient-text">MetroScope Flow</span>
          </Link>
          <p className="text-sm text-surface-600 leading-relaxed max-w-xs">
            Know before you move. Compare cities side-by-side across cost of living, safety, healthcare, and quality of life.
          </p>
        </div>

        <FooterLinkColumn title="Product" links={PRODUCT_LINKS} ariaLabel="Product links" />
        <FooterLinkColumn title="Account" links={ACCOUNT_LINKS} ariaLabel="Account links" />

        <div>
          <p className="footer-col-title">Data</p>
          <p className="text-xs text-surface-600 leading-relaxed">
            {year} educational dataset modeled on global cost-of-living and quality-of-life patterns. NYC&nbsp;=&nbsp;100 baseline. Not financial advice.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} MetroScope Flow. All rights reserved.</span>
        <span>Educational project · illustrative data</span>
      </div>
    </footer>
  );
}

export default memo(Footer);
