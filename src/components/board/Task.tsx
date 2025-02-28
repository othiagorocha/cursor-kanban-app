import { Draggable } from '@hello-pangea/dnd';
import { Task as TaskType } from '@/types/task';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskProps {
  task: TaskType;
  index: number;
  onEdit: () => void;
}

const priorityColors = {
  low: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  high: 'bg-red-500/10 text-red-500',
};

export function Task({ task, index, onEdit }: TaskProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`card p-3 ${snapshot.isDragging ? 'bg-accent' : ''}`}
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium">{task.title}</h4>
            <button
              onClick={onEdit}
              className="rounded-full p-1 hover:bg-accent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
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

          {task.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span
              className={`rounded px-2 py-1 text-xs font-medium ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority === 'low'
                ? 'Baixa'
                : task.priority === 'medium'
                ? 'Média'
                : 'Alta'}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(task.createdAt, "d 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
} 