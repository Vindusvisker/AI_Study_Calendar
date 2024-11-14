import { addDays, setHours, setMinutes } from '../utils/dateHelpers';

const today = new Date();

export const mockEvents = [
  {
    id: '1',
    summary: 'Math Study Session',
    description: 'Review calculus chapters 1-3',
    start: {
      dateTime: setHours(today, 10, 0),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    end: {
      dateTime: setHours(today, 12, 0),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    colorId: '1'
  },
  {
    id: '2',
    summary: 'Physics Group Project',
    description: 'Meet with team to discuss project outline',
    start: {
      dateTime: setHours(today, 14, 0),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    end: {
      dateTime: setHours(today, 15, 30),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    colorId: '2'
  },
  {
    id: '3',
    summary: 'Chemistry Lab Preparation',
    description: 'Prepare materials for tomorrow\'s lab experiment',
    start: {
      dateTime: setHours(addDays(today, 1), 9, 0),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    end: {
      dateTime: setHours(addDays(today, 1), 11, 0),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    colorId: '3'
  },
  {
    id: '4',
    summary: 'English Literature Essay',
    description: 'Work on final draft of analysis paper',
    start: {
      dateTime: setHours(addDays(today, 2), 13, 0),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    end: {
      dateTime: setHours(addDays(today, 2), 16, 0),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    colorId: '4'
  }
];

export const mockTasks = [
  {
    id: 1,
    title: 'Complete Math Assignment',
    completed: false,
    priority: 'high',
    dueDate: addDays(today, 2),
    category: 'Mathematics'
  },
  {
    id: 2,
    title: 'Review Physics Notes',
    completed: false,
    priority: 'medium',
    dueDate: addDays(today, 4),
    category: 'Physics'
  },
  {
    id: 3,
    title: 'Prepare Lab Report',
    completed: true,
    priority: 'low',
    dueDate: addDays(today, -1),
    category: 'Chemistry'
  },
  {
    id: 4,
    title: 'Read Literature Chapters',
    completed: false,
    priority: 'medium',
    dueDate: addDays(today, 3),
    category: 'English'
  }
];