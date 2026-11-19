import React, { useState } from 'react';
import { X, Send, ShieldCheck, MapPin, QrCode, Lock, CheckCircle2 } from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';

export default function ChatDrawer({ isOpen, onClose, targetItem, onTriggerEscrow }) {
  const [messages, setMessages] = useState([
    {
      sender: 'them',
      text: "Hi Alex! Thanks for reaching out. Yes, the item is available and in great shape.",
      time: '10:14 AM',
    },
    {
      sender: 'them',
      text: "Are you free to meet near Moffitt Library turnstiles around 2:30 PM today?",
      time: '10:15 AM',
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  if (!isOpen || !targetItem) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg = {
      sender: 'me',
      text: inputValue.trim(),
      time: 'Just now',
    };

    setMessages([...messages, newMsg]);
    setInputValue('');

    // Simulated reply after 1s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'them',
          text: "Sounds great! I'll bring the item in a protective sleeve. See you at the safe zone!",
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={targetItem.seller?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"} 
                alt="Seller" 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">{targetItem.seller?.name || "Student Seller"}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-semibold">
                  .edu Verified
                </span>
              </div>
              <span className="text-[11px] text-slate-300">{targetItem.seller?.role || "Campus Student"}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item mini reference bar */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <img 
              src={targetItem.image} 
              alt={targetItem.title} 
              className="w-10 h-10 rounded-md object-cover border border-slate-300 shrink-0"
            />
            <div className="truncate">
              <div className="font-bold text-slate-900 truncate">{targetItem.title}</div>
              <div className="text-slate-500 text-[11px]">${targetItem.price} • {targetItem.meetupLocation}</div>
            </div>
          </div>
          <button 
            onClick={() => onTriggerEscrow(targetItem)}
            className="shrink-0 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-xs"
          >
            <Lock className="w-3 h-3" />
            <span>Escrow Hold</span>
          </button>
        </div>

        {/* Campus Safety Banner */}
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2 text-blue-900 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
          <span>Always meet inside CCTV designated hubs (e.g. Moffitt 1st Floor).</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
                  m.sender === 'me'
                    ? 'bg-blue-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Chat input form */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message to peer..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
          />
          <button
            type="submit"
            className="p-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
