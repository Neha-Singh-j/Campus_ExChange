import { useEffect, useState } from 'react';
import { Search, Heart, MapPin, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useCampus } from '../context/useCampus';
import { formatMoney } from '../utils/format';

const CATEGORIES = [
  'Textbooks & Courseware',
  'Dorm & Furniture',
  'Electronics & Calculators',
  'Campus Gear & Merch',
  'Lab Equipment',
  'Subleases & Housing',
];
const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair (Usable)'];
const FIELD = 'w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden';

/** Real search over the campus's listings. Filtering happens on the server. */
export default function AdvancedSearchPage({ onMakeOffer, onToggleWishlist, refreshKey }) {
  const { campus } = useCampus();
  const [filters, setFilters] = useState({ search: '', category: '', condition: '', minPrice: '', maxPrice: '', sort: '', status: '' });
  const [state, setState] = useState({ loading: true, error: '', data: [], total: 0 });

  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  // Wait a moment after typing stops before asking the server.
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setState((s) => ({ ...s, loading: true, error: '' }));
      try {
        const res = await api.getListings({ ...filters, campusId: campus.id, limit: 100 });
        if (active) setState({ loading: false, error: '', data: res.data, total: res.total });
      } catch (err) {
        if (active) setState({ loading: false, error: err.message, data: [], total: 0 });
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [filters, campus.id, refreshKey]);

  const money = (n) => formatMoney(n, campus.currency);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Advanced Search</h1>
        <p className="text-sm text-slate-600 mt-1">Search by title, course code or tag, then narrow down by category, condition and price.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="search"
            placeholder="e.g. BAS-203, calculator, drafter, Grewal…"
            value={filters.search}
            onChange={set('search')}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <select aria-label="Category" className={FIELD} value={filters.category} onChange={set('category')}>
            <option value="">Any category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select aria-label="Condition" className={FIELD} value={filters.condition} onChange={set('condition')}>
            <option value="">Any condition</option>
            {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input aria-label="Minimum price" type="number" min="0" placeholder={`Min ${campus.currency}`} className={FIELD} value={filters.minPrice} onChange={set('minPrice')} />
          <input aria-label="Maximum price" type="number" min="0" placeholder={`Max ${campus.currency}`} className={FIELD} value={filters.maxPrice} onChange={set('maxPrice')} />
          <select aria-label="Sort" className={FIELD} value={filters.sort} onChange={set('sort')}>
            <option value="">Newest first</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
          <select aria-label="Availability" className={FIELD} value={filters.status} onChange={set('status')}>
            <option value="">Available + reserved</option>
            <option value="available">Available only</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      <div className="text-xs text-slate-500 flex items-center gap-2">
        {state.loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        <span>{state.loading ? 'Searching…' : `${state.total} result${state.total === 1 ? '' : 's'}`}</span>
      </div>

      {state.error && <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">{state.error}</div>}
      {!state.loading && !state.error && state.data.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">No items match these filters.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {state.data.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="relative aspect-16/10 bg-slate-100">
              {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />}
              <button
                onClick={() => onToggleWishlist(item.id)}
                aria-label={item.isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                className={`absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 shadow-xs cursor-pointer ${item.isWishlisted ? 'text-red-500' : 'text-slate-500'}`}
              >
                <Heart className="w-4 h-4" fill={item.isWishlisted ? 'currentColor' : 'none'} />
              </button>
              {item.status !== 'available' && (
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white uppercase">{item.status}</span>
              )}
            </div>
            <div className="p-4 space-y-2 text-xs flex-1 flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-slate-900">{money(item.price)}</span>
                {item.originalPrice && <span className="text-slate-400 line-through">{money(item.originalPrice)}</span>}
                {item.discount && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{item.discount}</span>}
              </div>
              <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{item.title}</h3>
              <div className="text-slate-500">{item.condition}{item.courseCode ? ` · ${item.courseCode}` : ''}</div>
              <div className="flex items-center gap-1 text-slate-600"><MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" /><span className="truncate">{item.meetupLocation}</span></div>
              <div className="text-slate-500 mt-auto pt-1">by {item.seller.name}</div>
              {item.isOwner ? (
                <div className="text-center text-[11px] font-bold text-slate-500 pt-1">Your listing</div>
              ) : (
                <button
                  disabled={item.status !== 'available'}
                  onClick={() => onMakeOffer(item)}
                  className="w-full py-2 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold cursor-pointer"
                >
                  Make an offer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
