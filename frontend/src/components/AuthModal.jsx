import { useEffect, useState } from 'react';
import { X, Lock, Loader2, UserPlus } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import { useCampus } from '../context/useCampus';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate', 'Alumni'];
const INPUT =
  'w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 text-sm';

/** Login / sign-up dialog. mode: 'login' | 'register' */
export default function AuthModal({ isOpen, onClose, initialMode = 'login', onAuthenticated }) {
  const { campus } = useCampus();
  const { completeLogin } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '', year: '1st Year' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Each time the dialog opens, start clean in the requested mode.
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; state is set after the await
      setMode(initialMode);
      setError('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  const finish = (res) => {
    completeLogin(res);
    onAuthenticated?.(res.user);
    onClose();
  };

  const run = async (fn) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const submitLogin = (e) => {
    e.preventDefault();
    run(async () => finish(await api.login(form.email, form.password)));
  };

  const submitRegister = (e) => {
    e.preventDefault();
    run(async () => finish(await api.register(form)));
  };

  const title = { login: 'Welcome back', register: 'Join your campus marketplace' }[mode];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex justify-between items-start">
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">{campus.name}</div>
            <h3 className="text-lg font-bold mt-0.5">{title}</h3>
            <p className="text-xs text-slate-300 mt-0.5">Only {campus.short} students can buy, sell and make offers.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 font-semibold">
              {error}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={submitLogin} className="space-y-4">
              <label className="block">
                <span className="block font-bold text-slate-700 mb-1">Campus email</span>
                <input type="email" required autoComplete="email" className={INPUT} placeholder={`you@${campus.domain}`} value={form.email} onChange={set('email')} />
              </label>
              <label className="block">
                <span className="block font-bold text-slate-700 mb-1">Password</span>
                <input type="password" required autoComplete="current-password" className={INPUT} value={form.password} onChange={set('password')} />
              </label>
              <button type="submit" disabled={busy} className="w-full py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-bold flex items-center justify-center gap-2">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} Log in
              </button>
              <p className="text-center text-slate-600">
                New here?{' '}
                <button type="button" className="font-bold text-blue-800 underline" onClick={() => switchMode('register')}>
                  Create an account
                </button>
              </p>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={submitRegister} className="space-y-3">
              <label className="block">
                <span className="block font-bold text-slate-700 mb-1">Full name</span>
                <input type="text" required minLength={2} maxLength={80} autoComplete="name" className={INPUT} value={form.name} onChange={set('name')} />
              </label>
              <label className="block">
                <span className="block font-bold text-slate-700 mb-1">Campus email</span>
                <input type="email" required autoComplete="email" className={INPUT} placeholder={`you@${campus.domain}`} value={form.email} onChange={set('email')} />
                <span className="text-[11px] text-slate-500">Only @{campus.domain} addresses are accepted.</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block font-bold text-slate-700 mb-1">Course / department</span>
                  <input type="text" maxLength={80} className={INPUT} placeholder="e.g. B.Tech CSE" value={form.department} onChange={set('department')} />
                </label>
                <label className="block">
                  <span className="block font-bold text-slate-700 mb-1">Year</span>
                  <select className={`${INPUT} bg-white`} value={form.year} onChange={set('year')}>
                    {YEARS.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="block font-bold text-slate-700 mb-1">Password</span>
                <input type="password" required minLength={8} maxLength={72} autoComplete="new-password" className={INPUT} value={form.password} onChange={set('password')} />
                <span className="text-[11px] text-slate-500">At least 8 characters, with a letter and a number.</span>
              </label>
              <button type="submit" disabled={busy} className="w-full py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-bold flex items-center justify-center gap-2">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Create account
              </button>
              <p className="text-center text-slate-600">
                Already have an account?{' '}
                <button type="button" className="font-bold text-blue-800 underline" onClick={() => switchMode('login')}>
                  Log in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
