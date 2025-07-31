import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Image } from './image';

describe('<Image />', () => {
  it('renders the image with correct src and alt', () => {
    render(
      <Image
        src='/logo.png'
        alt='Logo'
        data-testid='custom-image'
      />
    );
    const img = screen.getByTestId('custom-image');
    expect(img).toHaveAttribute('src', '/logo.png');
    expect(img).toHaveAttribute('alt', 'Logo');
  });

  it('applies className and default object-cover class', () => {
    render(
      <Image
        src='/image.png'
        className='rounded-md'
        data-testid='custom-image'
      />
    );
    const img = screen.getByTestId('custom-image');
    expect(img).toHaveClass('object-cover');
    expect(img).toHaveClass('rounded-md');
  });

  it('spreads additional props to the img tag', () => {
    render(
      <Image
        src='/example.png'
        alt='Example'
        width={100}
        height={200}
        loading='lazy'
        data-testid='custom-image'
      />
    );
    const img = screen.getByTestId('custom-image');
    expect(img).toHaveAttribute('width', '100');
    expect(img).toHaveAttribute('height', '200');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
