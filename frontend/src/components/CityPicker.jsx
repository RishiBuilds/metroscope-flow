import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Exchange, Loader2, Plus, Search, X } from './icons.jsx';
import { searchCities } from '../api/cities.js';

const MAX_CITIES = 4;

export default function CityPicker({ selected, onChange }) {
  const [activeSlot, setActiveSlot] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const pickerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (activeSlot === null || !query.trim()) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await searchCities(query);
        if (!cancelled) {
          setResults((response.data.data ?? []).filter((city) => !selected.some((item) => item._id === city._id)));
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [activeSlot, query, selected]);

  useEffect(() => {
    const closePicker = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) setActiveSlot(null);
    };
    document.addEventListener('mousedown', closePicker);
    return () => document.removeEventListener('mousedown', closePicker);
  }, []);

  useEffect(() => {
    if (activeSlot !== null) searchInputRef.current?.focus();
  }, [activeSlot]);

  const openSlot = (slot) => {
    setActiveSlot(slot);
    setQuery('');
    setResults([]);
  };

  const selectCity = (city) => {
    const next = [...selected];
    if (activeSlot < next.length) next[activeSlot] = city;
    else next.push(city);
    onChange(next);
    setActiveSlot(null);
    setQuery('');
  };

  const removeCity = (index) => {
    onChange(selected.filter((_, cityIndex) => cityIndex !== index));
    setActiveSlot(null);
  };

  const swapCities = () => {
    if (selected.length < 2) return;
    const next = [...selected];
    [next[0], next[1]] = [next[1], next[0]];
    onChange(next);
  };

  const renderSlot = (slot) => {
    const city = selected[slot];
    const open = activeSlot === slot;
    const label = city ? `${city.city}, ${city.country}` : 'Select City';

    return <div className="city-picker-slot" key={slot}>
      <button
        type="button"
        onClick={() => open ? setActiveSlot(null) : openSlot(slot)}
        className={`city-picker-trigger ${city ? 'is-selected' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={city ? `Change ${city.city}` : `Select city ${slot + 1}`}
      >
        <span className="min-w-0 text-left">
          <span className="block truncate font-semibold">{city?.city ?? label}</span>
          {city && <span className="block truncate text-xs text-surface-600 mt-0.5">{city.country}</span>}
        </span>
        <span className="shrink-0 flex items-center gap-1.5">
          {city && <span onClick={(event) => { event.stopPropagation(); removeCity(slot); }} role="button" tabIndex={0} className="city-picker-remove" aria-label={`Remove ${city.city}`}><X size={14} /></span>}
          {open ? <ArrowUp size={17} /> : <ArrowDown size={17} />}
        </span>
      </button>

      {open && <div className="city-picker-menu glass" role="dialog" aria-label={`Search for city ${slot + 1}`}>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-600 pointer-events-none" />
          <input
            ref={searchInputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="city-picker-search"
            placeholder="Search for a city"
            aria-label="Search cities"
            autoComplete="off"
          />
          {loading && <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-400 animate-spin" />}
        </div>
        {query.trim() && !loading && results.length === 0 && <p className="px-4 py-3 text-sm text-surface-600">No cities found for “{query}”</p>}
        {results.length > 0 && <ul className="max-h-52 overflow-y-auto py-1" role="listbox">
          {results.slice(0, 8).map((result) => <li key={result._id}>
            <button type="button" onClick={() => selectCity(result)} className="city-picker-option" role="option">
              <span><span className="font-semibold">{result.city}</span><span className="text-surface-600 ml-2">{result.country}</span></span>
              <Plus size={16} className="text-brand-400" />
            </button>
          </li>)}
        </ul>}
      </div>}
    </div>;
  };

  const extraSlotCount = selected.length > 2
    ? selected.length + (activeSlot === selected.length && selected.length < MAX_CITIES ? 1 : 0)
    : 2;

  return <div ref={pickerRef} className="w-full">
    <div className="city-picker-row">
      {renderSlot(0)}
      <button type="button" onClick={swapCities} disabled={selected.length < 2} className="city-swap-button" aria-label="Swap the first two cities" title="Swap cities">
        <Exchange size={20} />
      </button>
      {renderSlot(1)}
    </div>

    {selected.length >= 2 && selected.length < MAX_CITIES && <div className="flex justify-center mt-3">
      <button type="button" onClick={() => openSlot(selected.length)} className="city-picker-add"><Plus size={15} /> Add another city</button>
    </div>}

    {selected.length > 2 && <div className="city-picker-extra-row">
      {Array.from({ length: extraSlotCount - 2 }, (_, index) => renderSlot(index + 2))}
    </div>}

    {selected.length < 2 && <p className="text-xs text-surface-600 mt-3 text-center">Select two cities to start comparing.</p>}
  </div>;
}
