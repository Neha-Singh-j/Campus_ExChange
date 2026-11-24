import React, { useState } from 'react';
import { 
  FileText, 
  GraduationCap, 
  Users, 
  Award, 
  Calendar, 
  Lightbulb, 
  Cpu, 
  HardDrive, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Printer
} from 'lucide-react';

export default function SynopsisPage() {
  const [activeTab, setActiveTab] = useState('synopsis');

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Academic Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-blue-950 text-xs font-black uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>Final Year Major Project Synopsis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            CampusZon: Smart Campus Resource Exchange & Reuse Platform
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Academic Project Defense Documentation & Implementation Blueprint • Department of Computer Science & Engineering
          </p>
        </div>

        <button
          onClick={printDocument}
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-md hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-blue-700" />
          <span>Print / Export Synopsis</span>
        </button>
      </div>

      {/* Synopsis Document Container (Styled as an authentic academic paper) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-slate-800 font-serif leading-relaxed">
        
        {/* Academic Header Meta */}
        <div className="border-b-2 border-slate-900 pb-6 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black font-sans uppercase tracking-tight text-slate-950">
              PROJECT SYNOPSIS
            </h2>
            <p className="text-xs font-sans font-bold text-slate-600 uppercase tracking-widest">
              Bachelor of Technology (B.Tech) • Final Year Major Project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans pt-4 border-t border-slate-100">
            <div className="space-y-1.5">
              <div>
                <strong className="text-slate-900 uppercase">Project Topic:</strong>{' '}
                <span className="font-semibold text-blue-900">CampusZon – Smart Campus Resource Exchange & Reuse Platform</span>
              </div>
              <div>
                <strong className="text-slate-900 uppercase">Project Group No.:</strong> G-14 (CSE Batch 2026)
              </div>
              <div>
                <strong className="text-slate-900 uppercase">Project Supervisor:</strong> Dr. XYZ / Prof. XYZ, Associate Professor
              </div>
            </div>

            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 uppercase text-[11px] mb-1">Project Group Members:</div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-700">
                <div>1. Student 1 (Sec A - Roll No: 01)</div>
                <div>2. Student 2 (Sec A - Roll No: 02)</div>
                <div>3. Student 3 (Sec A - Roll No: 03)</div>
                <div>4. Student 4 (Sec B - Roll No: 04)</div>
                <div>5. Student 5 (Sec B - Roll No: 05)</div>
                <div>6. Student 6 (Sec B - Roll No: 06)</div>
              </div>
            </div>
          </div>
        </div>

        {/* 1. About the Project */}
        <section className="space-y-2">
          <h3 className="text-base font-bold font-sans uppercase tracking-wider text-blue-950 border-b border-slate-200 pb-1">
            1. About the Project
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            <strong>CampusZon</strong> is a specialized peer-to-peer campus marketplace designed exclusively for verified university students, faculty, and campus communities. While general commercial marketplaces (such as Craigslist, Facebook Marketplace, or OLX) cater to broad geographical demographics, they inherently suffer from severe trust deficits, off-campus safety risks, predatory pricing, scam listings, and zero academic context.
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            CampusZon bridges this critical gap by creating a closed-loop university ecosystem governed by institutional <strong>.edu authentication</strong>, physical <strong>student ID verification</strong>, and <strong>academic syllabus matching</strong>. Students can buy, sell, borrow, or donate textbooks, scientific calculators, lab gear, dorm furniture, and appliances with guaranteed on-campus handoffs. Through integrated features such as <strong>CampusZon ScamShield™ Escrow</strong>, <strong>Wanted/ISO reverse request boards</strong>, and <strong>Senior Move-Out Room Liquidations</strong>, CampusZon empowers students to drastically reduce the financial cost of academic life while driving environmental sustainability and campus-wide circular economies.
          </p>
        </section>

        {/* 2. Motivation & Societal Impact */}
        <section className="space-y-2">
          <h3 className="text-base font-bold font-sans uppercase tracking-wider text-blue-950 border-b border-slate-200 pb-1">
            2. Motivation & Societal Significance
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
            Every academic semester, college students face excessive textbook and educational supply expenses often exceeding $1,200 annually. Simultaneously, during end-of-semester move-out weeks, thousands of pounds of functional mini-fridges, study desks, lab kits, and electronics are discarded into municipal landfills due to the lack of an efficient hyper-local exchange medium. CampusZon solves this dual problem by democratizing affordable academic materials, preventing campus e-waste, and providing 100% verified physical safety within designated campus security zones.
          </p>
        </section>

        {/* 3. Innovation */}
        <section className="space-y-3">
          <h3 className="text-base font-bold font-sans uppercase tracking-wider text-blue-950 border-b border-slate-200 pb-1">
            3. Key Innovative Features (Differentiating Innovations)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1. Course Syllabus Intelligent Matching</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Direct integration with university course catalogs (e.g. BIO 1A, CS 61A, CHEM 3B) automatically matches required books, editions, and lab kits to enrolled student rosters.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>2. ScamShield™ Escrow & QR Handshake</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Funds are locked safely in escrow with zero platform fees. Payment is only released to the seller after the buyer physically inspects the item and scans the in-app QR token.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3. 24/7 CCTV Safe Meetup Hubs</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                All handoffs are geofenced to officially designated campus safety zones (Moffitt Library 1st Floor, MLK Union Info Desk, Sproul Hall Blue Light Hub).
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>4. Senior Move-Out & Whole-Room Bundles</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Graduating seniors can liquidate their entire dorm setup (coding rig, kitchen set, desk kit) in a single transaction with complimentary residential loading dock access.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>5. Wanted & ISO Reverse Marketplace</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Students can post "In Search Of" requests with target deadlines and budgets, allowing peers with unused items to instantly respond with matching offers.
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>6. Dynamic Price Guidance & Trust Index</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Algorithmic resale price suggestions combined with an in-person exchange reputation score (99.4% Trust Index) eliminate price gouging.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Project Planning & Gantt Chart (Sep 2025 to Mar 2026) */}
        <section className="space-y-3 font-sans">
          <h3 className="text-base font-bold font-sans uppercase tracking-wider text-blue-950 border-b border-slate-200 pb-1">
            4. Project Planning & Milestone Timeline (Gantt Chart)
          </h3>
          <p className="text-xs text-slate-600">
            Project schedule starting from <strong>October 2026</strong> through completion in <strong>March 2026</strong>:
          </p>

          {/* Interactive Gantt Chart Visualization */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 overflow-x-auto">
            <div className="min-w-[650px] space-y-3 text-xs">
              {/* Header months */}
              <div className="grid grid-cols-12 gap-1 text-[11px] font-bold text-slate-500 uppercase pb-2 border-b border-slate-200 text-center">
                <div className="col-span-4 text-left pl-2">Phase / Work Breakdown</div>
                
                <div className="col-span-1">Nov '26</div>
                <div className="col-span-1">Dec '26</div>
                <div className="col-span-2 text-emerald-700">Mar '26 (Launch)</div>
              </div>

              {/* Rows */}
              {[
                { task: 'Goal identification & Requirements Gathering', start: 0, span: 2, color: 'bg-blue-600' },
                { task: 'Scope definition, wireframing & mockups', start: 1, span: 2, color: 'bg-indigo-600' },
                { task: 'Sitemap, system architecture & DB design', start: 2, span: 2, color: 'bg-blue-700' },
                { task: 'MERN API, JWT & .edu OTP verification engine', start: 3, span: 2, color: 'bg-indigo-700' },
                { task: 'Frontend React UI (Marketplace, ISO, Syllabus)', start: 4, span: 2, color: 'bg-blue-800' },
                { task: 'ScamShield Escrow, QR scan & Socket.io chat', start: 5, span: 2, color: 'bg-emerald-600' },
                { task: 'System testing, campus pilot & viva defense', start: 6, span: 2, color: 'bg-amber-500' },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-1 items-center py-1">
                  <div className="col-span-4 text-xs font-semibold text-slate-800 truncate pl-2">
                    {row.task}
                  </div>
                  <div className="col-span-8 grid grid-cols-8 gap-1 h-6 items-center">
                    <div 
                      className={`h-4 rounded-md ${row.color} shadow-xs text-white text-[9px] font-bold flex items-center justify-center`}
                      style={{
                        gridColumnStart: row.start + 1,
                        gridColumnEnd: `span ${row.span}`
                      }}
                    >
                      P{idx+1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Tools & Requirements */}
        <section className="space-y-3 font-sans">
          <h3 className="text-base font-bold font-sans uppercase tracking-wider text-blue-950 border-b border-slate-200 pb-1">
            5. System Requirements
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                {/* <HardDrive className="w-4 h-4 text-blue-700" /> */}
                {/* <span>Hardware Requirements:</span> */}
              </div>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li>• <strong>Processor:</strong> Dual Core 2.4 GHz or higher (Intel Core i5 / AMD Ryzen / Apple Silicon)</li>
                <li>• <strong>RAM:</strong> 8 GB minimum (16 GB recommended for local Docker/Node runtime)</li>
                <li>• <strong>Storage:</strong> 256 GB SSD (50 GB available disk space for media/DB caching)</li>
                {/* <li>• <strong>Display:</strong> 1366 x 768 or higher display resolution for responsive views</li> */}
                {/* <li>• <strong>Client Camera:</strong> Integrated HD webcam or smartphone camera for student ID QR handshake</li> */}
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-700" />
                <span>Software Requirements:</span>
              </div>
              <ul className="space-y-1 text-slate-600 text-[11px]">
                <li>• <strong>Frontend:</strong> React 19, Vite, Tailwind CSS v4, Lucide React</li>
                <li>• <strong>Backend:</strong> Node.js (v22+), Express.js, Socket.IO for peer messaging</li>
                <li>• <strong>Database:</strong> MongoDB Atlas (NoSQL) with Mongoose ODM</li>
                <li>• <strong>Authentication:</strong> JWT (JSON Web Tokens), bcrypt, Nodemailer OTP</li>
                <li>• <strong>Development Tools:</strong> Visual Studio Code, Git/GitHub, Postman, Chrome DevTools</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Supervisor Signature Area */}
        <div className="pt-8 border-t-2 border-slate-900 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs font-sans">
          <div className="space-y-1">
            <div className="text-slate-500 font-semibold">Date of Submission:</div>
            <div className="font-bold text-slate-900">Academic Term 2025-2026</div>
          </div>

          <div className="space-y-2 text-right">
            {/* <div className="w-56 border-b border-slate-400 pb-1">
              <span className="text-[10px] text-slate-400 italic">Signature of Project Supervisor</span>
            </div> */}
            <div className="font-bold text-slate-900">Dr. XYZ / Assistant Professor</div>
            <div className="text-[10px] text-slate-500">Department of Computer Science & Engineering</div>
          </div>
        </div>

      </div>

    </div>
  );
}