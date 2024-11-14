import React, { useState } from 'react';
import { useDataMode } from '../../context/DataModeContext';
import { Calendar as CalendarIcon, Tag, ChevronDown, ChevronUp, Check, Plus } from 'lucide-react';
import TimeFilter, { TimeFilterValue } from './TimeFilter';
import { isDateInRange } from '../../utils/dateFilters';

const DeadlinesView = () => {
  const { mockTasks, updateMockTask } = useDataMode();
  const [timeFilter, setTimeFilter] = useState<TimeFilterValue>('all');
  const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
  const [newSubtask, setNewSubtask] = useState<Record<number, string>>({});

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  // Filter tasks based on selected time range
  const filteredTasks = mockTasks.filter(task => 
    isDateInRange(task.dueDate, timeFilter)
  );

  // Sort tasks by due date and priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Group tasks by due date
  const groupedTasks = sortedTasks.reduce((groups, task) => {
    const date = new Date(task.dueDate).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, typeof mockTasks>);

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

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Deadlines</h2>
          <TimeFilter 
            value={timeFilter} 
            onChange={setTimeFilter} 
            type="deadlines"
          />
        </div>

        {Object.entries(groupedTasks).length > 0 ? (
          Object.entries(groupedTasks).map(([date, tasks]) => (
            <div key={date} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{date}</h2>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-2 ${priorityColors[task.priority]} ${
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
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium`}>
                            {task.priority}
                          </span>
                          <div className="flex items-center gap-1 text-gray-500">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{new Date(task.dueDate).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}</span>
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
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No deadlines found for the selected time period
          </div>
        )}
      </div>
    </div>
  );
};

export default DeadlinesView;