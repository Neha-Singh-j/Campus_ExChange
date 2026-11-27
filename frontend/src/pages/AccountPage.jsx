import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, Pencil, Trash2, Loader2, MapPin, Plus } from 'lucide-react';
import api from '../services/api';
import { useCampus } from '../context/useCampus';
import { formatMoney, initialsOf } from '../utils/format';

const STATUS_STYLE = {
  available: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  reserved: 'bg-amber-50 text-amber-800 border-amber-200',
  sold: 'bg-slate-100 text-slate-600 border-slate-200',
};
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate', 'Alumni'];
const INPUT = 'w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 text-sm bg-white';

export default function AccountPage({ user, onUserUpdated, onEditListing, onPostItem, onListingsChanged, onToast, refreshKey }) {
  const { campus } = useCampus();
  const money = (n) => formatMoney(n, campus.currency);

  const [profile, setProfile] = useState({ name: user.name, department: user.department || '', year: user.year || '' });
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [mine, setMine] = useState(null);
  const [mineError, setMineError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadMine = useCallback(async () => {
    try {
      const res = await api.getMyListings();
      setMine(res.data);
      setMineError('');
    } catch (err) {
      setMineError(err.message);
    }
  }, []);

  // refreshKey changes when a listing is created/edited elsewhere in the app
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; state is set after the await
    loadMine();
  }, [loadMine, refreshKey]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileError('');
    try {
      const res = await api.updateMe(profile);
      onUserUpdated(res.user);
      onToast('Profile updated.');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (listing, status) => {
    setBusyId(listing.id);
    try {
      await api.setListingStatus(listing.id, status);
      onToast(status === 'sold' ? 'Marked as sold.' : status === 'reserved' ? 'Item reserved.' : 'Item is available again.');
      await loadMine();
      onListingsChanged();
    } catch (err) {
      onToast(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (listing) => {
    if (!window.confirm(`Delete "${listing.title}"? This also cancels any offers on it.`)) return;
    setBusyId(listing.id);
    try {
      await api.deleteListing(listing.id);
      onToast('Listing deleted.');
      await loadMine();
      onListingsChanged();
    } catch (err) {
      onToast(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Account</h1>
        <p className="text-sm text-slate-600 mt-1">Your profile, your listings and safe places to meet on campus.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile */}
        <section className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-blue-900 text-white text-lg font-black flex items-center justify-center">{initialsOf(user.name)}</div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 truncate">{user.name}</div>
              <div className="text-xs text-slate-500 truncate">{user.email}</div>
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" /> {campus.short} student
              </span>
            </div>
          </div>

          <form onSubmit={saveProfile} className="space-y-3 text-xs">
            {profileError && <div role="alert" className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 font-semibold">{profileError}</div>}
            <label className="block">
              <span className="block font-bold text-slate-700 mb-1">Name</span>
              <input className={INPUT} required minLength={2} maxLength={80} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </label>
            <label className="block">
              <span className="block font-bold text-slate-700 mb-1">Course / department</span>
              <input className={INPUT} maxLength={80} value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} />
            </label>
            <label className="block">
              <span className="block font-bold text-slate-700 mb-1">Year</span>
              <select className={INPUT} value={profile.year} onChange={(e) => setProfile({ ...profile, year: e.target.value })}>
                {!YEARS.includes(profile.year) && <option>{profile.year}</option>}
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </label>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-bold flex items-center gap-1.5">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save profile
            </button>
          </form>
        </section>

        {/* My listings */}
        <section className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">My listings {mine && `(${mine.length})`}</h2>
            <button onClick={onPostItem} className="px-3 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Post an item
            </button>
          </div>

          {mineError && <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs">{mineError}</div>}
          {!mine && !mineError && <p className="text-sm text-slate-500">Loading…</p>}
          {mine?.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">You have not listed anything yet.</div>
          )}

          {mine?.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                {l.image && <img src={l.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 truncate">{l.title}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLE[l.status]}`}>{l.status}</span>
                  {l.openOffers > 0 && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">{l.openOffers} open offer{l.openOffers > 1 ? 's' : ''}</span>}
                </div>
                <div className="text-xs text-slate-600">{money(l.price)} · {l.condition}</div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {l.status !== 'sold' && (
                    <>
                      <select
                        aria-label="Listing status"
                        value={l.status}
                        disabled={busyId === l.id}
                        onChange={(e) => changeStatus(l, e.target.value)}
                        className="px-2 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                      <button onClick={() => onEditListing(l)} className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 font-bold flex items-center gap-1 cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                    </>
                  )}
                  <button onClick={() => remove(l)} disabled={busyId === l.id} className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 font-bold flex items-center gap-1 disabled:opacity-60 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Safe meetup spots */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-800" /> Safe meetup spots at {campus.short}</h2>
        <p className="text-xs text-slate-500 mt-1">Always meet at a busy, well-lit place. Check the item before you pay.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {campus.meetupSpots.map((s) => (
            <span key={s} className="px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">{s}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
