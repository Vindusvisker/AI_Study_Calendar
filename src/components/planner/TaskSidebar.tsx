import React, { useState } from 'react';
import { useDataMode } from '../../context/DataModeContext';
import { Tag, Calendar as CalendarIcon, Plus, ChevronDown, ChevronUp, Check, Filter } from 'lucide-react';
import TaskModal from './TaskModal';
import TimeFilter, { TimeFilterValue } from './TimeFilter';
import { isDateInRange } from '../../utils/dateFilters';

interface TaskSidebarProps {
  isOpen: boolean;
}

interface FilterState {
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  completed?: boolean;
  time: TimeFilterValue;
}

const TaskSidebar = ({ isOpen }: TaskSidebarProps) => {
  const { mockTasks, updateMockTask } = useDataMode();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
  const [newSubtask, setNewSubtask] = useState<Record<number, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    time: 'all'
  });

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleAddSubtask = (taskId: number) => {
    const subtaskText = newSubtask[taskId]?.trim();
    if (!subtaskText) return;

    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return;

    const newSubtaskObj = {
      id: Date.now().toString(),
      title: subtaskText,
      completed: false
    };

    updateMockTask(taskId, {
      ...task,
      subtasks: [...(task.subtasks || []), newSubtaskObj]
    });

    setNewSubtask(prev => ({
      ...prev,
      [taskId]: ''
    }));
  };

  const toggleSubtaskCompletion = (taskId: number, subtaskId: string) => {
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks?.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    updateMockTask(taskId, {
      ...task,
      subtasks: updatedSubtasks
    });
  };

  const toggleTaskCompletion = (taskId: number) => {
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) return;

    updateMockTask(taskId, {
      ...task,
      completed: !task.completed
    });
  };

  const filteredTasks = mockTasks.filter(task => {
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.category && task.category !== filters.category) return false;
    if (filters.completed !== undefined && task.completed !== filters.completed) return false;
    return isDateInRange(task.dueDate, filters.time);
  });

  const categories = Array.from(new Set(mockTasks.map(task => task.category)));

  return (
    <div
      className={`w-80 bg-white border-l transition-all duration-300 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Tasks</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowTaskModal(true)}
              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Time Filter */}
        <div className="mb-4">
          <TimeFilter
            value={filters.time}
            onChange={(value) => setFilters(prev => ({ ...prev, time: value }))}
            type="tasks"
          />
        </div>

        {/* Additional Filters Panel */}
        {showFilters && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priority: e.target.value as 'high' | 'medium' | 'low' | undefined
                }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              >
                <option value="">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  category: e.target.value || undefined
                }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              >
                <option value="">All</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.completed === undefined ? '' : filters.completed.toString()}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  completed: e.target.value === '' ? undefined : e.target.value === 'true'
                }))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              >
                <option value="">All</option>
                <option value="false">Active</option>
                <option value="true">Completed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow duration-200 ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`mt-1 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                    task.completed
                      ? 'bg-primary border-primary text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3" />}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className={`font-medium text-gray-800 ${
                      task.completed ? 'line-through' : ''
                    }`}>
                      {task.title}
                    </h3>
                    <button
                      onClick={() => toggleTaskExpansion(task.id)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      {expandedTasks[task.id] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {task.priority}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Tag className="w-4 h-4" />
                      <span>{task.category}</span>
                    </div>
                  </div>

                  {expandedTasks[task.id] && (
                    <div className="mt-3 space-y-3">
                      {/* Subtasks */}
                      {task.subtasks?.map(subtask => (
                        <div
                          key={subtask.id}
                          className="flex items-center gap-2 pl-4"
                        >
                          <button
                            onClick={() => toggleSubtaskCompletion(task.id, subtask.id)}
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              subtask.completed
                                ? 'bg-primary border-primary text-white'
                                : 'border-gray-300'
                            }`}
                          >
                            {subtask.completed && <Check className="w-3 h-3" />}
                          </button>
                          <span
                            className={subtask.completed ? 'line-through text-gray-500' : ''}
                          >
                            {subtask.title}
                          </span>
                        </div>
                      ))}

                      {/* Add Subtask Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newSubtask[task.id] || ''}
                          onChange={e => setNewSubtask(prev => ({
                            ...prev,
                            [task.id]: e.target.value
                          }))}
                          placeholder="Add a subtask..."
                          className="flex-1 px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          onKeyPress={e => {
                            if (e.key === 'Enter') {
                              handleAddSubtask(task.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddSubtask(task.id)}
                          className="p-1 text-primary hover:bg-primary/10 rounded-full"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No tasks found for the selected filters
          </div>
        )}
      </div>

      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          defaultType="task"
          initialDate={new Date()}
        />
      )}
    </div>
  );
};

export default TaskSidebar;