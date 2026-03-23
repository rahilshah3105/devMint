import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './CustomSelect.css';

export default function CustomSelect({ options, value, onChange, disabled, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const ref = useRef(null);
  const optionRefs = useRef([]);
  const dropdownIdRef = useRef(`custom-select-${Math.random().toString(36).slice(2, 10)}`);

  const selectedOption = options.find(opt => opt.value === value) || options[0];
  const selectedIndex = options.findIndex(opt => opt.value === value);

  const closeMenu = () => setIsOpen(false);

  const openMenu = () => {
    const defaultIndex = selectedIndex >= 0 ? selectedIndex : 0;
    setHighlightedIndex(defaultIndex);
    setIsOpen(true);
  };

  const selectOption = (option) => {
    onChange({ target: { value: option.value } });
    closeMenu();
  };

  const handleKeyDown = (event) => {
    if (disabled || options.length === 0) return;

    const maxIndex = options.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          openMenu();
        } else {
          setHighlightedIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          openMenu();
        } else {
          setHighlightedIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
        }
        break;
      case 'Home':
        if (!isOpen) return;
        event.preventDefault();
        setHighlightedIndex(0);
        break;
      case 'End':
        if (!isOpen) return;
        event.preventDefault();
        setHighlightedIndex(maxIndex);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) {
          openMenu();
        } else {
          selectOption(options[highlightedIndex] || selectedOption || options[0]);
        }
        break;
      case 'Escape':
        if (!isOpen) return;
        event.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        if (isOpen) closeMenu();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const activeOption = optionRefs.current[highlightedIndex];
    if (activeOption && typeof activeOption.scrollIntoView === 'function') {
      activeOption.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [selectedIndex, isOpen]);

  return (
    <div className={`custom-select-container ${className}`} ref={ref}>
      <button
        type="button"
        className="custom-select-button"
        onClick={() => !disabled && (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={dropdownIdRef.current}
      >
        <span className="custom-select-label">{selectedOption?.label}</span>
        <ChevronDown size={14} className={`custom-select-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="custom-select-dropdown custom-scrollbar" id={dropdownIdRef.current} role="listbox">
          {options.map((opt, index) => (
            <div
              key={opt.value}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              role="option"
              aria-selected={value === opt.value}
              className={`custom-select-option ${value === opt.value ? 'selected' : ''} ${highlightedIndex === index ? 'highlighted' : ''}`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => {
                selectOption(opt);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
