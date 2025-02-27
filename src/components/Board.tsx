import { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Column from './Column';

interface BoardProps {
  id: number;
  name: string;
}

export interface ColumnType {
  id: number;
  name: string;
  cards: CardType[];
}

export interface CardType {
  id: number;
  title: string;
  description: string;
}

const Board: React.FC<BoardProps> = ({ id, name }) => {
  const [columns, setColumns] = useState<ColumnType[]>([
    {
      id: 1,
      name: 'A Fazer',
      cards: [
        { id: 1, title: 'Tarefa 1', description: 'Descrição da tarefa 1' },
        { id: 2, title: 'Tarefa 2', description: 'Descrição da tarefa 2' },
      ],
    },
    {
      id: 2,
      name: 'Em Progresso',
      cards: [
        { id: 3, title: 'Tarefa 3', description: 'Descrição da tarefa 3' },
      ],
    },
    {
      id: 3,
      name: 'Concluído',
      cards: [],
    },
  ]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColIndex = columns.findIndex(
      col => col.id.toString() === source.droppableId
    );
    const destColIndex = columns.findIndex(
      col => col.id.toString() === destination.droppableId
    );

    if (sourceColIndex === -1 || destColIndex === -1) return;

    const newColumns = JSON.parse(JSON.stringify(columns));

    const [movedCard] = newColumns[sourceColIndex].cards.splice(source.index, 1);

    newColumns[destColIndex].cards.splice(destination.index, 0, movedCard);

    setColumns(newColumns);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Novo Quadro
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-8 min-h-[calc(100vh-12rem)]">
            {columns.map((column) => (
              <Column key={column.id} column={column} />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Board; 