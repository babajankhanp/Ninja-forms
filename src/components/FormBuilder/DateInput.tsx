import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  format?: 'DD/MM/YYYY' | 'MM-DD-YYYY' | 'YYYY-MM-DD';
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  error,
  format = 'YYYY-MM-DD'
}) => {
  const [showFormat, setShowFormat] = useState(false);

  const formatDate = (date: string, fromFormat: string, toFormat: string): string => {
    if (!date) return '';

    const parts = date.split(/[-/]/);
    if (parts.length !== 3) return date;

    let year, month, day;
    
    switch (fromFormat) {
      case 'DD/MM/YYYY':
        [day, month, year] = parts;
        break;
      case 'MM-DD-YYYY':
        [month, day, year] = parts;
        break;
      default: // YYYY-MM-DD
        [year, month, day] = parts;
    }

    switch (toFormat) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM-DD-YYYY':
        return `${month}-${day}-${year}`;
      default:
        return `${year}-${month}-${day}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(formatDate(newValue, 'YYYY-MM-DD', format));
  };

  return (
    <div className="date-input-wrapper">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--input-placeholder))]" size={18} />
        <input
          type="date"
          value={formatDate(value, format, 'YYYY-MM-DD')}
          onChange={handleChange}
          className={`form-input pl-10 ${error ? 'error' : ''}`}
          onFocus={() => setShowFormat(true)}
          onBlur={() => setShowFormat(false)}
        />
        {showFormat && (
          <div className="date-format-select">
            Format: {format}
          </div>
        )}
      </div>
    </div>
  );
};