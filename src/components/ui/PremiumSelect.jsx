import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { HiOutlineChevronDown, HiOutlineCheck } from "react-icons/hi";

/**
 * Premium dropdown — presentation-only custom select.
 * Keyboard: ArrowUp/Down, Enter, Escape, Home/End
 */
const PremiumSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  label,
  disabled = false,
  searchable = false,
  groups,
  className = "",
  id: idProp,
}) => {
  const autoId = useId();
  const id = idProp || autoId;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef(null);
  const listRef = useRef(null);

  const flatOptions = useMemo(() => {
    if (groups?.length) {
      return groups.flatMap((g) => g.options.map((o) => ({ ...o, group: g.label })));
    }
    return options;
  }, [options, groups]);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return flatOptions;
    const q = query.toLowerCase();
    return flatOptions.filter((o) => o.label.toLowerCase().includes(q));
  }, [flatOptions, query, searchable]);

  const selected = flatOptions.find((o) => o.value === value);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, close]);

  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector("[data-highlight='true']");
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlight, open]);

  const pick = (opt) => {
    onChange?.(opt.value);
    close();
  };

  const onKeyDown = (e) => {
    if (disabled) return;
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[highlight]) {
      e.preventDefault();
      pick(filtered[highlight]);
    } else if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHighlight(Math.max(filtered.length - 1, 0));
    }
  };

  let lastGroup = null;

  return (
    <div className={`premium-select ${className}`} ref={rootRef}>
      {label && (
        <label htmlFor={id} className="premium-select__label">
          {label}
        </label>
      )}
      <button
        type="button"
        id={id}
        className={`premium-select__trigger ${open ? "is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        <span className={selected ? "" : "premium-select__placeholder"}>
          {selected?.label || placeholder}
        </span>
        <HiOutlineChevronDown size={16} className={`premium-select__chevron ${open ? "is-open" : ""}`} />
      </button>

      {open && (
        <div className="premium-select__menu" role="listbox">
          {searchable && (
            <div className="premium-select__search-wrap">
              <input
                type="text"
                className="premium-select__search"
                placeholder="Search…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlight(0);
                }}
                onKeyDown={onKeyDown}
                autoFocus
              />
            </div>
          )}
          <div className="premium-select__list yebone-premium-scroll" ref={listRef}>
            {filtered.length === 0 ? (
              <p className="premium-select__empty">No options found</p>
            ) : (
              filtered.map((opt, idx) => {
                const showHeader = opt.group && opt.group !== lastGroup;
                if (showHeader) lastGroup = opt.group;
                return (
                  <React.Fragment key={opt.value}>
                    {showHeader && (
                      <div className="premium-select__group" role="presentation">
                        {opt.group}
                      </div>
                    )}
                    <button
                      type="button"
                      role="option"
                      aria-selected={value === opt.value}
                      data-highlight={idx === highlight ? "true" : undefined}
                      className={`premium-select__option ${value === opt.value ? "is-selected" : ""} ${idx === highlight ? "is-highlighted" : ""}`}
                      onMouseEnter={() => setHighlight(idx)}
                      onClick={() => pick(opt)}
                    >
                      {opt.icon && <span className="premium-select__option-icon">{opt.icon}</span>}
                      <span className="premium-select__option-label">{opt.label}</span>
                      {value === opt.value && <HiOutlineCheck size={16} className="premium-select__check" />}
                    </button>
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumSelect;
