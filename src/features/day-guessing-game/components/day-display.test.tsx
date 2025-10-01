import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DayDisplay from '../../components/day-display';

describe('DayDisplay', () => {
  it('should render the day name', () => {
    render(<DayDisplay dayName="International Women's Day" />);

    expect(screen.getByText("International Women's Day")).toBeInTheDocument();
  });

  it('should render different day names', () => {
    const { rerender } = render(<DayDisplay dayName="Earth Day" />);
    expect(screen.getByText('Earth Day')).toBeInTheDocument();

    rerender(<DayDisplay dayName="Pi Day" />);
    expect(screen.getByText('Pi Day')).toBeInTheDocument();
  });

  it('should render day name as a heading', () => {
    render(<DayDisplay dayName="Test Day" />);

    const heading = screen.getByRole('heading');
    expect(heading).toHaveTextContent('Test Day');
  });
});
