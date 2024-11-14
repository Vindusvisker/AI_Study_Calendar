import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useDataMode } from '../../context/DataModeContext';
import TaskModal from './TaskModal';

interface DayLightboxProps {
  date: Date;
  isOpen: boolean;
  onClose: () => void;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

const DayLightbox: React.FC<DayLightboxProps> = ({ date, isOpen, onClose }) => {
  const { mockTasks, mockEvents, updateMockTask } = useDataMode();
  const [expandedTasks, setExpandedTasks] = useState<Record<number, boolean>>({});
  const [newSubtask, setNewSubtask] = useState<Record<number, string>>({});
  const [showTaskModal, setShowTaskModal] = useState(false);

  const dayTasks = mockTasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return (
      taskDate.getDate() === date.getDate() &&
      taskDate.getMonth() === date.getMonth() &&
      taskDate.getFullYear() === date.getFullYear()
    );
  });

  const dayEvents = mockEvents.filter(event => {
    const eventDate = parseISO(event.start.dateTime);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

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

  return (
    <>
      <Transition show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={onClose}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-2xl font-semibold text-gray-900">
                    {format(date, 'EEEE, MMMM d, yyyy')}
                  </Dialog.Title>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors duration-200 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add Event/Task
                    </button>
                    <button
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Events Section */}
                  {dayEvents.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-3">
                        Events
                      </h4>
                      <div className="space-y-2">
                        {dayEvents.map(event => (
                          <div
                            key={event.id}
                            className="p-3 bg-primary/5 rounded-lg border border-primary/10"
                          >
                            <div className="font-medium text-gray-800">
                              {event.summary}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {format(parseISO(event.start.dateTime), 'h:mm a')} -{' '}
                              {format(parseISO(event.end.dateTime), 'h:mm a')}
                            </div>
                            {event.description && (
                              <div className="text-sm text-gray-600 mt-2">
                                {event.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks Section */}
                  {dayTasks.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-3">
                        Tasks
                      </h4>
                      <div className="space-y-3">
                        {dayTasks.map(task => (
                          <div
                            key={task.id}
                            className={`p-4 rounded-lg border ${
                              task.priority === 'high'
                                ? 'bg-red-100 text-red-800 border-red-200'
                                : task.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                : 'bg-green-100 text-green-800 border-green-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{task.title}</h3>
                              <button
                                onClick={() => toggleTaskExpansion(task.id)}
                                className="p-1 hover:bg-black/5 rounded-full transition-colors duration-200"
                              >
                                {expandedTasks[task.id] ? (
                                  <ChevronUp className="w-5 h-5" />
                                ) : (
                                  <ChevronDown className="w-5 h-5" />
                                )}
                              </button>
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
                                      onClick={() =>
                                        toggleSubtaskCompletion(task.id, subtask.id)
                                      }
                                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                                        subtask.completed
                                          ? 'bg-primary border-primary text-white'
                                          : 'border-gray-300'
                                      }`}
                                    >
                                      {subtask.completed && (
                                        <Check className="w-3 h-3" />
                                      )}
                                    </button>
                                    <span
                                      className={
                                        subtask.completed
                                          ? 'line-through opacity-60'
                                          : ''
                                      }
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
                                    onChange={e =>
                                      setNewSubtask(prev => ({
                                        ...prev,
                                        [task.id]: e.target.value
                                      }))
                                    }
                                    placeholder="Add a subtask..."
                                    className="flex-1 px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white/50"
                                    onKeyPress={e => {
                                      if (e.key === 'Enter') {
                                        handleAddSubtask(task.id);
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleAddSubtask(task.id)}
                                    className="p-1 text-primary hover:bg-white/20 rounded-full transition-colors duration-200"
                                  >
                                    <Plus className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {dayTasks.length === 0 && dayEvents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No tasks or events scheduled for this day
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          defaultType="task"
          initialDate={date}
          isNested={true}
        />
      )}
    </>
  );
};

export default DayLightbox;