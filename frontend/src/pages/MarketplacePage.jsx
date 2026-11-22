import { useEffect, useMemo, useState } from 'react';
import { useCampus } from '../context/useCampus';

const CATS = [
  { id: 'all', label: 'All Items (3,420)' },
  { id: 'textbooks', label: 'Textbooks & Courseware' },
  { id: 'dorm', label: 'Dorm & Furniture' },
  { id: 'electronics', label: 'Electronics & Calculators' },
  { id: 'gear', label: 'Campus Gear & Merch' },
  { id: 'lab', label: 'Lab Equipment' },
  { id: 'sublease', label: 'Subleases & Housing' },
];

const CAT_OF = {
  'Textbooks & Courseware': 'textbooks',
  'Dorm & Furniture': 'dorm',
  'Electronics & Calculators': 'electronics',
  'Campus Gear & Merch': 'gear',
  'Lab Equipment': 'lab',
  'Subleases & Housing': 'sublease',
};

const BADGE_CLS = {
  'COURSE MATCHED': 'badge-course',
  'DORM PICKUP': 'badge-dorm',
  'TECH TESTED': 'badge-tech',
  'HIGH DEMAND': 'badge-high',
  'READY FOR MOVE-IN': 'badge-move',
  'COURSE ESSENTIAL': 'badge-essential',
  'CAMPUS MERCH': 'badge-merch',
  'QUICK DEAL': 'badge-quick',
};

const GRAD_OF = {
  textbooks: 'linear-gradient(135deg,#c8a97e,#8b6340)',
  dorm: 'linear-gradient(135deg,#8aabcc,#4a7a9b)',
  electronics: 'linear-gradient(135deg,#2c3e6b,#1a2545)',
  gear: 'linear-gradient(135deg,#1a3a6b,#0d2444)',
  lab: 'linear-gradient(135deg,#e8e0d5,#c5b89a)',
};

const AVATARS = ['avatar-ml', 'avatar-dk', 'avatar-st', 'avatar-ar', 'avatar-jm', 'avatar-cb', 'avatar-mw', 'avatar-ep'];

const ShieldIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L4 6v5c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

function useCountUp(target, duration = 1200) {
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (reduced) return undefined;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);

  return value;
}

