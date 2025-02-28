const API_URL = 'http://localhost:3001/api';

export async function fetchBoards() {
  const response = await fetch(`${API_URL}/boards`);
  if (!response.ok) {
    throw new Error('Falha ao carregar os boards');
  }
  return response.json();
}

export async function fetchBoard(id: string) {
  const response = await fetch(`${API_URL}/boards/${id}`);
  if (!response.ok) {
    throw new Error('Falha ao carregar o board');
  }
  return response.json();
}

export async function createBoard(data: { title: string }) {
  const response = await fetch(`${API_URL}/boards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Falha ao criar o board');
  }
  return response.json();
} 