"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar anúncios…",
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync from external (e.g. clearFilters)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  }

  function handleClear() {
    setLocalValue("");
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div className="relative flex items-center w-full group">
      {/* Search icon */}
      <div className="absolute left-4 pointer-events-none text-[var(--muted)] group-focus-within:text-[var(--primary)] transition-colors duration-200">
        <Search size={20} strokeWidth={2} />
      </div>

      <input
        ref={inputRef}
        id="search-input"
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        className="
          w-full h-14 pl-12 pr-12
          bg-white border-2 border-[var(--border)]
          rounded-2xl text-[var(--foreground)] text-base font-medium
          placeholder:text-[var(--muted)] placeholder:font-normal
          focus:outline-none focus:border-[var(--primary)]
          transition-all duration-200
          shadow-sm
        "
        style={{
          /* Remove browser default search input X button */
        }}
      />

      {/* Clear button */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpar busca"
          className="
            absolute right-4 flex items-center justify-center
            w-7 h-7 rounded-full
            text-[var(--muted)] hover:text-[var(--foreground)]
            hover:bg-[var(--muted-bg)]
            transition-all duration-150
          "
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
