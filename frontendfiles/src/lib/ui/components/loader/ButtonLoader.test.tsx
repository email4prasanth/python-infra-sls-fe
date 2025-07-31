import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ButtonLoader } from './ButtonLoader';

describe('<ButtonLoader />', () => {
  it('renders with default size and color', () => {
    const { getByRole } = render(<ButtonLoader />);
    const loader = getByRole('status');

    expect(loader).toBeInTheDocument();
    expect(loader).toHaveStyle({
      width: '16px',
      height: '16px',
      borderColor: '#FFFFFF',
    });
  });

  it('ensures minimum border width of 2px', () => {
    const { getByRole } = render(
      <ButtonLoader
        size={8}
        color='#00FF00'
      />
    );
    const loader = getByRole('status');

    expect(loader).toHaveStyle({
      borderWidth: '2px',
    });
  });
});
