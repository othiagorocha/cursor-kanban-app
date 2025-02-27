import { useState } from 'react';
import type { CardType } from './Board';

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 
                 cursor-pointer border border-gray-100 hover:border-blue-200 group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{card.title}</h3>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          Tarefa
        </span>
      </div>
      {isExpanded && card.description && (
        <p className="mt-3 text-gray-600 text-sm border-t pt-3 border-gray-100">
          {card.description}
        </p>
      )}
    </div>
  );
};

export default Card; 