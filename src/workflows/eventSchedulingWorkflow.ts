import { format, parseISO } from 'date-fns';
import { Workflow, WorkflowResponse, WorkflowState } from './types';
import { checkScheduleConflicts } from '../services/eventSchedulingService';

const STEPS = {
  CATEGORY: 'category',
  NAME: 'name',
  DATETIME: 'datetime',
  CONFIRM: 'confirm'
} as const;

const DEFAULT_CATEGORIES = ['Study Session', 'Meeting', 'Break', 'Other'];

export const eventSchedulingWorkflow: Workflow = {
  id: 'event-scheduling',
  name: 'Schedule Event',
  initialStep: STEPS.CATEGORY,

  async getInitialResponse(): Promise<WorkflowResponse> {
    return {
      text: "Select event category:",
      options: DEFAULT_CATEGORIES
    };
  },

  async processStep(input: string, state: WorkflowState, context?: any): Promise<WorkflowResponse> {
    switch (state.step) {
      case STEPS.CATEGORY:
        return {
          text: "Enter event name:",
          data: { category: input }
        };

      case STEPS.NAME:
        return {
          text: "Select date and time for the event:",
          data: { name: input },
          showDateTimePicker: true
        };

      case STEPS.DATETIME:
        const date = new Date(input);
        
        if (context?.events && checkScheduleConflicts(date, context.events)) {
          return {
            text: "There's a scheduling conflict at that time. Please choose a different time.",
            error: "Schedule conflict",
            showDateTimePicker: true
          };
        }

        return {
          text: `Confirm event:\n${state.data.name}\n${format(date, 'PPp')}`,
          options: ["Add to calendar", "Start over"],
          data: { dateTime: date.toISOString() }
        };

      case STEPS.CONFIRM:
        if (input === "Add to calendar") {
          return {
            text: "Event added. Need anything else?",
            options: ["Schedule another", "I'm done"],
            data: { confirmed: true }
          };
        }
        return {
          text: "Select event category:",
          options: DEFAULT_CATEGORIES,
          data: { reset: true }
        };

      default:
        return {
          text: "Select event category:",
          options: DEFAULT_CATEGORIES
        };
    }
  }
};