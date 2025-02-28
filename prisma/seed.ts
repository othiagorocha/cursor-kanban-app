import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpa o banco de dados
  await prisma.task.deleteMany();
  await prisma.column.deleteMany();
  await prisma.board.deleteMany();

  // Cria um board de exemplo
  const board = await prisma.board.create({
    data: {
      title: 'Meu Primeiro Board',
      columns: {
        create: [
          {
            id: 'todo',
            title: 'A Fazer',
            order: 0,
            tasks: {
              create: [
                {
                  id: 'task-1',
                  title: 'Implementar autenticação',
                  description: 'Adicionar sistema de login com Google',
                  priority: 'high',
                },
                {
                  id: 'task-2',
                  title: 'Melhorar UI',
                  description: 'Adicionar temas dark/light',
                  priority: 'medium',
                },
              ],
            },
          },
          {
            id: 'doing',
            title: 'Em Progresso',
            order: 1,
            tasks: {
              create: [
                {
                  id: 'task-3',
                  title: 'Drag and Drop',
                  description: 'Implementar arrastar e soltar de tarefas',
                  priority: 'high',
                },
              ],
            },
          },
          {
            id: 'done',
            title: 'Concluído',
            order: 2,
            tasks: {
              create: [
                {
                  id: 'task-4',
                  title: 'Setup inicial',
                  description: 'Configurar projeto com Vite e TypeScript',
                  priority: 'low',
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Board criado:', board);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 