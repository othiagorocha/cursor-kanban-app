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
        { id: 1, title: 'Implementar Autenticação', description: 'Adicionar login com Google e GitHub' },
        { id: 2, title: 'Design System', description: 'Criar componentes base do design system' },
      ],
    },
    {
      id: 2,
      name: 'Em Progresso',
      cards: [
        { id: 3, title: 'API REST', description: 'Desenvolver endpoints da API REST' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{name}</h1>
            <p className="text-slate-600">Gerencie suas tarefas de forma eficiente</p>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white text-slate-700 rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-200 flex items-center gap-2 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Novo Card
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Compartilhar
            </button>
          </div>
        </div>

        {/* Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-8 min-h-[calc(100vh-12rem)]">
            {columns.map((column) => (
              <Column key={column.id} column={column} />
            ))}
            
            {/* Add Column Button */}
            <button className="bg-white/50 backdrop-blur-sm rounded-xl w-80 flex-shrink-0 h-[100px] flex items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-400 transition-all duration-200 group">
              <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Adicionar Coluna</span>
              </div>
            </button>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Board; 