import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Board as BoardComponent } from '../../components/board/Board';
import { prisma } from '../../lib/prisma';
import { Board as BoardType, Column } from '../../types/task';

export function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<BoardType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBoard() {
      if (!id) return;

      try {
        const data = await prisma.board.findUnique({
          where: { id },
          include: {
            columns: {
              include: {
                tasks: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        });

        if (data) {
          setBoard({
            id: data.id,
            title: data.title,
            columns: data.columns.map((col) => ({
              id: col.id,
              title: col.title,
              status: col.order === 0 ? 'todo' : col.order === 1 ? 'in-progress' : 'done',
              tasks: col.tasks.map((task) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                priority: task.priority as 'low' | 'medium' | 'high',
                status: col.order === 0 ? 'todo' : col.order === 1 ? 'in-progress' : 'done',
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
              })),
            })),
          });
        }
      } catch (error) {
        console.error('Erro ao carregar o board:', error);
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

  if (!board) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Board não encontrado</div>
      </div>
    );
  }

  return <BoardComponent title={board.title} initialColumns={board.columns} />;
} 