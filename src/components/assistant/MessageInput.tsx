import React from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  dataMode?: 'sample' | 'real';
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
  dataMode
}) => {
  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
          placeholder={isLoading ? 'Assistant is typing...' : 'Type your message...'}
          disabled={isLoading}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
        />
        <button
          onClick={onSend}
          disabled={isLoading}
          className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      {dataMode === 'sample' && (
        <p className="mt-2 text-xs text-gray-500 text-center">
          Using sample data mode
        </p>
      )}
    </div>
  );
};

export default MessageInput;