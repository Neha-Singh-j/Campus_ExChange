import React from 'react';
import { ShieldCheck, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-slate-100">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Campus<span className="text-blue-700">Zon</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
              The closed-loop peer marketplace engineered exclusively for verified university students, faculty, and campus communities.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% .edu Verified Students & Faculty Only</span>
            </div>
          </div>

          {/* Campus Safety */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Campus Safety</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('verification')} className="hover:text-blue-700 transition-colors">Safety Pledge</button></li>
              <li><button onClick={() => onNavigate('verification')} className="hover:text-blue-700 transition-colors">Designated Meetup Hubs</button></li>
              <li><button onClick={() => onNavigate('verification')} className="hover:text-blue-700 transition-colors">Escrow & Hold Policy</button></li>
              <li><a href="#report" className="hover:text-blue-700 transition-colors">Report Suspicious Activity</a></li>
            </ul>
          </div>

          {/* Popular Dorm Hubs */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Popular Dorm Hubs</h4>
            <ul className="space-y-2 text-slate-500">
              <li>Unit 1 & Unit 2 Commons</li>
              <li>Foothill & Stern Lounges</li>
              <li>Clark Kerr Campus Quad</li>
              <li>MLK Student Union Hub</li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Trust & Legal</h4>
            <ul className="space-y-2">
              <li><a href="#protection" className="hover:text-blue-700 transition-colors">Buyer & Seller Protection</a></li>
              <li><a href="#guidelines" className="hover:text-blue-700 transition-colors">Community Guidelines</a></li>
              <li><a href="#privacy" className="hover:text-blue-700 transition-colors">Privacy & .edu Compliance</a></li>
              <li><button onClick={() => onNavigate('synopsis')} className="text-blue-700 font-semibold hover:underline">Major Project Synopsis</button></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & chapter info */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-400 text-[11px]">
          <div>
            © 2026 CampusZon Inc. Official University Student Commons. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium">UC Berkeley Chapter</span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              System Status: Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
