import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Board as BoardType } from '@/types/task';
import { Board } from '@/components/board/Board';
import { AddColumnModal } from '@/components/board/AddColumnModal';
import { fetchBoard } from '@/lib/api';

export function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<BoardType | null>(null);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);

  const loadBoard = async () => {
    if (!id) return;      
    try {
      const data = await fetchBoard(id);  
      if (data) {
        setBoard(data);
      }
    } catch (error) {
      console.error('Erro ao carregar board:', error);
    }
  };

  useEffect(() => {
    loadBoard();
  }, [id]);

  if (!board) return null;

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{board.title}</h1>
        <button
          onClick={() => setIsAddColumnModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Nova Coluna
        </button>
      </div>

      <Board 
        columns={board.columns} 
        onColumnsUpdated={loadBoard}
      />

      <AddColumnModal
        boardId={board.id}
        isOpen={isAddColumnModalOpen}
        onClose={() => setIsAddColumnModalOpen(false)}
        onColumnAdded={loadBoard}
      />
    </div>
  );
} 