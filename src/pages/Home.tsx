import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fetchBoards } from '../lib/api';

interface BoardWithCount {
  id: string;
  title: string;
  updatedAt: string;
  _count: {
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
        setError('Erro ao carregar os boards. Tente novamente mais tarde.');
        console.error('Erro ao carregar boards:', err);
      } finally {
        setLoading(false);
      }
    }

    loadBoards();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Carregando...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bem-vindo ao Kanban</h1>
        <Link
          to="/boards/new"
          className="btn btn-primary"
        >
          <PlusIcon className="h-5 w-5" />
          <span className="ml-2">Novo Board</span>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {boards.map((board) => (
          <Link
            key={board.id}
            to={`/boards/${board.id}`}
            className="card group p-6 transition-shadow hover:shadow-md"
          >
            <h2 className="text-xl font-semibold group-hover:text-primary">
              {board.title}
            </h2>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>{board._count.tasks} tarefas</span>
              <span>
                Atualizado {format(new Date(board.updatedAt), "d 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
          </Link>
        ))}

        {boards.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            <p className="mb-4">Nenhum board encontrado.</p>
            <Link to="/boards/new" className="btn btn-secondary">
              Criar meu primeiro board
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 