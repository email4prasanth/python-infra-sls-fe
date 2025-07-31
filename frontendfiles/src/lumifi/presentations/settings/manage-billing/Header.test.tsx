import { cardIcon } from '@/assets/images';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('<Header />', () => {
  it('renders header container and title', () => {
    render(<Header />);
    expect(screen.getByTestId('billing-header')).toBeInTheDocument();
    expect(screen.getByTestId('billing-heading')).toBeInTheDocument();
  });

  it('renders the card icon image', () => {
    render(<Header />);
    const image = screen.getByTestId('card-icon');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'user-icon');
    expect(image).toHaveAttribute('src', cardIcon);
  });
});
