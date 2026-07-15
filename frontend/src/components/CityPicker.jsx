import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Exchange, Loader2, Plus, Search, X } from './icons.jsx';
import { searchCities } from '../api/cities.js';

const MAX_CITIES = 4;

function CitySlot({
  slot, city, isOpen, selected,
  onOpen, onClose, onSelect, onRemove,
  query, onQueryChange, loading, results,
  searchInputRef,
}) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const label = city ? `${city.city}, ${city.country}` : 'Select City';

  // Reset highlight when results change
  useEffect(() => { setHighlightedIndex(-1); }, [results]);

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    const maxIndex = Math.min(results.length, 8) - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex <= maxIndex) {
          onSelect(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  };

  return (
    <div className="city-picker-slot">
      <button
        type="button"
        onClick={() => isOpen ? onClose() : onOpen(slot)}
        className={`city-picker-trigger ${city ? 'is-selected' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={city ? `Change ${city.city}` : `Select city ${slot + 1}`}
      >
        <span className="min-w-0 text-left">
          <span className="block truncate font-semibold">{city?.city ?? label}</span>
          {city && <span className="block truncate text-xs text-surface-600 mt-0.5">{city.country}</span>}
        </span>
        <span className="shrink-0 flex items-center gap-1.5">
          {city && (
            <span
              onClick={(event) => { event.stopPropagation(); onRemove(slot); }}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.stopPropagation(); onRemove(slot); } }}
              role="button"
              tabIndex={0}
              className="city-picker-remove"
              aria-label={`Remove ${city.city}`}
            >
              <X size={14} />
            </span>
          )}
          {isOpen ? <ArrowUp size={17} /> : <ArrowDown size={17} />}
        </span>
      </button>

      {isOpen && (
        <div className="city-picker-menu glass" role="dialog" aria-label={`Search for city ${slot + 1}`}>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-600 pointer-events-none" />
            <input
              ref={searchInputRef}
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={handleKeyDown}
              className="city-picker-search"
              placeholder="Search for a city"
              aria-label="Search cities"
              aria-activedescendant={highlightedIndex >= 0 ? `city-option-${slot}-${highlightedIndex}` : undefined}
              autoComplete="off"
            />
            {loading && <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-400 animate-spin" />}
          </div>
          {query.trim() && !loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-surface-600">No cities found for &ldquo;{query}&rdquo;</p>
          )}
          {results.length > 0 && (
            <ul className="max-h-52 overflow-y-auto py-1" role="listbox">
              {results.slice(0, 8).map((result, idx) => (
                <li key={result._id}>
                  <button
                    id={`city-option-${slot}-${idx}`}
                    type="button"
                    onClick={() => onSelect(result)}
                    className={`city-picker-option ${idx === highlightedIndex ? 'city-picker-option-highlighted' : ''}`}
                    role="option"
                    aria-selected={idx === highlightedIndex}
                  >
                    <span>
                      <span className="font-semibold">{result.city}</span>
                      <span className="text-surface-600 ml-2">{result.country}</span>
                    </span>
                    <Plus size={16} className="text-brand-400" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

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

  const openSlot = useCallback((slot) => {
    setActiveSlot(slot);
    setQuery('');
    setResults([]);
  }, []);

  const selectCity = useCallback((city) => {
    const next = [...selected];
    if (activeSlot < next.length) next[activeSlot] = city;
    else next.push(city);
    onChange(next);
    setActiveSlot(null);
    setQuery('');
  }, [selected, activeSlot, onChange]);

  const removeCity = useCallback((index) => {
    onChange(selected.filter((_, cityIndex) => cityIndex !== index));
    setActiveSlot(null);
  }, [selected, onChange]);

  const swapCities = useCallback(() => {
    if (selected.length < 2) return;
    const next = [...selected];
    [next[0], next[1]] = [next[1], next[0]];
    onChange(next);
  }, [selected, onChange]);

  const handleQueryChange = useCallback((value) => {
    setQuery(value);
  }, []);

  const handleClose = useCallback(() => {
    setActiveSlot(null);
  }, []);

  const extraSlotCount = selected.length > 2
    ? selected.length + (activeSlot === selected.length && selected.length < MAX_CITIES ? 1 : 0)
    : 2;

  return (
    <div ref={pickerRef} className="w-full">
      <div className="city-picker-row">
        <CitySlot
          slot={0} city={selected[0]} isOpen={activeSlot === 0} selected={selected}
          onOpen={openSlot} onClose={handleClose} onSelect={selectCity} onRemove={removeCity}
          query={query} onQueryChange={handleQueryChange} loading={loading} results={results}
          searchInputRef={searchInputRef}
        />
        <button type="button" onClick={swapCities} disabled={selected.length < 2} className="city-swap-button" aria-label="Swap the first two cities" title="Swap cities">
          <Exchange size={20} />
        </button>
        <CitySlot
          slot={1} city={selected[1]} isOpen={activeSlot === 1} selected={selected}
          onOpen={openSlot} onClose={handleClose} onSelect={selectCity} onRemove={removeCity}
          query={query} onQueryChange={handleQueryChange} loading={loading} results={results}
          searchInputRef={searchInputRef}
        />
      </div>

      {selected.length >= 2 && selected.length < MAX_CITIES && (
        <div className="flex justify-center mt-3">
          <button type="button" onClick={() => openSlot(selected.length)} className="city-picker-add"><Plus size={15} /> Add another city</button>
        </div>
      )}

      {selected.length > 2 && (
        <div className="city-picker-extra-row">
          {Array.from({ length: extraSlotCount - 2 }, (_, index) => (
            <CitySlot
              key={index + 2}
              slot={index + 2} city={selected[index + 2]} isOpen={activeSlot === index + 2} selected={selected}
              onOpen={openSlot} onClose={handleClose} onSelect={selectCity} onRemove={removeCity}
              query={query} onQueryChange={handleQueryChange} loading={loading} results={results}
              searchInputRef={searchInputRef}
            />
          ))}
        </div>
      )}

      {selected.length < 2 && <p className="text-xs text-surface-600 mt-3 text-center">Select two cities to start comparing.</p>}
    </div>
  );
}
