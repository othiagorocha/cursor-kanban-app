import '@testing-library/jest-dom/vitest';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Limpa o DOM após cada teste
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
}); 