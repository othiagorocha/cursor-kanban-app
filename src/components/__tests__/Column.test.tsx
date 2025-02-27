import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Column from '../Column';
import type { ColumnType } from '../Board';

// Mock do react-beautiful-dnd
vi.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }: { children: Function }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: vi.fn(),
  }, {}),
  Draggable: ({ children }: { children: Function }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: vi.fn(),
    dragHandleProps: {},
  }, {}),
}));

describe('Column Component', () => {
  const mockColumn: ColumnType = {
    id: 1,
    name: 'A Fazer',
    cards: [
      { id: 1, title: 'Card 1', description: 'Descrição 1' },
      { id: 2, title: 'Card 2', description: 'Descrição 2' },
    ],
  };

  const mockOnUpdateColumn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o nome da coluna', () => {
    render(<Column column={mockColumn} onUpdateColumn={mockOnUpdateColumn} />);
    expect(screen.getByText('A Fazer')).toBeInTheDocument();
  });

  it('deve mostrar o contador correto de cards', () => {
    render(<Column column={mockColumn} onUpdateColumn={mockOnUpdateColumn} />);
    expect(screen.getByText('2 cards')).toBeInTheDocument();
  });

  it('deve renderizar todos os cards da coluna', () => {
    render(<Column column={mockColumn} onUpdateColumn={mockOnUpdateColumn} />);
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  it('deve mostrar o formulário de adição de card ao clicar no botão', () => {
    render(<Column column={mockColumn} onUpdateColumn={mockOnUpdateColumn} />);
    
    const addButton = screen.getByText('Adicionar card');
    fireEvent.click(addButton);

    expect(screen.getByPlaceholderText('Digite o título do card...')).toBeInTheDocument();
    expect(screen.getByText('Adicionar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('deve adicionar um novo card quando o formulário for submetido', () => {
    render(<Column column={mockColumn} onUpdateColumn={mockOnUpdateColumn} />);
    
    // Abre o formulário
    fireEvent.click(screen.getByText('Adicionar card'));

    // Preenche o título
    const input = screen.getByPlaceholderText('Digite o título do card...');
    fireEvent.change(input, { target: { value: 'Novo Card' } });

    // Submete o formulário
    fireEvent.click(screen.getByText('Adicionar'));

    // Verifica se onUpdateColumn foi chamado com o novo card
    expect(mockOnUpdateColumn).toHaveBeenCalledWith({
      ...mockColumn,
      cards: [...mockColumn.cards, expect.objectContaining({ title: 'Novo Card' })],
    });
  });

  it('deve limpar o formulário ao cancelar', () => {
    render(<Column column={mockColumn} onUpdateColumn={mockOnUpdateColumn} />);
    
    // Abre o formulário
    fireEvent.click(screen.getByText('Adicionar card'));

    // Preenche o título
    const input = screen.getByPlaceholderText('Digite o título do card...');
    fireEvent.change(input, { target: { value: 'Novo Card' } });

    // Cancela o formulário
    fireEvent.click(screen.getByText('Cancelar'));

    // Verifica se o formulário foi fechado
    expect(screen.queryByPlaceholderText('Digite o título do card...')).not.toBeInTheDocument();
  });
}); 