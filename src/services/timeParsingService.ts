import { parseISO, isValid, addDays, setHours, setMinutes, isBefore, parse, format } from 'date-fns';
import { getGPTResponse } from './gptService';

const TIME_FORMATS = [
  '2 PM today',
  'tomorrow at 3 PM',
  'March 5 at 2 PM',
  '3:30 PM',
  'next Monday 2 PM'
];

interface ParsedTime {
  date: Date | null;
  error?: string;
}

export const parseTime = async (input: string): Promise<ParsedTime> => {
  const now = new Date();

  try {
    // First try direct parsing for common formats
    const directParsed = parseDirectTime(input, now);
    if (directParsed) {
      return { date: directParsed };
    }

    // If direct parsing fails, try GPT
    const response = await getGPTResponse(input, 'time-parsing');
    const parsedText = response.text.trim();

    if (parsedText === 'Invalid time format') {
      return {
        date: null,
        error: getFormattedErrorMessage()
      };
    }

    // Validate GPT's response format
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(parsedText)) {
      return {
        date: null,
        error: getFormattedErrorMessage()
      };
    }

    const parsedDate = parseISO(parsedText);
    if (isValid(parsedDate) && !isBefore(parsedDate, now)) {
      return { date: parsedDate };
    }

    return {
      date: null,
      error: getFormattedErrorMessage()
    };
  } catch (error) {
    console.error('Time parsing error:', error);
    return {
      date: null,
      error: getFormattedErrorMessage()
    };
  }
};

const parseDirectTime = (input: string, now: Date): Date | null => {
  const lowercaseInput = input.toLowerCase().trim();
  
  // Handle "today at X" or "X today"
  if (lowercaseInput.includes('today')) {
    return parseTimeWithReference(lowercaseInput, now);
  }

  // Handle "tomorrow at X" or "X tomorrow"
  if (lowercaseInput.includes('tomorrow')) {
    return parseTimeWithReference(lowercaseInput, addDays(now, 1));
  }

  // Handle "X PM/AM" (assume today)
  const simpleTimeMatch = lowercaseInput.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (simpleTimeMatch) {
    return parseTimeWithReference(lowercaseInput, now);
  }

  // Handle "March 5 at 2 PM" format
  const dateTimeMatch = lowercaseInput.match(
    /([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?\s+(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i
  );
  if (dateTimeMatch) {
    try {
      const [_, month, day, hours, minutes = '0', meridiem] = dateTimeMatch;
      const parsedHours = parseInt(hours) + (meridiem.toLowerCase() === 'pm' && hours !== '12' ? 12 : 0);
      const dateString = `${month} ${day}, ${now.getFullYear()} ${parsedHours}:${minutes}`;
      const parsedDate = parse(dateString, 'MMMM d, yyyy H:mm', new Date());
      
      if (isValid(parsedDate) && !isBefore(parsedDate, now)) {
        return parsedDate;
      }
    } catch (error) {
      console.error('Error parsing date string:', error);
      return null;
    }
  }

  // Try parsing as direct date string
  const directDate = new Date(input);
  if (isValid(directDate) && !isBefore(directDate, now)) {
    return directDate;
  }

  return null;
};

const parseTimeWithReference = (input: string, referenceDate: Date): Date | null => {
  const timeMatch = input.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!timeMatch) return null;

  const [_, hours, minutes = '0', meridiem] = timeMatch;
  const parsedHours = parseInt(hours) + (meridiem.toLowerCase() === 'pm' && hours !== '12' ? 12 : 0);
  
  try {
    const result = setMinutes(setHours(referenceDate, parsedHours), parseInt(minutes));
    return !isBefore(result, new Date()) ? result : null;
  } catch (error) {
    console.error('Error setting time:', error);
    return null;
  }
};

const getFormattedErrorMessage = (): string => {
  return `Please use one of these formats:\n${TIME_FORMATS.map(f => `• ${f}`).join('\n')}`;
};