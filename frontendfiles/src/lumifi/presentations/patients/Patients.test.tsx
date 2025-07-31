import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Patients } from './Patients';

// Mock translations and images
vi.mock('@/lib/utils', () => ({
  t: (_ns: string, key: string) => key,
}));
vi.mock('@/assets/images', () => ({
  searchWhiteIcon: '',
  plusIcon: '',
  dentalImage: '',
  dentalImageRight: '',
  greenTickIcon: '',
  notePadUserIcon: '',
}));

describe('<Patients />', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Patients />
      </MemoryRouter>
    );
  });

  it('should render the search form', () => {
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
  });

  it('should render all search input fields', () => {
    expect(screen.getByTestId('first-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('last-name-input')).toBeInTheDocument();
    // expect(screen.getByTestId('dob-picker')).toBeInTheDocument();
  });

  it('should render the search button', () => {
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  it('should render the initial message section before searching', () => {
    expect(screen.getByTestId('initial-message')).toBeInTheDocument();
  });

  it('should not render optional elements before searching', () => {
    expect(screen.queryByTestId('clear-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('no-results-message')).not.toBeInTheDocument();
    expect(screen.queryByTestId('add-patient-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('multiple-matches-title')).not.toBeInTheDocument();
    expect(screen.queryByTestId('patient-result')).not.toBeInTheDocument();
    expect(screen.queryByTestId('patient-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('patient-dob')).not.toBeInTheDocument();
    expect(screen.queryByTestId('add-implant-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('view-chart-button')).not.toBeInTheDocument();
  });
});
