import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import { BoardPage } from './pages/boards/BoardPage';
import { NewBoard } from './pages/boards/NewBoard';
import { ThemeProvider } from './providers/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="boards">
              <Route index element={<BoardPage />} />
              <Route path="new" element={<NewBoard />} />
              <Route path=":id" element={<BoardPage />} />
            </Route>
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
