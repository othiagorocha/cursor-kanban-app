import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBoard } from '../../lib/api';

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
      const board = await createBoard({ title: title.trim() });
      navigate(`/boards/${board.id}`);
    } catch (err) {
      console.error('Erro ao criar board:', err);
      setError('Erro ao criar o board. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Criar Novo Board</h1>

      <form onSubmit={handleSubmit} className="mt-8">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-muted-foreground">
            Título do Board
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Digite o título do board"
            disabled={loading}
          />
          {error && (
            <p className="mt-2 text-sm text-destructive">{error}</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !title.trim()}
          >
            {loading ? 'Criando...' : 'Criar Board'}
          </button>
        </div>
      </form>
    </div>
  );
} 