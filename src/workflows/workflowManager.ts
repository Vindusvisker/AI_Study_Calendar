import { Workflow, WorkflowState, WorkflowResponse } from './types';
import { eventSchedulingWorkflow } from './eventSchedulingWorkflow';
import { studyTipsWorkflow } from './studyTipsWorkflow';

export class WorkflowManager {
  private workflows: Map<string, Workflow>;
  private currentWorkflow: Workflow | null = null;
  private currentState: WorkflowState | null = null;
  private context: any = null;

  constructor() {
    this.workflows = new Map([
      [eventSchedulingWorkflow.id, eventSchedulingWorkflow],
      [studyTipsWorkflow.id, studyTipsWorkflow]
    ]);
  }

  setContext(context: any) {
    this.context = context;
  }

  async startWorkflow(workflowId: string): Promise<WorkflowResponse> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    this.currentWorkflow = workflow;
    this.currentState = {
      step: workflow.initialStep,
      data: {}
    };

    return workflow.getInitialResponse();
  }

  async processInput(input: string): Promise<WorkflowResponse> {
    if (!this.currentWorkflow || !this.currentState) {
      throw new Error('No active workflow');
    }

    const response = await this.currentWorkflow.processStep(input, this.currentState, this.context);

    // Update workflow state
    if (response.data) {
      if (response.data.reset) {
        this.currentState = {
          step: this.currentWorkflow.initialStep,
          data: {}
        };
      } else {
        this.currentState = {
          step: this.getNextStep(this.currentState.step),
          data: { ...this.currentState.data, ...response.data }
        };
      }
    }

    return response;
  }

  private getNextStep(currentStep: string): string {
    const steps = {
      'category': 'name',
      'name': 'datetime',
      'datetime': 'confirm',
      'confirm': 'category'
    };
    return steps[currentStep as keyof typeof steps] || currentStep;
  }

  getCurrentState(): WorkflowState | null {
    return this.currentState;
  }

  isInWorkflow(): boolean {
    return this.currentWorkflow !== null;
  }

  endWorkflow(): void {
    this.currentWorkflow = null;
    this.currentState = null;
  }
}