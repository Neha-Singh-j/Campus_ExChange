import React, { useState } from 'react';
import { X, UploadCloud, ShieldCheck, DollarSign, BookOpen, MapPin, Tag } from 'lucide-react';

export default function PostItemModal({ isOpen, onClose, onAddItem, selectedCampus }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Textbooks & Courseware',
    courseCode: '',
    price: '',
    originalPrice: '',
    condition: 'Like New',
    conditionBadge: '',
    meetupLocation: 'Moffitt Library North Steps',
    image: '',
    description: '',
  });

  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    const newItem = {
      id: `item-${Date.now()}`,
      title: formData.title,
      courseCode: formData.courseCode || 'General Campus',
      category: formData.category,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Math.round(Number(formData.price) * 1.8),
      discount: formData.originalPrice 
        ? `${Math.round((1 - Number(formData.price) / Number(formData.originalPrice)) * 100)}% off`
        : 'Student Deal',
      condition: formData.condition,
      conditionBadge: formData.conditionBadge || 'Verified student item',
      badge: formData.courseCode ? 'COURSE MATCHED' : 'STUDENT DROP',
      badgeType: 'royal',
      meetupLocation: formData.meetupLocation,
      seller: {
        name: 'Alex Morgan',
        role: 'Jr • Haas School of Business',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5.0,
        verified: true,
      },
      image: imagePreview,
      tags: [formData.category.split(' ')[0], formData.courseCode || 'Campus'],
      isWishlisted: false,
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-amber-400 text-blue-950 font-bold uppercase tracking-wider">
                Peer Marketplace
              </span>
              <span className="text-xs text-blue-200">Verified Listing</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Post an Item for Sale or Swap</h3>
            <p className="text-xs text-slate-300">Listed instantly across {selectedCampus} verified network</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Item Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Calculus Stewart 9th Edition or Mini Fridge 0.9 cu ft"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900"
            />
          </div>

          {/* Category & Course Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 bg-white"
              >
                <option>Textbooks & Courseware</option>
                <option>Dorm & Furniture</option>
                <option>Electronics & Calculators</option>
                <option>Campus Gear & Merch</option>
                <option>Lab Equipment</option>
                <option>Subleases & Housing</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Course Code (Optional)</label>
              <input
                type="text"
                placeholder="e.g. BIO 1A, CS 61A, CHEM 3B"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900"
              />
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Selling Price ($) *</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="35"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Original / Retail Price ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="0"
                  placeholder="120"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 bg-white"
              >
                <option>Brand New</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Fair (Usable)</option>
              </select>
            </div>
          </div>

          {/* Condition Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Condition Highlight / Short Note</label>
            <input
              type="text"
              placeholder="e.g. Zero highlights, includes charger and cables"
              value={formData.conditionBadge}
              onChange={(e) => setFormData({ ...formData, conditionBadge: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900"
            />
          </div>

          {/* Designated Campus Meetup Spot */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Preferred Campus Meetup Hub</span>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> CCTV Monitored
              </span>
            </label>
            <select
              value={formData.meetupLocation}
              onChange={(e) => setFormData({ ...formData, meetupLocation: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-hidden text-slate-900 bg-white"
            >
              <option>Moffitt Library North Steps (24/7 Monitored)</option>
              <option>MLK Student Union Lobby (Staffed)</option>
              <option>UCPD Station Sproul Hall (Blue Light Zone)</option>
              <option>Unit 1 Putnam Hall / Courtyard</option>
              <option>Unit 2 Towle Hall Lounge</option>
              <option>Soda Hall CS Commons</option>
              <option>Latimer Hall Courtyard (Chemistry)</option>
            </select>
          </div>

          {/* Image URL preview */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Image Representation</label>
            <div className="flex items-center gap-3">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-16 h-16 rounded-lg object-cover border border-slate-300"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={imagePreview}
                  onChange={(e) => setImagePreview(e.target.value)}
                  placeholder="Paste image URL or use sample"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
                <div className="flex gap-2 mt-1">
                  <button 
                    type="button" 
                    onClick={() => setImagePreview("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80")}
                    className="text-[10px] text-blue-700 hover:underline"
                  >Book</button>
                  <button 
                    type="button" 
                    onClick={() => setImagePreview("https://images.unsplash.com/photo-1580481077195-c2901a6134b2?auto=format&fit=crop&w=600&q=80")}
                    className="text-[10px] text-blue-700 hover:underline"
                  >Chair</button>
                  <button 
                    type="button" 
                    onClick={() => setImagePreview("https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80")}
                    className="text-[10px] text-blue-700 hover:underline"
                  >Calculator</button>
                  <button 
                    type="button" 
                    onClick={() => setImagePreview("https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80")}
                    className="text-[10px] text-blue-700 hover:underline"
                  >Mini Fridge</button>
                </div>
              </div>
            </div>
          </div>

          {/* Escrow safety badge */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Campus Escrow & Hold Protected:</strong> Buyers deposit funds securely into escrow. You hand off the item inside an authorized campus safe hub, the buyer scans your in-app QR handshake code, and payment is released instantly.
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold shadow-md hover:shadow-lg transition-all"
            >
              Publish Listing Now
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
