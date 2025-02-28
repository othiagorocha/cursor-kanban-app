import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ClockIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fetchBoards } from '../lib/api';

interface BoardWithCount {
  id: string;
  title: string;
  updatedAt: Date;
  _count: {
    columns: number;
    tasks: number;
  };
}

export function Home() {
  const [boards, setBoards] = useState<BoardWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBoards() {
      try {
        const data = await fetchBoards();
        setBoards(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar boards:', err);
        setError('Não foi possível carregar os boards. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    loadBoards();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Carregando boards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-muted-foreground">
            Seus Boards
          </h2>
          <p className="text-sm text-muted-foreground">
            Total de {boards.length} board{boards.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          to="/boards/new"
          className="btn btn-primary"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo Board
        </Link>
      </div>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <PlusIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">Nenhum board encontrado</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Comece criando seu primeiro board para organizar suas tarefas.
          </p>
          <Link
            to="/boards/new"
            className="btn btn-primary mt-4"
          >
            Criar Primeiro Board
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <Link
              key={board.id}
              to={`/boards/${board.id}`}
              className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-colors hover:border-primary"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium group-hover:text-primary">
                  {board.title}
                </h3>
                <span className="flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium">
                  {board._count.tasks} tarefas
                </span>
              </div>
              
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>
                    {format(new Date(board.updatedAt), "d 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <span>•</span>
                <span>{board._count.columns} colunas</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/40 to-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 