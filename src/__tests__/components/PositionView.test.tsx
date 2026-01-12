import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PositionView } from '../../components/PositionView';
import type { Position } from '../../types';

const mockPosition: Position = {
  id: 'side-control',
  name: 'Side Control',
  top: {
    doFirst: ['Crossface + far underhook', 'Kill their frames'],
    techniques: [
      { id: 't1', name: 'Americana', description: 'Figure-four grip', notes: ['Keep elbow by head'] },
      { id: 't2', name: 'Kimura', description: 'Switch hands', notes: [] },
    ],
    transitions: ['Mount', 'Back via gift-wrap'],
    notes: ['Mousetrap system: use scarf hold first'],
  },
  bottom: {
    doFirst: ['Frame on neck and hip', 'Bridge and shrimp'],
    techniques: [
      { id: 't3', name: 'Knee-Elbow Escape', description: 'Insert knee, shrimp to guard', notes: [] },
    ],
    transitions: ['Half guard', 'Closed guard'],
    notes: [],
  },
};

describe('PositionView', () => {
  const defaultProps = {
    position: mockPosition,
    onAddTechnique: vi.fn(),
    onAddTechniqueNote: vi.fn(),
    onAddPerspectiveNote: vi.fn(),
    onAddDoFirst: vi.fn(),
    onUpdateDoFirst: vi.fn(),
    onDeleteDoFirst: vi.fn(),
    onAddTransition: vi.fn(),
    onUpdateTransition: vi.fn(),
    onDeleteTransition: vi.fn(),
    onUpdateTechnique: vi.fn(),
    onDeleteTechnique: vi.fn(),
    onUpdatePerspectiveNote: vi.fn(),
    onDeletePerspectiveNote: vi.fn(),
    onUpdateTechniqueNote: vi.fn(),
    onDeleteTechniqueNote: vi.fn(),
  };

  it('renders position name as heading', () => {
    render(<PositionView {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Side Control' })).toBeInTheDocument();
  });

  it('shows Top and Bottom tabs', () => {
    render(<PositionView {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Top' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bottom' })).toBeInTheDocument();
  });

  it('shows Top tab content by default', () => {
    render(<PositionView {...defaultProps} />);
    expect(screen.getByText('Crossface + far underhook')).toBeInTheDocument();
    expect(screen.getByText('Americana')).toBeInTheDocument();
  });

  it('switches to Bottom tab when clicked', async () => {
    const user = userEvent.setup();
    render(<PositionView {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Bottom' }));

    expect(screen.getByText('Frame on neck and hip')).toBeInTheDocument();
    expect(screen.getByText('Knee-Elbow Escape')).toBeInTheDocument();
    expect(screen.queryByText('Americana')).not.toBeInTheDocument();
  });

  it('renders doFirst items', () => {
    render(<PositionView {...defaultProps} />);
    expect(screen.getByText('Crossface + far underhook')).toBeInTheDocument();
    expect(screen.getByText('Kill their frames')).toBeInTheDocument();
  });

  it('renders techniques', () => {
    render(<PositionView {...defaultProps} />);
    expect(screen.getByText('Americana')).toBeInTheDocument();
    expect(screen.getByText('Figure-four grip')).toBeInTheDocument();
    expect(screen.getByText('Kimura')).toBeInTheDocument();
  });

  it('renders transitions', () => {
    render(<PositionView {...defaultProps} />);
    expect(screen.getByText('Mount')).toBeInTheDocument();
    expect(screen.getByText('Back via gift-wrap')).toBeInTheDocument();
  });

  it('renders perspective notes', () => {
    render(<PositionView {...defaultProps} />);
    expect(screen.getByText('Mousetrap system: use scarf hold first')).toBeInTheDocument();
  });

  it('shows "+ Add Technique" button', () => {
    render(<PositionView {...defaultProps} />);
    expect(screen.getByRole('button', { name: '+ Add Technique' })).toBeInTheDocument();
  });

  it('opens technique form when "+ Add Technique" clicked', async () => {
    const user = userEvent.setup();
    render(<PositionView {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: '+ Add Technique' }));

    expect(screen.getByPlaceholderText('Technique name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
  });

  it('calls onAddTechnique on submit', async () => {
    const user = userEvent.setup();
    const onAddTechnique = vi.fn();
    render(<PositionView {...defaultProps} onAddTechnique={onAddTechnique} />);

    await user.click(screen.getByRole('button', { name: '+ Add Technique' }));
    await user.type(screen.getByPlaceholderText('Technique name'), 'New Technique');
    await user.type(screen.getByPlaceholderText('Description'), 'How to do it');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddTechnique).toHaveBeenCalledWith('side-control', 'top', {
      name: 'New Technique',
      description: 'How to do it',
      notes: [],
    });
  });

  it('adds technique to correct perspective', async () => {
    const user = userEvent.setup();
    const onAddTechnique = vi.fn();
    render(<PositionView {...defaultProps} onAddTechnique={onAddTechnique} />);

    // Switch to bottom tab
    await user.click(screen.getByRole('button', { name: 'Bottom' }));

    await user.click(screen.getByRole('button', { name: '+ Add Technique' }));
    await user.type(screen.getByPlaceholderText('Technique name'), 'Bottom Technique');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddTechnique).toHaveBeenCalledWith('side-control', 'bottom', expect.anything());
  });

  it('rejects empty technique name', async () => {
    const user = userEvent.setup();
    const onAddTechnique = vi.fn();
    render(<PositionView {...defaultProps} onAddTechnique={onAddTechnique} />);

    await user.click(screen.getByRole('button', { name: '+ Add Technique' }));
    await user.type(screen.getByPlaceholderText('Description'), 'Some description');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddTechnique).not.toHaveBeenCalled();
  });

  it('shows "+ Add Note" button for notes section', () => {
    render(<PositionView {...defaultProps} />);
    const addNoteButtons = screen.getAllByRole('button', { name: '+ Add Note' });
    expect(addNoteButtons.length).toBeGreaterThan(0);
  });

  it('opens note form when "+ Add Note" clicked', async () => {
    const user = userEvent.setup();
    render(<PositionView {...defaultProps} />);

    // Find the add note button in the Notes section (last one)
    const addNoteButtons = screen.getAllByRole('button', { name: '+ Add Note' });
    await user.click(addNoteButtons[addNoteButtons.length - 1]);

    expect(screen.getByPlaceholderText('Add a note...')).toBeInTheDocument();
  });

  it('calls onAddPerspectiveNote on submit', async () => {
    const user = userEvent.setup();
    const onAddPerspectiveNote = vi.fn();
    render(<PositionView {...defaultProps} onAddPerspectiveNote={onAddPerspectiveNote} />);

    const addNoteButtons = screen.getAllByRole('button', { name: '+ Add Note' });
    await user.click(addNoteButtons[addNoteButtons.length - 1]);
    await user.type(screen.getByPlaceholderText('Add a note...'), 'New perspective note');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddPerspectiveNote).toHaveBeenCalledWith('side-control', 'top', 'New perspective note');
  });

  it('shows "No notes yet" when perspective has no notes', async () => {
    const user = userEvent.setup();
    render(<PositionView {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Bottom' }));

    expect(screen.getByText('No notes yet')).toBeInTheDocument();
  });

  it('closes technique form on cancel', async () => {
    const user = userEvent.setup();
    render(<PositionView {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: '+ Add Technique' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByPlaceholderText('Technique name')).not.toBeInTheDocument();
  });

  // Do First CRUD tests
  it('shows "+ Add" button for Do First section', () => {
    render(<PositionView {...defaultProps} />);
    const addButtons = screen.getAllByRole('button', { name: '+ Add' });
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it('opens Do First form when "+ Add" clicked', async () => {
    const user = userEvent.setup();
    render(<PositionView {...defaultProps} />);

    const addButtons = screen.getAllByRole('button', { name: '+ Add' });
    await user.click(addButtons[0]); // First "+ Add" is for Do First

    expect(screen.getByPlaceholderText('Add a do first item...')).toBeInTheDocument();
  });

  it('calls onAddDoFirst on submit', async () => {
    const user = userEvent.setup();
    const onAddDoFirst = vi.fn();
    render(<PositionView {...defaultProps} onAddDoFirst={onAddDoFirst} />);

    const addButtons = screen.getAllByRole('button', { name: '+ Add' });
    await user.click(addButtons[0]);
    await user.type(screen.getByPlaceholderText('Add a do first item...'), 'New do first item');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddDoFirst).toHaveBeenCalledWith('side-control', 'top', 'New do first item');
  });

  // Transitions CRUD tests
  it('opens Transitions form when "+ Add" clicked', async () => {
    const user = userEvent.setup();
    render(<PositionView {...defaultProps} />);

    const addButtons = screen.getAllByRole('button', { name: '+ Add' });
    await user.click(addButtons[1]); // Second "+ Add" is for Transitions

    expect(screen.getByPlaceholderText('Add a transition...')).toBeInTheDocument();
  });

  it('calls onAddTransition on submit', async () => {
    const user = userEvent.setup();
    const onAddTransition = vi.fn();
    render(<PositionView {...defaultProps} onAddTransition={onAddTransition} />);

    const addButtons = screen.getAllByRole('button', { name: '+ Add' });
    await user.click(addButtons[1]);
    await user.type(screen.getByPlaceholderText('Add a transition...'), 'New transition');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddTransition).toHaveBeenCalledWith('side-control', 'top', 'New transition');
  });
});
