import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  MapPin, 
  Heart, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Zap, 
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  Home,
  Laptop,
  Shirt,
  FlaskConical,
  KeyRound
} from 'lucide-react';

export default function MarketplacePage({ 
  listings, 
  onToggleWishlist, 
  onOpenChat, 
  onTriggerEscrow, 
  onNavigateToHubs,
  selectedCampus 
}) {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyOnCampus, setOnlyOnCampus] = useState(true);
  const [fastResponderOnly, setFastResponderOnly] = useState(false);
  const [sortOption, setSortOption] = useState('featured');

  const categories = [
    { label: 'All Items', count: '3,420', icon: Sparkles },
    { label: 'Textbooks & Courseware', count: '1,120', icon: BookOpen },
    { label: 'Dorm & Furniture', count: '840', icon: Home },
    { label: 'Electronics & Calculators', count: '630', icon: Laptop },
    { label: 'Campus Gear & Merch', count: '410', icon: Shirt },
    { label: 'Lab Equipment', count: '280', icon: FlaskConical },
    { label: 'Subleases & Housing', count: '140', icon: KeyRound },
  ];

  // Filtering
  const filteredListings = listings.filter((item) => {
    const matchesCategory = selectedCategory === 'All Items' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Campus Verification Ribbon */}
      <section className="bg-gradient-to-b from-blue-50/70 via-slate-50 to-white pt-8 pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Buy, Sell & Swap Safely with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 underline decoration-blue-500/30 decoration-wavy">
                  Verified Students
                </span>
                .
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                No strangers, no shipping fees, no off-campus parking lot sketches. Exchange textbooks, tech, dorm essentials, and lab gear directly inside secured university zones.
              </p>

              {/* Trust Metric Counters */}
              <div className="grid grid-cols-3 gap-3 pt-3 max-w-md">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-2xl font-black text-slate-900">3,420</div>
                  <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">Active Listings</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-2xl font-black text-emerald-600">98%</div>
                  <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">On-Campus Hand-Offs</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-2xl font-black text-blue-700">100%</div>
                  <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">.EDU Verified Only</div>
                </div>
              </div>
            </div>

            {/* Right Escrow & Safety Live Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-blue-900/40 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-amber-400 border border-blue-400/30">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">Campus Escrow & Hold</h3>
                      <p className="text-[11px] text-slate-300">Zero fee campus-protected handoffs</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    ACTIVE
                  </span>
                </div>

                {/* Live ticker simulation */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                    <span className="text-slate-200">
                      <strong>Maya L.</strong> swapped <em>Bio 1A Notes</em> at <strong>Moffitt Library</strong> (2m ago)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Blue Light Stations mapped across Central & Northside</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>14 Designated Safe Meetup Hubs</span>
                  </div>
                  <button 
                    onClick={onNavigateToHubs}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore Hubs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Category Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-blue-800 text-blue-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter & Search Strip */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search textbooks, dorm mini fridges, CS calculators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900"
            />
          </div>

          {/* Quick filter pills */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setOnlyOnCampus(!onlyOnCampus)}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                onlyOnCampus
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>On-Campus Pickup Only</span>
            </button>

            <button
              onClick={() => setFastResponderOnly(!fastResponderOnly)}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                fastResponderOnly
                  ? 'bg-amber-50 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Fast Responder (&lt; 15m)</span>
            </button>

            <div className="h-5 w-px bg-slate-200 hidden md:block"></div>

            {/* Sort selector */}
            <div className="flex items-center gap-1 text-slate-500 whitespace-nowrap ml-auto">
              <span>Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured & Course Relevant</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div>
            Showing <strong className="text-slate-900">{filteredListings.length}</strong> featured student drops
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Escrow Protected & Zero Scam Verified</span>
          </div>
        </div>

        {/* Product Cards Grid (Matching Page 1 & 2 in PDF) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredListings.map((item) => {
            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col relative"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Wishlist Heart Button */}
                  <button
                    onClick={() => onToggleWishlist(item.id)}
                    className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer z-10 ${
                      item.isWishlisted
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-white/80 hover:bg-white text-slate-700'
                    }`}
                    title={item.isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                  >
                    <Heart className={`w-4 h-4 ${item.isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  {/* Course Code / Spec Bottom Tag on Image */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="inline-block text-[10px] font-bold bg-slate-900/80 backdrop-blur-md text-slate-200 px-2 py-0.5 rounded">
                      {item.courseCode}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  
                  <div>
                    {/* Price & Savings */}
                    <div className="flex items-baseline justify-between mb-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">${item.originalPrice} new</span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.discount}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>

                    {/* Condition highlight note */}
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                      {item.conditionBadge}
                    </p>

                    {/* Verified Safe Meetup location */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-2 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span className="truncate">{item.meetupLocation}</span>
                    </div>
                  </div>

                  {/* Seller info & Direct Action CTA */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <img
                        src={item.seller.avatar}
                        alt={item.seller.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500 shrink-0"
                      />
                      <div className="truncate">
                        <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1 truncate">
                          <span>{item.seller.name}</span>
                          <span className="text-[9px] px-1 bg-emerald-100 text-emerald-800 rounded font-semibold">.edu</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{item.seller.role}</div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenChat(item)}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Message Peer Seller"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onTriggerEscrow(item)}
                        className="px-2.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                        title="Hold in Escrow"
                      >
                        Hold
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Peace of Mind Campus Safety Banner (Matching PDF Page 1 & 2 bottom) */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-800/40 mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Campus Police & Safety Zone Verified</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Trade with total peace of mind.
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Always meet at designated Campus Safety Zones with blue-light monitoring, surveillance coverage, and staff presence. Never hand over cash in off-campus blindspots.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToHubs}
              className="px-5 py-2.5 bg-white text-blue-950 font-bold text-xs rounded-xl hover:bg-slate-100 shadow-md transition-all cursor-pointer"
            >
              View 14 Verified Hubs
            </button>
            <button
              onClick={onNavigateToHubs}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              Safety Checklist
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
