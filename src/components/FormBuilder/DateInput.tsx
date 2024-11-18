import React, { useRef, useState, useEffect } from 'react';
import { format as formatDate } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Calendar } from 'lucide-react';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  format?: string;
  errorMessage?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  error = false,
  format = 'dd/MM/yyyy',
  errorMessage = 'Invalid date',
}) => {
  // Unique reference for the calendar container
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (showCalendar) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showCalendar]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = formatDate(date, format);
      onChange(formattedDate);
    }
    setShowCalendar(false); // Close the calendar after selecting a date
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      setShowCalendar(false);
    }
  };

  return (
    <div className="date-input-wrapper relative">
      {/* Display formatted date and Calendar icon */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <Calendar className="text-gray-500" size={18} />
        <span className="ml-2">{value || 'Select a date'}</span>
      </div>

      {/* Calendar Popup */}
      {showCalendar && (
        <div
          ref={(ref) => (calendarRef.current = ref)}
          className="absolute z-10 mt-2 bg-white border rounded-md shadow-lg p-4"
        >
          <DayPicker
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={handleDateSelect}
          />
        </div>
      )}

      {/* Error Message */}
      {error && <div className="mt-1 text-sm text-red-600">{errorMessage}</div>}
    </div>
  );
};
