import type { IPagination } from '@/lumifi/types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TablePagination } from './TablePagination';

const mockPaginationData: IPagination = {
  currentPage: 2,
  rowsPerPage: 5,
  totalItems: 25,
  totalPages: 5,
  hasNextPage: true,
  hasPreviousPage: true,
  nextPage: 3,
  previousPage: 1,
};

const renderComponent = (overrideProps = {}) => {
  const handlePagination = vi.fn();
  const props = {
    paginationData: mockPaginationData,
    handlePagination,
    ...overrideProps,
  };

  render(<TablePagination {...props} />);
  return { handlePagination };
};

describe('<TablePagination />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders current, previous, and next page buttons', () => {
    renderComponent();
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls handlePagination when next page is clicked', async () => {
    const { handlePagination } = renderComponent();
    fireEvent.click(screen.getByLabelText('Next page'));
    await waitFor(() => {
      expect(handlePagination).toHaveBeenCalledWith(3, 5);
    });
  });

  it('calls handlePagination when previous page is clicked', async () => {
    const { handlePagination } = renderComponent();
    fireEvent.click(screen.getByLabelText('Previous page'));
    await waitFor(() => {
      expect(handlePagination).toHaveBeenCalledWith(1, 5);
    });
  });

  it('disables previous button on first page', () => {
    renderComponent({ paginationData: { ...mockPaginationData, currentPage: 1 } });
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    renderComponent({ paginationData: { ...mockPaginationData, currentPage: 5 } });
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('calls handlePagination with clicked page number', async () => {
    const { handlePagination } = renderComponent();
    fireEvent.click(screen.getByText('4'));
    await waitFor(() => {
      expect(handlePagination).toHaveBeenCalledWith(4, 5);
    });
  });

  it('toggles dropdown and changes rows per page', async () => {
    const { handlePagination } = renderComponent();
    const dropdownButton = screen.getByRole('button', { expanded: false });

    fireEvent.click(dropdownButton);
    expect(dropdownButton).toHaveAttribute('aria-expanded', 'true');

    const option = await screen.findByText('10');
    fireEvent.click(option);

    await waitFor(() => {
      expect(handlePagination).toHaveBeenCalledWith(1, 10);
    });
  });

  it('does not call pagination if same page is clicked', () => {
    const { handlePagination } = renderComponent();
    fireEvent.click(screen.getByText('2'));
    expect(handlePagination).not.toHaveBeenCalled();
  });
});
