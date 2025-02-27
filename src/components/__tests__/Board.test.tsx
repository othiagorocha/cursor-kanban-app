import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { DragDropContext } from 'react-beautiful-dnd';
import Board from '../Board';

// Mock do react-beautiful-dnd
const mockOnDragEnd = vi.fn();
vi.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => children,
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

describe('Board Component', () => {
  const defaultProps = {
    id: 1,
    name: 'Meu Kanban',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o título do board', () => {
    render(<Board {...defaultProps} />);
    expect(screen.getByText('Meu Kanban')).toBeInTheDocument();
  });

  it('deve renderizar todas as colunas iniciais', () => {
    render(<Board {...defaultProps} />);
    expect(screen.getByText('A Fazer')).toBeInTheDocument();
    expect(screen.getByText('Em Progresso')).toBeInTheDocument();
    expect(screen.getByText('Concluído')).toBeInTheDocument();
  });

  it('deve renderizar os cards iniciais', () => {
    render(<Board {...defaultProps} />);
    expect(screen.getByText('Implementar Autenticação')).toBeInTheDocument();
    expect(screen.getByText('Design System')).toBeInTheDocument();
    expect(screen.getByText('API REST')).toBeInTheDocument();
  });

  it('deve mostrar o contador correto de cards em cada coluna', () => {
    render(<Board {...defaultProps} />);
    expect(screen.getByText('2 cards')).toBeInTheDocument(); // Coluna "A Fazer"
    expect(screen.getByText('1 cards')).toBeInTheDocument(); // Coluna "Em Progresso"
    expect(screen.getByText('0 cards')).toBeInTheDocument(); // Coluna "Concluído"
  });

  it('deve ter um botão para adicionar nova coluna', () => {
    render(<Board {...defaultProps} />);
    expect(screen.getByText('Adicionar Coluna')).toBeInTheDocument();
  });

  it('deve ter botões de ação no header', () => {
    render(<Board {...defaultProps} />);
    expect(screen.getByText('Novo Card')).toBeInTheDocument();
    expect(screen.getByText('Compartilhar')).toBeInTheDocument();
  });
}); 