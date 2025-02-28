import { Link, Outlet, useLocation } from 'react-router-dom';
import { HomeIcon, ListTodoIcon, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Boards', href: '/boards', icon: ListTodoIcon },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

function getBreadcrumb(pathname: string): string {
  if (pathname === '/') return 'Home';
  if (pathname === '/settings') return 'Configurações';
  if (pathname === '/boards') return 'Boards';
  if (pathname.startsWith('/boards/')) {
    if (pathname.endsWith('/new')) return 'Novo Board';
    return 'Board';
  }
  return '';
}

export function RootLayout() {
  const location = useLocation();
  const breadcrumb = getBreadcrumb(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-card">
        <div className="px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-xl font-semibold text-foreground hover:text-primary sm:text-2xl"
              >
                <ListTodoIcon className="h-6 w-6" />
                <span>Kanban</span>
              </Link>

              <div className="hidden items-center gap-1 md:flex">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || 
                    (item.href !== '/' && location.pathname.startsWith(item.href));
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex md:hidden">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg p-2 transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mt-20 px-4 pb-8 md:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">{breadcrumb}</h1>
        </div>
        <Outlet />
      </main>
    </div>
  );
} 