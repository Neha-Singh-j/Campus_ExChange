import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Clock, 
  TrendingDown, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Package, 
  Lock, 
  MapPin, 
  ArrowRight,
  Boxes,
  Layers,
  Heart
} from 'lucide-react';
import { MOVE_OUT_BUNDLES } from '../data/mockData';

export default function MoveOutBundlesPage({ onTriggerEscrow, onOpenPostModal }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 44,
    seconds: 11,
  });

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { label: 'All Move-Out Bundles', count: 142 },
    { label: 'Full Dorm Room Kits', count: 38 },
    { label: 'EECS / STEM Lab Workstations', count: 29 },
    { label: 'Kitchen & Meal Prep Essentials', count: 24 },
    { label: 'Apartment Furniture Lots', count: 21 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Notice Banner */}
      <div className="bg-amber-500 text-slate-950 font-bold text-xs py-2 px-4 text-center flex flex-wrap items-center justify-center gap-3">
        <span className="flex items-center gap-1.5">
          <Truck className="w-4 h-4" />
          <span>Campus Safe Move Alert: Free moving dolly loans active at MLK Student Union & Unit 1 Commons</span>
        </span>
        <span className="hidden md:inline">|</span>
        <span>May 10 - 22 Final Clearance Phase</span>
        <span className="hidden md:inline">|</span>
        <button onClick={onOpenPostModal} className="underline hover:text-white cursor-pointer">
          Seniors: Post Your Whole Room →
        </button>
      </div>

      {/* Hero Liquidation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-blue-900/40 relative overflow-hidden">
          
          {/* Subtle background graphics */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                <GraduationCap className="w-4 h-4" />
                <span>UC BERKELEY CLASS OF 2026 CLEARANCE</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Senior Move-Out & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
                  Graduation Bundle Liquidation.
                </span>
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Dorms and apartments clear out May 10-22. Score complete living setups, coding battle-stations, and major lab packs at <strong>60-80% off retail</strong> before graduating seniors head off campus.
              </p>

              {/* Countdown Timer Block (Matching PDF Page 7) */}
              <div className="pt-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-2">
                  TIME UNTIL FINAL DORM LOCKOUT
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/15 min-w-[55px]">
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">{timeLeft.days}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Days</div>
                  </div>
                  <span className="text-slate-500 font-bold text-xl">:</span>
                  <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/15 min-w-[55px]">
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">{timeLeft.hours}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Hours</div>
                  </div>
                  <span className="text-slate-500 font-bold text-xl">:</span>
                  <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/15 min-w-[55px]">
                    <div className="text-xl sm:text-2xl font-black text-white font-mono">{timeLeft.minutes}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Mins</div>
                  </div>
                  <span className="text-slate-500 font-bold text-xl">:</span>
                  <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/15 min-w-[55px]">
                    <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{timeLeft.seconds}</div>
                    <div className="text-[9px] uppercase tracking-wider text-amber-300 font-bold">Secs</div>
                  </div>
                </div>
              </div>

              {/* Mini Stats Counters */}
              <div className="grid grid-cols-3 gap-3 pt-3 max-w-md">
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="text-xl font-black text-white">$340</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Avg Bundle Savings</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="text-xl font-black text-amber-400">142</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Complete Setups</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="text-xl font-black text-emerald-400">100%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Senior Verified</div>
                </div>
              </div>
            </div>

            {/* Right Featured Showcase Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-blue-950 font-bold uppercase tracking-wider text-[10px]">
                    Senior Verified Guarantee
                  </span>
                  <span className="text-slate-300 text-[11px]">Zero Dumpster Initiative</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">Buy Whole Rooms, Not Pieces</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Every bundle includes all accessories, power cords, mounts, and notes. One checkout, one campus hand-off.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80"
                    alt="Room Kit"
                    className="w-full h-24 object-cover rounded-xl border border-white/20"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80"
                    alt="Desk Rig"
                    className="w-full h-24 object-cover rounded-xl border border-white/20"
                  />
                </div>

                <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Unit 2 Towle Loading Zone</span>
                  </div>
                  <span className="text-slate-300 text-[11px]">Escrow Hold Enabled</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {categories.map((cat, idx) => {
            const isSelected = idx === 0;
            return (
              <button
                key={cat.label}
                className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
      </section>

      {/* Move-Out Bundles Cards Grid (Matching PDF Page 7) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOVE_OUT_BUNDLES.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Retail savings badge */}
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img
                    src={bundle.image}
                    alt={bundle.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-bold text-white bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span className="truncate">{bundle.location}</span>
                    </span>
                    <span className="text-amber-300 shrink-0">{bundle.seller}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-4 text-xs">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {bundle.title}
                    </h3>

                    {/* Breakdown list */}
                    <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex justify-between">
                        <span>BUNDLE CONTENTS ({bundle.itemsCount} ITEMS)</span>
                        <span className="text-emerald-700 font-semibold">Ready for Pickup</span>
                      </div>
                      <ul className="space-y-1 text-slate-700 text-[11px]">
                        {bundle.itemsList.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-blue-700 font-bold shrink-0">•</span>
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {bundle.note}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Row & Claim CTA */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mb-3">
                  <div>
                    <span className="text-2xl font-black text-slate-900">${bundle.price}</span>
                    <span className="text-xs text-slate-400 line-through ml-2">${bundle.originalRetail} retail</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Save ${bundle.originalRetail - bundle.price}
                  </span>
                </div>

                <button
                  onClick={() => onTriggerEscrow({
                    title: bundle.title,
                    price: bundle.price,
                    meetupLocation: bundle.location,
                    image: bundle.image,
                    condition: "Move-Out Bundle Lot",
                    seller: { name: bundle.seller }
                  })}
                  className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Claim Move-Out Bundle</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* How Move-Out Bundles Work On Campus (Matching PDF Page 7) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700">CAMPUS LOGISTICS PARTNERSHIP</span>
            <h3 className="text-2xl font-black text-slate-900">How Move-Out Bundles Work On Campus</h3>
            <p className="text-slate-500 text-xs max-w-lg mx-auto">
              Coordinated with UC Berkeley Residential Facilities to ensure safe physical handoffs, secure escrow payments, and zero dumpster overflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="p-2 bg-blue-50 text-blue-700 rounded-xl w-fit">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Designated Drop-Off Loading Docks</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Every residence hall (Unit 1, 2, 3, Foothill, & Clark Kerr) has 3 reserved campus-escort 30-minute pickup spots with security oversight.
              </p>
              <div className="text-[10px] text-blue-700 font-bold">✓ Active 8AM - 8PM Daily</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl w-fit">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Free Dolly & Hand Truck Loans</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Flash your student Cal 1 ID at MLK Student Union front desk for a complimentary 2-hour heavy dolly rental to move appliances.
              </p>
              <div className="text-[10px] text-emerald-700 font-bold">✓ $0 Deposit for .edu accounts</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Campus Escrow Inspection Hold</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Buyer funds stay safely locked in CampusZon Escrow. You test the electronics and inspect the furniture at loading dock before approving final funds.
              </p>
              <div className="text-[10px] text-slate-700 font-bold">✓ 100% Protection Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Seller CTA Callout (Matching PDF Page 7 bottom) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-blue-800">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Attention Graduating Class of 2026
            </span>
            <h3 className="text-2xl font-black text-white">
              List Your Entire Dorm Room in Under 3 Minutes.
            </h3>
            <p className="text-slate-300 text-xs max-w-xl leading-relaxed">
              Don't leave hundreds of dollars in furniture behind or spend days meeting 10 different buyers. Snap one wide photo of your setup, price it as a package, and let a rising sophomore pick up everything at once.
            </p>
          </div>

          <button
            onClick={onOpenPostModal}
            className="shrink-0 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            Create Move-Out Bundle
          </button>
        </div>
      </section>

    </div>
  );
}
