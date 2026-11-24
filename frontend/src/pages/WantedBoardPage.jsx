import { useMemo, useState } from 'react';
import { useCampus } from '../context/useCampus';
import { useLocalize } from '../context/useLocalize';

const CATEGORIES = [
  { label: 'All Requests', count: '38' },
  { label: 'Textbooks & Notes', count: '14' },
  { label: 'Dorm & Living', count: '9' },
  { label: 'Electronics & Gear', count: '7' },
  { label: 'Moving & Boxes', count: '5' },
  { label: 'Study Partners / Rides', count: '3' },
];

const BORDER = { red: '#ef4444', amber: '#f59e0b' };

const STEPS = [
  {
    num: '1',
    bg: '#eef1fc',
    title: 'Post what you need',
    desc: 'Specify the textbook, lab equipment, furniture, or gadget you require, your deadline, and how much you are ready to pay or borrow it for.',
    note: '✓ Broadcasts to 15,000+ verified peers',
  },
  {
    num: '2',
    bg: '#f0fdf4',
    title: 'Classmates reply with offers',
    desc: 'Students who have the item in their closet or dorm room reply with photos, condition grades, and counter-offers via in-app chat.',
    note: '✓ Zero spam • .edu credentials verified',
  },
  {
    num: '3',
    bg: '#e0f2fe',
    title: 'Meet safely on campus to swap',
    desc: null,
    note: '✓ Campus security monitored hubs',
  },
];

