import { useEffect, useMemo, useState } from 'react';
import { CURRENT_USER, DESIGNATED_HUBS } from '../data/mockData';
import { useCampus } from '../context/useCampus';
import { useLocalize } from '../context/useLocalize';

const CIRC = 2 * Math.PI * 52;

const Check = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8l3.5 3.5L13 4" />
  </svg>
);

const Icon = ({ children }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const YEARS = [
  '1st Year / Freshman',
  '2nd Year / Sophomore',
  '3rd Year / Junior',
  'Final Year / Senior',
  "Postgraduate / Master's",
  'Ph.D. Scholar',
  'Faculty / Staff',
];

export default function VerificationPage({ selectedCampus, setSelectedCampus }) {
  const { campus, campuses } = useCampus();
  const loc = useLocalize();

  // Form state (same fields as before)
  const [rollNo, setRollNo] = useState('3034528190');
  const [uniEmail, setUniEmail] = useState(`alex.morgan@${campus.domain}`);
  const [personalEmail, setPersonalEmail] = useState('alex.morgan.personal@gmail.com');
  const [contactNo, setContactNo] = useState('+1 (555) 234-5678');
  const [department, setDepartment] = useState('Computer Science & Business');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year / Junior');
  const [uploadedFile, setUploadedFile] = useState('student_id_card.png');
  const [consent, setConsent] = useState(true);

  const [isVerified, setIsVerified] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [ringOn, setRingOn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRingOn(true), 400);
    return () => clearTimeout(t);
  }, []);

  const hubs = useMemo(() => loc(DESIGNATED_HUBS).slice(0, 3), [loc]);
  const emailValid = /^\S+@\S+\.\S+$/.test(uniEmail);
  const universityName = selectedCampus.split('•')[0].trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rollNo.trim() || !uniEmail.trim() || !universityName) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields (University, Roll No., and University Email).' });
      return;
    }
    if (!consent) {
      setStatusMessage({ type: 'error', text: 'Please confirm the certification checkbox before submitting.' });
      return;
    }
    setIsSubmitting(true);
    setStatusMessage(null);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsVerified(true);
      setStatusMessage({ type: 'success', text: 'Student verification submitted and verified successfully!' });
    }, 800);
  };

  const rating = CURRENT_USER.trustScore ?? 99.4;
  const offset = ringOn ? CIRC * (1 - rating / 100) : CIRC;

  return (
    <>
      <div className="protocol-bar">
        <div className="protocol-bar-inner">
          <span className="protocol-text">University Institutional Cryptographic Verification Protocol v3.8</span>
          <div className="protocol-chips">
            <span className="pill pill-mint" style={{ fontSize: 'calc(9*var(--u))' }}>✓ FERPA &amp; Title IV Compliant</span>
            <span className="pill pill-blue" style={{ fontSize: 'calc(9*var(--u))' }}>⟳ Registrar Direct-Sync Active</span>
          </div>
        </div>
      </div>

      <div className="content-col" style={{ paddingTop: 'calc(32*var(--u))' }}>
        <div className="verify-layout">
          <div style={{ minWidth: 0 }}>
            <span className="pill pill-navy" style={{ marginBottom: 'calc(16*var(--u))', display: 'inline-flex' }}>🔒 ZERO UNVERIFIED PUBLIC ACCESS</span>
            <h1 style={{ marginBottom: 'calc(10*var(--u))' }}>Campus Security &amp; Student Identity Verification</h1>
            <p style={{ fontSize: 'calc(13*var(--u))', color: 'var(--muted)', maxWidth: 'calc(560*var(--u))' }}>
              Only verified students, faculty, and alumni with active .edu credentials can buy, sell, or trade. No strangers, no off-campus bots, zero scam tolerance.
            </p>

            <div className="step-cards">
              <div className="step-card">
                <div className="step-label">STEP 01 / IDENTITY FOUNDATION</div>
                <div className="step-title">University Email OTP</div>
                <div className="mono" style={{ marginBottom: 'calc(10*var(--u))', wordBreak: 'break-all' }}>{uniEmail}</div>
                <span className="pill pill-blue" style={{ fontSize: 'calc(9*var(--u))', marginBottom: 'calc(10*var(--u))' }}>🔐 2FA Enforced</span>
                <p style={{ fontSize: 'calc(10.5*var(--u))', color: 'var(--muted)', marginBottom: 'calc(10*var(--u))' }}>Last cryptographically validated 2 days ago</p>
                <button type="button" className="btn btn-ghost-dark btn-sm">Re-test Inbox</button>
              </div>

              <div className="step-card">
                <div className="step-label">STEP 02 / BIOMETRIC &amp; ID CARD</div>
                <div className="step-title">Official Student ID Match</div>
                <div className="student-id-card">
                  <div style={{ display: 'flex', gap: 'calc(10*var(--u))' }}>
                    <div className="id-portrait">
                      <svg viewBox="0 0 32 32" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><circle cx="16" cy="11" r="5" /><path d="M5 27c0-6 4.5-10 11-10s11 4 11 10" /></svg>
                    </div>
                    <div>
                      <div className="id-name">{CURRENT_USER.name}</div>
                      <div className="id-num">ID# {rollNo}</div>
                      <div className="id-row">
                        <div><div className="id-field-label">Expiration</div><div className="id-field-val">MAY 2026</div></div>
                        <div><div className="id-field-label">Status</div><div className="id-field-val" style={{ color: '#6ee7b7' }}>{isVerified ? 'MATRICULATED' : 'PENDING'}</div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-card">
                <div className="step-label">STEP 03 / ON-CAMPUS TRACK</div>
                <div className="step-title">Exchange Trust Index</div>
                <div className="donut-wrap">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#e6e9f5" strokeWidth="10" />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="#0f1fa8"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={CIRC}
                      strokeDashoffset={offset}
                      transform="rotate(-90 60 60)"
                      style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }}
                    />
                    <text x="60" y="65" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0b1560">{rating}%</text>
                  </svg>
                </div>
                <div className="trust-stats">
                  <div className="trust-stat"><div className="num">{CURRENT_USER.safeExchanges}</div><div className="lbl">Safe Exchanges</div></div>
                  <div className="trust-stat"><div className="num" style={{ color: '#22c55e' }}>{CURRENT_USER.reportedDisputes}</div><div className="lbl">Disputes</div></div>
                  <div className="trust-stat"><div className="num">{CURRENT_USER.positiveReviews}</div><div className="lbl">Positive Reviews</div></div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 'calc(20*var(--u))', marginBottom: 'calc(20*var(--u))' }}>
              <div style={{ fontSize: 'calc(13*var(--u))', fontWeight: 800, color: 'var(--navy)', marginBottom: 'calc(10*var(--u))' }}>University SSO Direct Gateway</div>
              <div className="sso-row">
                <button type="button" className="sso-chip">{/log(in|on)/i.test(campus.sso) ? campus.sso : `${campus.sso} Login`}</button>
                <button type="button" className="sso-chip">Shibboleth v4</button>
                <button type="button" className="sso-chip">Okta Campus</button>
              </div>
              <p style={{ fontSize: 'calc(10.5*var(--u))', color: 'var(--muted)', marginTop: 'calc(10*var(--u))' }}>
                Alumni accounts are granted read-only marketplace access. Active enrollment required for buying and selling.
              </p>
            </div>

            <div className="card" style={{ padding: 'calc(20*var(--u))', marginBottom: 'calc(20*var(--u))' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'calc(14*var(--u))', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ fontSize: 'calc(13*var(--u))', fontWeight: 800, color: 'var(--navy)' }}>Designated Campus Meetup Hubs</div>
                <span className="pill pill-navy" style={{ fontSize: 'calc(9*var(--u))' }}>📹 CCTV 24/7 Recording</span>
              </div>
              <div className="hub-cards">
                {hubs.map((h) => (
                  <div key={h.id} className="hub-card">
                    <div className="hub-zone">{h.zone}</div>
                    <div className="hub-name">{h.name}</div>
                    <div className="hub-hours">{h.location}</div>
                    <div className="hub-hours">{h.hours}</div>
                    <span className="pill pill-mint" style={{ fontSize: 'calc(9*var(--u))', marginTop: 'calc(8*var(--u))' }}>● {h.status}</span>
                  </div>
                ))}
              </div>
              <div className="gps-line"><span className="pulse-dot" /> GPS Safe Radius Active — All zones monitored in real-time</div>
            </div>

            <div className="card" style={{ padding: 'calc(20*var(--u))', marginBottom: 'calc(20*var(--u))' }}>
              <div style={{ fontSize: 'calc(13*var(--u))', fontWeight: 800, color: 'var(--navy)', marginBottom: 'calc(14*var(--u))' }}>ScamShield™ Escrow Protocol</div>
              <div className="scam-steps">
                {[
                  { icon: <Icon><rect x="3" y="9" width="14" height="10" rx="2" /><path d="M7 9V6a3 3 0 0 1 6 0v3" /></Icon>, title: 'Locked in Escrow', desc: 'Funds held safely until handoff is confirmed' },
                  { icon: <Icon><path d="M2 7V3h4M14 3h4v4M2 13v4h4M14 17h4v-4M5 10h10" /></Icon>, title: 'Physical Scan Check', desc: 'Item verified at designated campus hub' },
                  { icon: <Icon><circle cx="10" cy="10" r="8" /><path d="M10 6v8M7.5 13.5l2.5-2 2.5 2" /></Icon>, title: 'Direct Deposit', desc: 'Instant transfer to seller after confirmation' },
                ].map((s, i) => (
                  <div key={s.title} className="scam-step">
                    <div className="scam-icon">{s.icon}</div>
                    <div style={{ fontSize: 'calc(12*var(--u))', fontWeight: 700, color: 'var(--navy)' }}>{s.title}</div>
                    <div style={{ fontSize: 'calc(10.5*var(--u))', color: 'var(--muted)', marginTop: 'calc(4*var(--u))' }}>{s.desc}</div>
                    {i < 2 && <div style={{ fontSize: 'calc(18*var(--u))', color: 'var(--muted)', marginTop: 'calc(8*var(--u))' }}>→</div>}
                  </div>
                ))}
              </div>
              <div className="data-list">
                <div style={{ fontSize: 'calc(11*var(--u))', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginTop: 'calc(10*var(--u))' }}>Data Protection Guarantee</div>
                {['FERPA Directory Compliance', 'End-to-End Cryptographic Vault', 'Zero 3rd-Party Commercial Tracking'].map((item) => (
                  <div key={item} className="data-item"><Check /> {item}</div>
                ))}
              </div>
            </div>

            <div className="honor-strip">
              🎓 University Student Honor Code Enforced &nbsp;·&nbsp; <a href="#verification" onClick={(e) => e.preventDefault()}>Read Student Commons By-Laws →</a>
            </div>
          </div>

          <div>
            <form className="verify-form-card" style={{ position: 'static' }} onSubmit={handleSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(10*var(--u))', marginBottom: 'calc(14*var(--u))' }}>
                <div style={{ width: 'calc(44*var(--u))', height: 'calc(44*var(--u))', borderRadius: '50%', border: 'calc(3*var(--u)) solid #22c55e', overflow: 'hidden', background: '#eef1fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 32 32" fill="none" stroke="var(--blue)" strokeWidth="1.5" width="22" height="22"><circle cx="16" cy="11" r="5" /><path d="M5 27c0-6 4.5-10 11-10s11 4 11 10" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 'calc(12*var(--u))', fontWeight: 800, color: 'var(--navy)' }}>
                    {CURRENT_USER.name} {isVerified && <span style={{ color: '#22c55e' }}>[ACTIVE .EDU]</span>}
                  </div>
                  <div style={{ fontSize: 'calc(10.5*var(--u))', color: 'var(--muted)' }}>{universityName} • {CURRENT_USER.standing?.split('•')[1]?.trim() ?? 'Student'}</div>
                </div>
              </div>

              <div className="form-title">Request Verification / Renewal</div>
              <div className="form-sub">Register with your institutional credentials. Fields marked <span style={{ color: 'var(--red)' }}>*</span> are required.</div>

              {statusMessage && (
                <div
                  role="status"
                  style={{
                    padding: 'calc(10*var(--u)) calc(12*var(--u))',
                    borderRadius: 'var(--r-input)',
                    marginBottom: 'calc(14*var(--u))',
                    fontSize: 'calc(11*var(--u))',
                    fontWeight: 600,
                    background: statusMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: statusMessage.type === 'success' ? '#15803d' : '#b91c1c',
                  }}
                >
                  {statusMessage.type === 'success' ? '✓ ' : '⚠ '}{statusMessage.text}
                </div>
              )}

              <div className="form-field">
                <label className="form-label" htmlFor="v-campus">University / College <span style={{ color: 'var(--red)' }}>*</span></label>
                <select id="v-campus" className="form-input filter-select" style={{ width: '100%' }} value={campus.id} onChange={(e) => setSelectedCampus(e.target.value)}>
                  {campuses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="v-roll">Roll No. / Student ID <span style={{ color: 'var(--red)' }}>*</span></label>
                <input id="v-roll" className="form-input" style={{ fontFamily: 'monospace' }} value={rollNo} onChange={(e) => setRollNo(e.target.value)} placeholder="e.g. 3034528190" required />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="v-email">University Email <span style={{ color: 'var(--red)' }}>*</span></label>
                <div className="input-wrap">
                  <input
                    id="v-email"
                    className={`form-input${emailValid ? ' valid' : ''}`}
                    type="email"
                    value={uniEmail}
                    onChange={(e) => setUniEmail(e.target.value)}
                    placeholder={`student@${campus.domain}`}
                    required
                  />
                  {emailValid && <span className="input-check"><Check size={16} /></span>}
                </div>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="v-dept">Department / Branch</label>
                <input id="v-dept" className="form-input" value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="v-pemail">Personal Email (optional)</label>
                <input id="v-pemail" className="form-input" type="email" value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="v-phone">Contact / Phone</label>
                <input id="v-phone" className="form-input" type="tel" value={contactNo} onChange={(e) => setContactNo(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="v-year">Year of Study</label>
                <select id="v-year" className="form-input filter-select" style={{ width: '100%' }} value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)}>
                  {YEARS.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label className="form-label" htmlFor="v-file">Student ID Upload</label>
                <label className="drop-zone" htmlFor="v-file" style={{ display: 'block' }}>
                  <div style={{ fontSize: 'calc(11*var(--u))', color: 'var(--muted)' }}>Click to choose your ID scan</div>
                  <div className="drop-file"><span>📄 {uploadedFile}</span><span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span></div>
                </label>
                <input
                  id="v-file"
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files?.[0] && setUploadedFile(e.target.files[0].name)}
                />
              </div>

              <label className="consent-row">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>I certify all submitted information is accurate and authorize CampusZon to verify my credentials with the {campus.name} Registrar.</span>
              </label>
              <button type="submit" className={`btn btn-full ${statusMessage?.type === 'success' ? 'btn-success' : 'btn-primary'}`} disabled={isSubmitting}>
                {isSubmitting ? '⟳ Verifying…' : statusMessage?.type === 'success' ? '✓ Verification Submitted' : 'Request Immediate Verification'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}