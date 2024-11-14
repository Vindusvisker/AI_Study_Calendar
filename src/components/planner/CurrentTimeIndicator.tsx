import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface CurrentTimeIndicatorProps {
  viewType: 'week' | '3day' | 'day';
  columnCount: number;
}

const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ viewType, columnCount }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getTopPosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    // Each hour slot is 60px
    return (hours * 60) + ((minutes / 60) * 60);
  };

  return (
    <div
      className="absolute left-20 right-0 pointer-events-none z-20"
      style={{ 
        top: `${getTopPosition()}px`,
      }}
    >
      <div className="relative flex items-center">
        {/* Time Label */}
        <div className="absolute -left-16 -translate-y-1/2 bg-white px-2 py-1 rounded text-xs text-primary font-medium shadow-sm">
          {format(currentTime, 'h:mm a')}
        </div>
        
        {/* Line */}
        <div className="flex-1 h-px bg-primary">
          {/* Dot */}
          <div className="absolute left-0 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-sm" />
        </div>
      </div>
    </div>
  );
};

export default CurrentTimeIndicator;