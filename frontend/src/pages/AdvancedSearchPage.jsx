import { useMemo, useState } from 'react';
import { SYLLABUS_MATCHES } from '../data/mockData';
import { useCampus } from '../context/useCampus';
import { useLocalize } from '../context/useLocalize';

const COURSE_CODES = ['BIO 1A', 'CHEM 3B', 'MATH 53', 'CS 61B'];
const AVATARS = ['avatar-ml', 'avatar-dk', 'avatar-st', 'avatar-ar', 'avatar-jm', 'avatar-cb'];
const GRADS = [
  'linear-gradient(135deg,#4a7a5a,#2d5a3a)',
  'linear-gradient(135deg,#5a7a9a,#3a5a7a)',
  'linear-gradient(135deg,#d0c8b8,#a8a098)',
  'linear-gradient(135deg,#c8c090,#a8a070)',
  'linear-gradient(135deg,#788090,#505870)',
  'linear-gradient(135deg,#4a6a4a,#2a4a2a)',
];
const TABS = ['All Items 142', 'Course Materials 38', 'Dorm Goods 54', 'Electronics 27', 'Free Box 8', 'Lab Gear 15'];

const Star = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M6 1l1.5 3h3.2l-2.6 1.9 1 3L6 7.2 2.9 8.9l1-3L1.3 4H4.5z" />
  </svg>
);

const badgeFor = (pct) =>
  pct >= 100
    ? { text: '100% MATCH', color: '#065f46' }
    : pct >= 85
    ? { text: `${pct}% MATCH`, color: '#1d3fbf' }
    : { text: `${pct ?? 80}% MATCH`, color: '#8a3b12' };

const miles = (s) => {
  const m = /([\d.]+)\s*mi/.exec(s ?? '');
  return m ? parseFloat(m[1]) : Infinity;
};

