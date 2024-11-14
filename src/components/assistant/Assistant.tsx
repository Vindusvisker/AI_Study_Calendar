import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useDataMode } from '../../context/DataModeContext';
import { useAssistantMessages, useQuickActions, useOptionHandler } from './hooks';
import AssistantMessage from './AssistantMessage';
import QuickActions from './QuickActions';
import MessageInput from './MessageInput';
import DateTimePicker from './DateTimePicker';

const Assistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const location = useLocation();
  const { dataMode, mockEvents, setMockEvents } = useDataMode();

  const handleEventCreated = (event: any) => {
    setMockEvents([...mockEvents, event]);
  };

  const {
    messages,
    isLoading,
    addMessage,
    handleUserInput
  } = useAssistantMessages(handleEventCreated);

  const {
    quickActions,
    handleQuickAction
  } = useQuickActions(addMessage, handleEventCreated);

  const handleOptionClick = useOptionHandler(
    addMessage,
    handleEventCreated,
    handleQuickAction,
    quickActions
  );

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    handleUserInput(input, location.pathname);
    setInput('');
  };

  const handleDateTimeSelect = (date: Date) => {
    handleUserInput(date.toISOString(), location.pathname);
    setShowDatePicker(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors duration-200"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[420px] h-[700px] bg-white rounded-2xl shadow-xl flex flex-col">
          <div className="p-4 bg-secondary text-white rounded-t-2xl flex justify-between items-center">
            <h3 className="font-semibold">AI Study Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <QuickActions
            actions={quickActions}
            onActionClick={handleQuickAction}
          />

          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message) => (
              <AssistantMessage
                key={message.id}
                message={message}
                onOptionClick={handleOptionClick}
              />
            ))}
          </div>

          <MessageInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            isLoading={isLoading}
            dataMode={dataMode}
          />
        </div>
      )}

      {showDatePicker && (
        <DateTimePicker
          onSelect={handleDateTimeSelect}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </>
  );
};

export default Assistant;