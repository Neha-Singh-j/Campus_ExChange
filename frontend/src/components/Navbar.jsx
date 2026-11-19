import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  PlusCircle, 
  Bell, 
  MapPin, 
  ChevronDown, 
  Sparkles,
  BookOpen,
  GraduationCap,
  Layers,
  Heart,
  UserCheck,
  FileText
} from 'lucide-react';
import { CAMPUS_OPTIONS, CURRENT_USER } from '../data/mockData';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenPostModal, 
  wishlistCount, 
  selectedCampus, 
  setSelectedCampus,
  onOpenNotification 
}) {
  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);

  const navItems = [
    { id: 'marketplace', label: 'Marketplace', icon: Layers },
    { id: 'wanted', label: 'Wanted Board', icon: Sparkles, badge: '8 New' },
    { id: 'advanced-search', label: 'Advanced Search', icon: Search },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistCount },
    { id: 'verification', label: 'Student Verification', icon: UserCheck, verified: true },
    { id: 'bundles', label: 'Move-Out Bundles', icon: GraduationCap, badge: 'May 10-22' },
    { id: 'synopsis', label: 'Project Synopsis', icon: FileText, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3">
          
          {/* Brand Logo & Campus Selector */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setActiveTab('marketplace')} 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center">
                  Campus<span className="text-blue-700">Zon</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 -mt-1">
                  Verified Peer Exchange
                </span>
              </div>
            </div>

            {/* Campus Selector Dropdown */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setCampusDropdownOpen(!campusDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-700" />
                <span className="max-w-[150px] truncate">{selectedCampus}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {campusDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select University
                  </div>
                  {CAMPUS_OPTIONS.map((campus) => (
                    <button
                      key={campus}
                      onClick={() => {
                        setSelectedCampus(campus);
                        setCampusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-blue-50 transition-colors flex items-center justify-between ${
                        selectedCampus === campus ? 'font-bold text-blue-700 bg-blue-50/60' : 'text-slate-700'
                      }`}
                    >
                      <span>{campus}</span>
                      {selectedCampus === campus && <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-xs'
                      : item.highlight
                      ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : item.highlight ? 'text-amber-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>

                  {item.badge && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-amber-400 text-blue-950' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Post an Item CTA Button */}
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Post an Item</span>
            </button>

            {/* Notification Bell */}
            <button 
              onClick={onOpenNotification}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {/* User Profile Pill */}
            <div 
              onClick={() => setActiveTab('verification')}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
              title="View Student Verification & ID status"
            >
              <div className="relative">
                <img
                  src={CURRENT_USER.avatar}
                  alt={CURRENT_USER.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/80"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  <span>{CURRENT_USER.name}</span>
                  <span className="text-[10px] px-1 bg-emerald-100 text-emerald-800 font-bold rounded">.edu</span>
                </div>
                <span className="text-[10px] text-slate-500">Haas School of Business</span>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Horizontal Navigation Strip */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  isActive
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
