import { useState } from 'react';
import { X, ShieldCheck, Send, Loader2 } from 'lucide-react';
import { useCampus } from '../context/useCampus';

/** Dialog for offering an item to a student's Wanted request. onSendOffer({ amount, message }) returns a promise. */
export default function OfferModal({ isOpen, onClose, wantedRequest, onSendOffer }) {
  const { campus } = useCampus();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !wantedRequest) return null;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onSendOffer({ amount: amount === '' ? undefined : Number(amount), message });
      setAmount('');
      setMessage('');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Send peer offer</div>
            <h3 className="text-base font-bold mt-0.5">Offer an item to {wantedRequest.user}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="text-[11px] text-slate-500 font-semibold mb-1">Student&apos;s request</div>
          <div className="font-bold text-slate-900 text-sm mb-1">{wantedRequest.title}</div>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Budget: {wantedRequest.budget}
          </span>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4 text-xs">
          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 font-semibold">
              {error}
            </div>
          )}
          <label className="block">
            <span className="block font-bold text-slate-700 mb-1">Your price ({campus.currency}, optional)</span>
            <input type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 300" className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-bold" />
          </label>
          <label className="block">
            <span className="block font-bold text-slate-700 mb-1">Message *</span>
            <textarea rows={3} required maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="I have this exact item in good condition. I can meet you at the library today after 3pm." className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 resize-none" />
          </label>
          <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>The student is notified by email. Meet only at safe campus spots.</span>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-bold flex items-center gap-1.5">
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Submit offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
