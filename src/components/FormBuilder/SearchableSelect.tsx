import React, { useState, useRef, useEffect } from 'react';
import { SelectOption } from '../../types/form';
import { Search, ChevronDown, X } from 'lucide-react';

interface SearchableSelectProps {
  options: SelectOption[];
  value: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
  placeholder?: string;
  error?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options = [],
  value = '',
  onChange,
  multiple = false,
  placeholder = 'Select...',
  error = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLabels = multiple
    ? options.filter(opt => (value as string[])?.includes(opt.value)).map(opt => opt.label)
    : options.find(opt => opt.value === value)?.label;

  const removeValue = (valueToRemove: string) => {
    const newValue = (value as string[]).filter(v => v !== valueToRemove);
    onChange(newValue);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`form-select cursor-pointer ${error ? 'error' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {multiple ? (
            selectedLabels?.length > 0 ? (
              selectedLabels.map((label, index) => (
                <span key={label} className="multi-select-tag">
                  {label}
                  <X
                    size={14}
                    className="multi-select-remove cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeValue(options.find(opt => opt.label === label)?.value || '');
                    }}
                  />
                </span>
              ))
            ) : (
              <span className="text-[rgb(var(--input-placeholder))]">{placeholder}</span>
            )
          ) : (
            <span className={selectedLabels ? 'text-[rgb(var(--input-text))]' : 'text-[rgb(var(--input-placeholder))]'}>
              {selectedLabels || placeholder}
            </span>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 rounded-lg border shadow-lg bg-[rgb(var(--input-bg))] border-[rgb(var(--input-border))]">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--input-placeholder))]" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="form-input pl-10"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-2 cursor-pointer transition-colors duration-200 ${
                  multiple
                    ? (value as string[])?.includes(option.value)
                      ? 'bg-[rgb(var(--color-primary))] bg-opacity-10'
                      : 'hover:bg-[rgb(var(--input-bg-hover))]'
                    : value === option.value
                      ? 'bg-[rgb(var(--color-primary))] bg-opacity-10'
                      : 'hover:bg-[rgb(var(--input-bg-hover))]'
                }`}
                onClick={() => {
                  if (multiple) {
                    const newValue = Array.isArray(value) ? value : [];
                    const updated = newValue.includes(option.value)
                      ? newValue.filter(v => v !== option.value)
                      : [...newValue, option.value];
                    onChange(updated);
                  } else {
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};