import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = 3001;

app.use(cors());
app.use(express.json());

const router = express.Router();

// Listar todos os boards
router.get('/boards', async (req: Request, res: Response) => {
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
  try {
    const { title } = req.body;
    const board = await prisma.board.create({
      data: {
        title,
        columns: {
          create: [
            { id: 'todo', title: 'A Fazer', order: 0 },
            { id: 'doing', title: 'Em Progresso', order: 1 },
            { id: 'done', title: 'Concluído', order: 2 },
          ],
        },
      },
      include: {
        columns: true,
      },
    });
    res.status(201).json(board);
  } catch (error) {
    console.error('Erro ao criar board:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.use('/api', router);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
}); 