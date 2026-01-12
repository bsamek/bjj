import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '../../components/Sidebar';
import type { Position } from '../../types';

const mockPositions: Position[] = [
  {
    id: 'closed-guard',
    name: 'Closed Guard',
    top: { doFirst: [], techniques: [], transitions: [], notes: [] },
    bottom: { doFirst: [], techniques: [], transitions: [], notes: [] },
  },
  {
    id: 'side-control',
    name: 'Side Control',
    top: { doFirst: [], techniques: [], transitions: [], notes: [] },
    bottom: { doFirst: [], techniques: [], transitions: [], notes: [] },
  },
];

describe('Sidebar', () => {
  it('renders Principles link and Positions section', () => {
    render(
      <Sidebar
        positions={mockPositions}
        currentView="principles"
        selectedPositionId={null}
        onViewChange={vi.fn()}
        onPositionSelect={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Principles' })).toBeInTheDocument();
    expect(screen.getByText('Positions')).toBeInTheDocument();
  });

  it('renders all positions as links', () => {
    render(
      <Sidebar
        positions={mockPositions}
        currentView="principles"
        selectedPositionId={null}
        onViewChange={vi.fn()}
        onPositionSelect={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Closed Guard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Side Control' })).toBeInTheDocument();
  });

  it('calls onViewChange when Principles clicked', async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();

    render(
      <Sidebar
        positions={mockPositions}
        currentView="position"
        selectedPositionId="closed-guard"
        onViewChange={onViewChange}
        onPositionSelect={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Principles' }));
    expect(onViewChange).toHaveBeenCalledWith('principles');
  });

  it('calls onPositionSelect and onViewChange when position clicked', async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();
    const onPositionSelect = vi.fn();

    render(
      <Sidebar
        positions={mockPositions}
        currentView="principles"
        selectedPositionId={null}
        onViewChange={onViewChange}
        onPositionSelect={onPositionSelect}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Side Control' }));

    expect(onPositionSelect).toHaveBeenCalledWith('side-control');
    expect(onViewChange).toHaveBeenCalledWith('position');
  });

  it('highlights Principles when currentView is principles', () => {
    render(
      <Sidebar
        positions={mockPositions}
        currentView="principles"
        selectedPositionId={null}
        onViewChange={vi.fn()}
        onPositionSelect={vi.fn()}
      />
    );

    const principlesButton = screen.getByRole('button', { name: 'Principles' });
    expect(principlesButton).toHaveClass('bg-blue-600');
  });

  it('highlights selected position when in position view', () => {
    render(
      <Sidebar
        positions={mockPositions}
        currentView="position"
        selectedPositionId="side-control"
        onViewChange={vi.fn()}
        onPositionSelect={vi.fn()}
      />
    );

    const positionButton = screen.getByRole('button', { name: 'Side Control' });
    expect(positionButton).toHaveClass('bg-blue-600');

    const otherButton = screen.getByRole('button', { name: 'Closed Guard' });
    expect(otherButton).not.toHaveClass('bg-blue-600');
  });

  it('calls onClose when provided and a link is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Sidebar
        positions={mockPositions}
        currentView="principles"
        selectedPositionId={null}
        onViewChange={vi.fn()}
        onPositionSelect={vi.fn()}
        onClose={onClose}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Principles' }));
    expect(onClose).toHaveBeenCalled();
  });
});
