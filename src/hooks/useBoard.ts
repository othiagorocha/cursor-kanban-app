import { useState, useEffect } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { Board } from '@/types/task';

export function useBoard(id: string) {
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBoard();
  }, [id]);

  async function loadBoard() {
    try {
      const response = await fetch(`/api/boards/${id}`);
      if (!response.ok) {
        throw new Error('Failed to load board');
      }
      const data = await response.json();
      setBoard(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar o board');
      console.error('Error loading board:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle column reordering
    if (type === 'COLUMN') {
      const newColumns = Array.from(board!.columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);

      const updatedBoard = {
        ...board!,
        columns: newColumns,
      };

      setBoard(updatedBoard);

      try {
        await fetch(`/api/boards/${id}/columns/reorder`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            columnId: draggableId,
            newOrder: destination.index,
          }),
        });
      } catch (err) {
        console.error('Error reordering columns:', err);
        loadBoard(); // Reload board on error to restore original state
      }
      return;
    }

    // Handle task reordering
    const sourceColumn = board!.columns.find(
      (col) => col.id === source.droppableId
    );
    const destColumn = board!.columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destColumn) return;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const newTasks = Array.from(sourceColumn.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      const newColumns = board!.columns.map((col) =>
        col.id === sourceColumn.id ? { ...col, tasks: newTasks } : col
      );

      setBoard({ ...board!, columns: newColumns });

      try {
        await fetch(`/api/columns/${sourceColumn.id}/tasks/reorder`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            taskId: draggableId,
            newIndex: destination.index,
          }),
        });
      } catch (err) {
        console.error('Error reordering tasks:', err);
        loadBoard();
      }
    } else {
      // Moving task between columns
      const sourceTasks = Array.from(sourceColumn.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      const destTasks = Array.from(destColumn.tasks);
      destTasks.splice(destination.index, 0, removed);

      const newColumns = board!.columns.map((col) => {
        if (col.id === sourceColumn.id) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destColumn.id) {
          return { ...col, tasks: destTasks };
        }
        return col;
      });

      setBoard({ ...board!, columns: newColumns });

      try {
        await fetch(`/api/tasks/${draggableId}/move`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceColumnId: sourceColumn.id,
            destinationColumnId: destColumn.id,
            newIndex: destination.index,
          }),
        });
      } catch (err) {
        console.error('Error moving task:', err);
        loadBoard();
      }
    }
  };

  return { board, isLoading, error, handleDragEnd };
} 