import React, { useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { Calendar } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface DatePickerButtonProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  viewType: 'month' | 'week' | '3day' | 'day';
}

const DatePickerButton: React.FC<DatePickerButtonProps> = ({
  selectedDate,
  onDateSelect,
  viewType
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date);
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    switch (viewType) {
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      case 'week':
        return `Week of ${format(selectedDate, 'MMM d, yyyy')}`;
      case '3day':
        return format(selectedDate, 'MMM d, yyyy');
      case 'day':
        return format(selectedDate, 'EEEE, MMMM d');
      default:
        return format(selectedDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      >
        <Calendar className="w-5 h-5" />
        <span className="font-medium">{getDisplayText()}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 z-30 mt-2 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              className="p-3"
              classNames={{
                months: "flex flex-col",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium text-gray-900",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gray-500 rounded-md w-8 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm relative p-0 rounded-md hover:bg-gray-100 focus-within:relative focus-within:z-20",
                day: "h-8 w-8 p-0 font-normal",
                day_selected: "bg-primary text-white hover:bg-primary focus:bg-primary focus:text-white",
                day_today: "bg-gray-100",
                day_outside: "text-gray-300",
                day_disabled: "text-gray-300",
                day_hidden: "invisible"
              }}
              styles={{
                caption: { position: 'relative' }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DatePickerButton;