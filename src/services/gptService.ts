import axios from 'axios';

interface GPTResponse {
  text: string;
  options?: string[];
  suggestions?: string[];
}

const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4';

const getContextPrompt = (context: string) => {
  switch (context) {
    case 'time-parsing':
      return `You are a time parsing assistant. Convert the following time expression to YYYY-MM-DD HH:mm format (24-hour clock). 
      If the input is invalid or unclear, respond with "Invalid time format". 
      Be strict about the format - only return either a date-time string or "Invalid time format".`;
    case 'event-scheduling':
      return 'You are a scheduling assistant helping to create calendar events. Keep responses concise and actionable.';
    case '/calendar':
      return 'You are a study assistant helping with calendar optimization.';
    case '/tasks':
      return 'You are a study assistant helping with task management.';
    case '/assistant':
      return 'You are a study assistant providing academic guidance.';
    default:
      return 'You are a study assistant helping with time management and academic success.';
  }
};

export const getGPTResponse = async (
  message: string,
  context: string
): Promise<GPTResponse> => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: getContextPrompt(context)
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: context === 'time-parsing' ? 0.1 : 0.7,
        max_tokens: 150
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        }
      }
    );

    return {
      text: response.data.choices[0].message.content,
      suggestions: generateContextualSuggestions(context)
    };
  } catch (error) {
    console.error('GPT API Error:', error);
    return handleGPTError(context);
  }
};

const handleGPTError = (context: string): GPTResponse => {
  const responses: { [key: string]: string } = {
    'time-parsing': 'Invalid time format',
    '/calendar': 'Would you like to schedule a study session?',
    '/tasks': 'What task would you like to focus on?',
    '/assistant': 'How can I help with your studies?',
    '/': 'What can I help you with today?'
  };

  return {
    text: responses[context] || responses['/'],
    suggestions: generateContextualSuggestions(context)
  };
};

const generateContextualSuggestions = (context: string): string[] => {
  if (context === 'time-parsing') return [];
  
  const contextSuggestions: { [key: string]: string[] } = {
    '/calendar': [
      'Find study time',
      'Add study block'
    ],
    '/tasks': [
      'Create task',
      'Set priority'
    ],
    '/assistant': [
      'Study technique',
      'Stay focused'
    ]
  };

  return contextSuggestions[context] || [];
};