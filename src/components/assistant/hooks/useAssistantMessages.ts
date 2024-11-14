import { useState, useEffect, useCallback } from 'react';
import { Message } from '../types';
import { getGPTResponse } from '../../../services/gptService';
import { workflowManager, handleWorkflowResponse } from '../../../services/workflowService';

export const useAssistantMessages = (onEventCreated: (event: any) => void) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: Date.now().toString(),
        text: 'What can I help you with today?',
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, []);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]);
  }, []);

  const handleUserInput = useCallback(async (input: string, context: string) => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    addMessage({ text: input.trim(), isUser: true });

    try {
      if (workflowManager.isInWorkflow()) {
        const response = await workflowManager.processInput(input);
        const message = await handleWorkflowResponse(
          response,
          workflowManager.getCurrentState()?.data,
          onEventCreated
        );
        addMessage(message);
      } else {
        const response = await getGPTResponse(input, context);
        addMessage({
          text: response.text,
          isUser: false,
          suggestions: response.suggestions
        });
      }
    } catch (error) {
      addMessage({
        text: "Please try again.",
        isUser: false
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage, onEventCreated]);

  return {
    messages,
    isLoading,
    addMessage,
    handleUserInput
  };
};