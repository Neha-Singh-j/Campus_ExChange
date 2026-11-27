import { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { useCampus } from '../context/useCampus';

export default function PostWantedModal({ isOpen, onClose, onAddWanted }) {
  const { campus } = useCampus();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Textbooks & Notes',
    urgency: 'This Week',
    budget: '',
    campus: '',
    description: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const title = formData.title.trim();
      await onAddWanted({
        ...formData,
        title: /^(ISO|Wanted):/i.test(title) ? title : `ISO: ${title}`,
        campus: formData.campus || campus.meetupSpots[0],
      });
      setFormData((f) => ({ ...f, title: '', budget: '', description: '' }));
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider">
                ISO Board
              </span>
              <span className="text-xs text-blue-200">{campus.short} students</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Post a Wanted & ISO Request</h3>
            <p className="text-xs text-slate-300">Classmates with unused gear will reply directly with offers</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">What are you looking for? *</label>
            <input
              type="text"
              required
              placeholder="e.g. ISO: Chem 3B Molecular Model Kit or TI-84 Plus CE"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 bg-white"
              >
                <option>Textbooks & Notes</option>
                <option>Dorm & Living</option>
                <option>Electronics & Gear</option>
                <option>Moving & Boxes</option>
                <option>Study Partners / Rides</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Urgency Timeline</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 bg-white"
              >
                <option>Urgent</option>
                <option>This Week</option>
                <option>Flexible</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Offered Budget / Terms *</label>
              <input
                type="text"
                required
                placeholder={`e.g. ${campus.currency}300 - ${campus.currency}500`}
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Preferred Campus Zone</label>
              <input
                type="text"
                placeholder={`e.g. ${campus.meetupSpots[0]}`}
                value={formData.campus}
                onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description & Specifications</label>
            <textarea
              rows={3}
              placeholder="State any specific editions, conditions, professor requirements, or whether you want to rent vs buy outright..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 resize-none"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Peer-to-Peer Match:</strong> Your ISO post will be instantly broadcast to enrolled students in your department and residential dorms.
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Broadcast Request
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