function ListingCard({ item, index, onToggleWishlist, onOpenChat }) {
  const cat = CAT_OF[item.category] ?? 'other';
  const sellerName = item.seller?.name ?? 'You';
  const [cls, hub] = (item.seller?.role ?? 'Student • On campus').split(' • ');
  const initials = sellerName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const avatarCls = AVATARS[[...sellerName].reduce((n, ch) => n + ch.charCodeAt(0), 0) % AVATARS.length];
  const sub = cat === 'textbooks' ? item.courseCode : item.condition;
  const grad = GRAD_OF[cat] ?? 'linear-gradient(135deg,#d4c5a9,#a89070)';

  return (
    <div className="listing-card rise" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="card-photo" style={{ background: grad }}>
        {item.image && (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            style={{ position: 'absolute', inset: 0 }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <span className={`badge-top ${BADGE_CLS[item.badge] ?? 'badge-course'}`}>{item.badge}</span>
        <button
          type="button"
          className={`heart-btn${item.isWishlisted ? ' liked' : ''}`}
          aria-label={item.isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={() => onToggleWishlist(item.id)}
        >
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 12S1 8 1 4.5a3 3 0 0 1 6 0 3 3 0 0 1 6 0C13 8 7 12 7 12z" />
          </svg>
        </button>
        <span className="frosted-tag">{sub}</span>
      </div>
      <div className="card-body">
        <div className="price-row">
          <span className="price">${item.price}</span>
          {item.originalPrice != null && <span className="struck">${item.originalPrice} retail</span>}
          {item.discount && (
            <span className="pill pill-mint" style={{ fontSize: 'calc(9*var(--u))', padding: 'calc(2*var(--u)) calc(7*var(--u))' }}>
              {item.discount}
            </span>
          )}
        </div>
        <div className="card-title" style={{ marginBottom: 'calc(4*var(--u))' }}>{item.title}</div>
        <div style={{ fontSize: 'calc(11*var(--u))', color: 'var(--muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {item.conditionBadge}
        </div>
        <div className="location-pill">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1z" />
            <circle cx="6" cy="4.5" r="1.2" />
          </svg>{' '}
          {item.meetupLocation}
        </div>
        <hr className="card-hr" />
        <div className="seller-row">
          <div className={`avatar ${avatarCls}`}>
            <span>{initials}</span>
            <span className="dot" />
          </div>
          <div className="seller-info">
            <div className="seller-name">{sellerName} • {cls}</div>
            <div className="seller-sub">{hub}</div>
          </div>
          <button type="button" className="chat-btn" title={`Message ${sellerName}`} onClick={() => onOpenChat(item)}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8.5a1.5 1.5 0 0 1-1.5 1.5H4L1 12V3.5A1.5 1.5 0 0 1 2.5 2h8A1.5 1.5 0 0 1 12 3.5v5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage({ listings, onToggleWishlist, onOpenChat, onNavigateToHubs }) {
  const { campus } = useCampus();
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('featured');
  const [feedIdx, setFeedIdx] = useState(0);
  const [feedFade, setFeedFade] = useState(false);

  const listingsCount = useCountUp(3420);
  const handoffs = useCountUp(98);

  const lm = campus.landmarks;
  const feed = [
    `● Maya L. swapped Bio 1A Notes at ${lm[0]} (2m ago)`,
    `● David K. sold Dorm Chair at ${lm[3]} Lounge (8m ago)`,
    `● Sarah T. completed TI-84 handoff at ${lm[1]} (15m ago)`,
  ];

  useEffect(() => {
    let swap;
    const timer = setInterval(() => {
      setFeedFade(true);
      swap = setTimeout(() => {
        setFeedIdx((i) => (i + 1) % 3);
        setFeedFade(false);
      }, 300);
    }, 4000);
    return () => {
      clearInterval(timer);
      clearTimeout(swap);
    };
  }, []);

  const visible = useMemo(() => {
    let list = cat === 'all' ? listings : listings.filter((l) => (CAT_OF[l.category] ?? 'other') === cat);
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [listings, cat, sort]);

  return (
    <>
      <div className="hero">
        <div className="content-col">
          <div className="hero-inner">
            <div>
              <div style={{ marginBottom: 'calc(16*var(--u))' }}>
                <span className="pill pill-mint">
                  <ShieldIcon size={14} /> {campus.short} Verified Commons • Spring 2025
                </span>
              </div>
              <div className="hero-h1-wrap">
                <h1>
                  Buy, Sell &amp; Swap Safely
                  <br />
                  with{' '}
                  <span style={{ color: 'var(--blue)', textDecorationLine: 'underline', textDecorationColor: '#6ee7b7', textDecorationThickness: 2, textUnderlineOffset: 4 }}>
                    Verified Students
                  </span>
                  .
                </h1>
              </div>
              <p className="hero-p">
                No strangers, no shipping fees, no off-campus parking lot sketches. Exchange textbooks, tech, dorm essentials, and lab gear directly inside secured university zones.
              </p>
              <div className="stat-cards-row">
                <div className="stat-card">
                  <div className="stat-num">{listingsCount.toLocaleString()}</div>
                  <div className="stat-label">Active Listings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num green">{handoffs}%</div>
                  <div className="stat-label">On-Campus Hand-Offs</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">100% ✓</div>
                  <div className="stat-label">.edu Verified Only</div>
                </div>
              </div>
            </div>

            <div className="escrow-card">
              <div className="escrow-shield"><ShieldIcon size={24} /></div>
              <div className="escrow-title">Campus Escrow &amp; Hold</div>
              <div className="escrow-sub">Zero fee campus-protected handoffs</div>
              <span className="pill pill-mint" style={{ fontSize: 'calc(9.5*var(--u))' }}>● ACTIVE</span>
              <div className="live-feed">
                <div className="live-feed-line" style={{ opacity: feedFade ? 0 : 1, transform: feedFade ? 'translateY(-8px)' : 'none' }}>
                  {feed[feedIdx]}
                </div>
              </div>
              <div style={{ marginTop: 'calc(10*var(--u))', fontSize: 'calc(10.5*var(--u))', color: 'var(--muted)' }}>✱ Blue Light Stations mapped</div>
              <a
                href="#verification"
                style={{ fontSize: 'calc(11*var(--u))', fontWeight: 700, color: 'var(--blue)', display: 'block', marginTop: 'calc(6*var(--u))' }}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToHubs?.();
                }}
              >
                Explore Hubs →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="content-col">
        <div className="category-bar-wrap">
          <div className="category-bar">
            {CATS.map((c) => (
              <button key={c.id} type="button" className={`cat-pill${cat === c.id ? ' active' : ''}`} onClick={() => setCat(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-bar">
          <span className="filter-chip">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l2.5 2.5L10 3" /></svg>
            On-Campus Pickup Only
          </span>
          <select className="filter-select" defaultValue="All Grades" aria-label="Condition">
            <option>All Grades</option>
            <option>Like New</option>
            <option>Good</option>
            <option>Acceptable</option>
          </select>
          <label className="filter-check">
            <input type="checkbox" style={{ accentColor: 'var(--blue)' }} />
            ⚡ Fast Responder (&lt; 15m)
          </label>
          <span className="filter-label">
            Showing {visible.length} {cat === 'all' ? 'featured student drops' : 'items in category'}
          </span>
          <select className="filter-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="featured">Featured &amp; Course Relevant</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        <div className="listing-grid">
          {visible.map((item, i) => (
            <ListingCard key={item.id} item={item} index={i} onToggleWishlist={onToggleWishlist} onOpenChat={onOpenChat} />
          ))}
        </div>

        <div className="safety-banner">
          <div className="safety-banner-text">
            <span className="pill pill-dark" style={{ fontSize: 'calc(9*var(--u))', marginBottom: 'calc(14*var(--u))' }}>✱ CAMPUS POLICE VERIFIED SAFE ZONES</span>
            <h2>Trade with total peace of mind.</h2>
            <p>
              Always meet at designated Campus Safety Zones with blue-light monitoring, surveillance coverage, and staff presence. Never hand over cash in off-campus blindspots.
            </p>
            <div className="safety-banner-btns">
              <button type="button" className="btn" style={{ background: '#fff', color: 'var(--blue)' }} onClick={onNavigateToHubs}>
                View 14 Verified Hubs
              </button>
              <button type="button" className="btn btn-ghost">Safety Checklist</button>
            </div>
          </div>
          <div className="shield-watermark"><ShieldIcon size={220} /></div>
        </div>
      </div>
    </>
  );
}