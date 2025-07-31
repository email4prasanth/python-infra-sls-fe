import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from './Dialog';

describe('<Dialog />', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Delete Record',
    message: 'Are you sure you want to delete this record?',
    isProcessing: false,
    onCancel: vi.fn(),
    onConfirm: vi.fn(),
  };

  it('does not render when isOpen is false', () => {
    render(
      <Dialog
        {...defaultProps}
        isOpen={false}
      />
    );
    expect(screen.queryByTestId('dialog-wrapper')).not.toBeInTheDocument();
  });

  it('renders title and message correctly', () => {
    render(<Dialog {...defaultProps} />);
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Delete Record');
    expect(screen.getByTestId('dialog-message')).toHaveTextContent('Are you sure you want to delete this record?');
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<Dialog {...defaultProps} />);
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(<Dialog {...defaultProps} />);
    fireEvent.click(screen.getByTestId('confirm-button'));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('disables buttons when isProcessing is true', () => {
    render(
      <Dialog
        {...defaultProps}
        isProcessing={true}
      />
    );
    expect(screen.getByTestId('cancel-button')).toBeDisabled();
    expect(screen.getByTestId('confirm-button')).toBeDisabled();
  });
});
