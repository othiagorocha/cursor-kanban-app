import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient, Prisma } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = 3001;

app.use(cors());
app.use(express.json());

const router = express.Router();

// Listar todos os boards
router.get('/boards', async (_req: Request, res: Response) => {
  try {
    const boards = await prisma.board.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        columns: {
          include: {
            _count: {
              select: {
                tasks: true,
              },
            },
          },
        },
      },
    });

    // Transformar os dados para o formato esperado pelo frontend
    const formattedBoards = boards.map(board => ({
      ...board,
      _count: {
        tasks: board.columns.reduce((acc, col) => acc + (col._count?.tasks || 0), 0),
      },
    }));

    res.json(formattedBoards);
  } catch (error) {
    console.error('Erro ao buscar boards:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar um board específico
router.get('/boards/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { order: 'asc' },
          include: {
            tasks: {
              orderBy: { updatedAt: 'desc' },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ error: 'Board não encontrado' });
    }

    res.json(board);
  } catch (error) {
    console.error('Erro ao buscar board:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar um novo board
router.post('/boards', async (req: Request, res: Response) => {
  console.log('Recebendo requisição POST /boards');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      console.log('Título inválido:', { title, type: typeof title });
      return res.status(400).json({ 
        error: 'Título inválido',
        details: 'O título é obrigatório e deve ser uma string não vazia' 
      });
    }

    console.log('Criando board com título:', title.trim());

    const board = await prisma.board.create({
      data: {
        title: title.trim(),
        columns: {
          create: [
            { title: 'A Fazer', order: 0 },
            { title: 'Em Progresso', order: 1 },
            { title: 'Concluído', order: 2 },
          ],
        },
      },
      include: {
        columns: true,
      },
    });

    console.log('Board criado com sucesso:', board);
    res.status(201).json(board);
  } catch (error) {
    console.error('Erro ao criar board:', error);
    
    if (error instanceof Error) {
      res.status(500).json({ 
        error: 'Erro ao criar board',
        details: error.message
      });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: 'Ocorreu um erro desconhecido ao criar o board'
      });
    }
  }
});

// Board CRUD
app.put('/api/boards/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const updatedBoard = await prisma.board.update({
      where: { id },
      data: { title },
    });

    res.json(updatedBoard);
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ error: 'Failed to update board' });
  }
});

app.delete('/api/boards/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.board.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting board:', error);
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

// Column CRUD
app.post('/api/boards/:boardId/columns', async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;

  try {
    // Get the current highest order value
    const lastColumn = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
    });

    const order = lastColumn ? lastColumn.order + 1 : 0;

    const newColumn = await prisma.column.create({
      data: {
        title,
        order,
        boardId,
      },
    });

    res.status(201).json(newColumn);
  } catch (error) {
    console.error('Error creating column:', error);
    res.status(500).json({ error: 'Failed to create column' });
  }
});

app.put('/api/columns/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const updatedColumn = await prisma.column.update({
      where: { id },
      data: { title },
    });

    res.json(updatedColumn);
  } catch (error) {
    console.error('Error updating column:', error);
    res.status(500).json({ error: 'Failed to update column' });
  }
});

app.delete('/api/columns/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.column.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting column:', error);
    res.status(500).json({ error: 'Failed to delete column' });
  }
});

// Column reordering
app.put('/api/boards/:boardId/columns/reorder', async (req, res) => {
  const { boardId } = req.params;
  const { columnId, newOrder } = req.body;

  try {
    // Get all columns for the board
    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: { order: 'asc' },
    });

    // Find the column being moved
    const columnIndex = columns.findIndex((col) => col.id === columnId);
    if (columnIndex === -1) {
      return res.status(404).json({ error: 'Column not found' });
    }

    // Update all affected columns in a transaction
    await prisma.$transaction(async (tx) => {
      // Move columns out of the way
      if (newOrder > columnIndex) {
        // Moving right
        await tx.column.updateMany({
          where: {
            boardId,
            order: {
              gt: columns[columnIndex].order,
              lte: newOrder,
            },
          },
          data: {
            order: { decrement: 1 },
          },
        });
      } else {
        // Moving left
        await tx.column.updateMany({
          where: {
            boardId,
            order: {
              gte: newOrder,
              lt: columns[columnIndex].order,
            },
          },
          data: {
            order: { increment: 1 },
          },
        });
      }

      // Move the target column to its new position
      await tx.column.update({
        where: { id: columnId },
        data: { order: newOrder },
      });
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering columns:', error);
    res.status(500).json({ error: 'Failed to reorder columns' });
  }
});

