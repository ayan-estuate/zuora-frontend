export interface Workflow {
  id: string;
  workflowName: string;
  summary: string;
  payload: Record<string, any>;
  requester: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface ApprovalRequest {
  comment?: string;
}
