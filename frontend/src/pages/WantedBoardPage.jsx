import { useState } from 'react';
import { useCampus } from '../context/useCampus';
import api from '../services/api';
import { formatMoney } from '../utils/format';
import {  
  PlusCircle, 
  Search,  
  MapPin,  
  ShieldCheck,    
  MessageSquare,
  Users,
  Send
} from 'lucide-react';

export default function WantedBoardPage({ 
  wantedRequests, 
  onOpenWantedModal, 
  onOpenOfferModal,
  onSetWantedStatus,
  onDeleteWanted,
}) {
  const { campus } = useCampus();
  const [selectedCategory, setSelectedCategory] = useState('All Requests');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [offersFor, setOffersFor] = useState(null); // { request, offers, error }

  const viewOffers = async (request) => {
    setOffersFor({ request, offers: null, error: '' });
    try {
      const res = await api.getWantedOffers(request.id);
      setOffersFor({ request, offers: res.data, error: '' });
    } catch (err) {
      setOffersFor({ request, offers: [], error: err.message });
    }
  };

  const categories = [
    'All Requests',
    'Textbooks & Notes',
    'Dorm & Living',
    'Electronics & Gear',
    'Moving & Boxes',
    'Study Partners / Rides',
  ].map((label) => ({
    label,
    count: String(label === 'All Requests' ? wantedRequests.length : wantedRequests.filter((r) => r.category === label).length),
  }));

  const filteredRequests = wantedRequests.filter((req) => {
    const matchesCat = selectedCategory === 'All Requests' || req.category === selectedCategory;
    const matchesUrgency =
      urgencyFilter === 'all' ||
      (urgencyFilter === 'urgent' && req.urgencyColor === 'red') ||
      (urgencyFilter === 'week' && req.urgencyColor === 'amber');
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch && matchesUrgency;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top micro metric strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-slate-200 pb-4 text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">Commons / Community ISO Board</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
            {wantedRequests.length} Open Requests
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-600 font-medium">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-700" />
            <span>{campus.short} students only</span>
          </span>
        </div>
      </div>

      {/* Main Header & Post CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold uppercase tracking-wider">
            <span>PEER-TO-PEER REQUEST FEED</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Wanted & ISO Board <span className="text-blue-700">(In Search Of)</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Looking for a specific textbook, dorm item, lab kit, or ride-share? Post your request to 15,000+ campus peers before spending full retail price.
          </p>
        </div>

        <button
          onClick={onOpenWantedModal}
          className="shrink-0 flex items-center gap-2 px-5 py-3 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Post a Wanted Request</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`ml-2 text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-blue-800 text-blue-200' : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">URGENCY TIMELINE</label>
          <select 
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-hidden"
          >
            <option value="all">Any Urgency Window</option>
            <option value="urgent">Urgent</option>
            <option value="week">This Week</option>
          </select>
        </div>



        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">KEYWORD SEARCH</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Chem kit, fridge, Krugman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Results Count & Sort */}
      <div className="flex justify-between items-center text-xs text-slate-500">
        <div>Showing <strong className="text-slate-900">{filteredRequests.length}</strong> active wanted requests at {campus.short}</div>
        <div className="text-slate-600 font-medium">Newest first</div>
      </div>

      {/* Wanted Request Cards Grid (Matching Page 4 in PDF) */}
      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-sm text-slate-500">
          No requests match yet. Be the first to post what you are looking for!
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* User header */}
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    aria-hidden="true"
                    className="w-9 h-9 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center ring-1 ring-emerald-500"
                  >
                    {req.user.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900">{req.user}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">.edu verified</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{req.standing}</div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{req.timeAgo}</span>
              </div>

              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                  req.urgencyColor === 'red' ? 'bg-red-50 text-red-700 border border-red-200' :
                  req.urgencyColor === 'amber' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                  'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {req.urgency}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {req.tag}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1.5">
                {req.title}
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                {req.description}
              </p>

              {/* Campus Meetup Zone */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-3">
                <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <span>Zone: {req.campus}</span>
              </div>
            </div>

            {/* Bottom Budget & Action */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Offered Budget</div>
                  <div className="text-base font-black text-slate-900">{req.budget}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Activity</div>
                  <div className="text-[11px] font-bold text-emerald-700">{req.activity}</div>
                </div>
              </div>

              {req.isOwner ? (
                <div className="space-y-2">
                  <button
                    onClick={() => viewOffers(req)}
                    className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                    <span>View offers ({req.offersCount})</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => onSetWantedStatus(req.id, 'fulfilled')} className="py-2 rounded-xl border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-bold text-xs cursor-pointer">
                      Mark fulfilled
                    </button>
                    <button onClick={() => onDeleteWanted(req.id)} className="py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 font-bold text-xs cursor-pointer">
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onOpenOfferModal(req)}
                  className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>Offer Item to Student</span>
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Informative Blue Banner (Matching PDF Page 4 bottom) */}
      <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-800 rounded-xl text-emerald-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Have an item a classmate is looking for?</h4>
            <p className="text-xs text-emerald-200">
              Send an offer and the student is notified by email. Always settle the exchange in person at a safe spot on campus.
            </p>
          </div>
        </div>
        <button className="hidden sm:block whitespace-nowrap text-xs font-bold text-amber-300 hover:underline">
          Safe meetup spots →
        </button>
      </div>

      {/* How Wanted & ISO Posts Work 3-Step Guide (Matching PDF Page 4) */}
      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-700">SIMPLE CAMPUS MECHANISM</span>
          <h3 className="text-2xl font-black text-slate-900">How Wanted & ISO Posts Work</h3>
          <p className="text-slate-500 text-xs max-w-lg mx-auto">
            Save money and reduce campus waste by tapping into unused items sitting right inside dorms and student apartments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 font-black text-sm flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Post what you need</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Specify the textbook, lab equipment, furniture, or gadget you require, your deadline, and how much you are ready to pay or borrow it for.
            </p>
            <div className="text-[11px] text-blue-700 font-semibold pt-1">✓ Broadcasts to 15,000+ verified peers</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 font-black text-sm flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Classmates reply with offers</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Students who have the item in their closet or dorm room reply with photos, condition grades, and counter-offers via in-app chat.
            </p>
            <div className="text-[11px] text-emerald-700 font-semibold pt-1">✓ Zero spam • .edu credentials verified</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Meet safely on campus to swap</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Choose one of 14 official security-monitored trading hubs (Moffitt Library, MLK Union, Unit 1 Commons) to inspect and complete the exchange.
            </p>
            <div className="text-[11px] text-slate-700 font-semibold pt-1">✓ Campus security monitored hubs</div>
          </div>
        </div>
      </div>


      {offersFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 overflow-y-auto" onClick={() => setOffersFor(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 flex justify-between items-start gap-3">
              <div>
                <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Offers received</div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{offersFor.request.title}</h3>
              </div>
              <button onClick={() => setOffersFor(null)} className="text-slate-500 hover:text-slate-900 font-bold" aria-label="Close">✕</button>
            </div>
            <div className="p-5 space-y-3 text-xs max-h-96 overflow-y-auto">
              {offersFor.offers === null && <p className="text-slate-500">Loading…</p>}
              {offersFor.error && <p className="text-red-700 font-semibold">{offersFor.error}</p>}
              {offersFor.offers?.length === 0 && !offersFor.error && <p className="text-slate-500">No offers yet.</p>}
              {offersFor.offers?.map((o) => (
                <div key={o.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{o.from.name}</span>
                    {o.amount !== null && <span className="text-emerald-700">{formatMoney(o.amount, campus.currency)}</span>}
                  </div>
                  <div className="text-[11px] text-slate-500">{o.from.role}</div>
                  <p className="mt-1.5 text-slate-700">{o.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
