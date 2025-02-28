import { useTheme } from '../providers/ThemeProvider';

export function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold">Configurações</h1>
      
      <div className="mt-8">
        <div className="card p-6">
          <h2 className="text-lg font-medium">Preferências</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-border"
                  checked={theme === 'dark'}
                  onChange={toggleTheme}
                />
                <span>Modo escuro</span>
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-border"
                  disabled
                />
                <span className="text-muted-foreground">Notificações (em breve)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 