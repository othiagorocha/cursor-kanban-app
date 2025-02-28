import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Board } from '@/types/task';
import { deleteBoard, updateBoard } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface EditBoardModalProps {
  board: Board;
  isOpen: boolean;
  onClose: () => void;
}

export function EditBoardModal({ board, isOpen, onClose }: EditBoardModalProps) {
  const [title, setTitle] = useState(board.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await updateBoard(board.id, { title });
      navigate('/boards');
      onClose();
    } catch (err) {
      setError('Não foi possível atualizar o board. Tente novamente.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este board?')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await deleteBoard(board.id);
      navigate('/boards');
    } catch (err) {
      setError('Não foi possível excluir o board. Tente novamente.');
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Board">
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
            {isDeleting ? 'Excluindo...' : 'Excluir Board'}
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