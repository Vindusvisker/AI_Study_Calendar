import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface QuickAction {
  icon: LucideIcon;
  label: string;
  workflowId?: string;
  prompt?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick: (action: QuickAction) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, onActionClick }) => {
  return (
    <div className="p-4 border-b grid grid-cols-2 gap-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => onActionClick(action)}
          className="flex items-center gap-2 p-2 text-sm rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <action.icon className="w-4 h-4 text-primary" />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;