import { useEffect, useState } from 'react';
import CampusSelector from './CampusSelector';
import LogoMark from './LogoMark';
import { CURRENT_USER } from '../data/mockData';

const NAV_ITEMS = [
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'bundles', label: 'Move-Out Bundles', isNew: true },
  { id: 'wanted', label: 'Wanted Board' },
  { id: 'advanced-search', label: 'Advanced Search' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'verification', label: 'Student Verification' },
  { id: 'synopsis', label: 'Synopsis' },
];

export default function Navbar({ activeTab, setActiveTab, onOpenPostModal, wishlistCount, onOpenNotification }) {
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

  const initials = CURRENT_USER.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
          <button type="button" className="logo-wrap" onClick={() => go('marketplace')} aria-label="CampusZon home">
            <LogoMark />
            <span className="logo-word">CampusZon</span>
          </button>

          <div className="hide-mobile">
            <CampusSelector />
          </div>

          <nav className="nav-links">{NAV_ITEMS.map((item) => renderLink(item, true))}</nav>

          <div className="header-right">
            <button type="button" className="btn-post" onClick={onOpenPostModal}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M7 1v12M1 7h12" />
              </svg>
              <span className="btn-post-text">Post an Item</span>
            </button>
            <button type="button" className="bell-btn" onClick={onOpenNotification} aria-label="Notifications">
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M9 1a5 5 0 0 1 5 5v3l1.5 2.5H2.5L4 9V6a5 5 0 0 1 5-5zM7 15.5a2 2 0 0 0 4 0" />
              </svg>
              <span className="bell-dot" />
            </button>
            <div className="profile-wrap" onClick={() => go('verification')} title="Student verification & ID status">
              <div className="profile-avatar">{initials}</div>
              <div className="verified-badge-sm">
                <svg viewBox="0 0 7 7" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 3.5l1.5 1.5 2.5-3" />
                </svg>
              </div>
            </div>
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
          <div style={{ marginBottom: 12 }}>
            <CampusSelector />
          </div>
          {NAV_ITEMS.map((item) => renderLink(item, false))}
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