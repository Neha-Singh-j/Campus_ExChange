import { useEffect, useMemo, useState } from 'react';
import { X, UploadCloud, Loader2, Trash2, ImagePlus } from 'lucide-react';
import { useCampus } from '../context/useCampus';

const CATEGORIES = [
  'Textbooks & Courseware',
  'Dorm & Furniture',
  'Electronics & Calculators',
  'Campus Gear & Merch',
  'Lab Equipment',
  'Subleases & Housing',
];
const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair (Usable)'];
const MAX_PHOTOS = 5;
const MAX_BYTES = 5 * 1024 * 1024;
const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const INPUT =
  'w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 bg-white';

const blankForm = (spot) => ({
  title: '',
  category: CATEGORIES[0],
  courseCode: '',
  price: '',
  originalPrice: '',
  condition: 'Good',
  conditionBadge: '',
  meetupLocation: spot,
  desc: '',
});

/**
 * Create a listing, or edit one when `listing` is passed.
 * onSubmit(formData) must return a promise; errors it throws are shown in the dialog.
 */
export default function PostItemModal({ isOpen, onClose, onSubmit, listing }) {
  const { campus } = useCampus();
  const editing = Boolean(listing);

  const [form, setForm] = useState(() => blankForm(campus.meetupSpots[0]));
  const [existing, setExisting] = useState([]); // photos already saved on the listing
  const [removed, setRemoved] = useState([]); // publicIds of saved photos to delete
  const [files, setFiles] = useState([]); // new photos picked in this dialog
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Load the listing's values (or blanks) every time the dialog opens.
  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; state is set after the await
    setError('');
    setBusy(false);
    setFiles([]);
    setRemoved([]);
    if (listing) {
      setForm({
        title: listing.title,
        category: listing.category,
        courseCode: listing.courseCode || '',
        price: String(listing.price),
        originalPrice: listing.originalPrice ? String(listing.originalPrice) : '',
        condition: listing.condition,
        conditionBadge: listing.conditionBadge || '',
        meetupLocation: listing.meetupLocation,
        desc: listing.desc || '',
      });
      setExisting(listing.imageRecords || []);
    } else {
      setForm(blankForm(campus.meetupSpots[0]));
      setExisting([]);
    }
  }, [isOpen, listing, campus.meetupSpots]);

  const previews = useMemo(() => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })), [files]);
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  if (!isOpen) return null;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const keptCount = existing.filter((img) => !removed.includes(img.publicId)).length;
  const totalPhotos = keptCount + files.length;

  const addFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    setError('');
    for (const f of picked) {
      if (!OK_TYPES.includes(f.type)) return setError('Only JPG, PNG or WebP photos are allowed.');
      if (f.size > MAX_BYTES) return setError(`"${f.name}" is larger than 5 MB.`);
    }
    if (totalPhotos + picked.length > MAX_PHOTOS) return setError(`You can add up to ${MAX_PHOTOS} photos.`);
    setFiles((prev) => [...prev, ...picked]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const price = Number(form.price);
    const original = form.originalPrice === '' ? null : Number(form.originalPrice);
    if (original !== null && original < price) {
      setError('Original price should be at least the price you are asking.');
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'originalPrice') {
        if (v !== '' || editing) data.append(k, v);
      } else {
        data.append(k, v);
      }
    });
    files.forEach((f) => data.append('images', f));
    if (editing && removed.length) data.append('removeImages', JSON.stringify(removed));

    setBusy(true);
    try {
      await onSubmit(data);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex justify-between items-center">
          <div>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-400 text-blue-950 font-bold uppercase tracking-wider">
              {editing ? 'Edit listing' : 'Peer Marketplace'}
            </span>
            <h3 className="text-lg font-bold mt-1">{editing ? 'Update your item' : 'Post an item for sale'}</h3>
            <p className="text-xs text-slate-300">Visible to {campus.short} students</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4 text-xs">
          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 font-semibold">
              {error}
            </div>
          )}

          <label className="block">
            <span className="block font-bold text-slate-700 mb-1">Item title *</span>
            <input type="text" required minLength={3} maxLength={120} className={INPUT} placeholder="e.g. Engineering Mathematics by B.S. Grewal" value={form.title} onChange={set('title')} />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block font-bold text-slate-700 mb-1">Category *</span>
              <select className={INPUT} value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block font-bold text-slate-700 mb-1">Course code (optional)</span>
              <input type="text" maxLength={40} className={INPUT} placeholder="e.g. BAS-203" value={form.courseCode} onChange={set('courseCode')} />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="block">
              <span className="block font-bold text-slate-700 mb-1">Your price ({campus.currency}) *</span>
              <input type="number" required min="0" max="1000000" step="any" className={INPUT} value={form.price} onChange={set('price')} />
            </label>
            <label className="block">
              <span className="block font-bold text-slate-700 mb-1">Original price</span>
              <input type="number" min="0" step="any" className={INPUT} placeholder="optional" value={form.originalPrice} onChange={set('originalPrice')} />
            </label>
            <label className="block">
              <span className="block font-bold text-slate-700 mb-1">Condition *</span>
              <select className={INPUT} value={form.condition} onChange={set('condition')}>
                {CONDITIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="block font-bold text-slate-700 mb-1">Condition details</span>
            <input type="text" maxLength={120} className={INPUT} placeholder="e.g. No highlights, all accessories included" value={form.conditionBadge} onChange={set('conditionBadge')} />
          </label>

          <label className="block">
            <span className="block font-bold text-slate-700 mb-1">Safe meetup spot *</span>
            <select className={INPUT} value={form.meetupLocation} onChange={set('meetupLocation')}>
              {[...new Set([...campus.meetupSpots, form.meetupLocation])].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block font-bold text-slate-700 mb-1">Description</span>
            <textarea rows={3} maxLength={2000} className={`${INPUT} resize-none`} placeholder="Edition, age, why you are selling..." value={form.desc} onChange={set('desc')} />
          </label>

          <div>
            <span className="block font-bold text-slate-700 mb-1">
              Photos ({totalPhotos}/{MAX_PHOTOS})
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {existing.map((img) => {
                const gone = removed.includes(img.publicId);
                return (
                  <div key={img.publicId} className={`relative aspect-square rounded-lg overflow-hidden border border-slate-200 ${gone ? 'opacity-30' : ''}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      aria-label={gone ? 'Keep photo' : 'Remove photo'}
                      onClick={() => setRemoved((r) => (gone ? r.filter((x) => x !== img.publicId) : [...r, img.publicId]))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-white/90 text-red-600 shadow-xs"
                    >
                      {gone ? <ImagePlus className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
              {previews.map((p, i) => (
                <div key={p.url} className="relative aspect-square rounded-lg overflow-hidden border border-blue-300">
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => setFiles((fs) => fs.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 p-1 rounded-full bg-white/90 text-red-600 shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {totalPhotos < MAX_PHOTOS && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center justify-center text-slate-500 cursor-pointer text-center">
                  <UploadCloud className="w-5 h-5" />
                  <span className="text-[10px] font-semibold mt-1">Add photos</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={addFiles} />
                </label>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">JPG, PNG or WebP, up to 5 MB each. The first photo is the cover.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-bold flex items-center gap-1.5">
              {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editing ? 'Save changes' : 'Post item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
