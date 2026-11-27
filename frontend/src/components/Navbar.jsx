import { useEffect, useState } from 'react';
import LogoMark from './LogoMark';
import { useCampus } from '../context/useCampus';
import { initialsOf } from '../utils/format';

const NAV_ITEMS = [
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'wanted', label: 'Wanted Board' },
  { id: 'advanced-search', label: 'Advanced Search' },
  { id: 'wishlist', label: 'Wishlist' },
];

export default function Navbar({ activeTab, setActiveTab, onOpenPostModal, wishlistCount, user, onLogin, onSignup, onLogout }) {
  const { campus } = useCampus();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const initials = user ? initialsOf(user.name) : '';

  const renderLink = (item, withExtras) => (
    <button key={item.id} type="button" className={`nav-link${activeTab === item.id ? ' active' : ''}`} onClick={() => go(item.id)}>
      {item.label}
      {withExtras && item.isNew && <span className="new-tag">New</span>}
      {withExtras && item.id === 'wishlist' && wishlistCount > 0 && <span className="count-tag">{wishlistCount}</span>}
    </button>
  );

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`} id="main-header">
        <div className="header-inner">
          <button type="button" className="logo-wrap" onClick={() => go('marketplace')} aria-label="Campus Exchange home">
            <LogoMark />
            <span className="logo-word">Campus Exchange</span>
          </button>

          <div className="hide-mobile" style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            🎓 {campus.name}
          </div>

          <nav className="nav-links">{NAV_ITEMS.map((item) => renderLink(item, true))}</nav>

          <div className="header-right">
            <button type="button" className="btn-post" onClick={onOpenPostModal}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 1v12M1 7h12" />
              </svg>
              <span className="btn-post-text">Post an Item</span>
            </button>
            {user ? (
              <>
                <div className="profile-wrap" onClick={() => go('account')} title={`${user.name} - My account`}>
                  <div className="profile-avatar">{initials}</div>
                  <div className="verified-badge-sm">
                    <svg viewBox="0 0 7 7" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1.5 3.5l1.5 1.5 2.5-3" />
                    </svg>
                  </div>
                </div>
                <button type="button" className="nav-link hide-mobile" onClick={onLogout}>Log out</button>
              </>
            ) : (
              <>
                <button type="button" className="nav-link" onClick={onLogin}>Log in</button>
                <button type="button" className="nav-link hide-mobile" onClick={onSignup} style={{ fontWeight: 800 }}>Sign up</button>
              </>
            )}
            <button type="button" className="hamburger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 5h16M2 10h16M2 15h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)}>
        <div className="mobile-sheet" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              style={{ background: '#f1f3fa', borderRadius: '50%', width: 32, height: 32, fontSize: 18 }}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <div style={{ marginBottom: 12, fontWeight: 700, color: 'var(--muted)' }}>🎓 {campus.name}</div>
          {NAV_ITEMS.map((item) => renderLink(item, false))}
          {user && (
            <>
              <button type="button" className={`nav-link${activeTab === 'account' ? ' active' : ''}`} onClick={() => go('account')}>My Account</button>
              <button type="button" className="nav-link" onClick={() => { setMenuOpen(false); onLogout(); }}>Log out</button>
            </>
          )}
          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={() => {
                setMenuOpen(false);
                onOpenPostModal();
              }}
            >
              ⊕ Post an Item
            </button>
          </div>
        </div>
      </div>
    </>
  );
}