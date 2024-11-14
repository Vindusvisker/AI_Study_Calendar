import { WorkflowManager } from '../workflows/workflowManager';
import { EventDetails } from './eventSchedulingService';

// Create a singleton instance of WorkflowManager
export const workflowManager = new WorkflowManager();

export const initializeWorkflowContext = (events: any[]) => {
  workflowManager.setContext({ events });
};

export const handleWorkflowResponse = async (
  response: any,
  eventData?: EventDetails,
  onEventCreated?: (event: any) => void
) => {
  if (response.data?.confirmed && eventData) {
    const event = {
      id: Date.now().toString(),
      summary: eventData.name,
      description: `Category: ${eventData.category}`,
      start: {
        dateTime: eventData.dateTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: new Date(
          new Date(eventData.dateTime).getTime() + (eventData.duration || 60) * 60000
        ).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      colorId: '1'
    };

    onEventCreated?.(event);
    workflowManager.endWorkflow();
  }

  return {
    text: response.text,
    isUser: false,
    options: response.options,
    suggestions: response.suggestions,
    error: response.error
  };
};