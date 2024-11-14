import React from 'react';
import { Menu } from '@headlessui/react';
import { Calendar, ChevronDown } from 'lucide-react';

type ViewType = 'month' | 'week' | '3day' | 'day';

interface ViewSelectorProps {
  value: ViewType;
  onChange: (value: ViewType) => void;
}

const ViewSelector: React.FC<ViewSelectorProps> = ({ value, onChange }) => {
  const views: { value: ViewType; label: string }[] = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: '3day', label: '3 Days' },
    { value: 'day', label: 'Day' }
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        <Calendar className="w-4 h-4" />
        {views.find(v => v.value === value)?.label}
        <ChevronDown className="w-4 h-4" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 w-36 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
        <div className="py-1">
          {views.map((view) => (
            <Menu.Item key={view.value}>
              {({ active }) => (
                <button
                  onClick={() => onChange(view.value)}
                  className={`${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  } ${
                    value === view.value ? 'bg-primary/10' : ''
                  } group flex items-center w-full px-4 py-2 text-sm`}
                >
                  {view.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default ViewSelector;