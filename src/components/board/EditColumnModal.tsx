import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Column } from '@/types/task';
import { deleteColumn, updateColumn } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface EditColumnModalProps {
  column: Column;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditColumnModal({ column, isOpen, onClose, onSuccess }: EditColumnModalProps) {
  const [title, setTitle] = useState(column.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await updateColumn(column.id, { title });
      navigate(0);
      onClose();
      onSuccess();
    } catch (err) {
      setError('Não foi possível atualizar a coluna. Tente novamente.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta coluna? Todas as tarefas serão excluídas.')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await deleteColumn(column.id);
      navigate(0);
      onClose();
      onSuccess();
    } catch (err) {
      setError('Não foi possível excluir a coluna. Tente novamente.');
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Coluna">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir Coluna'}
          </button>
          <div className="space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded-md"
            >
              Salvar
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
} 