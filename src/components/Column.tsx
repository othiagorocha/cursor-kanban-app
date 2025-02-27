import { useState } from 'react';
import { Droppable, Draggable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import type { ColumnType, CardType } from './Board';
import Card from './Card';
import { PlusIcon } from '@heroicons/react/24/outline';

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
    <div className="bg-gray-50 rounded-xl w-80 flex-shrink-0 flex flex-col shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{column.name}</h2>
      </div>

      <Droppable droppableId={column.id.toString()}>
        {(provided: DroppableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 p-4 space-y-3 min-h-[200px] overflow-y-auto"
          >
            {column.cards.map((card, index) => (
              <Draggable
                key={card.id}
                draggableId={card.id.toString()}
                index={index}
              >
                {(provided: DraggableProvided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
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

      <div className="p-4 border-t border-gray-200">
        {isAddingCard ? (
          <div className="space-y-3">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o título do cartão"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCard()}
            />
            <div className="flex gap-2">
              <button
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                onClick={handleAddCard}
              >
                Adicionar
              </button>
              <button
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                onClick={() => setIsAddingCard(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 w-full px-3 py-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsAddingCard(true)}
          >
            <PlusIcon className="w-5 h-5" />
            <span>Adicionar cartão</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Column; 