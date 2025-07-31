import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Home } from './Home';

// Mock `t` function to return the key itself for simplicity
vi.mock('@/lib/utils', () => ({
  t: (_ns: string, key: string) => key,
}));

// Mock navigate function
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('<Home />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path='/'
            element={<Home />}
          />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders the main headings and description', () => {
    renderComponent();
    expect(screen.getByText('homePage.title')).toBeInTheDocument();
    expect(screen.getByText('homePage.addImplant')).toBeInTheDocument();
    expect(screen.getByText('homePage.findImplant')).toBeInTheDocument();
  });

  it('renders both action buttons', () => {
    renderComponent();
    expect(screen.getByText('homePage.addImplantBtn')).toBeInTheDocument();
    expect(screen.getByText('homePage.findImplantBtn')).toBeInTheDocument();
  });

  it('navigates to /patients when "Add Implant" button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('homePage.addImplantBtn'));
    expect(mockNavigate).toHaveBeenCalledWith('/patients');
  });

  it('navigates to /patients when "Find Implant" button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('homePage.findImplantBtn'));
    expect(mockNavigate).toHaveBeenCalledWith('/patients');
  });

  it('renders the dental image', () => {
    renderComponent();
    const img = screen.getByAltText('Dental_img');
    expect(img).toBeInTheDocument();
  });
});
