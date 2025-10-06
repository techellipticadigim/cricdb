import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerForm from '../PlayerForm';

// Mock the date picker
jest.mock('@mui/x-date-pickers/DatePicker', () => {
  return function MockDatePicker(props: any) {
    return (
      <input
        data-testid={props.slotProps?.textField?.['data-testid'] || 'date-picker'}
        onChange={(e) => props.onChange && props.onChange({ format: () => e.target.value })}
      />
    );
  };
});

describe('PlayerForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(
      <PlayerForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId('player-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('country-select')).toBeInTheDocument();
    expect(screen.getByTestId('start-year-input')).toBeInTheDocument();
    expect(screen.getByTestId('role-select')).toBeInTheDocument();
    expect(screen.getByTestId('gender-male')).toBeInTheDocument();
    expect(screen.getByTestId('gender-female')).toBeInTheDocument();
    expect(screen.getByTestId('notes-input')).toBeInTheDocument();
  });

  it('calls onSubmit with form data when submit button is clicked', async () => {
    render(
      <PlayerForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByTestId('player-name-input'), {
      target: { value: 'Test Player' }
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          playerName: 'Test Player',
          country: '',
          startYear: expect.any(Number),
          gender: 'MALE',
          role: 'BATSMAN',
          notes: ''
        })
      );
    });
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <PlayerForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays loading state correctly', () => {
    render(
      <PlayerForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        loading={true}
      />
    );

    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  it('populates form fields when editing existing player', () => {
    const existingPlayer = {
      playerId: 1,
      playerName: 'Existing Player',
      country: 'India',
      startYear: 2020,
      gender: 'FEMALE' as const,
      role: 'BOWLER' as const,
      notes: 'Test notes'
    };

    render(
      <PlayerForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        player={existingPlayer}
      />
    );

    expect(screen.getByTestId('player-name-input')).toHaveValue('Existing Player');
    expect(screen.getByTestId('notes-input')).toHaveValue('Test notes');
  });
});
