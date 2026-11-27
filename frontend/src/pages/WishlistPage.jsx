import { useCallback, useEffect, useState } from 'react';
import { Heart, Bell, MapPin, Trash2, PlusCircle, X } from 'lucide-react';
import api from '../services/api';
import { useCampus } from '../context/useCampus';
import { formatMoney } from '../utils/format';

export default function WishlistPage({ onToggleWishlist, onMakeOffer, onToast, refreshKey }) {
  const { campus } = useCampus();
  const money = (n) => formatMoney(n, campus.currency);

  const [tab, setTab] = useState('saved');
  const [saved, setSaved] = useState(null);
  const [watchlists, setWatchlists] = useState(null);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ course: '', title: '', maxPrice: '' });
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    try {
      const [w, c] = await Promise.all([api.getWishlist(), api.getWatchlists()]);
      setSaved(w.data);
      setWatchlists(c.data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; state is set after the await
    load();
  }, [load, refreshKey]);

  const unsave = async (id) => {
    setSaved((list) => list.filter((l) => l.id !== id)); // optimistic
    await onToggleWishlist(id, false);
  };

  const addWatchlist = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.createWatchlist({ ...form, maxPrice: Number(form.maxPrice) });
      setForm({ course: '', title: '', maxPrice: '' });
      setAdding(false);
      onToast('Watchlist added. We will email you when a match is posted.');
      load();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const toggleNotify = async (w) => {
    setWatchlists((list) => list.map((x) => (x.id === w.id ? { ...x, autoNotify: !x.autoNotify } : x)));
    try {
      await api.toggleWatchlistNotify(w.id);
    } catch (err) {
      onToast(err.message);
      load();
    }
  };

  const removeWatchlist = async (w) => {
    setWatchlists((list) => list.filter((x) => x.id !== w.id));
    try {
      await api.deleteWatchlist(w.id);
    } catch (err) {
      onToast(err.message);
      load();
    }
  };

  const tabBtn = (id, label) => (
    <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer ${tab === id ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Wishlist</h1>
        <p className="text-sm text-slate-600 mt-1">Save items you like, and add a course watchlist to get an email when a matching item is posted under your price limit.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabBtn('saved', `Saved items (${saved?.length ?? 0})`)}
        {tabBtn('watch', `Course watchlists (${watchlists?.length ?? 0})`)}
      </div>

      {error && <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">{error} <button className="underline font-bold" onClick={load}>Retry</button></div>}

      {tab === 'saved' && saved && (
        saved.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
            <Heart className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800">Nothing saved yet</h3>
            <p className="text-xs text-slate-500">Tap the heart on any listing to keep it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {saved.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="relative aspect-16/10 bg-slate-100">
                  {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                  <button onClick={() => unsave(item.id)} title="Remove" aria-label="Remove from wishlist" className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-red-500 shadow-xs cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {item.status !== 'available' && <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white uppercase">{item.status}</span>}
                </div>
                <div className="p-4 space-y-2 text-xs flex-1 flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-slate-900">{money(item.price)}</span>
                    {item.originalPrice && <span className="text-slate-400 line-through">{money(item.originalPrice)}</span>}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{item.title}</h4>
                  <div className="flex items-center gap-1 text-slate-600"><MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" /><span className="truncate">{item.meetupLocation}</span></div>
                  <div className="text-slate-500">by {item.seller.name}</div>
                  {!item.isOwner && (
                    <button disabled={item.status !== 'available'} onClick={() => onMakeOffer(item)} className="mt-auto w-full py-2 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold cursor-pointer">
                      Make an offer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'watch' && watchlists && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setAdding((v) => !v)} className="px-3 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              {adding ? <X className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />} {adding ? 'Cancel' : 'Add course watchlist'}
            </button>
          </div>

          {adding && (
            <form onSubmit={addWatchlist} className="bg-white rounded-2xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
              {formError && <div role="alert" className="sm:col-span-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 font-semibold">{formError}</div>}
              <label className="block">
                <span className="block font-bold text-slate-700 mb-1">Course code</span>
                <input required maxLength={40} placeholder="e.g. BAS-203" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </label>
              <label className="block sm:col-span-2">
                <span className="block font-bold text-slate-700 mb-1">What you need</span>
                <input required maxLength={120} placeholder="e.g. Engineering Mathematics textbook" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </label>
              <label className="block">
                <span className="block font-bold text-slate-700 mb-1">Max price ({campus.currency})</span>
                <input required type="number" min="0" value={form.maxPrice} onChange={(e) => setForm({ ...form, maxPrice: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
              </label>
              <button type="submit" className="sm:col-span-4 sm:w-40 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer">Save watchlist</button>
            </form>
          )}

          {watchlists.length === 0 && !adding && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">No watchlists yet.</div>
          )}

          {watchlists.map((w) => (
            <div key={w.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center gap-4 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600"><Bell className="w-5 h-5" /></div>
              <div className="flex-1 min-w-48">
                <div className="font-bold text-slate-900 text-sm">{w.course} · {w.title}</div>
                <div className="text-slate-500">Up to {money(w.maxPrice)}</div>
              </div>
              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input type="checkbox" checked={w.autoNotify} onChange={() => toggleNotify(w)} className="accent-blue-800" />
                Email me
              </label>
              <button onClick={() => removeWatchlist(w)} aria-label="Delete watchlist" className="p-2 rounded-lg border border-slate-200 hover:bg-red-50 text-red-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
