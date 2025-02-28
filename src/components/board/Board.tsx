import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Column as ColumnType } from '@/types/task';
import { Column } from './Column';
import { EditColumnModal } from './EditColumnModal';

interface BoardProps {
  columns: ColumnType[];
  onColumnsUpdated: () => void;
}

export function Board({ columns, onColumnsUpdated }: BoardProps) {
  const [editingColumn, setEditingColumn] = useState<ColumnType | null>(null);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'COLUMN') {
      if (source.index === destination.index) return;
      onColumnsUpdated();
      return;
    }

    if (source.droppableId === destination.droppableId && 
        source.index === destination.index) {
      return;
    }

    onColumnsUpdated();
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {columns.map((column, index) => (
              <Draggable key={column.id} draggableId={column.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Column
                      column={column}
                      index={index}
                      onEdit={() => setEditingColumn(column)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {editingColumn && (
        <EditColumnModal
          column={editingColumn}
          isOpen={true}
          onClose={() => setEditingColumn(null)}
          onSuccess={onColumnsUpdated}
        />
      )}
    </DragDropContext>
  );
} 