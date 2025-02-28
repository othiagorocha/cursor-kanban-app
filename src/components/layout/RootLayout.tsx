import { Link, Outlet } from 'react-router-dom';
import { HomeIcon, ListTodoIcon, Settings } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Boards', href: '/boards', icon: ListTodoIcon },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-card">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="self-center text-xl font-semibold sm:text-2xl">
                  Kanban
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="mt-14 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
} 