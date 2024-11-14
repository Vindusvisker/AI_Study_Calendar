import { LucideIcon } from 'lucide-react';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  options?: string[];
  suggestions?: string[];
  error?: string;
  timestamp: Date;
}

export interface QuickAction {
  icon: LucideIcon;
  label: string;
  workflowId?: string;
  prompt?: string;
}

export interface WorkflowState {
  workflowId: string;
  step: string;
  data: Record<string, any>;
}