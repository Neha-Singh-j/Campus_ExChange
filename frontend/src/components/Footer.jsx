import { useCampus } from '../context/useCampus';
import LogoMark from './LogoMark';

export default function Footer({ onNavigate, activeTab }) {
  const { campus } = useCampus();
  const lm = campus.landmarks;
  const noop = (e) => e.preventDefault();
  const to = (tab) => (e) => {
    e.preventDefault();
    onNavigate?.(tab);
    window.scrollTo({ top: 0 });
  };

  // Berkeley keeps the exact mockup wording; other campuses get their own landmark names.
  const hubs =
    campus.id === 'berkeley'
      ? ['Unit 1 & Unit 2 Commons', 'Foothill & Stern Lounges', 'Clark Kerr Campus Quad', 'MLK Student Union Hub']
      : [`${lm[2]} & ${lm[3]} Commons`, `${lm[4]} Lounges`, `${lm[4]} Campus Quad`, `${lm[1]} Hub`];

  const col3 =
    activeTab === 'bundles'
      ? { title: 'Seasonal & Bundles', links: ['Move-Out Clearance', 'Bundle Deals', 'Senior Graduation Sales', 'Dolly Loan Program'] }
      : { title: 'Popular Dorm Hubs', links: hubs };

  return (
    <footer className="footer" id="main-footer">
      <div className="content-col">
        <div className="footer-grid">
          <div>
            <a href="#marketplace" className="logo-wrap" style={{ marginBottom: 12, display: 'inline-flex' }} onClick={to('marketplace')}>
              <LogoMark />
              <span className="logo-word">CampusZon</span>
            </a>
            <p className="footer-tagline">
              The closed-loop peer marketplace engineered exclusively for verified university students, faculty, and campus communities.
            </p>
            <span className="pill pill-mint" style={{ fontSize: 'calc(10*var(--u))' }}>
              ✓ 100% .edu Verified Students &amp; Faculty Only
            </span>
          </div>
          <div>
            <div className="footer-col-title">Campus Safety</div>
            <div className="footer-links">
              <a href="#" onClick={noop}>Safety Pledge</a>
              <a href="#verification" onClick={to('verification')}>Designated Meetup Hubs</a>
              <a href="#" onClick={noop}>Escrow &amp; Hold Policy</a>
              <a href="#" onClick={noop}>Report Suspicious Activity</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">{col3.title}</div>
            <div className="footer-links">
              {col3.links.map((l) => (
                <a key={l} href="#" onClick={noop}>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Trust &amp; Legal</div>
            <div className="footer-links">
              <a href="#" onClick={noop}>Buyer &amp; Seller Protection</a>
              <a href="#" onClick={noop}>Community Guidelines</a>
              <a href="#" onClick={noop}>Privacy &amp; .edu Compliance</a>
              <a href="#" onClick={noop}>Honor Code Standards</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-bottom-txt">© {new Date().getFullYear()} CampusZon Inc. Official University Student Commons. All rights reserved.</span>
          <span className="footer-bottom-txt">{campus.name} Chapter · System Status</span>
        </div>
      </div>
    </footer>
  );
}