export default function WantedBoardPage({ wantedRequests, onOpenWantedModal, onOpenOfferModal, onNavigate }) {
  const { campus } = useCampus();
  const loc = useLocalize();
  const lm = campus.landmarks;

  const [selectedCategory, setSelectedCategory] = useState('All Requests');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return wantedRequests.filter((req) => {
      const matchesCat = selectedCategory === 'All Requests' || req.category === selectedCategory;
      const matchesSearch =
        !q ||
        req.title.toLowerCase().includes(q) ||
        req.description.toLowerCase().includes(q) ||
        req.tag.toLowerCase().includes(q);
      const matchesUrgency =
        urgencyFilter === 'all' ||
        (urgencyFilter === 'urgent' && req.urgencyColor === 'red') ||
        (urgencyFilter === 'week' && req.urgency.toLowerCase().includes('week'));
      return matchesCat && matchesSearch && matchesUrgency;
    });
  }, [wantedRequests, selectedCategory, searchQuery, urgencyFilter]);

  return (
    <div className="content-col" style={{ paddingTop: 'calc(32*var(--u))' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10*var(--u))', flexWrap: 'wrap', marginBottom: 'calc(6*var(--u))' }}>
        <span style={{ fontSize: 'calc(11*var(--u))', color: 'var(--muted)' }}>Commons / Community ISO Board</span>
        <span className="pill pill-mint" style={{ fontSize: 'calc(9.5*var(--u))' }}>● 8 New Today</span>
        <span style={{ marginLeft: 'auto', fontSize: 'calc(11*var(--u))', color: 'var(--muted)' }}>
          15,420 Active {campus.short} Students · 89% Match Rate in 48h
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'calc(10*var(--u))', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>
            Wanted &amp; ISO Board <span style={{ color: 'var(--blue)' }}><em>(In Search Of)</em></span>
          </h1>
          <p style={{ fontSize: 'calc(13*var(--u))', color: 'var(--muted)', marginTop: 'calc(8*var(--u))', maxWidth: 'calc(560*var(--u))' }}>
            Looking for a specific textbook, dorm item, lab kit, or ride-share? Post your request to 15,000+ campus peers before spending full retail price.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={onOpenWantedModal}>+ Post a Wanted Request</button>
      </div>

      <div className="tab-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            type="button"
            className={`tab-btn${selectedCategory === cat.label ? ' active' : ''}`}
            onClick={() => setSelectedCategory(cat.label)}
          >
            {cat.label} {cat.count}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <select className="filter-select" value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)} aria-label="Urgency timeline">
          <option value="all">Any Urgency Window</option>
          <option value="urgent">Urgent (&lt; 24h)</option>
          <option value="week">This Week</option>
        </select>
        <select className="filter-select" aria-label="Offered budget">
          <option>All Payout Levels</option>
          <option>Under $25</option>
          <option>$25 – $75</option>
          <option>$75+</option>
        </select>
        <select className="filter-select" aria-label="Campus zone">
          <option>Entire {campus.short} Hub</option>
          <option>{lm[2]} &amp; {lm[3]}</option>
          <option>{lm[4]} &amp; Southside</option>
        </select>
        <input
          className="form-input"
          type="text"
          placeholder="Chem kit, fridge, Krugman…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: 'calc(140*var(--u))', width: 'auto' }}
          aria-label="Search wanted requests"
        />
      </div>
      <div style={{ fontSize: 'calc(11.5*var(--u))', color: 'var(--muted)', marginBottom: 'calc(20*var(--u))' }}>
        Showing <strong style={{ color: 'var(--navy)' }}>{filtered.length} active wanted requests</strong> across campus &nbsp;·&nbsp; Sorted by: <strong>Most Urgent First</strong>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 'calc(40*var(--u))', textAlign: 'center', marginBottom: 'calc(40*var(--u))', color: 'var(--muted)' }}>
          No requests match those filters yet. Try clearing the search box.
        </div>
      ) : (
        <div className="wanted-grid">
          {filtered.map((req, i) => {
            const border = BORDER[req.urgencyColor] ?? '#0f1fa8';
            const initials = req.user.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
            const urgencyStyle =
              req.urgencyColor === 'red'
                ? undefined
                : req.urgencyColor === 'amber'
                ? { background: 'var(--amber-bg)', color: 'var(--amber)' }
                : { background: '#eef1fc', color: 'var(--blue)' };
            return (
              <div key={req.id} className="wanted-card rise" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="wanted-top-border" style={{ background: border }} />
                <div className="wanted-body">
                  <div className="wanted-avatar-row">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(8*var(--u))', marginBottom: 'calc(4*var(--u))' }}>
                        <div className="wanted-avatar" style={{ background: '#1a3a6b' }}>
                          {req.avatar ? (
                            <img src={req.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', position: 'absolute', inset: 0 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          ) : null}
                          <span>{initials}</span>
                          <div className="wanted-verified">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3.5 3.5L13 4" /></svg>
                          </div>
                        </div>
                        <div>
                          <div className="wanted-name">{req.user}</div>
                          <div className="wanted-class">{req.standing}</div>
                        </div>
                      </div>
                      <span className="pill pill-mint" style={{ fontSize: 'calc(8.5*var(--u))' }}>✓ .edu verified</span>
                    </div>
                    <span className="wanted-time">{req.timeAgo}</span>
                  </div>

                  <div className="chip-row">
                    <span className={`chip${req.urgencyColor === 'red' ? ' chip-red' : ''}`} style={urgencyStyle}>{req.urgency}</span>
                    <span className="chip chip-grey">{req.tag}</span>
                  </div>
                  <div style={{ fontSize: 'calc(10.5*var(--u))', color: 'var(--muted)', marginBottom: 'calc(8*var(--u))' }}>
                    📍 Zone: {loc(req.campus)}
                  </div>
                  <div className="card-title" style={{ marginBottom: 'calc(6*var(--u))' }}>{req.title}</div>
                  <div className="wanted-desc">{req.description}</div>
                  <div className="budget-block">
                    <div className="budget-col">
                      <div className="budget-col-label">OFFERED BUDGET</div>
                      <div className="budget-col-val">{req.budget}</div>
                    </div>
                    <div className="budget-col">
                      <div className="budget-col-label">ACTIVITY</div>
                      <div className="budget-col-val" style={{ fontSize: 'calc(11.5*var(--u))', color: '#16a34a' }}>● {req.activity}</div>
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary btn-full" onClick={() => onOpenOfferModal(req)}>
                    Offer Item to Student
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="helper-bar">
        <div className="helper-shield">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L4 6v5c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 'calc(13*var(--u))', fontWeight: 700, color: 'var(--navy)' }}>Have an item a classmate is looking for?</div>
          <div style={{ fontSize: 'calc(11.5*var(--u))', color: 'var(--muted)' }}>
            Connect directly through CampusZon instant messaging. Payments are held in escrow or settled at verified 24/7 CCTV Campus Meetup Hubs.
          </div>
        </div>
        <button
          type="button"
          className="btn btn-ghost-dark btn-sm"
          style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}
          onClick={() => onNavigate?.('verification')}
        >
          View Verified Meetup Zones →
        </button>
      </div>

      <div className="section-sm">
        <div className="micro-label" style={{ textAlign: 'center', marginBottom: 'calc(8*var(--u))' }}>SIMPLE CAMPUS MECHANISM</div>
        <h2 style={{ textAlign: 'center', marginBottom: 'calc(4*var(--u))' }}>How Wanted &amp; ISO Posts Work</h2>
        <p style={{ textAlign: 'center', fontSize: 'calc(12*var(--u))', color: 'var(--muted)', maxWidth: 'calc(520*var(--u))', margin: '0 auto' }}>
          Save money and reduce campus waste by tapping into unused items sitting right inside dorms and student apartments.
        </p>
        <div className="hiw-grid">
          {STEPS.map((s) => (
            <div key={s.num} className="hiw-card" style={{ background: s.bg }}>
              <div className="hiw-num" style={{ color: 'rgba(15,31,168,0.25)' }}>{s.num}</div>
              <div className="hiw-title">{s.title}</div>
              <div className="hiw-desc">
                {s.desc ?? `Choose one of 14 official security-monitored trading hubs (${lm[0]}, ${lm[1]}, ${lm[2]} Commons) to inspect and complete the exchange.`}
              </div>
              <div className="hiw-footnote">{s.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}