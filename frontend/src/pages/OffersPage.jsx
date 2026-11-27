import { useState } from 'react';
import { Check, X, Repeat, Undo2, PackageCheck, Ban, Loader2, ChevronDown, MapPin } from 'lucide-react';
import api from '../services/api';
import { useCampus } from '../context/useCampus';
import { formatMoney, timeAgo } from '../utils/format';

const STATUS_STYLE = {
  open: 'bg-blue-50 text-blue-800 border-blue-200',
  accepted: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  completed: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  withdrawn: 'bg-slate-100 text-slate-600 border-slate-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
};
const STATUS_LABEL = {
  open: 'Negotiating',
  accepted: 'Deal agreed',
  completed: 'Completed',
  rejected: 'Declined',
  withdrawn: 'Withdrawn',
  cancelled: 'Cancelled',
};

function historyText(h, money, otherName) {
  const who = h.role === 'system' ? 'System' : h.role === 'buyer' ? 'Buyer' : 'Seller';
  switch (h.action) {
    case 'offer': return `${who} offered ${money(h.amount)}`;
    case 'counter': return `${who} countered with ${money(h.amount)}`;
    case 'accept': return `${who} accepted ${money(h.amount)}`;
    case 'reject': return `${who} declined`;
    case 'withdraw': return `${who} withdrew the offer`;
    case 'cancel': return `${who} cancelled the deal`;
    case 'complete': return 'Hand-off completed';
    case 'auto_rejected': return 'Closed automatically (item reserved for someone else)';
    case 'auto_cancelled': return 'Closed automatically (listing changed)';
    default: return `${who} ${h.action} ${otherName ? '' : ''}`;
  }
}

