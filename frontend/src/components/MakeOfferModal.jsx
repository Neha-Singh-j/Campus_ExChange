import { useState } from 'react';
import { X, Send, Loader2, ShieldCheck, MapPin } from 'lucide-react';
import { formatMoney } from '../utils/format';
import { useCampus } from '../context/useCampus';

/** Buyer's dialog for making an offer on a listing. onSubmit(amount, message) must return a promise. */
export default function MakeOfferModal({ listing, onClose, onSubmit }) {
  const { campus } = useCampus();
  const [amount, setAmount] = useState(String(listing.price));
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const money = (n) => formatMoney(n, campus.currency);
  const quick = [0.9, 0.8, 0.7].map((f) => Math.max(1, Math.round(listing.price * f)));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onSubmit(Number(amount), message);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex justify-between items-start">
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Make an offer</div>
            <h3 className="text-base font-bold mt-0.5 pr-4">{listing.title}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <div className="text-[11px] text-slate-500 font-semibold">Asking price</div>
              <div className="text-lg font-black text-slate-900">{money(listing.price)}</div>
            </div>
            <div className="text-right text-slate-600">
              <div className="font-semibold">{listing.seller.name}</div>
              <div className="flex items-center gap-1 justify-end text-[11px]">
                <MapPin className="w-3 h-3" /> {listing.meetupLocation}
              </div>
            </div>
          </div>

          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 font-semibold">
              {error}
            </div>
          )}

          <label className="block">
            <span className="block font-bold text-slate-700 mb-1">Your offer ({campus.currency})</span>
            <input
              type="number"
              required
              min="1"
              max="1000000"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-bold text-base"
            />
            <div className="flex gap-2 mt-2">
              {quick.map((q) => (
                <button key={q} type="button" onClick={() => setAmount(String(q))} className="px-2.5 py-1 rounded-full border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700">
                  {money(q)}
                </button>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="block font-bold text-slate-700 mb-1">Message to the seller (optional)</span>
            <textarea
              rows={3}
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! Is this still available? I can pick it up after my 4pm class."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 resize-none"
            />
          </label>

          <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>The seller can accept, decline or counter. Meet only at the campus spot listed.</span>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-bold flex items-center gap-1.5">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Send offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
