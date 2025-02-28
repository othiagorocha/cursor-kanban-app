import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Column as ColumnType, Task as TaskType } from '@/types/task';
import { AddTaskModal } from './AddTaskModal';

interface ColumnProps {
  column: ColumnType;
  index: number;
  onEdit: () => void;
}

export function Column({ column, index, onEdit }: ColumnProps) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  return (
    <div className="bg-card rounded-lg p-4 min-h-[200px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{column.title}</h3>
          <span className="text-sm text-muted-foreground">
            {column.tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="p-1 hover:bg-accent rounded-md"
            title="Adicionar tarefa"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
          <button
            onClick={onEdit}
            className="p-1 hover:bg-accent rounded-md"
            title="Editar coluna"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1">
        {column.tasks.map((task, taskIndex) => (
          <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="bg-background rounded-md p-3 mb-2 shadow-sm border"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium">{task.title}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {task.priority === 'high'
                      ? 'Alta'
                      : task.priority === 'medium'
                      ? 'Média'
                      : 'Baixa'}
                  </span>
                </div>
                {task.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}
              </div>
            )}
          </Draggable>
        ))}
      </div>

      <AddTaskModal
        columnId={column.id}
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskAdded={onEdit}
      />
    </div>
  );
} 