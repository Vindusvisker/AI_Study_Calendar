import { format, parseISO, isValid, isBefore } from 'date-fns';
import { parseTime } from './timeParsingService';

export interface EventDetails {
  category?: string;
  name?: string;
  dateTime?: string;
  duration?: number;
}

export interface SchedulingResponse {
  text: string;
  options?: string[];
  suggestions?: string[];
  eventDetails?: EventDetails;
  error?: string;
}

export const checkScheduleConflicts = (dateTime: Date, events: any[], duration: number = 60): boolean => {
  const eventEnd = new Date(dateTime.getTime() + duration * 60000);

  return events.some(event => {
    const existingStart = parseISO(event.start.dateTime);
    const existingEnd = parseISO(event.end.dateTime);

    return (
      (dateTime >= existingStart && dateTime < existingEnd) ||
      (eventEnd > existingStart && eventEnd <= existingEnd) ||
      (dateTime <= existingStart && eventEnd >= existingEnd)
    );
  });
};

export const processEventScheduling = async (
  input: string,
  currentDetails?: EventDetails,
  events?: any[]
): Promise<SchedulingResponse> => {
  const defaultCategories = ['Study Session', 'Meeting', 'Break', 'Other'];

  // Starting fresh with no details
  if (!currentDetails?.category) {
    return {
      text: "Let's schedule your event. What category does it belong to?",
      options: defaultCategories,
      eventDetails: {}
    };
  }

  // Have category, need name
  if (!currentDetails.name) {
    return {
      text: `Great! What would you like to name this ${currentDetails.category.toLowerCase()}?`,
      eventDetails: {
        ...currentDetails,
        name: input || undefined
      }
    };
  }

  // Have name, need date/time
  if (!currentDetails.dateTime) {
    const { date, error } = await parseTime(input);
    
    if (!date) {
      return {
        text: error || "I couldn't understand that time format.",
        error: "Invalid time format",
        eventDetails: currentDetails
      };
    }

    if (events && checkScheduleConflicts(date, events)) {
      return {
        text: "There's a scheduling conflict at that time. Would you like to try a different time?",
        error: "Schedule conflict",
        eventDetails: currentDetails
      };
    }

    return {
      text: `Perfect! Here's a summary of your event:\n\nCategory: ${currentDetails.category}\nName: ${currentDetails.name}\nTime: ${format(date, 'PPpp')}\n\nWould you like me to add this to your calendar?`,
      options: ["Yes, add it", "No, make changes"],
      eventDetails: {
        ...currentDetails,
        dateTime: date.toISOString()
      }
    };
  }

  // Have all details, confirm
  return {
    text: `Perfect! Here's a summary of your event:\n\nCategory: ${currentDetails.category}\nName: ${currentDetails.name}\nTime: ${format(parseISO(currentDetails.dateTime), 'PPpp')}\n\nWould you like me to add this to your calendar?`,
    options: ["Yes, add it", "No, make changes"],
    eventDetails: currentDetails
  };
};

export const createCalendarEvent = (details: EventDetails) => {
  if (!details.name || !details.dateTime) {
    throw new Error('Incomplete event details');
  }

  return {
    id: Date.now().toString(),
    summary: details.name,
    description: `Category: ${details.category}`,
    start: {
      dateTime: details.dateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    end: {
      dateTime: new Date(
        new Date(details.dateTime).getTime() + (details.duration || 60) * 60000
      ).toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    colorId: '1'
  };
};