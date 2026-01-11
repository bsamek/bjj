import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Navigation } from '../../components/Navigation';
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

describe('Navigation', () => {
  it('renders Principles button and Positions dropdown', () => {
    render(
      <Navigation
        positions={mockPositions}
        currentView="principles"
        selectedPositionId={null}
        onViewChange={vi.fn()}
        onPositionSelect={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Principles' })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders all positions in dropdown', () => {
    render(
      <Navigation
        positions={mockPositions}
        currentView="principles"
        selectedPositionId={null}
        onViewChange={vi.fn()}
        onPositionSelect={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toContainHTML('Closed Guard');
    expect(select).toContainHTML('Side Control');
  });

  it('calls onViewChange when Principles clicked', async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();

    render(
      <Navigation
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

  it('calls onPositionSelect and onViewChange when position selected', async () => {
    const user = userEvent.setup();
    const onViewChange = vi.fn();
    const onPositionSelect = vi.fn();

    render(
      <Navigation
        positions={mockPositions}
        currentView="principles"
        selectedPositionId={null}
        onViewChange={onViewChange}
        onPositionSelect={onPositionSelect}
      />
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'side-control');

    expect(onPositionSelect).toHaveBeenCalledWith('side-control');
    expect(onViewChange).toHaveBeenCalledWith('position');
  });

  it('shows selected position in dropdown', () => {
    render(
      <Navigation
        positions={mockPositions}
        currentView="position"
        selectedPositionId="side-control"
        onViewChange={vi.fn()}
        onPositionSelect={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('side-control');
  });

  it('renders app title', () => {
    render(
      <Navigation
        positions={mockPositions}
        currentView="principles"
        selectedPositionId={null}
        onViewChange={vi.fn()}
        onPositionSelect={vi.fn()}
      />
    );

    expect(screen.getByText('BJJ Study')).toBeInTheDocument();
  });
});
