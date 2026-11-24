import { useEffect, useMemo, useRef, useState } from 'react';
import { useCampus } from '../context/useCampus';
import { matchesCampus } from '../data/campuses';

const CapIcon = () => (
  <svg viewBox="0 0 24 24" className="shrink-0" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 10 12 5 2 10l10 5 10-5z" />
    <path d="M6 12v5c3 2 9 2 12 0v-5" />
  </svg>
);

const Chevron = ({ open }) => (
  <svg viewBox="0 0 24 24" width="12" height="12" className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function CampusSelector({ className = '' }) {
  const { campus, campuses, selectCampus, addCustomCampus } = useCampus();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = useMemo(() => campuses.filter((c) => matchesCampus(c, query)), [campuses, query]);

  const trimmed = query.trim();
  const canAddCustom =
    trimmed.length >= 2 &&
    !campuses.some((c) => c.name.toLowerCase() === trimmed.toLowerCase() || c.short.toLowerCase() === trimmed.toLowerCase());

  // Flat option list = campuses + optional "add" row. Used for keyboard navigation.
  const options = useMemo(
    () => [...results.map((c) => ({ type: 'campus', campus: c })), ...(canAddCustom ? [{ type: 'add' }] : [])],
    [results, canAddCustom]
  );

  const grouped = useMemo(() => {
    const map = new Map();
    results.forEach((c) => {
      if (!map.has(c.region)) map.set(c.region, []);
      map.get(c.region).push(c);
    });
    return [...map.entries()];
  }, [results]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const choose = (opt) => {
    if (!opt) return;
    if (opt.type === 'add') addCustomCampus(trimmed);
    else selectCampus(opt.campus.id);
    close();
  };

  // Click outside + Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, [open]);

  // Focus the search box when the menu opens (DOM-only, no setState).
  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  // Start the highlight on the current campus — done in the click handler, not an effect.
  const openMenu = () => {
    setActive(Math.max(0, campuses.findIndex((c) => c.id === campus.id)));
    setOpen(true);
  };

  const updateQuery = (value) => {
    setQuery(value);
    setActive(0);
  };

  // Keep the highlighted row visible.
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  };

  let flatIndex = -1;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => (open ? close() : openMenu())}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="campus-switcher"
      >
        <CapIcon />
        <span>{campus.label}</span>
        <Chevron open={open} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-50 w-[min(92vw,22rem)] rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2"
          onKeyDown={onKeyDown}
        >
          <div className="p-3 border-b border-slate-100">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-600 focus-within:bg-white">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                placeholder="Search campus, city or state…"
                aria-label="Search campuses"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              {query && (
                <button type="button" onClick={() => updateQuery('')} aria-label="Clear search" className="text-slate-400 hover:text-slate-700 text-base leading-none">
                  ×
                </button>
              )}
            </label>
            <p className="mt-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {results.length} {results.length === 1 ? 'campus' : 'campuses'} · each has its own listings, hubs &amp; boards
            </p>
          </div>

          <ul ref={listRef} role="listbox" aria-label="Campuses" className="max-h-72 overflow-y-auto py-1">
            {grouped.map(([region, items]) => (
              <li key={region} role="presentation">
                <div className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{region}</div>
                <ul role="presentation">
                  {items.map((c) => {
                    flatIndex += 1;
                    const idx = flatIndex;
                    const selected = c.id === campus.id;
                    return (
                      <li
                        key={c.id}
                        data-idx={idx}
                        role="option"
                        aria-selected={selected}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => choose({ type: 'campus', campus: c })}
                        className={`mx-1 flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 ${
                          idx === active ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="min-w-0">
                          <div className={`truncate text-sm ${selected ? 'font-bold text-blue-800' : 'font-semibold text-slate-800'}`}>{c.name}</div>
                          <div className="truncate text-[11px] text-slate-500">
                            {c.city} · @{c.domain}
                          </div>
                        </div>
                        {selected && (
                          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m5 12 5 5 9-10" />
                          </svg>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}

            {results.length === 0 && (
              <li role="presentation" className="px-4 py-6 text-center text-sm text-slate-500">
                No campus matches “{trimmed}”.
              </li>
            )}

            {canAddCustom && (() => {
              flatIndex += 1;
              const idx = flatIndex;
              return (
                <li
                  data-idx={idx}
                  role="option"
                  aria-selected={false}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => choose({ type: 'add' })}
                  className={`mx-1 mt-1 mb-1 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-blue-300 px-3 py-2 text-sm font-semibold text-blue-800 ${
                    idx === active ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="text-lg leading-none">＋</span>
                  <span className="truncate">Use “{trimmed}” as my campus</span>
                </li>
              );
            })()}
          </ul>
        </div>
      )}
    </div>
  );
}