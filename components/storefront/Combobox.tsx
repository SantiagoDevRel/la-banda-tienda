"use client";

// Reusable combobox / autocomplete for department + city selection.
// Filters options as the user types (case + accent insensitive).
// No external dependencies — built with basic React.

import { useEffect, useId, useRef, useState } from "react";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

interface ComboboxProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export function Combobox({
  label,
  value,
  onChange,
  options,
  placeholder = "Buscar…",
  disabled = false,
  error,
  required = false,
}: ComboboxProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Sync inputValue when controlled value changes from outside
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const filtered = options.filter((opt) =>
    normalize(opt).includes(normalize(inputValue)),
  );

  function selectOption(opt: string) {
    setInputValue(opt);
    onChange(opt);
    setOpen(false);
    setActiveIdx(-1);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setInputValue(v);
    // If the user cleared the selection, notify parent
    if (v === "") onChange("");
    setOpen(true);
    setActiveIdx(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        return;
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && filtered[activeIdx]) {
        selectOption(filtered[activeIdx]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx < 0 || !listRef.current) return;
    const el = listRef.current.children[activeIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveIdx(-1);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <label htmlFor={id} className="lds-label">
        {label}
        {required && <span style={{ color: "#f87171" }}> *</span>}
      </label>
      <input
        ref={inputRef}
        id={id}
        className="lds-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (!disabled) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-invalid={!!error}
        role="combobox"
        style={
          disabled
            ? { opacity: 0.5, cursor: "not-allowed" }
            : undefined
        }
      />
      {error && <div className="lds-error">{error}</div>}

      {open && !disabled && filtered.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% - (var(--error-height, 0px)))",
            left: 0,
            right: 0,
            zIndex: 50,
            background: "rgba(10, 13, 11, 0.92)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-md)",
            marginTop: error ? 0 : 4,
            maxHeight: 240,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "4px 0",
            listStyle: "none",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          {filtered.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              onPointerDown={(e) => {
                e.preventDefault(); // Prevent blur before mouseup
                selectOption(opt);
              }}
              style={{
                padding: "11px 14px",
                fontSize: 14,
                cursor: "pointer",
                color: opt === value ? "var(--accent-ink)" : "var(--ink)",
                fontWeight: opt === value ? 600 : 400,
                background:
                  i === activeIdx
                    ? "rgba(46, 161, 92, 0.15)"
                    : opt === value
                      ? "rgba(46, 161, 92, 0.08)"
                      : "transparent",
                minHeight: 40,
                display: "flex",
                alignItems: "center",
                transition: "background 0.08s",
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
