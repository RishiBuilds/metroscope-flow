import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Globe2, BookmarkCheck, Menu, X, LogOut, User } from './icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_LINKS = [
  { to: '/compare', label: 'Compare' },
  { to: '/saved',   label: 'Saved',   protected: true },
  { to: '/visa-predictor', label: 'Visa Predictor', protected: true },
  { to: '/visa-timeline', label: 'Timeline', protected: true },
  { to: '/culture-guide', label: 'Culture Guide', protected: true },
  { to: '/checklist', label: 'Checklist', protected: true },
];

function AnimatedNavLink({ to, children, className }) {
  return (
    <NavLink to={to} className={className}>
      {({ isActive }) => (
        <span className="relative inline-flex items-center gap-1.5 pb-0.5">
          {children}
          <motion.span
            className="absolute bottom-0 left-0 h-px bg-brand-400 w-full"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: isActive ? 1 : 0, originX: 0 }}
            whileHover={{ scaleX: 1, originX: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </span>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `btn-ghost text-sm ${isActive ? 'text-white bg-surface-700/60' : ''}`;

  const mobileNavLinkClass = ({ isActive }) =>
    `btn-ghost w-full justify-start text-sm ${isActive ? 'text-white bg-surface-700/60' : ''}`;

  return (
    <header
      role="banner"
      className={`site-nav ${location.pathname === '/' ? 'site-nav-home' : ''} ${scrolled ? 'site-nav-scrolled' : ''} ${menuOpen ? 'site-nav-menu-open' : ''}`}
    >
      <nav
        aria-label="Main navigation"
        className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] grid grid-cols-[1fr_auto_1fr] items-center gap-4"
      >

        <Link
          to="/"
          aria-label="MetroScope Flow — home"
          className="nav-brand flex items-center gap-2 font-bold text-lg tracking-tight shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <Globe2 size={22} className="text-brand-400" aria-hidden="true" />
          <span className="gradient-text">MetroScope Flow</span>
        </Link>

        <div className="hidden md:flex items-center justify-center gap-1" role="list">
          {!loading && NAV_LINKS.map(({ to, label, protected: prot }) => {
            if (prot && !user) return null;
            return (
              <AnimatedNavLink key={to} to={to} className={navLinkClass} role="listitem">
                {label}
              </AnimatedNavLink>
            );
          })}
        </div>

        <div className="hidden md:flex items-center justify-self-end gap-2">
          {!loading && (user ? (
            <>
              <AnimatedNavLink to="/profile" className={navLinkClass} aria-label={`Profile: ${user.name}`}>
                <User size={15} aria-hidden="true" />
                <span>{user.name.split(' ')[0]}</span>
              </AnimatedNavLink>
              <motion.button
                onClick={handleLogout}
                className="btn-ghost text-sm"
                aria-label="Log out"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <LogOut size={15} aria-hidden="true" />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <AnimatedNavLink to="/login" className={navLinkClass}>Login</AnimatedNavLink>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </motion.div>
            </>
          ))}
        </div>

        <motion.button
          className="desktop-menu-trigger md:hidden btn-ghost p-2 min-w-[44px] min-h-[44px] justify-self-end"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          whileTap={{ scale: 0.92 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen
              ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} aria-hidden="true" /></motion.span>
              : <motion.span key="open"  initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu size={20} aria-hidden="true" /></motion.span>
            }
          </AnimatePresence>
        </motion.button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            className="mobile-nav md:hidden px-4 py-3 flex flex-col gap-1 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            aria-hidden={!menuOpen}
          >
            {NAV_LINKS.map(({ to, label, protected: prot }) => {
              if (prot && !user) return null;
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={mobileNavLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {label === 'Saved' && <BookmarkCheck size={15} aria-hidden="true" />}
                  {label}
                </NavLink>
              );
            })}

            <div className="border-t border-surface-700/40 mt-1 pt-2 flex flex-col gap-1">
              {user ? (
                <>
                  <NavLink
                    to="/profile"
                    className={mobileNavLinkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    <User size={15} aria-hidden="true" /> {user.name}
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="btn-ghost w-full justify-start text-sm"
                    aria-label="Log out"
                  >
                    <LogOut size={15} aria-hidden="true" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className={mobileNavLinkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <Link
                    to="/signup"
                    className="btn-primary text-sm w-full"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
