import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GuessButtons from './guess-buttons';

describe('GuessButtons', () => {
  it('should render Real and Fake buttons', () => {
    render(<GuessButtons onGuess={vi.fn()} disabled={false} />);

    expect(screen.getByRole('button', { name: /real/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fake/i })).toBeInTheDocument();
  });

  it('should call onGuess with true when Real button is clicked', async () => {
    const user = userEvent.setup();
    const onGuessMock = vi.fn();

    render(<GuessButtons onGuess={onGuessMock} disabled={false} />);

    await user.click(screen.getByRole('button', { name: /real/i }));

    expect(onGuessMock).toHaveBeenCalledWith(true);
    expect(onGuessMock).toHaveBeenCalledTimes(1);
  });

  it('should call onGuess with false when Fake button is clicked', async () => {
    const user = userEvent.setup();
    const onGuessMock = vi.fn();

    render(<GuessButtons onGuess={onGuessMock} disabled={false} />);

    await user.click(screen.getByRole('button', { name: /fake/i }));

    expect(onGuessMock).toHaveBeenCalledWith(false);
    expect(onGuessMock).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when disabled prop is true', () => {
    render(<GuessButtons onGuess={vi.fn()} disabled={true} />);

    expect(screen.getByRole('button', { name: /real/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /fake/i })).toBeDisabled();
  });

  it('should enable buttons when disabled prop is false', () => {
    render(<GuessButtons onGuess={vi.fn()} disabled={false} />);

    expect(screen.getByRole('button', { name: /real/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /fake/i })).toBeEnabled();
  });
});
