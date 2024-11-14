import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { useDataMode } from '../../context/DataModeContext';

interface MiniCalendarProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ currentMonth, onMonthChange }) => {
  const navigate = useNavigate();
  const { mockEvents, mockTasks } = useDataMode();

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const hasEventsOnDate = (date: Date) => {
    const hasEvent = mockEvents.some(event => 
      isSameDay(parseISO(event.start.dateTime), date)
    );

    const hasTask = mockTasks.some(task =>
      isSameDay(new Date(task.dueDate), date)
    );

    return hasEvent || hasTask;
  };

  const getDateContent = (date: Date) => {
    const hasEvents = hasEventsOnDate(date);
    const isCurrentMonth = isSameMonth(date, currentMonth);
    const isCurrentDay = isToday(date);

    return (
      <button
        onClick={() => navigate(`/planner?date=${format(date, 'yyyy-MM-dd')}`)}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm relative
          ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
          ${isCurrentDay ? 'bg-primary text-white' : ''}
          ${hasEvents && !isCurrentDay ? 'font-medium' : ''}
          hover:bg-gray-100 transition-colors duration-200
        `}
      >
        {format(date, 'd')}
        {hasEvents && !isCurrentDay && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>
        )}
      </button>
    );
  };

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onMonthChange(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMonthChange(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
        {days.map(day => (
          <div key={day.toISOString()} className="flex items-center justify-center">
            {getDateContent(day)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;