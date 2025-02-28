import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useState } from 'react';
import { Column as ColumnType, Task } from '../../types/task';
import { Column } from './Column';

interface BoardProps {
  title: string;
  initialColumns: ColumnType[];
}

export function Board({ title, initialColumns }: BoardProps) {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // Se não houver destino, não fazer nada
    if (!destination) return;

    // Se o destino for o mesmo que a origem, não fazer nada
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Movendo colunas
    if (type === 'column') {
      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);
      setColumns(newColumns);
      return;
    }

    // Movendo tarefas
    const sourceColumn = columns.find(
      (col) => col.id === source.droppableId
    );
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destColumn) return;

    // Movendo na mesma coluna
    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      const newColumns = columns.map((col) =>
        col.id === sourceColumn.id
          ? { ...col, tasks: newTasks }
          : col
      );

      setColumns(newColumns);
      return;
    }

    // Movendo entre colunas
    const sourceTasks = Array.from(sourceColumn.tasks);
    const [removed] = sourceTasks.splice(source.index, 1);
    const destinationTasks = Array.from(destColumn.tasks);
    destinationTasks.splice(destination.index, 0, removed);

    const newColumns = columns.map((col) => {
      if (col.id === source.droppableId) {
        return { ...col, tasks: sourceTasks };
      }
      if (col.id === destination.droppableId) {
        return { ...col, tasks: destinationTasks };
      }
      return col;
    });

    setColumns(newColumns);
  };

  return (
    <div className="h-full min-h-screen bg-background p-4">
      <h1 className="mb-8 text-2xl font-bold">{title}</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="board"
          type="column"
          direction="horizontal"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 gap-4 md:grid-cols-3"
            >
              {columns.map((column, index) => (
                <Column
                  key={column.id}
                  column={column}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
} 