// Task reordering within the same column
app.put('/api/columns/:columnId/tasks/reorder', async (req, res) => {
  const { columnId } = req.params;
  const { taskId, newIndex: newOrder } = req.body;

  try {
    // Get all tasks for the column with full type information
    const tasks = await prisma.task.findMany({
      where: { columnId },
      include: {
        column: true,
      },
    });

    // Find the task being moved
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const currentTask = tasks[taskIndex];

    // Update all affected tasks in a transaction
    await prisma.$transaction(async (tx) => {
      // Move tasks out of the way
      if (newOrder > currentTask.column.order) {
        // Moving down
        await tx.task.updateMany({
          where: {
            columnId,
            order: {
              gt: currentTask.order,
              lte: newOrder,
            },
          } as Prisma.TaskScalarWhereInput,
          data: {
            order: {
              decrement: 1,
            },
          } as Prisma.TaskUpdateManyMutationInput,
        });
      } else {
        // Moving up
        await tx.task.updateMany({
          where: {
            columnId,
            order: {
              gte: newOrder,
              lt: currentTask.order,
            },
          } as Prisma.TaskScalarWhereInput,
          data: {
            order: {
              increment: 1,
            },
          } as Prisma.TaskUpdateManyMutationInput,
        });
      }

      // Move the target task to its new position
      await tx.task.update({
        where: { id: taskId },
        data: {
          order: newOrder,
        } as Prisma.TaskUncheckedUpdateInput,
      });
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    res.status(500).json({ error: 'Failed to reorder tasks' });
  }
});

// Move task between columns
app.put('/api/tasks/:taskId/move', async (req, res) => {
  const { taskId } = req.params;
  const { sourceColumnId, destinationColumnId, newIndex: newOrder } = req.body;

  try {
    await prisma.$transaction(async (tx) => {
      // Get the task being moved with full type information
      const task = await tx.task.findUnique({
        where: { id: taskId },
        include: {
          column: true,
        },
      });

      if (!task) {
        throw new Error('Task not found');
      }

      // Update order of tasks in source column
      await tx.task.updateMany({
        where: {
          columnId: sourceColumnId,
          order: {
            gt: task.order,
          },
        } as Prisma.TaskScalarWhereInput,
        data: {
          order: {
            decrement: 1,
          },
        } as Prisma.TaskUpdateManyMutationInput,
      });

      // Update order of tasks in destination column
      await tx.task.updateMany({
        where: {
          columnId: destinationColumnId,
          order: {
            gte: newOrder,
          },
        } as Prisma.TaskScalarWhereInput,
        data: {
          order: {
            increment: 1,
          },
        } as Prisma.TaskUpdateManyMutationInput,
      });

      // Move the task to its new position
      await tx.task.update({
        where: { id: taskId },
        data: {
          columnId: destinationColumnId,
          order: newOrder,
        } as Prisma.TaskUncheckedUpdateInput,
      });
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error moving task:', error);
    res.status(500).json({ error: 'Failed to move task' });
  }
});

// Task CRUD
app.post('/api/columns/:columnId/tasks', async (req, res) => {
  const { columnId } = req.params;
  const { title, description, priority } = req.body;

  try {
    // Get the current highest order value with full type information
    const lastTask = await prisma.task.findFirst({
      where: { columnId },
      include: {
        column: true,
      },
      orderBy: {
        order: 'desc',
      },
    });

    const order = (lastTask?.order ?? -1) + 1;

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        order,
        columnId,
      } as Prisma.TaskUncheckedCreateInput,
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, priority } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
}); 