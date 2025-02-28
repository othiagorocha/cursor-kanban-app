# Kanban App

Uma aplicação Kanban moderna construída com React, TypeScript, Tailwind CSS e Prisma.

## 🚀 Tecnologias

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [SQLite](https://www.sqlite.org/)
- [React Router](https://reactrouter.com/)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── board/
│   │   ├── Board.tsx
│   │   ├── Column.tsx
│   │   └── Task.tsx
│   └── layout/
│       └── RootLayout.tsx
├── pages/
│   ├── boards/
│   │   ├── BoardPage.tsx
│   │   └── NewBoard.tsx
│   ├── Home.tsx
│   └── Settings.tsx
├── types/
│   └── task.ts
└── lib/
    └── prisma.ts
```

## 🗄️ Estrutura do Banco de Dados

### Board
```prisma
model Board {
  id        String   @id @default(cuid())
  title     String
  columns   Column[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Column
```prisma
model Column {
  id        String   @id
  title     String
  order     Int
  boardId   String
  board     Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  tasks     Task[]
}
```

### Task
```prisma
model Task {
  id          String   @id
  title       String
  description String?
  priority    String   // 'low' | 'medium' | 'high'
  columnId    String
  column      Column   @relation(fields: [columnId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🛣️ Rotas

- `/` - Página inicial com lista de boards
- `/boards/new` - Criar novo board
- `/boards/:id` - Visualizar board específico
- `/settings` - Configurações do app

## 🎨 Design System

### Cores
O sistema de cores usa variáveis RGB para melhor suporte a opacidade e temas:

```css
:root {
  --background: 248 250 252;
  --foreground: 15 23 42;
  --primary: 59 130 246;
  --secondary: 241 245 249;
  --muted: 226 232 240;
  --accent: 243 244 246;
  --destructive: 239 68 68;
}
```

### Componentes Base

- `.btn` - Botão base
- `.btn-primary` - Botão primário
- `.btn-secondary` - Botão secundário
- `.btn-destructive` - Botão destrutivo
- `.card` - Card base

## 🚀 Como Executar

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/kanban-app.git
cd kanban-app
```

2. Instale as dependências
```bash
npm install
```

3. Configure o banco de dados
```bash
npx prisma generate
npx prisma db push
```

4. Popule o banco com dados iniciais
```bash
npx prisma db seed
```

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## ✨ Funcionalidades

- [x] Criação e gerenciamento de boards
- [x] Drag and drop de tarefas
- [x] Sistema de temas (claro/escuro)
- [x] Design responsivo
- [x] Persistência de dados com SQLite
- [x] Interface moderna com Tailwind CSS
- [x] Tipagem forte com TypeScript

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
