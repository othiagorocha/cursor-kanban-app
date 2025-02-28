// Se o tipo Prisma não está sendo usado, remova a importação
// import type { Prisma } from '@prisma/client';

export type Priority = 'low' | 'medium' | 'high';

export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  order: number;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  status: Status;
  order: number;
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