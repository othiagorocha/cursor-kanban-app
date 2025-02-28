import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createBoard } from '../../lib/api';
import { Button } from '../../components/ui/Button';

export function NewBoard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Criando board com título:', title.trim());
      const board = await createBoard({ title: title.trim() });
      console.log('Board criado com sucesso:', board);
      navigate(`/boards/${board.id}`);
    } catch (err) {
      console.error('Erro detalhado ao criar board:', err);
      if (err instanceof Error) {
        setError(`Erro ao criar board: ${err.message}`);
      } else {
        setError('Não foi possível criar o board. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 text-muted-foreground hover:text-foreground"
        onClick={() => navigate(-1)}
        leftIcon={<ArrowLeft className="h-4 w-4" />}
      >
        Voltar
      </Button>

      <div className="rounded-lg border bg-card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="title" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Título do Board
            </label>
            <p className="text-[0.8rem] text-muted-foreground">
              Escolha um nome descritivo para seu board
            </p>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Ex: Projeto Website"
              disabled={loading}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              disabled={loading || !title.trim()}
            >
              Criar Board
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 