import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import CalendarView from './CalendarView';
import DeadlinesView from './DeadlinesView';
import TaskSidebar from './TaskSidebar';
import TaskModal from './TaskModal';

const PlannerPage = () => {
  const [view, setView] = useState<'calendar' | 'deadlines'>('calendar');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Navigation */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex space-x-4">
              <button
                onClick={() => setView('calendar')}
                className={`flex items-center px-4 py-2 font-medium transition-colors duration-200 ${
                  view === 'calendar'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Calendar
              </button>
              <button
                onClick={() => setView('deadlines')}
                className={`flex items-center px-4 py-2 font-medium transition-colors duration-200 ${
                  view === 'deadlines'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Clock className="w-5 h-5 mr-2" />
                Deadlines
              </button>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <ChevronRight /> : <ChevronLeft />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto">
          {view === 'calendar' ? <CalendarView /> : <DeadlinesView />}
        </div>
        <TaskSidebar isOpen={sidebarOpen} />
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowTaskModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors duration-200"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          defaultType={view === 'calendar' ? 'event' : 'deadline'}
        />
      )}
    </div>
  );
};

export default PlannerPage;