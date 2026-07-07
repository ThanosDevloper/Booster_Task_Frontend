export type TaskStatus = 'PENDING' | 'COMPLETED';

export interface Task {
  id?: number;
  name: string;
  description: string;
  status: TaskStatus;
  createdAt?: string;
}
