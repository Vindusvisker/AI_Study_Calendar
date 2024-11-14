import { Workflow, WorkflowResponse } from './types';

const TIPS = [
  {
    title: 'Pomodoro',
    description: '25min study + 5min break. Helps maintain focus and prevent burnout.'
  },
  {
    title: 'Active Recall',
    description: 'Test yourself instead of re-reading. Improves memory retention.'
  },
  {
    title: 'Spaced Review',
    description: 'Review at increasing intervals. Enhances long-term memory.'
  }
];

export const studyTipsWorkflow: Workflow = {
  id: 'study-tips',
  name: 'Study Tips',
  initialStep: 'select-tip',

  async getInitialResponse(): Promise<WorkflowResponse> {
    return {
      text: 'Choose a study technique:',
      options: TIPS.map(tip => tip.title)
    };
  },

  async processStep(input: string): Promise<WorkflowResponse> {
    const tip = TIPS.find(t => t.title === input);
    
    if (tip) {
      return {
        text: tip.description,
        options: ['Show another', 'Got it']
      };
    }

    if (input === 'Show another') {
      return this.getInitialResponse();
    }

    return {
      text: 'Need more study tips?',
      options: ['Show more', 'Done']
    };
  }
};