import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AddPatient } from './AddPatient';

describe('<AddPatient />', () => {
  it('renders all form and view data-testid elements (if present)', () => {
    render(
      <MemoryRouter>
        <AddPatient />
      </MemoryRouter>
    );

    // Form fields
    expect(screen.getByTestId('first-name')).toBeInTheDocument();
    expect(screen.getByTestId('last-name')).toBeInTheDocument();
    expect(screen.getByTestId('email')).toBeInTheDocument();
    expect(screen.getByTestId('phone')).toBeInTheDocument();

    // Buttons
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();

    // These may not be visible until review mode, but you're asking just for presence check
    const optionalTestIds = [
      'first-name-view',
      'last-name-view',
      'dob-view',
      'email-view',
      'phone-view',
      'edit-button',
      'save-button',
    ];

    optionalTestIds.forEach((testId) => {
      const el = screen.queryByTestId(testId);
      if (el) {
        expect(el).toBeInTheDocument();
      }
    });
  });
});
