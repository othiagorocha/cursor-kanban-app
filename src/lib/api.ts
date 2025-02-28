import { Board } from '@/types/task';

const API_URL = 'http://localhost:3001/api';

export async function fetchBoards() {
  const response = await fetch(`${API_URL}/boards`);
  if (!response.ok) {
    throw new Error('Falha ao carregar os boards');
  }
  return response.json();
}

export async function fetchBoard(id: string): Promise<Board> {
  const response = await fetch(`${API_URL}/boards/${id}`);
  if (!response.ok) {
    throw new Error('Falha ao carregar o board');
  }
  return response.json();
}

export async function createBoard(data: { title: string }) {
  console.log('Enviando requisição para criar board:', data);
  
  const response = await fetch(`${API_URL}/boards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  console.log('Resposta do servidor:', responseData);

  if (!response.ok) {
    throw new Error(responseData.error || responseData.details || 'Falha ao criar o board');
  }

  return responseData;
}

export async function updateBoard(id: string, data: { title: string }) {
  const response = await fetch(`${API_URL}/boards/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update board');
  }

  return response.json();
}

export async function deleteBoard(id: string) {
  const response = await fetch(`${API_URL}/boards/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete board');
  }
}

export async function createColumn(boardId: string, data: { title: string }) {
  const response = await fetch(`${API_URL}/boards/${boardId}/columns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create column');
  }

  return response.json();
}

export async function updateColumn(id: string, data: { title: string }) {
  const response = await fetch(`${API_URL}/columns/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update column');
  }

  return response.json();
}

export async function deleteColumn(id: string) {
  const response = await fetch(`${API_URL}/columns/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete column');
  }
}

export async function createTask(columnId: string, data: { title: string; description?: string; priority?: string }) {
  const response = await fetch(`${API_URL}/columns/${columnId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Falha ao criar tarefa');
  }

  return response.json();
}

export async function updateTask(taskId: string, data: { title?: string; description?: string; priority?: string; status?: string }) {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Falha ao atualizar tarefa');
  }

  return response.json();
}

export async function deleteTask(taskId: string) {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Falha ao deletar tarefa');
  }
}

export async function updateTaskOrder(columnId: string, taskIds: string[]) {
  const response = await fetch(`${API_URL}/columns/${columnId}/tasks/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskIds }),
  });

  if (!response.ok) {
    throw new Error('Falha ao reordenar tarefas');
  }

  return response.json();
} 