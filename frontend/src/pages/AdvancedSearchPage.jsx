import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Sliders, 
  MessageSquare, 
  SlidersHorizontal, 
  Download, 
  ChevronRight,
  ExternalLink,
  Layers,
  Heart
} from 'lucide-react';
import { SYLLABUS_MATCHES } from '../data/mockData';

export default function AdvancedSearchPage({ onOpenChat, onTriggerEscrow }) {
  const [selectedCourse, setSelectedCourse] = useState('BIO 1A');
  const [maxDistance, setMaxDistance] = useState(0.4);
  const [priceMax, setPriceMax] = useState(60);
  const [strictMatch, setStrictMatch] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('Biology 1A lab manual and equipment');

  const courseCodes = ['BIO 1A', 'CHEM 3B', 'MATH 53', 'CS 61B'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Catalog Breadcrumbs */}
      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3">
        <span>UC Berkeley</span>
        <span>/</span>
        <span>College of Letters & Science</span>
        <span>/</span>
        <span>Department of Molecular & Cell Biology</span>
        <span>/</span>
        <span className="font-bold text-slate-900">BIO 1A Catalog Hub</span>
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Catalog Synced: Spring 2026 Regular Session
        </span>
      </div>

      {/* Course Search Bar Strip */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
          />
        </div>

        <button className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>Filter Match</span>
        </button>

        <button className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0">
          <span>Save Search Alert</span>
        </button>
      </div>

      {/* Syllabus Match Verification Alert Banner (Matching PDF Page 5) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white p-4 rounded-2xl shadow-md border border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-800/80 rounded-xl text-amber-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <span>Course Syllabus Verification Active</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500 text-white font-black">ACTIVE</span>
            </div>
            <p className="text-slate-300 text-xs mt-0.5">
              These results have been matched with the official UC Berkeley Spring 2026 course catalog for BIO 1A.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-amber-300 font-semibold text-[11px]">Prof. Jennifer Doudna & Staff</span>
          <button className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold text-[11px] border border-white/20 flex items-center gap-1">
            <span>View Syllabus PDF</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2-Column Layout: Sidebar Filters + Search Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6 text-xs">
          
          {/* Section 1: Course & Syllabus Match */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-700" />
                Course & Syllabus Match
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active
              </span>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">DEPARTMENT & COURSE CODE</label>
              <div className="flex flex-wrap gap-1.5">
                {courseCodes.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedCourse(code)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      selectedCourse === code
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">INSTRUCTOR</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800">
                  <option>Prof. Doudna</option>
                  <option>Prof. Welch</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">SEMESTER</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800">
                  <option>Spring 2026</option>
                  <option>Fall 2025</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold text-slate-700">Strict Syllabus Match Only</span>
              <button
                type="button"
                onClick={() => setStrictMatch(!strictMatch)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  strictMatch ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                  strictMatch ? 'left-5.5' : 'left-0.5'
                }`}></span>
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-200"></div>

          {/* Section 2: Campus Radius & Hubs */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-700" />
                Campus Radius & Hubs
              </h4>
              <button className="text-[11px] text-blue-700 font-semibold hover:underline">Reset</button>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-700"></span>
              <span className="text-[11px] text-slate-700 font-semibold">
                Current Anchor: <strong>Moffitt Library</strong>
              </span>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                <span>Walking Distance:</span>
                <span className="text-blue-700">&lt; {maxDistance} miles</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                className="w-full accent-blue-900 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 pt-1 text-[11px]">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-blue-900" />
                <span>
                  <strong>Central Campus Hubs</strong> (MLK Union, Moffitt, Dwinelle &lt; 0.2 mi)
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-blue-900" />
                <span>
                  <strong>Southside Units</strong> (Unit 1, 2, 3, Martinez 0.3 - 0.7 mi)
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-blue-900" />
                <span>
                  <strong>Northside Dorms</strong> (Foothill, Stern, Bowles 0.6 - 1.0 mi)
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-0.5 rounded text-blue-900" />
                <span>
                  <strong>Clark Kerr & Greek Row</strong> (Piedmont Ave 1.2 mi)
                </span>
              </label>
            </div>
          </div>

          <div className="h-px bg-slate-200"></div>

          {/* Section 3: Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-slate-900 font-bold">
              <span>Price Range</span>
              <span>$0 - ${priceMax}</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full accent-blue-900 cursor-pointer"
            />
            <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded text-blue-900" />
              <span>Include Free Swaps & Textbook Trades</span>
            </label>
          </div>

          <div className="h-px bg-slate-200"></div>

          {/* Section 4: Condition Standard */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900">Condition Standard</div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <label className="flex justify-between items-center cursor-pointer">
                <span className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-blue-900" />
                  <span>Brand New (Unopened)</span>
                </span>
                <span className="text-slate-400">4</span>
              </label>
              <label className="flex justify-between items-center cursor-pointer">
                <span className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-blue-900" />
                  <span>Like New (No highlighting)</span>
                </span>
                <span className="text-slate-400">21</span>
              </label>
              <label className="flex justify-between items-center cursor-pointer">
                <span className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-blue-900" />
                  <span>Good (Light margin notes)</span>
                </span>
                <span className="text-slate-400">18</span>
              </label>
            </div>
          </div>

          <div className="h-px bg-slate-200"></div>

          {/* Section 5: Seller Credentials */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900">Seller Credentials</div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-900" />
                <span>.edu Verified Student</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-900" />
                <span>Graduating Senior Quick-Sale</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-900" />
                <span>Verified Honors Student</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-900" />
                <span>Top Rated Peer (4.8+ ★)</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Search Results Main Area */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Filters Pill Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-lg font-bold">
              Course: {selectedCourse} ×
            </span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
              Price: &lt; ${priceMax} ×
            </span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
              Location: Southside / Central ×
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
              edu Verified Only ×
            </span>
            <button className="text-xs text-blue-700 font-semibold hover:underline ml-auto">
              Clear All
            </button>
          </div>

          {/* Result Count and Sort */}
          <div className="flex justify-between items-center text-xs pb-1 border-b border-slate-200">
            <div>
              Showing <strong className="text-slate-900">48 Verified Results</strong> for {selectedCourse}
              <div className="text-[11px] text-slate-500">Syllabus-aligned books, lab equipment & peer-graded study materials</div>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <span>Sort By:</span>
              <select className="bg-transparent text-blue-700 font-bold focus:outline-hidden">
                <option>Best Course Match (90%+)</option>
                <option>Price: Low to High</option>
                <option>Distance: Closest First</option>
              </select>
            </div>
          </div>

          {/* Results List Cards (Matching PDF Page 5) */}
          <div className="space-y-4">
            {SYLLABUS_MATCHES.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 relative"
              >
                {/* Product Thumbnail */}
                <div className="sm:w-44 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Listing Details */}
                <div className="flex-1 flex flex-col justify-between space-y-2 text-xs">
                  <div>
                    {/* Price and Course info */}
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-[11px] font-bold text-blue-900">
                        {item.courseCode}
                      </span>
                      <div className="text-right">
                        <span className="text-xl font-black text-slate-900">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-slate-400 line-through ml-1.5">${item.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {item.title}
                    </h3>

                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      {item.condition}
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mt-1">
                      {item.notes}
                    </p>
                  </div>

                  {/* Seller & Action Row */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{item.seller}</span>
                        <span className="text-amber-500 font-bold">★ {item.rating}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-700 shrink-0" />
                        <span>{item.distance}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenChat({
                          title: item.title,
                          price: item.price,
                          meetupLocation: item.distance,
                          image: item.image,
                          seller: { name: item.seller, role: "Student Seller", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" }
                        })}
                        className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message {item.seller.split(' ')[0]}</span>
                      </button>
                      <button
                        onClick={() => onTriggerEscrow({
                          title: item.title,
                          price: item.price,
                          meetupLocation: item.distance,
                          image: item.image,
                          condition: item.condition,
                          seller: { name: item.seller }
                        })}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer"
                      >
                        Hold Escrow
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* 24/7 Monitored Meetup Station Banner (Matching PDF Page 5 bottom) */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between gap-4 text-xs mt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-800 rounded-xl text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white">CampusZon 24/7 Monitored Meetup Stations</div>
                <div className="text-slate-300 text-[11px]">
                  Always exchange items inside official designated safe zones: MLK Student Union front desk, Moffitt Library Security Turnstiles, or Unit 1 Central Office lobby.
                </div>
              </div>
            </div>
            <button className="hidden sm:block shrink-0 px-3 py-1.5 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100">
              View Safe Exchange Map
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