export default function AdvancedSearchPage({ onOpenChat, onTriggerEscrow }) {
  const { campus } = useCampus();
  const loc = useLocalize();
  const lm = campus.landmarks;

  const [selectedCourse, setSelectedCourse] = useState('BIO 1A');
  const [maxDistance, setMaxDistance] = useState(0.4);
  const [priceMax, setPriceMax] = useState(60);
  const [strictMatch, setStrictMatch] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('Biology 1A lab manual and equipment');
  const [sort, setSort] = useState('match');
  const [tab, setTab] = useState(1);
  const [liked, setLiked] = useState({});
  const [hiddenTags, setHiddenTags] = useState([]);

  const items = useMemo(() => loc(SYLLABUS_MATCHES), [loc]);

  const results = useMemo(() => {
    const list = items.filter((it) => it.price <= priceMax);
    if (sort === 'price') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'distance') return [...list].sort((a, b) => miles(a.distance) - miles(b.distance));
    return [...list].sort((a, b) => (b.syllabusMatchPercent ?? 0) - (a.syllabusMatchPercent ?? 0));
  }, [items, priceMax, sort]);

  const tags = [
    { id: 'course', text: selectedCourse },
    { id: 'price', text: `$0–$${priceMax}` },
    { id: 'loc', text: 'Southside / Central' },
    { id: 'edu', text: 'Verified .edu' },
  ].filter((t) => !hiddenTags.includes(t.id));

  const removeTag = (id) => {
    setHiddenTags((p) => [...p, id]);
    if (id === 'price') setPriceMax(200);
  };
  const clearAll = () => {
    setHiddenTags(['course', 'price', 'loc', 'edu']);
    setPriceMax(200);
  };

  const hubs = [
    lm[0],
    lm[1],
    `${lm[2]} & ${lm[3]} Commons`,
    lm[4],
    lm[5],
  ];

  const chatPayload = (it) => ({
    title: it.title,
    price: it.price,
    meetupLocation: it.distance,
    image: it.image,
    seller: { name: it.seller, role: 'Student Seller' },
  });

  return (
    <div className="content-col" style={{ paddingTop: 'calc(24*var(--u))' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(14*var(--u))', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 'calc(10.5*var(--u))', color: 'var(--muted)' }}>
          {campus.name} / College of Letters &amp; Science / Department of Molecular &amp; Cell Biology / <strong>{selectedCourse} Catalog Hub</strong>
        </div>
        <span className="pill pill-mint" style={{ fontSize: 'calc(9.5*var(--u))' }}>✓ Catalog Synced: Spring 2026 Regular Session</span>
      </div>

      <div className="search-bar-wrap">
        <span className="search-campus-chip">{campus.short}</span>
        <input
          className="search-input"
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          aria-label="Search"
        />
        <span className="search-hint">⌘K</span>
        <button type="button" className="btn btn-primary btn-sm">Filter Match</button>
        <button type="button" className="btn btn-ghost-dark btn-sm">Save Search Alert</button>
      </div>

      <div style={{ display: 'flex', gap: 'calc(6*var(--u))', flexWrap: 'wrap', marginBottom: 'calc(16*var(--u))' }}>
        {TABS.map((label, i) => {
          const active = tab === i;
          const free = label.startsWith('Free Box');
          return (
            <button
              key={label}
              type="button"
              className={`tab-btn${active ? ' active' : ''}`}
              onClick={() => setTab(i)}
              style={{
                padding: 'calc(8*var(--u)) calc(14*var(--u))',
                borderBottom: active ? '2px solid var(--navy)' : '2px solid transparent',
                color: active ? 'var(--navy)' : undefined,
                fontWeight: active ? 800 : undefined,
                ...(free ? { background: '#fff3e0', color: 'var(--amber)', borderRadius: 'var(--r-pill)', border: '1px solid #fcd9a0' } : null),
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="syllabus-banner">
        <div className="syllabus-text">
          <strong>Course Syllabus Verification Active:</strong> These results have been matched with the official {campus.name} Spring 2026 course catalog for {selectedCourse}. &nbsp;·&nbsp; Prof. Jennifer Doudna &amp; Staff
        </div>
        <button type="button" className="btn btn-ghost-dark btn-sm">View Syllabus PDF</button>
      </div>

      <div className="search-layout">
        <div className="search-sidebar">
          <div className="sidebar-block">
            <div className="sidebar-title">
              Course &amp; Syllabus Match <span className="pill pill-mint" style={{ fontSize: 'calc(8.5*var(--u))' }}>Active</span>
            </div>
            <div className="micro-label">DEPARTMENT &amp; COURSE CODE</div>
            <div className="course-chips">
              {COURSE_CODES.map((code) => (
                <button
                  key={code}
                  type="button"
                  className={`course-chip${selectedCourse === code ? ' active' : ''}`}
                  onClick={() => {
                    setSelectedCourse(code);
                    setHiddenTags((p) => p.filter((x) => x !== 'course'));
                  }}
                >
                  {code}
                </button>
              ))}
            </div>
            <select className="filter-select" style={{ width: '100%', margin: 'calc(8*var(--u)) 0' }} aria-label="Instructor">
              <option>Instructor: Jennifer Doudna</option>
              <option>Instructor: Welch</option>
            </select>
            <select className="filter-select" style={{ width: '100%' }} aria-label="Semester">
              <option>Semester: Spring 2026</option>
              <option>Semester: Fall 2025</option>
            </select>
            <div className="sidebar-label" style={{ marginTop: 'calc(10*var(--u))' }}>
              <span className="sidebar-label-text">Strict Syllabus Match Only</span>
              <label className="toggle-switch">
                <input type="checkbox" checked={strictMatch} onChange={(e) => setStrictMatch(e.target.checked)} />
                <span className="toggle-track" />
              </label>
            </div>
          </div>

          <div className="sidebar-block">
            <div className="sidebar-title">Campus Radius &amp; Hubs</div>
            <div style={{ fontSize: 'calc(11*var(--u))', color: 'var(--muted)', marginBottom: 'calc(6*var(--u))' }}>
              Current anchor: <strong style={{ color: 'var(--navy)' }}>{lm[0]}</strong>
            </div>
            <div className="price-range-labels"><span>Walking distance</span><span>&lt; {maxDistance} miles</span></div>
            <input
              type="range"
              className="range-input"
              min="0.1"
              max="2"
              step="0.1"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              aria-label="Walking distance"
            />
            <div className="sidebar-checkbox-row">
              {hubs.map((h, i) => (
                <label key={h} className="sidebar-check">
                  <input type="checkbox" defaultChecked={i < 2} /> {h}
                </label>
              ))}
            </div>
          </div>

          <div className="sidebar-block">
            <div className="sidebar-title">Price Range</div>
            <div className="price-range-labels"><span>$0</span><span>${priceMax}</span></div>
            <input
              type="range"
              className="range-input"
              min="10"
              max="200"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              aria-label="Maximum price"
            />
            <label className="sidebar-check" style={{ marginTop: 'calc(8*var(--u))' }}>
              <input type="checkbox" /> Include Free Swaps &amp; Textbook Trades
            </label>
          </div>

          <div className="sidebar-block">
            <div className="sidebar-title">Condition Standard</div>
            <div className="sidebar-checkbox-row">
              <label className="sidebar-check"><input type="checkbox" /> Brand New (Unopened) <span style={{ color: 'var(--muted)', marginLeft: 4 }}>(4)</span></label>
              <label className="sidebar-check"><input type="checkbox" defaultChecked /> Like New (No highlighting) <span style={{ color: 'var(--muted)', marginLeft: 4 }}>(21)</span></label>
              <label className="sidebar-check"><input type="checkbox" defaultChecked /> Good (Light margin notes) <span style={{ color: 'var(--muted)', marginLeft: 4 }}>(18)</span></label>
            </div>
          </div>

          <div className="sidebar-block">
            <div className="sidebar-title">Seller Credentials</div>
            <div className="sidebar-checkbox-row">
              <label className="sidebar-check"><input type="checkbox" defaultChecked /> .edu Verified Student</label>
              <label className="sidebar-check"><input type="checkbox" defaultChecked /> Graduating Senior Quick-Sale</label>
              <label className="sidebar-check"><input type="checkbox" /> Verified Honors Student</label>
              <label className="sidebar-check"><input type="checkbox" defaultChecked /> Top Rated Peer (4.8+ ★)</label>
            </div>
          </div>
        </div>

        <div>
          <div className="search-results-header">
            <span className="results-count">
              Showing {results.length} of 48 Verified Results
            </span>
            <span className="pill pill-blue">{selectedCourse}</span>
            <select className="filter-select" style={{ marginLeft: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort results">
              <option value="match">Best Course Match (90%+)</option>
              <option value="price">Price: Low to High</option>
              <option value="distance">Distance: Closest First</option>
            </select>
          </div>

          <div className="active-filters">
            <span style={{ fontSize: 'calc(11*var(--u))', color: 'var(--muted)' }}>Active filters:</span>
            {tags.map((t) => (
              <span key={t.id} className="filter-tag">
                {t.text} <button type="button" aria-label={`Remove ${t.text}`} onClick={() => removeTag(t.id)}>×</button>
              </span>
            ))}
            <button type="button" onClick={clearAll} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 'calc(11*var(--u))', fontWeight: 700, cursor: 'pointer' }}>
              Clear All
            </button>
          </div>

          {results.length === 0 ? (
            <div className="card" style={{ padding: 'calc(36*var(--u))', textAlign: 'center', color: 'var(--muted)' }}>
              Nothing under ${priceMax}. Raise the price slider to see more results.
            </div>
          ) : (
            results.map((it, i) => {
              const badge = badgeFor(it.syllabusMatchPercent);
              const sellerName = it.seller.split('•')[0].trim();
              const initials = sellerName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
              const instant = it.price <= 18 && /digital|instant/i.test(it.distance);
              return (
                <div key={it.id} className="search-result-card rise" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="result-photo" style={{ background: GRADS[i % GRADS.length] }}>
                    <img src={it.image} alt="" loading="lazy" style={{ position: 'absolute', inset: 0 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: 'calc(8*var(--u))',
                        left: 'calc(8*var(--u))',
                        background: badge.color,
                        color: '#fff',
                        fontSize: 'calc(8*var(--u))',
                        fontWeight: 800,
                        letterSpacing: '0.07em',
                        padding: 'calc(2*var(--u)) calc(6*var(--u))',
                        borderRadius: 'var(--r-pill)',
                        zIndex: 2,
                      }}
                    >
                      {badge.text}
                    </span>
                  </div>
                  <div className="result-body">
                    <div className="result-price-row">
                      <div className="card-title" style={{ flex: 1, paddingRight: 'calc(10*var(--u))' }}>{it.title}</div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div className="price-sm">${it.price}</div>
                        {it.originalPrice ? <div className="struck">${it.originalPrice}</div> : null}
                      </div>
                    </div>
                    <div className="result-meta">
                      <span className="chip chip-green">✓ {it.courseCode}</span>
                      <span className="chip chip-blue">{it.condition}</span>
                      {it.matchBadge ? <span className="chip chip-grey">{it.matchBadge}</span> : null}
                    </div>
                    <div className="result-desc">{it.notes}</div>
                    <div className="result-seller-row">
                      <div className={`avatar ${AVATARS[i % AVATARS.length]}`}><span>{initials}</span><span className="dot" /></div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(6*var(--u))' }}>
                          <span className="seller-name">{sellerName}</span>
                          <span className="seller-rating"><Star /> {it.rating}</span>
                        </div>
                        <div className="seller-dist" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.distance}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 'calc(6*var(--u))', alignItems: 'center', flexShrink: 0 }}>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpenChat(chatPayload(it))}>
                          Message {sellerName.split(' ')[0]}
                        </button>
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            onTriggerEscrow({
                              title: it.title,
                              price: it.price,
                              meetupLocation: it.distance,
                              image: it.image,
                              condition: it.condition,
                              seller: { name: it.seller },
                            })
                          }
                        >
                          {instant ? `Instant Purchase ($${it.price})` : 'Hold Escrow'}
                        </button>
                        <button
                          type="button"
                          className={`heart-btn${liked[it.id] ? ' liked' : ''}`}
                          aria-label="Save"
                          style={{ position: 'static', width: 'calc(28*var(--u))', height: 'calc(28*var(--u))', background: '#f1f3fa' }}
                          onClick={() => setLiked((p) => ({ ...p, [it.id]: !p[it.id] }))}
                        >
                          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 12S1 8 1 4.5a3 3 0 0 1 6 0 3 3 0 0 1 6 0C13 8 7 12 7 12z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div className="meetup-banner">
            <div>
              <div style={{ fontSize: 'calc(13*var(--u))', fontWeight: 700, color: 'var(--blue)' }}>📍 24/7 Monitored Meetup Stations</div>
              <div style={{ fontSize: 'calc(11.5*var(--u))', color: 'var(--muted)' }}>
                Always exchange items inside official safe zones: {lm[1]} front desk, {lm[0]} security turnstiles, or the {lm[2]} central office lobby.
              </div>
            </div>
            <button type="button" className="btn btn-primary btn-sm">View Safe Exchange Map</button>
          </div>
          <div className="pagination">
            <button type="button" className="page-btn">← Previous</button>
            <button type="button" className="page-btn active">1</button>
            <button type="button" className="page-btn">2</button>
            <button type="button" className="page-btn">3</button>
            <span style={{ color: 'var(--muted)', padding: '0 4px' }}>…</span>
            <button type="button" className="page-btn">8</button>
            <button type="button" className="page-btn">Next Page →</button>
          </div>
        </div>
      </div>
    </div>
  );
}