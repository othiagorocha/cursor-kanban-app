import { Draggable } from '@hello-pangea/dnd';
import { Task as TaskType } from '../../types/task';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskProps {
  task: TaskType;
  index: number;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function Task({ task, index }: TaskProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 card p-3 ${
            snapshot.isDragging ? 'bg-accent' : ''
          }`}
        >
          <h3 className="font-medium">{task.title}</h3>
          {task.description && (
            <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
          )}
          <div className="mt-2 flex items-center justify-between">
            <span
              className={`rounded px-2 py-1 text-xs font-medium ${
                priorityColors[task.priority as keyof typeof priorityColors]
              }`}
            >
              {task.priority}
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