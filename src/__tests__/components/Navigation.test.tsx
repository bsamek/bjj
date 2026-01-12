import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Navigation } from '../../components/Navigation';

describe('Navigation', () => {
  it('renders app title', () => {
    render(
      <Navigation
        onLogout={vi.fn()}
        onMenuToggle={vi.fn()}
        isMenuOpen={false}
      />
    );

    expect(screen.getByText('BJJ Study')).toBeInTheDocument();
  });

  it('renders logout button', () => {
    render(
      <Navigation
        onLogout={vi.fn()}
        onMenuToggle={vi.fn()}
        isMenuOpen={false}
      />
    );

    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument();
  });

  it('calls onLogout when logout clicked', async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();

    render(
      <Navigation
        onLogout={onLogout}
        onMenuToggle={vi.fn()}
        isMenuOpen={false}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Log out' }));
    expect(onLogout).toHaveBeenCalled();
  });

  it('renders hamburger menu button for mobile', () => {
    render(
      <Navigation
        onLogout={vi.fn()}
        onMenuToggle={vi.fn()}
        isMenuOpen={false}
      />
    );

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('calls onMenuToggle when hamburger clicked', async () => {
    const user = userEvent.setup();
    const onMenuToggle = vi.fn();

    render(
      <Navigation
        onLogout={vi.fn()}
        onMenuToggle={onMenuToggle}
        isMenuOpen={false}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(onMenuToggle).toHaveBeenCalled();
  });

  it('shows close icon when menu is open', () => {
    render(
      <Navigation
        onLogout={vi.fn()}
        onMenuToggle={vi.fn()}
        isMenuOpen={true}
      />
    );

    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  });
});
