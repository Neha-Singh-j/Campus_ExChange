import { useEffect, useMemo, useState } from 'react';
import { MOVE_OUT_BUNDLES } from '../data/mockData';
import { useCampus } from '../context/useCampus';
import { useLocalize } from '../context/useLocalize';

const TABS = [
  { label: 'All Move-Out Bundles', count: 142 },
  { label: 'Full Dorm Room Kits', count: 38 },
  { label: 'EECS / STEM Lab Workstations', count: 29 },
  { label: 'Kitchen & Meal Prep Essentials', count: 24 },
  { label: 'Apartment Furniture Lots', count: 21 },
];

const AVATARS = ['avatar-ml', 'avatar-dk', 'avatar-st', 'avatar-ar', 'avatar-jm', 'avatar-cb', 'avatar-mw', 'avatar-ep'];
const GRADS = [
  'linear-gradient(135deg,#8aabcc,#4a7a9b)',
  'linear-gradient(135deg,#2c3e6b,#1a2545)',
  'linear-gradient(135deg,#c8a97e,#8b6340)',
  'linear-gradient(135deg,#9db8d4,#6a8fa8)',
  'linear-gradient(135deg,#d4c5a9,#a89070)',
  'linear-gradient(135deg,#4a6080,#2d4060)',
];

const pad = (n) => String(n).padStart(2, '0');

function useCountdown(totalSeconds) {
  const [left, setLeft] = useState(totalSeconds);
  useEffect(() => {
    const timer = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);
  return {
    days: pad(Math.floor(left / 86400)),
    hours: pad(Math.floor((left % 86400) / 3600)),
    mins: pad(Math.floor((left % 3600) / 60)),
    secs: pad(left % 60),
  };
}

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8l3.5 3.5L13 4" />
  </svg>
);

