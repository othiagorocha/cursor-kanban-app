import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { createColumn } from '@/lib/api';

interface AddColumnModalProps {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
  onColumnAdded: () => void;
}

export function AddColumnModal({ boardId, isOpen, onClose, onColumnAdded }: AddColumnModalProps) {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createColumn(boardId, { title });
      onColumnAdded();
      onClose();
    } catch (error) {
      console.error('Erro ao criar coluna:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Coluna">
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

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Criando...' : 'Criar Coluna'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 