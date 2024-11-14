export interface WorkflowResponse {
  text: string;
  options?: string[];
  suggestions?: string[];
  data?: Record<string, any>;
}

export interface WorkflowState {
  step: string;
  data: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  initialStep: string;
  processStep: (input: string, state: WorkflowState) => Promise<WorkflowResponse>;
  getInitialResponse: () => Promise<WorkflowResponse>;
}