import { useCampus } from '../context/useCampus';
import LogoMark from './LogoMark';

export default function Footer({ onNavigate }) {
  const { campus } = useCampus();
  const noop = (e) => e.preventDefault();
  const to = (tab) => (e) => {
    e.preventDefault();
    onNavigate?.(tab);
    window.scrollTo({ top: 0 });
  };

  const hubs = campus.meetupSpots.slice(0, 4);

  const col3 = { title: 'Safe Meetup Spots', links: hubs };

  return (
    <footer className="footer" id="main-footer">
      <div className="content-col">
        <div className="footer-grid">
          <div>
            <a href="#marketplace" className="logo-wrap" style={{ marginBottom: 12, display: 'inline-flex' }} onClick={to('marketplace')}>
              <LogoMark />
              <span className="logo-word">Campus Exchange</span>
            </a>
            <p className="footer-tagline">
              The closed-loop peer marketplace engineered exclusively for university students, faculty, and campus communities.
            </p>
            <span className="pill pill-mint" style={{ fontSize: 'calc(10*var(--u))' }}>
              ✓ Campus emails only
            </span>
          </div>
          <div>
            <div className="footer-col-title">Campus Safety</div>
            <div className="footer-links">
              <a href="#" onClick={noop}>Safety Pledge</a>
              <a href="#account" onClick={to('account')}>Safe Meetup Spots</a>
              <a href="#" onClick={noop}>How offers work</a>
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
              <a href="#" onClick={noop}>Privacy</a>
              <a href="#" onClick={noop}>Honor Code Standards</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-bottom-txt">© {new Date().getFullYear()} Campus Exchange. A student project.</span>
          <span className="footer-bottom-txt">{campus.name}</span>
        </div>
      </div>
    </footer>
  );
}