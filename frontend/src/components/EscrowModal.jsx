import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, Lock, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';

export default function EscrowModal({ isOpen, onClose, targetItem }) {
  const [step, setStep] = useState(1); // 1: Escrow Hold Initiated, 2: Meetup & QR Handshake, 3: Completed

  if (!isOpen || !targetItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                CampusZon ScamShield™
              </div>
              <h3 className="text-base font-bold text-white">Escrow & Secure Handshake</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Step Protocol Progress bar */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`p-2 rounded-lg font-bold flex flex-col items-center gap-1 ${
            step >= 1 ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            <span className="text-[10px] uppercase">Step 1</span>
            <span>1. Locked in Escrow</span>
          </div>
          <div className={`p-2 rounded-lg font-bold flex flex-col items-center gap-1 ${
            step >= 2 ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            <span className="text-[10px] uppercase">Step 2</span>
            <span>2. QR Scan Check</span>
          </div>
          <div className={`p-2 rounded-lg font-bold flex flex-col items-center gap-1 ${
            step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            <span className="text-[10px] uppercase">Step 3</span>
            <span>3. Direct Deposit</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 text-xs space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <img 
                  src={targetItem.image} 
                  alt={targetItem.title} 
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-sm">{targetItem.title}</div>
                  <div className="text-slate-600">${targetItem.price} • {targetItem.condition}</div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-blue-700" />
                    <span>Meetup: {targetItem.meetupLocation}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Item Price:</span>
                  <span className="font-bold">${targetItem.price}.00</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Campus Safety Escrow Fee:</span>
                  <span>$0.00 (Free for .edu students)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-900 font-black text-sm">
                  <span>Total Escrow Deposit:</span>
                  <span>${targetItem.price}.00</span>
                </div>
              </div>

              <p className="text-slate-500 text-[11px] leading-relaxed">
                Your ${targetItem.price} deposit will be safely locked in CampusZon Escrow. The seller does <strong>not</strong> get paid until you inspect the item in person and scan their physical handshake QR code.
              </p>

              <button
                onClick={() => setStep(2)}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Deposit ${targetItem.price} to Escrow & Generate QR</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block shadow-inner mx-auto">
                {/* Simulated QR Code */}
                <div className="w-44 h-44 bg-white border-2 border-slate-900 rounded-xl p-2 flex flex-col items-center justify-center relative mx-auto">
                  <div className="grid grid-cols-6 gap-1 w-full h-full p-2">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          (i % 2 === 0 || i % 5 === 0 || i < 7 || i > 28) ? 'bg-slate-900' : 'bg-slate-100'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-1.5 bg-white rounded-md shadow-md border border-slate-300">
                      <Lock className="w-5 h-5 text-blue-900" />
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] font-mono text-slate-600 font-semibold">
                  ESCROW-TOKEN: #{Math.floor(100000 + Math.random() * 900000)}
                </div>
              </div>

              <div className="text-left bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-900 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Funds Safely Locked in Escrow
                </div>
                <p>
                  Meet {targetItem.seller?.name || "Seller"} at <strong>{targetItem.meetupLocation}</strong>. Inspect the item, verify condition, and have them scan this QR code or click below to simulate immediate completion.
                </p>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulate In-Person Safe QR Scan Handshake</span>
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900">Exchange Complete & Verified!</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Payment of ${targetItem.price}.00 has been released directly to {targetItem.seller?.name || "the seller"}. Your Campus Trust Index has increased!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-700 text-left space-y-1">
                <div className="flex justify-between">
                  <span>Handoff Station:</span>
                  <span className="font-semibold text-slate-900">{targetItem.meetupLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified Time:</span>
                  <span className="font-semibold text-slate-900">Just Now (CCTV Mapped)</span>
                </div>
                <div className="flex justify-between">
                  <span>Trust Score Update:</span>
                  <span className="font-bold text-emerald-600">+0.2 (Now 99.6%)</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-lg shadow-md transition-all cursor-pointer"
              >
                Back to CampusZon
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
