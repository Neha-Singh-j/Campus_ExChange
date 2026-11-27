import { useEffect, useMemo, useState } from 'react';
import { useCampus } from '../context/useCampus';
import { formatMoney, initialsOf } from '../utils/format';

const CATS = [
  { id: 'all', label: 'All Items' },
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

function ListingCard({ item, index, currency, onToggleWishlist, onMakeOffer }) {
  const cat = CAT_OF[item.category] ?? 'other';
  const sellerName = item.seller?.name ?? 'Student';
  const [cls, hub] = (item.seller?.role ?? 'Student').split(' • ');
  const initials = initialsOf(sellerName);
  const avatarCls = AVATARS[[...sellerName].reduce((n, ch) => n + ch.charCodeAt(0), 0) % AVATARS.length];
  const unavailable = item.status !== 'available';
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
        <span className={`badge-top ${BADGE_CLS[item.badge] ?? 'badge-course'}`}>{item.status === 'reserved' ? 'RESERVED' : item.status === 'sold' ? 'SOLD' : item.badge}</span>
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
        <span className="frosted-tag">{sub}{item.images?.length > 1 ? ` • ${item.images.length} photos` : ''}</span>
      </div>
      <div className="card-body">
        <div className="price-row">
          <span className="price">{formatMoney(item.price, currency)}</span>
          {item.originalPrice != null && <span className="struck">{formatMoney(item.originalPrice, currency)} retail</span>}
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

        </div>
        {item.isOwner ? (
          <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: 'var(--muted)', textAlign: 'center' }}>This is your listing</div>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-full"
            style={{ marginTop: 10, opacity: unavailable ? 0.55 : 1 }}
            disabled={unavailable}
            onClick={() => onMakeOffer(item)}
          >
            {unavailable ? (item.status === 'sold' ? 'Sold' : 'Reserved') : 'Make an offer'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MarketplacePage({ listings, stats, loading, error, onRetry, onToggleWishlist, onMakeOffer, onPostItem, onNavigateToHubs }) {
  const { campus } = useCampus();
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('featured');
  const [condition, setCondition] = useState('All Grades');
  const [search, setSearch] = useState('');
  const [feedIdx, setFeedIdx] = useState(0);
  const [feedFade, setFeedFade] = useState(false);

  const listingsCount = useCountUp(stats?.activeListings ?? 0);
  const handoffs = useCountUp(stats?.completedHandoffs ?? 0);
  const students = useCountUp(stats?.verifiedStudents ?? 0);

  // Live ticker built from the real latest listings.
  const feed = listings.slice(0, 3).map((l) => `● ${l.seller.name} listed ${l.title} at ${l.meetupLocation}`);
  if (feed.length === 0) feed.push('● No listings yet - be the first to post an item!');

  useEffect(() => {
    let swap;
    const timer = setInterval(() => {
      setFeedFade(true);
      swap = setTimeout(() => {
        setFeedIdx((i) => i + 1);
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
    if (condition !== 'All Grades') list = list.filter((l) => l.condition === condition);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((l) => [l.title, l.courseCode, l.desc, ...(l.tags || [])].some((f) => f && f.toLowerCase().includes(q)));
    }
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [listings, cat, sort, condition, search]);

  return (
    <>
      <div className="hero">
        <div className="content-col">
          <div className="hero-inner">
            <div>
              <div style={{ marginBottom: 'calc(16*var(--u))' }}>
                <span className="pill pill-mint">
                  <ShieldIcon size={14} /> {campus.short} Student Commons
                </span>
              </div>
              <div className="hero-h1-wrap">
                <h1>
                  Buy, Sell &amp; Swap Safely
                  <br />
                  with{' '}
                  <span style={{ color: 'var(--blue)', textDecorationLine: 'underline', textDecorationColor: '#6ee7b7', textDecorationThickness: 2, textUnderlineOffset: 4 }}>
                    Students
                  </span>
                  .
                </h1>
              </div>
              <p className="hero-p">
                No strangers, no shipping fees, no off-campus parking lot sketches. Exchange textbooks, tech, dorm essentials, and lab gear directly on campus.
              </p>
              <div className="stat-cards-row">
                <div className="stat-card">
                  <div className="stat-num">{listingsCount.toLocaleString()}</div>
                  <div className="stat-label">Active Listings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num green">{handoffs.toLocaleString()}</div>
                  <div className="stat-label">Completed Hand-Offs</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">{students.toLocaleString()} ✓</div>
                  <div className="stat-label">Students</div>
                </div>
              </div>
            </div>

            <div className="escrow-card">
              <div className="escrow-shield"><ShieldIcon size={24} /></div>
              <div className="escrow-title">Safe Campus Hand-Offs</div>
              <div className="escrow-sub">Fellow students, in-person meetups</div>
              <span className="pill pill-mint" style={{ fontSize: 'calc(9.5*var(--u))' }}>● ACTIVE</span>
              <div className="live-feed">
                <div className="live-feed-line" style={{ opacity: feedFade ? 0 : 1, transform: feedFade ? 'translateY(-8px)' : 'none' }}>
                  {feed[feedIdx % feed.length]}
                </div>
              </div>
              <div style={{ marginTop: 'calc(10*var(--u))', fontSize: 'calc(10.5*var(--u))', color: 'var(--muted)' }}>✱ Meet only at listed campus spots</div>
              <a
                href="#verification"
                style={{ fontSize: 'calc(11*var(--u))', fontWeight: 700, color: 'var(--blue)', display: 'block', marginTop: 'calc(6*var(--u))' }}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToHubs?.();
                }}
              >
                Safe meetup spots →
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
          <select className="filter-select" value={condition} onChange={(e) => setCondition(e.target.value)} aria-label="Condition">
            <option>All Grades</option>
            <option>Brand New</option>
            <option>Like New</option>
            <option>Good</option>
            <option>Fair (Usable)</option>
          </select>
          <input
            type="search"
            className="filter-select"
            placeholder="Search items…"
            aria-label="Search items"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="filter-label">
            Showing {visible.length} {cat === 'all' ? 'student listings' : 'items in category'}
          </span>
          <select className="filter-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="featured">Newest first</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {loading && <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>Loading listings…</div>}
        {!loading && error && (
          <div role="alert" style={{ padding: '24px', margin: '16px 0', textAlign: 'center', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, color: '#991b1b' }}>
            <strong>Could not load listings.</strong> {error}
            <div><button type="button" className="btn btn-primary" style={{ marginTop: 10 }} onClick={onRetry}>Try again</button></div>
          </div>
        )}
        {!loading && !error && visible.length === 0 && (
          <div style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
              {listings.length === 0 ? 'No items listed yet' : 'No items match your filters'}
            </div>
            {listings.length === 0 && (
              <button type="button" className="btn btn-primary" onClick={onPostItem}>Post the first item</button>
            )}
          </div>
        )}
        <div className="listing-grid">
          {visible.map((item, i) => (
            <ListingCard key={item.id} item={item} index={i} currency={campus.currency} onToggleWishlist={onToggleWishlist} onMakeOffer={onMakeOffer} />
          ))}
        </div>

        <div className="safety-banner">
          <div className="safety-banner-text">
            <span className="pill pill-dark" style={{ fontSize: 'calc(9*var(--u))', marginBottom: 'calc(14*var(--u))' }}>✱ SAFE MEETUP SPOTS</span>
            <h2>Trade with total peace of mind.</h2>
            <p>
              Always meet at a busy, well-lit spot on campus. Never go somewhere secluded, and check the item before you pay.
            </p>
            <div className="safety-banner-btns">
              <button type="button" className="btn" style={{ background: '#fff', color: 'var(--blue)' }} onClick={onNavigateToHubs}>
                Safe meetup spots
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