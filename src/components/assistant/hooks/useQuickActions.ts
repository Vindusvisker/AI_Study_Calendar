import { useMemo, useCallback } from 'react';
import { Brain, Clock, Calendar, BookOpen } from 'lucide-react';
import { QuickAction } from '../types';
import { workflowManager, handleWorkflowResponse } from '../../../services/workflowService';
import { getGPTResponse } from '../../../services/gptService';

export const useQuickActions = (
  addMessage: (message: any) => void,
  onEventCreated: (event: any) => void
) => {
  const quickActions = useMemo<QuickAction[]>(() => [
    {
      icon: Calendar,
      label: 'Schedule Event',
      workflowId: 'event-scheduling'
    },
    {
      icon: Clock,
      label: 'Find Time',
      prompt: 'Help me find study time'
    },
    {
      icon: Brain,
      label: 'Study Tips',
      workflowId: 'study-tips'
    },
    {
      icon: BookOpen,
      label: 'Get Motivated',
      prompt: 'I need motivation'
    }
  ], []);

  const handleQuickAction = useCallback(async (action: QuickAction) => {
    if (action.workflowId) {
      const response = await workflowManager.startWorkflow(action.workflowId);
      const message = await handleWorkflowResponse(response, undefined, onEventCreated);
      addMessage(message);
      return;
    }

    if (action.prompt) {
      addMessage({
        text: action.prompt,
        isUser: true
      });

      try {
        const response = await getGPTResponse(action.prompt, '/');
        addMessage({
          text: response.text,
          isUser: false,
          suggestions: response.suggestions
        });
      } catch (error) {
        console.error('Error handling quick action:', error);
      }
    }
  }, [addMessage, onEventCreated]);

  return {
    quickActions,
    handleQuickAction
  };
};