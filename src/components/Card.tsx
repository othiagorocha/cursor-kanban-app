import { useState } from 'react';
import type { CardType } from './Board';
import { ChatBubbleLeftIcon, ClockIcon } from '@heroicons/react/24/outline';

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="bg-white rounded-lg p-3 shadow-sm hover:shadow transition-all duration-200 
                 cursor-pointer border border-slate-200 hover:border-blue-200 group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
            {card.title}
          </h3>
          <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full whitespace-nowrap">
            Tarefa
          </span>
        </div>

        {isExpanded && card.description && (
          <p className="text-sm text-slate-600 border-t border-slate-100 pt-2">
            {card.description}
          </p>
        )}

        <div className="flex items-center justify-between text-slate-500 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ChatBubbleLeftIcon className="w-4 h-4" />
              <span>2</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>3 dias</span>
            </div>
          </div>
          
          <div className="flex -space-x-2">
            <img
              className="w-6 h-6 rounded-full border-2 border-white"
              src="https://ui-avatars.com/api/?name=John+Doe&background=random"
              alt="Membro"
            />
            <img
              className="w-6 h-6 rounded-full border-2 border-white"
              src="https://ui-avatars.com/api/?name=Jane+Smith&background=random"
              alt="Membro"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card; 