const Icon = ({ children }) => (
  <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export default function MoveOutBundlesPage({ onTriggerEscrow, onOpenPostModal }) {
  const { campus } = useCampus();
  const loc = useLocalize();
  const [activeTab, setActiveTab] = useState(0);
  const [liked, setLiked] = useState({});
  const t = useCountdown(12 * 86400 + 8 * 3600 + 44 * 60 + 11);

  const bundles = useMemo(() => loc(MOVE_OUT_BUNDLES), [loc]);
  const lm = campus.landmarks;

  const claim = (b) =>
    onTriggerEscrow({
      title: b.title,
      price: b.price,
      meetupLocation: b.location,
      image: b.image,
      condition: 'Move-Out Bundle Lot',
      seller: { name: b.seller },
    });

  return (
    <>
      <div className="bundles-hero">
        <div className="content-col">
          <div className="bundles-hero-inner">
            <div>
              <span className="pill pill-amber rise" style={{ marginBottom: 'calc(16*var(--u))', display: 'inline-flex' }}>
                {campus.name.toUpperCase()} CLASS OF 2026 CLEARANCE
              </span>
              <h1 className="rise">
                Senior Move-Out &amp; Graduation
                <br />
                Bundle Liquidation.
              </h1>
              <p className="hero-p rise">
                Dorms and apartments clear out May 10–22. Score complete living setups, coding battle-stations, and major lab packs at <strong>60–80% off retail</strong> before graduating seniors head off campus.
              </p>
              <div className="countdown-row rise">
                <span className="countdown-label">TIME UNTIL FINAL DORM LOCKOUT</span>
                <div className="countdown-tiles">
                  <div className="countdown-tile">{t.days}</div>
                  <span className="countdown-sep">:</span>
                  <div className="countdown-tile">{t.hours}</div>
                  <span className="countdown-sep">:</span>
                  <div className="countdown-tile">{t.mins}</div>
                  <span className="countdown-sep">:</span>
                  <div className="countdown-tile">{t.secs}</div>
                </div>
              </div>
              <div className="bundle-stats rise">
                <div className="bundle-stat"><strong>$340</strong> Avg Bundle Savings</div>
                <div className="bundle-stat"><strong>142</strong> Complete Setups</div>
                <div className="bundle-stat"><strong>100%</strong> Senior Verified</div>
              </div>
            </div>
            <div>
              <div className="dark-card">
                <div className="dark-card-title">Senior Verified Guarantee</div>
                <div className="dark-card-sub">Buy Whole Rooms, Not Pieces</div>
                <div style={{ display: 'flex', gap: 'calc(8*var(--u))', marginTop: 'calc(10*var(--u))', flexWrap: 'wrap' }}>
                  <span className="pill" style={{ background: 'rgba(110,231,183,0.2)', color: '#6ee7b7', fontSize: 'calc(9.5*var(--u))' }}>✓ Escrow Protected</span>
                  <span className="pill" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 'calc(9.5*var(--u))' }}>Zero Dumpster Initiative</span>
                </div>
                <div
                  className="photo-card"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(11,21,96,.8), rgba(11,21,96,.1)), url(${bundles[0]?.image ?? ''}), linear-gradient(135deg,#4a6080,#2d4060)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <span className="photo-card-label">LIVE HANDOFF HUB</span>
                  <span className="photo-card-title">{lm[3]} Loading Zone</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-col">
        <div className="tab-bar">
          {TABS.map((tab, i) => (
            <button key={tab.label} type="button" className={`tab-btn${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        <div className="filter-bar" style={{ marginTop: 'calc(14*var(--u))' }}>
          <select className="filter-select" aria-label="Campus zone">
            <option>All Campus Zones</option>
            <option>North Campus</option>
            <option>Southside</option>
          </select>
          <select className="filter-select" aria-label="Price tier">
            <option>Sweet Spot: $50 – $150</option>
            <option>Under $100</option>
            <option>$150+</option>
          </select>
          <label className="filter-check">
            <input type="checkbox" style={{ accentColor: 'var(--blue)' }} /> Graduating Class of &apos;26 Only
          </label>
          <label className="filter-check">
            <input type="checkbox" style={{ accentColor: 'var(--blue)' }} /> Includes Dolly Loan
          </label>
          <span className="filter-label">Showing {bundles.length} Featured of 142</span>
        </div>

        <div className="bundle-grid">
          {bundles.map((b, i) => {
            const saveAmt = b.originalRetail - b.price;
            const sellerName = b.seller.split('•')[0].trim();
            const initials = sellerName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
            const major = b.seller.split('•')[1]?.trim();
            return (
              <div key={b.id} className="bundle-card rise" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="card-photo" style={{ background: GRADS[i % GRADS.length] }}>
                  <img src={b.image} alt="" loading="lazy" style={{ position: 'absolute', inset: 0 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <span className="badge-top badge-course">{b.badge}</span>
                  <span className="off-tag" style={{ top: 'auto', bottom: 'calc(10*var(--u))' }}>{b.savings}</span>
                  <button
                    type="button"
                    className={`heart-btn${liked[b.id] ? ' liked' : ''}`}
                    aria-label="Save bundle"
                    onClick={() => setLiked((p) => ({ ...p, [b.id]: !p[b.id] }))}
                  >
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 12S1 8 1 4.5a3 3 0 0 1 6 0 3 3 0 0 1 6 0C13 8 7 12 7 12z" />
                    </svg>
                  </button>
                </div>
                <div className="bundle-body">
                  <div className="bundle-seller-row">
                    <div className={`avatar ${AVATARS[i % AVATARS.length]}`}><span>{initials}</span><span className="dot" /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="seller-name">{sellerName}{major ? ` • ${major}` : ''}</div>
                      <div className="seller-sub">{b.location}</div>
                    </div>
                    <span className="pill pill-grey" style={{ fontSize: 'calc(9*var(--u))' }}>Senior</span>
                  </div>
                  <div className="card-title">{b.title}</div>
                  <div className="bundle-items">
                    <div className="bundle-items-label">BUNDLE CONTENTS ({b.itemsCount} ITEMS):</div>
                    <ul>
                      {b.itemsList.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bundle-note">&ldquo;{b.note}&rdquo;</div>
                  <div className="bundle-price-row" style={{ marginTop: 'auto', paddingTop: 'calc(10*var(--u))' }}>
                    <span className="struck" style={{ fontSize: 'calc(12*var(--u))' }}>${b.originalRetail} retail</span>
                    <span className="price-sm">${b.price}</span>
                    <span className="save-amber">Save ${saveAmt}</span>
                  </div>
                  <button type="button" className="btn btn-dark" onClick={() => claim(b)}>
                    Claim Move-Out Bundle
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="section-sm">
          <div className="micro-label" style={{ textAlign: 'center', marginBottom: 'calc(8*var(--u))' }}>CAMPUS LOGISTICS PARTNERSHIP</div>
          <h2 style={{ textAlign: 'center', marginBottom: 'calc(4*var(--u))' }}>How Move-Out Bundles Work On Campus</h2>
          <p style={{ textAlign: 'center', fontSize: 'calc(12*var(--u))', color: 'var(--muted)', maxWidth: 'calc(520*var(--u))', margin: '0 auto' }}>
            Coordinated with {campus.name} Residential Facilities to ensure safe physical handoffs, secure escrow payments, and zero dumpster overflow.
          </p>
          <div className="explainer-grid">
            <div className="explainer-card">
              <div className="explainer-icon">
                <Icon>
                  <rect x="1" y="4" width="14" height="12" rx="1" />
                  <path d="M15 8h4l2 4v4h-6V8z" />
                  <circle cx="5.5" cy="17.5" r="1.5" />
                  <circle cx="17.5" cy="17.5" r="1.5" />
                </Icon>
              </div>
              <h3 style={{ fontSize: 'calc(14*var(--u))', marginBottom: 'calc(6*var(--u))' }}>Designated Drop-Off Loading Docks</h3>
              <p style={{ fontSize: 'calc(11.5*var(--u))', color: 'var(--muted)' }}>
                Every residence hall ({lm[2]}, {lm[3]} &amp; {lm[4]}) has 3 reserved campus-escort 30-minute pickup spots with security oversight.
              </p>
              <div className="explainer-footnote">✓ Active 8AM – 8PM Daily</div>
            </div>
            <div className="explainer-card">
              <div className="explainer-icon">
                <Icon>
                  <circle cx="11" cy="11" r="9" />
                  <path d="M11 7v4l3 3" />
                </Icon>
              </div>
              <h3 style={{ fontSize: 'calc(14*var(--u))', marginBottom: 'calc(6*var(--u))' }}>Free Dolly &amp; Hand Truck Loans</h3>
              <p style={{ fontSize: 'calc(11.5*var(--u))', color: 'var(--muted)' }}>
                Flash your student ID at the {lm[1]} front desk for a complimentary 2-hour heavy dolly rental to move appliances.
              </p>
              <div className="explainer-footnote">✓ $0 Deposit for .edu accounts</div>
            </div>
            <div className="explainer-card">
              <div className="explainer-icon">
                <Icon>
                  <rect x="3" y="9" width="14" height="10" rx="2" />
                  <path d="M7 9V6a3 3 0 0 1 6 0v3" />
                </Icon>
              </div>
              <h3 style={{ fontSize: 'calc(14*var(--u))', marginBottom: 'calc(6*var(--u))' }}>Campus Escrow Inspection Hold</h3>
              <p style={{ fontSize: 'calc(11.5*var(--u))', color: 'var(--muted)' }}>
                Buyer funds stay locked in CampusZon Escrow. You test the electronics and inspect the furniture at the loading dock before approving final funds.
              </p>
              <div className="explainer-footnote">✓ 100% Protection Guarantee</div>
            </div>
          </div>
        </div>

        <div className="cta-band">
          <div style={{ flex: 1 }}>
            <div className="micro-label" style={{ color: 'var(--amber)', marginBottom: 'calc(6*var(--u))' }}>ATTENTION GRADUATING CLASS OF 2026</div>
            <h2>List Your Entire Dorm Room in Under 3 Minutes.</h2>
            <p>
              Don&apos;t leave hundreds of dollars in furniture behind or spend days meeting 10 different buyers. Snap one wide photo of your setup, price it as a package, and let a rising sophomore pick up everything at once.
            </p>
            <div className="cta-checks">
              <div className="cta-check"><Check /> No individual listing fees — one bundle, one post</div>
              <div className="cta-check"><Check /> Campus Escrow protection for every transaction</div>
              <div className="cta-check"><Check /> Free dolly loan and loading dock access included</div>
            </div>
          </div>
          <div className="cta-right">
            <button type="button" className="btn btn-amber-border" onClick={onOpenPostModal}>Create Move-Out Bundle</button>
            <div style={{ fontSize: 'calc(10*var(--u))', color: 'rgba(255,255,255,0.5)', marginTop: 'calc(4*var(--u))' }}>Takes less than 3 minutes</div>
          </div>
        </div>
      </div>
    </>
  );
}