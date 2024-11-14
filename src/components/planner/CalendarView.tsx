import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import ViewSelector from './ViewSelector';
import DatePickerButton from './DatePickerButton';
import CurrentTimeIndicator from './CurrentTimeIndicator';
import DayLightbox from './DayLightbox';
import TaskModal from './TaskModal';
import { useDataMode } from '../../context/DataModeContext';
import { format, addDays, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval, isSameDay, parseISO, differenceInMinutes, isToday } from 'date-fns';

type ViewType = 'month' | 'week' | '3day' | 'day';

interface EventPosition {
  top: number;
  height: number;
  left: string;
  width: string;
}

const CalendarView = () => {
  const [viewType, setViewType] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedModalDate, setSelectedModalDate] = useState<Date | null>(null);
  const { mockEvents } = useDataMode();

  const handlePrevious = () => {
    switch (viewType) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addDays(currentDate, -7));
        break;
      case '3day':
        setCurrentDate(addDays(currentDate, -3));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, -1));
        break;
    }
  };

  const handleNext = () => {
    switch (viewType) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addDays(currentDate, 7));
        break;
      case '3day':
        setCurrentDate(addDays(currentDate, 3));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const handleAddClick = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedModalDate(date);
    setShowTaskModal(true);
  };

  const getDaysToShow = () => {
    switch (viewType) {
      case 'month':
        const start = startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
        const end = endOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
        return eachDayOfInterval({ start, end });
      case 'week':
        return eachDayOfInterval({
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate)
        });
      case '3day':
        return [currentDate, addDays(currentDate, 1), addDays(currentDate, 2)];
      case 'day':
        return [currentDate];
      default:
        return [];
    }
  };

  const calculateEventPosition = (event: any, columnWidth: number): EventPosition => {
    const startTime = parseISO(event.start.dateTime);
    const endTime = parseISO(event.end.dateTime);
    
    // Calculate position from top (each hour is 60px)
    const minutesSinceMidnight = startTime.getHours() * 60 + startTime.getMinutes();
    const top = (minutesSinceMidnight / 60) * 60;
    
    // Calculate height based on duration
    const durationInMinutes = differenceInMinutes(endTime, startTime);
    const height = (durationInMinutes / 60) * 60;
    
    // For now, use full width of column minus padding
    return {
      top,
      height,
      left: '4px',
      width: `calc(${columnWidth}% - 8px)`
    };
  };

  const renderTimeGrid = () => {
    if (viewType === 'month') return null;

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = getDaysToShow();
    const columnWidth = 100 / days.length;

    return (
      <div className="flex-1 overflow-auto">
        <div className="relative grid" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)`, minHeight: "1440px" }}>
          {/* Time Column */}
          <div className="sticky left-0 bg-white border-r border-gray-200 z-10">
            {hours.map(hour => (
              <div key={hour} className="h-[60px] border-b border-gray-100 text-xs text-gray-500 pr-2 text-right relative">
                <span className="absolute right-2 -top-2">
                  {format(new Date().setHours(hour), 'h a')}
                </span>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {days.map((day, columnIndex) => (
            <div key={day.toISOString()} className="relative border-r border-gray-200">
              {/* Background Grid */}
              {hours.map(hour => (
                <div 
                  key={hour} 
                  className={`h-[60px] border-b ${
                    hour === 0 ? 'border-t' : ''
                  } border-gray-200 ${
                    hour >= 9 && hour <= 17 ? 'bg-gray-50/50' : ''
                  }`} 
                />
              ))}

              {/* Events */}
              {mockEvents
                .filter(event => isSameDay(parseISO(event.start.dateTime), day))
                .map(event => {
                  const position = calculateEventPosition(event, columnWidth);
                  return (
                    <div
                      key={event.id}
                      className="absolute left-0 right-0 bg-primary/10 text-primary rounded-md px-2 py-1 text-xs overflow-hidden hover:bg-primary/20 transition-colors duration-200 cursor-pointer"
                      style={{
                        top: `${position.top}px`,
                        height: `${position.height}px`,
                        left: position.left,
                        width: position.width
                      }}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className="font-medium truncate">{event.summary}</div>
                      <div className="text-xs opacity-75">
                        {format(parseISO(event.start.dateTime), 'h:mm a')}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}

          {/* Current Time Indicator */}
          {viewType !== 'month' && (
            <CurrentTimeIndicator 
              viewType={viewType} 
              columnCount={days.length}
            />
          )}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    if (viewType !== 'month') return null;

    const days = getDaysToShow();
    const today = new Date();

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map(date => {
          const isCurrentDay = isToday(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();

          const dayEvents = mockEvents.filter(event => 
            isSameDay(parseISO(event.start.dateTime), date)
          );

          return (
            <div
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`min-h-[120px] bg-white p-2 cursor-pointer hover:bg-gray-50 ${
                !isCurrentMonth ? 'opacity-50' : ''
              } ${isCurrentDay ? 'bg-blue-50' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isCurrentDay ? 'font-bold text-blue-600' : ''}`}>
                  {date.getDate()}
                </span>
                <button
                  onClick={(e) => handleAddClick(date, e)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded bg-primary/10 text-primary truncate hover:bg-primary/20 transition-colors duration-200"
                    title={event.summary}
                  >
                    {format(parseISO(event.start.dateTime), 'h:mm a')} {event.summary}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white z-20 border-b">
        {/* Navigation Controls */}
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <DatePickerButton
                selectedDate={currentDate}
                onDateSelect={setCurrentDate}
                viewType={viewType}
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <ViewSelector value={viewType} onChange={setViewType} />
          </div>
        </div>

        {/* Day Names Header for non-month views */}
        {viewType !== 'month' && (
          <div className="grid border-t" style={{ 
            gridTemplateColumns: `80px repeat(${
              viewType === 'day' ? 1 : viewType === '3day' ? 3 : 7
            }, 1fr)` 
          }}>
            <div className="h-14" /> {/* Empty cell for time column */}
            {getDaysToShow().map((day) => (
              <div 
                key={day.toISOString()} 
                className={`p-2 text-center ${
                  isToday(day) ? 'bg-blue-50' : ''
                }`}
              >
                <div className="font-medium text-gray-900">
                  {format(day, 'EEE')}
                </div>
                <div className={`text-sm ${
                  isToday(day) ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {format(day, 'MMM d')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable Calendar Content */}
      <div className="flex-1 overflow-auto bg-white">
        {viewType === 'month' ? renderMonthView() : renderTimeGrid()}
      </div>

      {/* Day Lightbox */}
      {selectedDate && (
        <DayLightbox
          date={selectedDate}
          isOpen={true}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {/* Task Modal */}
      {showTaskModal && selectedModalDate && (
        <TaskModal
          onClose={() => {
            setShowTaskModal(false);
            setSelectedModalDate(null);
          }}
          defaultType={viewType === 'month' ? 'task' : 'event'}
          initialDate={selectedModalDate}
        />
      )}
    </div>
  );
};

export default CalendarView;