import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Column as ColumnType } from '@/types/task';
import { Column } from '@/components/board/Column';
import { EditBoardModal } from '@/components/board/EditBoardModal';
import { AddColumnModal } from '@/components/board/AddColumnModal';
import { EditColumnModal } from '@/components/board/EditColumnModal';
import { useBoard } from '@/hooks/useBoard';

export function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const { board, isLoading, error, handleDragEnd } = useBoard(id!);
  const [isEditBoardModalOpen, setIsEditBoardModalOpen] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [columnToEdit, setColumnToEdit] = useState<ColumnType | null>(null);

  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (error || !board) {
    return <div className="p-4 text-red-500">Erro ao carregar o board.</div>;
  }

  return (
    <div className="h-full p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{board.title}</h1>
          <button
            onClick={() => setIsEditBoardModalOpen(true)}
            className="rounded-full p-2 hover:bg-accent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
        <button
          onClick={() => setIsAddColumnModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
          Nova Coluna
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex h-full gap-4 overflow-x-auto pb-4"
            >
              {board.columns.map((column, index) => (
                <Column
                  key={column.id}
                  column={column}
                  index={index}
                  onEdit={() => setColumnToEdit(column)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {board && (
        <EditBoardModal
          board={board}
          isOpen={isEditBoardModalOpen}
          onClose={() => setIsEditBoardModalOpen(false)}
        />
      )}

      <AddColumnModal
        boardId={id!}
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        onColumnAdded={() => { /* Implementar lógica aqui */ }}
      />

      {columnToEdit && (
        <EditColumnModal
          column={columnToEdit}
          isOpen={true}
          onClose={() => setColumnToEdit(null)}
          onSuccess={() => { /* Implementar lógica aqui */ }}
        />
      )}
    </div>
  );
} 