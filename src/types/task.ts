import type { Prisma } from '@prisma/client';

export type Priority = 'low' | 'medium' | 'high';

export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: Priority;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  status: Status;
  tasks: Task[];
  _count?: {
    tasks: number;
  };
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  updatedAt?: Date;
} 