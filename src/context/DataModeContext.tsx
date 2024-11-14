import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockEvents as initialMockEvents, mockTasks as initialMockTasks } from '../services/mockData';

type DataMode = 'sample' | 'real';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  category: string;
  subtasks?: Subtask[];
}

interface DataModeContextType {
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;
  mockEvents: any[];
  setMockEvents: React.Dispatch<React.SetStateAction<any[]>>;
  mockTasks: Task[];
  setMockTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addMockTask: (task: Omit<Task, 'id'>) => void;
  updateMockTask: (id: number, task: Partial<Task>) => void;
  deleteMockTask: (id: number) => void;
}

const DataModeContext = createContext<DataModeContextType | undefined>(undefined);

export const useDataMode = () => {
  const context = useContext(DataModeContext);
  if (context === undefined) {
    throw new Error('useDataMode must be used within a DataModeProvider');
  }
  return context;
};

export const DataModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataMode, setDataMode] = useState<DataMode>(() => {
    const savedMode = localStorage.getItem('dataMode');
    return (savedMode as DataMode) || 'sample';
  });

  const [mockEvents, setMockEvents] = useState(() => {
    const savedEvents = localStorage.getItem('mockEvents');
    return savedEvents ? JSON.parse(savedEvents) : initialMockEvents;
  });

  const [mockTasks, setMockTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('mockTasks');
    return savedTasks ? JSON.parse(savedTasks) : initialMockTasks;
  });

  useEffect(() => {
    localStorage.setItem('dataMode', dataMode);
  }, [dataMode]);

  useEffect(() => {
    localStorage.setItem('mockEvents', JSON.stringify(mockEvents));
  }, [mockEvents]);

  useEffect(() => {
    localStorage.setItem('mockTasks', JSON.stringify(mockTasks));
  }, [mockTasks]);

  const addMockTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now(),
      subtasks: []
    };
    setMockTasks(prev => [...prev, newTask]);
  };

  const updateMockTask = (id: number, updates: Partial<Task>) => {
    setMockTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const deleteMockTask = (id: number) => {
    setMockTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <DataModeContext.Provider
      value={{
        dataMode,
        setDataMode,
        mockEvents,
        setMockEvents,
        mockTasks,
        setMockTasks,
        addMockTask,
        updateMockTask,
        deleteMockTask
      }}
    >
      {children}
    </DataModeContext.Provider>
  );
};