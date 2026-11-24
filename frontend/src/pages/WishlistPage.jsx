import { useState } from 'react';
import { WATCHLIST_CLASSES } from '../data/mockData';
import { useCampus } from '../context/useCampus';

const AVATARS = ['avatar-ml', 'avatar-dk', 'avatar-st', 'avatar-ar', 'avatar-jm', 'avatar-cb'];
const GRADS = [
  'linear-gradient(135deg,#c8a97e,#8b6340)',
  'linear-gradient(135deg,#8aabcc,#4a7a9b)',
  'linear-gradient(135deg,#b8956a,#7a5c35)',
  'linear-gradient(135deg,#2c3e6b,#1a2545)',
];

export default function WishlistPage({ listings, onToggleWishlist, onOpenChat, onTriggerEscrow, onNavigate }) {
  const { campus } = useCampus();
  const lm = campus.landmarks;

  const [activeSubTab, setActiveSubTab] = useState('all');
  const [watchlists, setWatchlists] = useState(WATCHLIST_CLASSES);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCeilingBudget, setNewCeilingBudget] = useState('');

  const wishlisted = listings.filter((item) => item.isWishlisted);
  const shown = activeSubTab === 'drops' ? wishlisted.filter((i) => i.discount) : wishlisted;
  const showItems = activeSubTab !== 'watchlists';

  const toggleAutoNotify = (id) => setWatchlists((prev) => prev.map((w) => (w.id === id ? { ...w, autoNotify: !w.autoNotify } : w)));
  const removeWatchlist = (id) => setWatchlists((prev) => prev.filter((w) => w.id !== id));

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newCourseCode.trim()) return;
    setWatchlists((prev) => [
      ...prev,
      {
        id: `watch-${Date.now()}`,
        courseCode: newCourseCode.trim().toUpperCase(),
        title: 'Enrolled Course Material',
        target: 'Textbook & Lab Notebook',
        ceilingBudget: parseFloat(newCeilingBudget) || 30,
        peersWatching: 1,
        autoNotify: true,
      },
    ]);
    setNewCourseCode('');
    setNewCeilingBudget('');
    setShowAddClassModal(false);
  };

  const hubRows = [
    [`${lm[0]} 3rd Fl Hub`, '2 items'],
    [`${lm[1]} Lobby`, '1 item'],
    [`${lm[2]} & ${lm[3]} Commons`, '3 items'],
  ];

  const tabClass = (id) => `tab-btn${activeSubTab === id ? ' active' : ''}`;

  return (
    <div className="content-col" style={{ paddingTop: 'calc(24*var(--u))' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 'calc(6*var(--u))' }}>
        <span style={{ fontSize: 'calc(11*var(--u))', color: 'var(--muted)' }}>{campus.name} › Student Commons › Wishlist &amp; Alerts</span>
        <button type="button" className="btn btn-ghost-dark btn-sm">Share with Roommate / Group</button>
      </div>
      <div className="micro-label" style={{ marginBottom: 'calc(8*var(--u))' }}>LIVE PEER PRICE RADAR • SPRING SEMESTER</div>
      <h1 style={{ marginBottom: 'calc(8*var(--u))' }}>My Campus Wishlist &amp; Saved Alerts</h1>
      <p style={{ fontSize: 'calc(13*var(--u))', color: 'var(--muted)', marginBottom: 'calc(24*var(--u))' }}>
        Track course textbooks, dorm essentials, and upcoming move-out deals. Get notified the second a peer lists an item you need on {campus.short} grounds.
      </p>

      <div className="stats-row-wl">
        <div className="wl-stat-card">
          <div className="micro-label">TRACKED GEAR &amp; BOOKS</div>
          <div className="wl-stat-num">{wishlisted.length} Saved Items</div>
        </div>
        <div className="wl-stat-card mint">
          <div className="micro-label">2 PRICE DROPS ACTIVE</div>
          <div className="wl-stat-num">● $35 Saved Potential</div>
        </div>
        <div className="wl-stat-card">
          <div className="micro-label">AUTOMATED ALERTS</div>
          <div className="wl-stat-num">{watchlists.length} Course Watchlists</div>
          <div style={{ display: 'flex', gap: 'calc(5*var(--u))', marginTop: 'calc(8*var(--u))', flexWrap: 'wrap' }}>
            {watchlists.slice(0, 3).map((w) => (
              <span key={w.id} className="pill pill-blue" style={{ fontSize: 'calc(9*var(--u))' }}>{w.courseCode}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8*var(--u))', marginBottom: 'calc(20*var(--u))', borderBottom: '1.5px solid var(--border)', paddingBottom: 'calc(14*var(--u))', flexWrap: 'wrap' }}>
        <button type="button" className={tabClass('all')} onClick={() => setActiveSubTab('all')}>All Saved Listings ({wishlisted.length})</button>
        <button type="button" className={tabClass('drops')} onClick={() => setActiveSubTab('drops')}>Price Drop Alerts {wishlisted.filter((i) => i.discount).length}</button>
        <button type="button" className={tabClass('watchlists')} onClick={() => setActiveSubTab('watchlists')}>Course Watchlists ({watchlists.length})</button>
      </div>

      <div className="wishlist-layout">
        <div>
          {showItems &&
            (shown.length === 0 ? (
              <div className="card" style={{ padding: 'calc(48*var(--u))', textAlign: 'center' }}>
                <div className="card-title" style={{ marginBottom: 'calc(6*var(--u))' }}>Your Wishlist is Empty</div>
                <div style={{ fontSize: 'calc(12*var(--u))', color: 'var(--muted)', maxWidth: 'calc(360*var(--u))', margin: '0 auto' }}>
                  Explore the marketplace and tap the heart on any textbook, desk, or gadget to track price drops.
                </div>
              </div>
            ) : (
              <div className="wishlist-grid">
                {shown.map((item, i) => {
                  const sellerName = item.seller?.name ?? 'Student';
                  const initials = sellerName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <div key={item.id} className="wishlist-card rise" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="wcard-photo" style={{ background: GRADS[i % GRADS.length] }}>
                        {item.image && (
                          <img src={item.image} alt="" loading="lazy" style={{ position: 'absolute', inset: 0 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        )}
                        <div className="wcard-seller-chip">
                          <div className={`avatar ${AVATARS[i % AVATARS.length]}`} style={{ width: 'calc(18*var(--u))', height: 'calc(18*var(--u))', fontSize: 'calc(7*var(--u))' }}>
                            <span>{initials}</span>
                          </div>
                          {sellerName}
                        </div>
                        <div className="wcard-price-tag">${item.price}</div>
                        {item.discount && (
                          <div className="price-drop-pill" style={{ background: 'var(--mint-bg)', color: 'var(--mint-text)' }}>{item.discount}</div>
                        )}
                      </div>
                      <div className="wcard-body">
                        <div className="micro-label" style={{ marginBottom: 'calc(2*var(--u))' }}>{item.courseCode}</div>
                        <div style={{ fontSize: 'calc(10.5*var(--u))', color: 'var(--muted)', marginBottom: 'calc(6*var(--u))' }}>{item.condition}</div>
                        <div className="card-title" style={{ marginBottom: 'calc(4*var(--u))' }}>{item.title}</div>
                        <div style={{ fontSize: 'calc(11*var(--u))', color: 'var(--muted)', marginBottom: 'calc(4*var(--u))', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                          {item.conditionBadge}
                        </div>
                        <div className="location-pill" style={{ marginTop: 0 }}>📍 {item.meetupLocation}</div>
                        <div className="wcard-btn-row">
                          <button type="button" className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={() => onTriggerEscrow(item)}>
                            Buy / Hold Escrow
                          </button>
                          <button type="button" className="btn btn-ghost-dark btn-sm" style={{ flex: 1 }} onClick={() => onOpenChat(item)}>
                            Message {sellerName.split(' ')[0]}
                          </button>
                        </div>
                        <button type="button" className="wcard-remove" onClick={() => onToggleWishlist(item.id)}>
                          Remove from Wishlist
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

          <div className="watchlist-section" style={showItems ? undefined : { marginTop: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(6*var(--u))', gap: 8, flexWrap: 'wrap' }}>
              <h2>Active Course Watchlists</h2>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowAddClassModal(true)}>Track New Class</button>
            </div>
            <p style={{ fontSize: 'calc(11.5*var(--u))', color: 'var(--muted)' }}>
              We ping your campus email the moment a classmate lists these course-specific materials under your max price.
            </p>
            <div className="watchlist-cards">
              {watchlists.map((w) => (
                <div key={w.id} className="watchlist-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10*var(--u))', marginBottom: 'calc(10*var(--u))', flexWrap: 'wrap' }}>
                    <span className="pill pill-blue" style={{ fontSize: 'calc(10*var(--u))' }}>{w.courseCode}</span>
                    <span className="pill pill-mint" style={{ fontSize: 'calc(9*var(--u))' }}>● Monitoring ({w.peersWatching} peers)</span>
                  </div>
                  <div className="card-title" style={{ marginBottom: 'calc(4*var(--u))' }}>{w.title}</div>
                  <div style={{ fontSize: 'calc(11*var(--u))', color: 'var(--muted)' }}>
                    Watching: <strong style={{ color: 'var(--navy)' }}>{w.target}</strong>
                  </div>
                  <div style={{ fontSize: 'calc(11*var(--u))', color: 'var(--muted)' }}>
                    Max price alert: <strong style={{ color: 'var(--navy)' }}>≤ ${w.ceilingBudget.toFixed(2)}</strong>
                  </div>
                  <div className="wl-notify-row">
                    <span className="wl-toggle-label">Auto-Notify: <strong>{w.autoNotify ? 'On' : 'Off'}</strong></span>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={w.autoNotify} onChange={() => toggleAutoNotify(w.id)} />
                      <span className="toggle-track" />
                    </label>
                  </div>
                  <div className="wl-icons">
                    <button type="button" className="wl-icon-btn" title="Delete watchlist" style={{ color: 'var(--red)' }} onClick={() => removeWatchlist(w.id)}>
                      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 4h10M5 4V2h4v2M11 4l-.5 8H3.5L3 4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="wishlist-rail">
          <div className="rail-card" style={{ background: 'var(--amber-bg)', borderColor: '#fcd9a0' }}>
            <div className="rail-card-title" style={{ color: 'var(--amber)' }}>MARKET INTELLIGENCE / End-of-Semester Alert</div>
            <p style={{ fontSize: 'calc(11*var(--u))', color: 'var(--body-text)' }}>
              Dorm furniture, microwaves, and mini-fridges typically drop <strong>35–50%</strong> during Finals Week. Set your target bids now.
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'calc(5*var(--u))', height: 'calc(60*var(--u))', margin: 'calc(12*var(--u)) 0 calc(18*var(--u))' }}>
              {[{ h: 30, l: 'Mar' }, { h: 45, l: 'Apr' }, { h: 65, l: 'May' }, { h: 90, l: 'Finals' }].map((b) => (
                <div key={b.l} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <div style={{ width: '100%', height: `${b.h}%`, background: 'var(--amber)', borderRadius: 'calc(4*var(--u)) calc(4*var(--u)) 0 0', opacity: 0.8 }} />
                  <div style={{ fontSize: 'calc(8*var(--u))', color: 'var(--muted)', marginTop: 'calc(3*var(--u))' }}>{b.l}</div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-amber-border btn-full btn-sm">Set Target Move-Out Bids</button>
          </div>

          <div className="rail-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(10*var(--u))' }}>
              <div className="rail-card-title" style={{ marginBottom: 0 }}>Safe Meetup Hubs</div>
              <span className="pill pill-mint" style={{ fontSize: 'calc(8.5*var(--u))' }}>Monitored</span>
            </div>
            <div className="hub-list">
              {hubRows.map(([h, c]) => (
                <div key={h} className="hub-list-item"><span>{h}</span><span className="hub-count-pill">{c}</span></div>
              ))}
            </div>
            <div className="map-tile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.('verification')}
              style={{ fontSize: 'calc(11*var(--u))', fontWeight: 700, color: 'var(--blue)', display: 'block', marginTop: 'calc(10*var(--u))', textAlign: 'center', width: '100%' }}
            >
              View Campus Meetup Map →
            </button>
          </div>

          <div className="rail-card">
            <div className="rail-card-title">Campus Escrow Hold</div>
            <span className="pill pill-mint" style={{ marginBottom: 'calc(8*var(--u))', display: 'inline-flex' }}>✓ 100% Student Refund Guarantee</span>
            <p style={{ fontSize: 'calc(11*var(--u))', color: 'var(--muted)' }}>
              Funds are held securely until you physically inspect and approve the item at a campus hub. Zero-risk handoffs guaranteed.
            </p>
          </div>
        </div>
      </div>

      <div className={`modal-overlay${showAddClassModal ? ' open' : ''}`} onClick={() => setShowAddClassModal(false)}>
        <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title">Add Course Watchlist</div>
            <button type="button" className="modal-close" aria-label="Close" onClick={() => setShowAddClassModal(false)}>✕</button>
          </div>
          <form onSubmit={handleAddClass}>
            <div className="form-field">
              <label className="form-label" htmlFor="wl-code">Course Code</label>
              <input id="wl-code" className="form-input" type="text" required placeholder="e.g. CS 61B, ECON 2" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} style={{ textTransform: 'uppercase' }} />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="wl-budget">Max Ceiling Budget ($)</label>
              <input id="wl-budget" className="form-input" type="number" placeholder="35" value={newCeilingBudget} onChange={(e) => setNewCeilingBudget(e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'calc(8*var(--u))' }}>
              <button type="button" className="btn btn-ghost-dark btn-sm" onClick={() => setShowAddClassModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Save Watchlist</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}