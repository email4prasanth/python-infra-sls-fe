import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { H1, H2, H3, H4, H5, H6 } from './Typography';

const headings = [
  { Component: H1, tag: 'h1', text: 'Heading 1' },
  { Component: H2, tag: 'h2', text: 'Heading 2' },
  { Component: H3, tag: 'h3', text: 'Heading 3' },
  { Component: H4, tag: 'h4', text: 'Heading 4' },
  { Component: H5, tag: 'h5', text: 'Heading 5' },
  { Component: H6, tag: 'h6', text: 'Heading 6' },
];

describe('Typography Components', () => {
  headings.forEach(({ Component, tag, text }) => {
    it(`renders <${tag}> with children`, () => {
      render(<Component data-testid={`typography-${tag}`}>{text}</Component>);
      const heading = screen.getByTestId(`typography-${tag}`);
      expect(heading.tagName.toLowerCase()).toBe(tag);
      expect(heading).toHaveTextContent(text);
    });

    it(`applies custom class to <${tag}>`, () => {
      render(
        <Component
          className='text-red-500'
          data-testid={`typography-${tag}`}
        >
          {text}
        </Component>
      );
      const heading = screen.getByTestId(`typography-${tag}`);
      expect(heading).toHaveClass('text-red-500');
    });
  });
});
