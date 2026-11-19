import React, { useState } from 'react';
import { 
  Heart, 
  Tag, 
  TrendingDown, 
  Bell, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  PlusCircle, 
  Trash2,
  Calendar,
  Share2
} from 'lucide-react';
import { WATCHLIST_CLASSES } from '../data/mockData';

export default function WishlistPage({ 
  listings, 
  onToggleWishlist, 
  onOpenChat, 
  onTriggerEscrow 
}) {
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [watchlists, setWatchlists] = useState(WATCHLIST_CLASSES);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCeilingBudget, setNewCeilingBudget] = useState('');

  // Wishlisted items
  const wishlistedItems = listings.filter((item) => item.isWishlisted);

  const handleToggleAutoNotify = (id) => {
    setWatchlists(watchlists.map(w => w.id === id ? { ...w, autoNotify: !w.autoNotify } : w));
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newCourseCode) return;
    const newEntry = {
      id: `watch-${Date.now()}`,
      courseCode: newCourseCode.toUpperCase(),
      title: "Enrolled Course Material",
      target: "Textbook & Lab Notebook",
      ceilingBudget: parseFloat(newCeilingBudget) || 30.0,
      peersWatching: 1,
      autoNotify: true,
    };
    setWatchlists([...watchlists, newEntry]);
    setNewCourseCode('');
    setNewCeilingBudget('');
    setShowAddClassModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Share */}
      <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5">
          <span>UC Berkeley</span>
          <span>/</span>
          <span>Student Commons</span>
          <span>/</span>
          <span className="font-bold text-slate-900">Wishlist & Alerts</span>
        </div>
        <button className="flex items-center gap-1.5 text-blue-700 font-semibold hover:underline cursor-pointer">
          <Share2 className="w-3.5 h-3.5" />
          <span>Share with Roommate / Group</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold uppercase tracking-wider">
          <span>LIVE PEER PRICE RADAR • SPRING SEMESTER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          My Campus Wishlist & Saved Alerts
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Track course textbooks, dorm essentials, and upcoming move-out deals. Get notified the second a peer lists an item you need on Berkeley grounds.
        </p>
      </div>

      {/* Metrics Row (Matching PDF Page 6) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-900">
            <Heart className="w-6 h-6 fill-current text-red-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{wishlistedItems.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Tracked Gear & Books</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <TrendingDown className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">$35</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">2 Price Drops Active • Saved Potential</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
            <Bell className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{watchlists.length}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Automated Class Alerts (MATH 53, CHEM 3A)</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none text-xs">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeSubTab === 'all'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Saved Listings ({wishlistedItems.length})
        </button>
        <button
          onClick={() => setActiveSubTab('drops')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'drops'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
          <span>Price Drop Alerts (2)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('watchlists')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeSubTab === 'watchlists'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Course Watchlists ({watchlists.length})
        </button>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Saved Cards Grid */}
        <div className="lg:col-span-8">
          {wishlistedItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore the marketplace and click the heart icon on any textbook, desk, or gadget to track price drops.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-16/10 bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onToggleWishlist(item.id)}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-red-500 shadow-xs hover:scale-110 transition-transform cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-3 text-xs">
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-slate-900">${item.price}</span>
                          {item.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">${item.originalPrice}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {item.discount}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.conditionBadge}</p>

                      <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span className="truncate">{item.meetupLocation}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => onTriggerEscrow(item)}
                        className="flex-1 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Buy / Hold Escrow</span>
                      </button>
                      <button
                        onClick={() => onOpenChat(item)}
                        className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 cursor-pointer"
                        title="Chat with seller"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: Market Intelligence & Safe Hubs (Matching PDF Page 6) */}
        <div className="lg:col-span-4 space-y-5 text-xs">
          
          {/* Market Intelligence Box */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Calendar className="w-4 h-4 text-amber-700" />
              <span>MARKET INTELLIGENCE</span>
            </div>
            <h4 className="font-black text-slate-900 text-base">
              End-of-Semester Alert
            </h4>
            <p className="text-slate-700 text-xs leading-relaxed">
              Dorm furniture, microwaves, and compact mini-fridges typically drop <strong>35%-50%</strong> during Finals Week (May 10-18).
            </p>

            <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 space-y-2">
              <div className="flex justify-between text-[11px] font-bold text-slate-700">
                <span>Avg Campus Dorm Rent Cost</span>
                <span className="text-red-600">-45% drop forecast</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-3/4"></div>
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                <span>Mid-Semester</span>
                <span>Apr</span>
                <span className="text-amber-700">Finals (May)</span>
              </div>
            </div>

            <button className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors cursor-pointer">
              Set Target Move-Out Bids
            </button>
          </div>

          {/* Safe Meetup Hubs Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Safe Meetup Hubs
              </h4>
              <span className="text-[10px] text-emerald-700 font-bold">Monitored</span>
            </div>
            <p className="text-[11px] text-slate-500">
              All 6 sellers on your wishlist are currently registered near these designated secure exchange zones:
            </p>

            <div className="space-y-2 pt-1 text-[11px]">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-800">Moffitt Library 3rd Fl Hub</div>
                  <div className="text-slate-400 text-[10px]">High Foot Traffic • 24/7 Cameras</div>
                </div>
                <span className="font-bold text-slate-700">2 Items</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-800">MLK Student Union Lobby</div>
                  <div className="text-slate-400 text-[10px]">Campus Staff Monitored</div>
                </div>
                <span className="font-bold text-slate-700">1 Item</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-800">Unit 1 & Unit 2 Commons</div>
                  <div className="text-slate-400 text-[10px]">Keycard Access Entry Only</div>
                </div>
                <span className="font-bold text-slate-700">3 Items</span>
              </div>
            </div>

            {/* Simulated mini map snippet */}
            <div className="relative h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=400&q=80"
                alt="Campus Map"
                className="w-full h-full object-cover opacity-60"
              />
              <button className="absolute inset-0 m-auto h-8 px-3 bg-slate-900/90 text-white rounded-lg font-bold text-[10px] backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>View Campus Meetup Map</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Active Course Watchlists (Matching PDF Page 6 bottom) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-700" />
              <h3 className="text-xl font-black text-slate-900">Active Course Watchlists</h3>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              We ping your CalMail the moment a classmate lists these course-specific materials under your max price.
            </p>
          </div>

          <button
            onClick={() => setShowAddClassModal(true)}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Track New Class</span>
          </button>
        </div>

        {/* Watchlist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlists.map((w) => (
            <div
              key={w.id}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 text-xs"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono font-black text-xs text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                  {w.courseCode}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  Monitoring ({w.peersWatching} Peers Active)
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{w.title}</h4>
                <div className="text-[11px] text-slate-500 mt-1">Watching target: <strong className="text-slate-800">{w.target}</strong></div>
                <div className="text-[11px] text-slate-500">Ceiling Budget: <strong className="text-emerald-700">&le; ${w.ceilingBudget.toFixed(2)}</strong></div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">Auto-Notify</span>
                <button
                  type="button"
                  onClick={() => handleToggleAutoNotify(w.id)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    w.autoNotify ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    w.autoNotify ? 'left-4.5' : 'left-0.5'
                  }`}></span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for adding class */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs animate-in zoom-in-95">
            <h4 className="text-base font-bold text-slate-900">Add Course Watchlist</h4>
            <form onSubmit={handleAddClass} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS 61B, ECON 2"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg uppercase font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Max Ceiling Budget ($)</label>
                <input
                  type="number"
                  placeholder="35"
                  value={newCeilingBudget}
                  onChange={(e) => setNewCeilingBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 text-white font-bold rounded-lg"
                >
                  Save Watchlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
