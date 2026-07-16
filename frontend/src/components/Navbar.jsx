import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe2, BookmarkCheck, Menu, X, LogOut, User,
  Compass, ArrowDown, ShieldCheck, Clock, CheckListIcon2, BookOpen
} from './icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import CurrencyToggle from './CurrencyToggle.jsx';

const EASE_OUT = [0.16, 1, 0.3, 1];

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

function NavDropdown({ label, items, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const visibleItems = items.filter(item => !item.protected || user);
  if (visibleItems.length === 0) return null;

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn-ghost text-sm flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-surface-700/40 text-surface-300 hover:text-white transition-colors duration-150 ${
          isOpen ? 'bg-surface-700/40 text-white' : ''
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{label}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
        >
          <ArrowDown size={12} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="absolute top-full left-0 mt-1.5 w-56 glass rounded-xl border border-surface-700/60 p-1.5 z-50 shadow-lg"
            role="menu"
          >
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                        : 'text-surface-400 hover:bg-surface-800/60 hover:text-white border border-transparent'
                    }`
                  }
                  role="menuitem"
                >
                  <Icon size={14} className="shrink-0 text-brand-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

  const planItems = [
    { to: '/visa-predictor', label: 'Visa Predictor', icon: ShieldCheck, protected: true },
    { to: '/visa-timeline',  label: 'Timeline',       icon: Clock,       protected: true },
    { to: '/checklist',      label: 'Checklist',      icon: CheckListIcon2, protected: true },
  ];

  const toolItems = [
    { to: '/discover',       label: 'Discover',       icon: Compass },
    { to: '/saved',          label: 'Saved Comparisons', icon: BookmarkCheck, protected: true },
    { to: '/culture-guide',  label: 'Culture Guide',  icon: BookOpen, protected: true },
  ];

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

        <div className="hidden md:flex items-center justify-center gap-2" role="list">
          {!loading && (
            <>
              <AnimatedNavLink to="/compare" className={navLinkClass}>
                Compare
              </AnimatedNavLink>
              <NavDropdown label="Plan Your Move" items={planItems} user={user} />
              <NavDropdown label="Tools" items={toolItems} user={user} />
            </>
          )}
        </div>

        <div className="hidden md:flex items-center justify-self-end gap-2">
          <CurrencyToggle className="mr-2" />
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
            <NavLink
              to="/compare"
              className={mobileNavLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              <Globe2 size={15} className="mr-1.5" /> Compare
            </NavLink>

            {(user) && (
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-[10px] font-bold text-surface-600 uppercase tracking-widest px-3 mb-1">Plan Your Move</span>
                {planItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={mobileNavLinkClass}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon size={15} className="mr-1.5 text-brand-400" /> {item.label}
                    </NavLink>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[10px] font-bold text-surface-600 uppercase tracking-widest px-3 mb-1">Tools</span>
              {toolItems.map((item) => {
                if (item.protected && !user) return null;
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={mobileNavLinkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon size={15} className="mr-1.5 text-brand-400" /> {item.label}
                  </NavLink>
                );
              })}
            </div>

            <div className="flex items-center justify-between px-3 py-2 border-t border-surface-700/40 mt-3">
              <span className="text-xs text-surface-500 font-semibold">Currency</span>
              <CurrencyToggle />
            </div>

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
                    className="btn-primary text-sm w-full text-center py-2.5"
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
