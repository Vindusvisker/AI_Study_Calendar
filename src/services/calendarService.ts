import axios from 'axios';
import { mockEvents } from './mockData';
import { useDataMode } from '../context/DataModeContext';

const API_KEY = 'AIzaSyBxnFF3hFLyBwC8uEXF2PV2fAUAiqkJ69k';
const CALENDAR_ID = 'primary';
const BASE_URL = 'https://www.googleapis.com/calendar/v3';

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  colorId?: string;
}

const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('No access token available');
  }
  return {
    Authorization: `Bearer ${accessToken}`
  };
};

export const getEvents = async (timeMin: string, timeMax: string): Promise<CalendarEvent[]> => {
  const { dataMode } = useDataMode();

  if (dataMode === 'sample') {
    return mockEvents;
  }

  try {
    const response = await axios.get(`${BASE_URL}/calendars/${CALENDAR_ID}/events`, {
      params: {
        key: API_KEY,
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime'
      },
      headers: getAuthHeaders()
    });
    return response.data.items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch events');
    }
    throw error;
  }
};

export const createEvent = async (event: CalendarEvent): Promise<CalendarEvent> => {
  const { dataMode } = useDataMode();

  if (dataMode === 'sample') {
    const newEvent = {
      ...event,
      id: Date.now().toString()
    };
    mockEvents.push(newEvent);
    return newEvent;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/calendars/${CALENDAR_ID}/events`,
      event,
      {
        params: { key: API_KEY },
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to create event');
    }
    throw error;
  }
};

export const updateEvent = async (eventId: string, event: CalendarEvent): Promise<CalendarEvent> => {
  const { dataMode } = useDataMode();

  if (dataMode === 'sample') {
    const index = mockEvents.findIndex(e => e.id === eventId);
    if (index === -1) throw new Error('Event not found');
    mockEvents[index] = { ...event, id: eventId };
    return mockEvents[index];
  }

  try {
    const response = await axios.put(
      `${BASE_URL}/calendars/${CALENDAR_ID}/events/${eventId}`,
      event,
      {
        params: { key: API_KEY },
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to update event');
    }
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  const { dataMode } = useDataMode();

  if (dataMode === 'sample') {
    const index = mockEvents.findIndex(e => e.id === eventId);
    if (index === -1) throw new Error('Event not found');
    mockEvents.splice(index, 1);
    return;
  }

  try {
    await axios.delete(
      `${BASE_URL}/calendars/${CALENDAR_ID}/events/${eventId}`,
      {
        params: { key: API_KEY },
        headers: getAuthHeaders()
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        throw new Error('Authentication expired. Please sign in again.');
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to delete event');
    }
    throw error;
  }
};