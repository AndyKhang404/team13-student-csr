import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders student portal heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /student portal/i })).toBeInTheDocument();
  });
});
