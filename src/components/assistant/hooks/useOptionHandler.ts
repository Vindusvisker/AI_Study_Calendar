import { useCallback } from 'react';
import { workflowManager, handleWorkflowResponse } from '../../../services/workflowService';
import { getGPTResponse } from '../../../services/gptService';
import { QuickAction } from '../types';

export const useOptionHandler = (
  addMessage: (message: any) => void,
  onEventCreated: (event: any) => void,
  handleQuickAction: (action: QuickAction) => Promise<void>,
  quickActions: QuickAction[]
) => {
  return useCallback(async (option: string) => {
    if (workflowManager.isInWorkflow()) {
      const response = await workflowManager.processInput(option);
      const message = await handleWorkflowResponse(
        response,
        workflowManager.getCurrentState()?.data,
        onEventCreated
      );
      addMessage(message);
      return;
    }

    if (option === 'Schedule another') {
      await handleQuickAction(quickActions[0]);
      return;
    }

    addMessage({
      text: option,
      isUser: true
    });

    try {
      const response = await getGPTResponse(option, '/');
      addMessage({
        text: response.text,
        isUser: false,
        suggestions: response.suggestions
      });
    } catch (error) {
      console.error('Error handling option:', error);
    }
  }, [addMessage, onEventCreated, handleQuickAction, quickActions]);
};