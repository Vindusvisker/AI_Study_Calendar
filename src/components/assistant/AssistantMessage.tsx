import React from 'react';
import { Message } from './types';

interface AssistantMessageProps {
  message: Message;
  onOptionClick: (option: string) => void;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({ message, onOptionClick }) => {
  return (
    <div className="space-y-3">
      <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[85%] p-3.5 rounded-2xl ${
            message.isUser
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <div className="whitespace-pre-line">{message.text}</div>
          {message.error && (
            <div className="text-red-500 text-sm mt-2 font-medium">
              {message.error}
            </div>
          )}
          <div className="text-xs mt-2 opacity-60">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
      
      {!message.isUser && (message.options || message.suggestions) && (
        <div className="flex flex-wrap gap-2 ml-2">
          {message.options?.map((option, optIndex) => (
            <button
              key={optIndex}
              onClick={() => onOptionClick(option)}
              className="text-sm px-3.5 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            >
              {option}
            </button>
          ))}
          {message.suggestions?.map((suggestion, sugIndex) => (
            <button
              key={sugIndex}
              onClick={() => onOptionClick(suggestion)}
              className="text-sm px-3.5 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssistantMessage;