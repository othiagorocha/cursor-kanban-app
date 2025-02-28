import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Column as ColumnType } from '../../types/task';
import { Task } from './Task';

interface ColumnProps {
  column: ColumnType;
  index: number;
}

export function Column({ column, index }: ColumnProps) {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="card p-4"
        >
          <div
            {...provided.dragHandleProps}
            className="mb-4 flex items-center justify-between"
          >
            <h2 className="text-lg font-semibold">{column.title}</h2>
            <span className="rounded-full bg-secondary px-2 py-1 text-sm text-secondary-foreground">
              {column.tasks.length}
            </span>
          </div>

          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-[200px] rounded-md ${
                  snapshot.isDraggingOver ? 'bg-accent' : 'bg-card'
                }`}
              >
                {column.tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
} 