import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Task } from '@/types/task';

interface TaskModalProps {
  task?: Task;
  columnId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskModal({ task, columnId, isOpen, onClose }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (task) {
        // Atualizar tarefa existente
        await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description, priority }),
        });
      } else {
        // Criar nova tarefa
        await fetch(`/api/columns/${columnId}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description, priority }),
        });
      }

      onClose();
      setTitle('');
      setDescription('');
      setPriority('low');
    } catch (err) {
      setError(task ? 'Erro ao atualizar tarefa' : 'Erro ao criar tarefa');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return;
    }

    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });
      onClose();
    } catch (err) {
      setError('Erro ao excluir tarefa');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Editar Tarefa' : 'Nova Tarefa'}
    >
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

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 min-h-[100px]"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Prioridade
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-between">
          {task && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Excluir
            </button>
          )}
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
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isSubmitting
                ? task
                  ? 'Salvando...'
                  : 'Criando...'
                : task
                ? 'Salvar'
                : 'Criar'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
} 