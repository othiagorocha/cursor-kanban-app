import { useState } from 'react';
import { Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import type { ColumnType, CardType } from './Board';
import Card from './Card';
import { PlusIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

interface ColumnProps {
  column: ColumnType;
}

const Column: React.FC<ColumnProps> = ({ column }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;

    const newCard: CardType = {
      id: Date.now(),
      title: newCardTitle.trim(),
      description: '',
    };

    column.cards = [...column.cards, newCard];
    
    setNewCardTitle('');
    setIsAddingCard(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl w-80 flex-shrink-0 flex flex-col shadow-sm border border-slate-200">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{column.name}</h2>
            <p className="text-sm text-slate-500">{column.cards.length} cards</p>
          </div>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <EllipsisHorizontalIcon className="w-6 h-6 text-slate-400" />
          </button>
        </div>
      </div>

      <Droppable droppableId={column.id.toString()}>
        {(provided: DroppableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 p-4 space-y-3 min-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
          >
            {column.cards.map((card, index) => (
              <Draggable
                key={card.id}
                draggableId={card.id.toString()}
                index={index}
              >
                {(dragProvided: DraggableProvided) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <Card card={card} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        {isAddingCard ? (
          <div className="space-y-3">
            <textarea
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
              placeholder="Digite o título do card..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddCard()}
            />
            <div className="flex gap-2">
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                onClick={handleAddCard}
              >
                Adicionar
              </button>
              <button
                className="flex-1 px-4 py-2 bg-white text-slate-700 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors duration-200 text-sm font-medium"
                onClick={() => setIsAddingCard(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 w-full px-3 py-2 rounded-lg hover:bg-white group"
            onClick={() => setIsAddingCard(true)}
          >
            <PlusIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Adicionar card</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Column; 