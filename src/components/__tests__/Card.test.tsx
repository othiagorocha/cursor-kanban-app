import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Card from '../Card';
import type { CardType } from '../Board';

describe('Card Component', () => {
  const mockCard: CardType = {
    id: 1,
    title: 'Teste de Card',
    description: 'Descrição do card de teste',
  };

  it('deve renderizar o título do card', () => {
    render(<Card card={mockCard} />);
    expect(screen.getByText('Teste de Card')).toBeInTheDocument();
  });

  it('deve mostrar a descrição quando expandido', () => {
    render(<Card card={mockCard} />);
    
    // Inicialmente a descrição não deve estar visível
    expect(screen.queryByText('Descrição do card de teste')).not.toBeInTheDocument();

    // Clica no card para expandir
    fireEvent.click(screen.getByText('Teste de Card'));

    // Agora a descrição deve estar visível
    expect(screen.getByText('Descrição do card de teste')).toBeInTheDocument();
  });

  it('deve mostrar o label "Tarefa"', () => {
    render(<Card card={mockCard} />);
    expect(screen.getByText('Tarefa')).toBeInTheDocument();
  });

  it('deve mostrar os ícones de comentários e prazo', () => {
    render(<Card card={mockCard} />);
    expect(screen.getByText('2')).toBeInTheDocument(); // Número de comentários
    expect(screen.getByText('3 dias')).toBeInTheDocument(); // Prazo
  });

  it('deve mostrar as imagens dos membros', () => {
    render(<Card card={mockCard} />);
    const images = screen.getAllByRole('img', { name: /Membro/i });
    expect(images).toHaveLength(2);
  });

  it('deve alternar a visibilidade da descrição ao clicar', () => {
    render(<Card card={mockCard} />);
    
    // Primeiro clique - mostra a descrição
    fireEvent.click(screen.getByText('Teste de Card'));
    expect(screen.getByText('Descrição do card de teste')).toBeInTheDocument();

    // Segundo clique - esconde a descrição
    fireEvent.click(screen.getByText('Teste de Card'));
    expect(screen.queryByText('Descrição do card de teste')).not.toBeInTheDocument();
  });
}); 