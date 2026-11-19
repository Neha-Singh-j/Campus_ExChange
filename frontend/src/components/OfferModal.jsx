import React, { useState } from 'react';
import { X, Check, ShieldCheck, MapPin, DollarSign, Send } from 'lucide-react';

export default function OfferModal({ isOpen, onClose, wantedRequest, onSendOffer }) {
  const [offerPrice, setOfferPrice] = useState('');
  const [offerNote, setOfferNote] = useState('');
  const [meetupHub, setMeetupHub] = useState('Moffitt Library 1st Floor Security Desk');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen || !wantedRequest) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      onSendOffer(wantedRequest.id, {
        price: offerPrice || wantedRequest.budget,
        note: offerNote,
        meetupHub,
      });
      setIsSent(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              Send Peer Offer
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">Offer Item to {wantedRequest.user}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wanted Target Summary */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="text-[11px] text-slate-500 font-semibold mb-1">Student's Request:</div>
          <div className="font-bold text-slate-900 text-sm mb-1">{wantedRequest.title}</div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Offered Budget: {wantedRequest.budget}
            </span>
            <span>•</span>
            <span className="text-slate-500">{wantedRequest.campus}</span>
          </div>
        </div>

        {isSent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Offer Sent via CampusZon!</h4>
            <p className="text-xs text-slate-600">
              {wantedRequest.user} has been notified via @berkeley.edu email push notification and in-app instant chat.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Your Asking Price ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  placeholder="e.g. 20"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Proposed Safe Meetup Spot</label>
              <select
                value={meetupHub}
                onChange={(e) => setMeetupHub(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 bg-white"
              >
                <option>Moffitt Library 1st Floor Security Desk</option>
                <option>MLK Jr. Union Lobby Info Desk</option>
                <option>UCPD Sproul Hall Blue Light Station</option>
                <option>Latimer Hall Chemistry Courtyard</option>
                <option>Unit 2 Towle Hall Front Lounge</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Message / Condition Details</label>
              <textarea
                rows={3}
                required
                placeholder="Hey! I have this exact item with clean parts, can meet you today at 3pm between lectures..."
                value={offerNote}
                onChange={(e) => setOfferNote(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Protected by Zero-Fee Campus Escrow & QR Scan Handshake.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold flex items-center gap-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Offer</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
