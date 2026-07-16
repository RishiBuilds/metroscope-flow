import { useCurrency } from '../context/CurrencyContext.jsx';

export default function CurrencyToggle({ className = '' }) {
  const { currency, setCurrency, symbols } = useCurrency();

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <label htmlFor="currency-select" className="sr-only">
        Select Currency
      </label>
      <div className="relative flex items-center">
        <select
          id="currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="input-base text-xs font-bold py-1.5 pl-2.5 pr-8 bg-surface-800 border-surface-700/60 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400 cursor-pointer appearance-none"
          title="Approximate rates, for reference only"
        >
          {Object.keys(symbols).map((curr) => (
            <option key={curr} value={curr}>
              {curr} ({symbols[curr]})
            </option>
          ))}
        </select>
        <span className="absolute right-2.5 pointer-events-none text-surface-500 text-[10px]">▼</span>
      </div>
    </div>
  );
}
