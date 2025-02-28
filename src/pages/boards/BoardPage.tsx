import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Board as BoardComponent } from '../../components/board/Board';
import { fetchBoard } from '../../lib/api';
import { Board as BoardType, Column, Task } from '../../types/task';

export function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<BoardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBoard() {
      if (!id) return;

      try {
        const data = await fetchBoard(id);
        setBoard({
          id: data.id,
          title: data.title,
          columns: data.columns.map((col: { id: string; title: string; order: number; tasks: any[] }) => ({
            id: col.id,
            title: col.title,
            status: col.order === 0 ? 'todo' : col.order === 1 ? 'in-progress' : 'done',
            tasks: col.tasks.map((task: { id: string; title: string; description: string | null; priority: string; createdAt: string; updatedAt: string }) => ({
              id: task.id,
              title: task.title,
              description: task.description,
              priority: task.priority as 'low' | 'medium' | 'high',
              status: col.order === 0 ? 'todo' : col.order === 1 ? 'in-progress' : 'done',
              createdAt: new Date(task.createdAt),
              updatedAt: new Date(task.updatedAt),
            })),
          })),
        });
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar o board:', err);
        setError('Erro ao carregar o board. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Board não encontrado</div>
      </div>
    );
  }

  return <BoardComponent title={board.title} initialColumns={board.columns} />;
} 