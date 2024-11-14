import React from 'react';
import { Menu } from '@headlessui/react';
import { Calendar, ChevronDown } from 'lucide-react';

export type TimeFilterValue = 'all' | 'day' | 'week' | 'month' | 'nextMonth';

interface TimeFilterProps {
  value: TimeFilterValue;
  onChange: (value: TimeFilterValue) => void;
  type?: 'tasks' | 'deadlines';
}

const TimeFilter: React.FC<TimeFilterProps> = ({ value, onChange, type = 'tasks' }) => {
  const filters: { value: TimeFilterValue; label: string }[] = [
    { value: 'all', label: type === 'tasks' ? 'All Tasks' : 'All Deadlines' },
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'nextMonth', label: 'Next Month' }
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        <Calendar className="w-4 h-4" />
        {filters.find(f => f.value === value)?.label}
        <ChevronDown className="w-4 h-4" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
        <div className="py-1">
          {filters.map((filter) => (
            <Menu.Item key={filter.value}>
              {({ active }) => (
                <button
                  onClick={() => onChange(filter.value)}
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } ${
                    value === filter.value ? 'bg-primary/10' : ''
                  } group flex items-center w-full px-4 py-2 text-sm`}
                >
                  {filter.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default TimeFilter;