function OfferCard({ offer, money, currency, onChanged, onToast }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [countering, setCountering] = useState(false);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterNote, setCounterNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const other = offer.myRole === 'buyer' ? offer.seller : offer.buyer;
  const act = async (fn, okMessage) => {
    setBusy(true);
    setError('');
    try {
      await fn();
      if (okMessage) onToast(okMessage);
      await onChanged();
      setCountering(false);
    } catch (err) {
      setError(err.message);
      await onChanged().catch(() => {}); // the offer may have changed - show the latest state
    } finally {
      setBusy(false);
    }
  };

  const respond = (action, extra, msg) => act(() => api.respondToOffer(offer.id, action, extra), msg);
  const btn = 'px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 disabled:opacity-60 cursor-pointer';

  return (
    <div className={`bg-white rounded-2xl border shadow-xs overflow-hidden ${offer.awaitingMe ? 'border-amber-400 ring-1 ring-amber-300' : 'border-slate-200'}`}>
      <div className="p-4 flex gap-4">
        <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
          {offer.listing.image && <img src={offer.listing.image} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm truncate">{offer.listing.title}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLE[offer.status]}`}>{STATUS_LABEL[offer.status]}</span>
            {offer.awaitingMe && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">Your reply needed</span>}
          </div>
          <div className="text-xs text-slate-600">
            {offer.myRole === 'buyer' ? 'Seller' : 'Buyer'}: <strong>{other.name}</strong> · {other.role}
          </div>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs">
            <span className="text-slate-500">Asking <strong className="text-slate-800">{money(offer.listingPrice)}</strong></span>
            <span className="text-slate-500">
              {offer.status === 'accepted' || offer.status === 'completed' ? 'Agreed' : 'Current offer'}{' '}
              <strong className="text-base text-emerald-700">{money(offer.finalAmount ?? offer.currentAmount)}</strong>
            </span>
            <span className="text-slate-400">{timeAgo(offer.updatedAt)}</span>
          </div>
          {offer.message && <p className="text-xs text-slate-600 italic">“{offer.message}”</p>}
          {(offer.status === 'accepted') && (
            <p className="text-xs text-emerald-800 flex items-center gap-1 font-semibold">
              <MapPin className="w-3.5 h-3.5" /> Meet at: {offer.listing.meetupLocation}
            </p>
          )}
        </div>
      </div>

      {error && <div role="alert" className="mx-4 mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">{error}</div>}

      {/* Actions */}
      <div className="px-4 pb-4 space-y-3">
        {offer.status === 'open' && offer.awaitingMe && !countering && (
          <div className="flex flex-wrap gap-2">
            <button disabled={busy} className={`${btn} bg-emerald-600 hover:bg-emerald-500 text-white`} onClick={() => respond('accept', {}, 'Deal agreed! The item is reserved.')}>
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Accept {money(offer.currentAmount)}
            </button>
            <button disabled={busy} className={`${btn} border border-slate-300 text-slate-800 hover:bg-slate-100`} onClick={() => { setCountering(true); setCounterAmount(String(offer.currentAmount)); }}>
              <Repeat className="w-3.5 h-3.5" /> Counter
            </button>
            <button disabled={busy} className={`${btn} border border-red-200 text-red-700 hover:bg-red-50`} onClick={() => respond('reject', {}, 'Offer declined.')}>
              <X className="w-3.5 h-3.5" /> Decline
            </button>
          </div>
        )}

        {offer.status === 'open' && offer.awaitingMe && countering && (
          <form
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              respond('counter', { amount: Number(counterAmount), message: counterNote }, 'Counter-offer sent.');
            }}
          >
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <label className="font-bold text-slate-700">Your counter ({currency})</label>
              <input type="number" required min="1" step="any" value={counterAmount} onChange={(e) => setCounterAmount(e.target.value)} className="w-28 px-2 py-1.5 rounded-lg border border-slate-300 font-bold" />
              <input type="text" maxLength={500} value={counterNote} onChange={(e) => setCounterNote(e.target.value)} placeholder="Optional note" className="flex-1 min-w-40 px-2 py-1.5 rounded-lg border border-slate-300" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={busy} className={`${btn} bg-blue-900 text-white hover:bg-blue-800`}>
                {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Send counter
              </button>
              <button type="button" className={`${btn} border border-slate-300`} onClick={() => setCountering(false)}>Back</button>
            </div>
          </form>
        )}

        {offer.status === 'open' && !offer.awaitingMe && (
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Waiting for {other.name} to respond…</span>
            {offer.myRole === 'buyer' && (
              <button disabled={busy} className={`${btn} border border-slate-300 hover:bg-slate-100`} onClick={() => act(() => api.withdrawOffer(offer.id), 'Offer withdrawn.')}>
                <Undo2 className="w-3.5 h-3.5" /> Withdraw
              </button>
            )}
          </div>
        )}

        {offer.status === 'accepted' && (
          <div className="flex flex-wrap gap-2">
            {offer.myRole === 'seller' && (
              <button disabled={busy} className={`${btn} bg-emerald-600 hover:bg-emerald-500 text-white`} onClick={() => act(() => api.completeDeal(offer.id), 'Marked as sold. Nice!')}>
                <PackageCheck className="w-3.5 h-3.5" /> Hand-off done - mark as sold
              </button>
            )}
            <button disabled={busy} className={`${btn} border border-red-200 text-red-700 hover:bg-red-50`} onClick={() => act(() => api.cancelDeal(offer.id), 'Deal cancelled. The item is available again.')}>
              <Ban className="w-3.5 h-3.5" /> Cancel deal
            </button>
          </div>
        )}

        <button className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer" onClick={() => setShowHistory((v) => !v)}>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHistory ? 'rotate-180' : ''}`} /> Negotiation history ({offer.history.length})
        </button>
        {showHistory && (
          <ol className="space-y-1.5 border-l-2 border-slate-200 pl-3 text-xs text-slate-700">
            {offer.history.map((h, i) => (
              <li key={i}>
                {historyText(h, money)} <span className="text-slate-400">· {timeAgo(h.at)}</span>
                {h.message && <div className="text-slate-500 italic">“{h.message}”</div>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default function OffersPage({ offers, loading, error, onRefresh, onToast, onBrowse }) {
  const { campus } = useCampus();
  const [box, setBox] = useState('received');
  const [filter, setFilter] = useState('active');
  const money = (n) => formatMoney(n, campus.currency);

  const list = (box === 'received' ? offers.received : offers.sent).filter((o) =>
    filter === 'active' ? ['open', 'accepted'].includes(o.status) : filter === 'closed' ? !['open', 'accepted'].includes(o.status) : true
  );
  const waiting = (arr) => arr.filter((o) => o.awaitingMe).length;

  const tab = (id, label, n) => (
    <button key={id} onClick={() => setBox(id)} className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer ${box === id ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
      {label} {n > 0 && <span className="ml-1 px-1.5 rounded-full bg-amber-400 text-blue-950">{n}</span>}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Offers</h1>
        <p className="text-sm text-slate-600 mt-1">Negotiate prices with other students. Accept, decline or counter - the item is reserved once you agree.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tab('received', 'Offers on my items', waiting(offers.received))}
        {tab('sent', 'Offers I made', waiting(offers.sent))}
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="ml-auto px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold" aria-label="Filter offers">
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="all">All</option>
        </select>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading offers…</p>}
      {error && (
        <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {error} <button className="underline font-bold" onClick={onRefresh}>Retry</button>
        </div>
      )}
      {!loading && !error && list.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <h3 className="font-bold text-slate-800">{box === 'received' ? 'No offers on your items yet' : 'You have not made any offers'}</h3>
          <p className="text-xs text-slate-500">
            {box === 'received' ? 'When a student makes an offer on one of your listings it appears here.' : 'Find something you like and tap "Make an offer".'}
          </p>
          {box === 'sent' && <button className="px-4 py-2 rounded-lg bg-blue-900 text-white text-xs font-bold" onClick={onBrowse}>Browse the marketplace</button>}
        </div>
      )}

      <div className="space-y-4">
        {list.map((o) => (
          <OfferCard key={o.id} offer={o} money={money} currency={campus.currency} onChanged={onRefresh} onToast={onToast} />
        ))}
      </div>
    </div>
  );
}
