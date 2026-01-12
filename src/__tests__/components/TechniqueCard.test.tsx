import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TechniqueCard } from '../../components/TechniqueCard';
import type { Technique } from '../../types';

const mockTechnique: Technique = {
  id: 'tech-1',
  name: 'Armbar',
  description: 'Control wrist, pivot hips, leg over head',
  notes: [],
};

const mockTechniqueWithNotes: Technique = {
  id: 'tech-2',
  name: 'Triangle',
  description: 'One arm in, one arm out',
  notes: ['Grab shin to control posture', 'Use foot on hip to prevent stack'],
};

describe('TechniqueCard', () => {
  const defaultProps = {
    onAddNote: vi.fn(),
    onUpdateTechnique: vi.fn(),
    onDeleteTechnique: vi.fn(),
    onUpdateNote: vi.fn(),
    onDeleteNote: vi.fn(),
  };

  it('renders technique name and description', () => {
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} />);

    expect(screen.getByText('Armbar')).toBeInTheDocument();
    expect(screen.getByText('Control wrist, pivot hips, leg over head')).toBeInTheDocument();
  });

  it('renders existing notes', () => {
    render(<TechniqueCard technique={mockTechniqueWithNotes} {...defaultProps} />);

    expect(screen.getByText('Grab shin to control posture')).toBeInTheDocument();
    expect(screen.getByText('Use foot on hip to prevent stack')).toBeInTheDocument();
  });

  it('shows "+ Note" button', () => {
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} />);
    expect(screen.getByRole('button', { name: '+ Note' })).toBeInTheDocument();
  });

  it('opens form when "+ Note" clicked', async () => {
    const user = userEvent.setup();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: '+ Note' }));

    expect(screen.getByPlaceholderText('Add a note...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls onAddNote with note text on submit', async () => {
    const user = userEvent.setup();
    const onAddNote = vi.fn();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} onAddNote={onAddNote} />);

    await user.click(screen.getByRole('button', { name: '+ Note' }));
    await user.type(screen.getByPlaceholderText('Add a note...'), 'New note text');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddNote).toHaveBeenCalledWith('tech-1', 'New note text');
  });

  it('closes form after successful submit', async () => {
    const user = userEvent.setup();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: '+ Note' }));
    await user.type(screen.getByPlaceholderText('Add a note...'), 'New note');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.queryByPlaceholderText('Add a note...')).not.toBeInTheDocument();
  });

  it('rejects empty/whitespace input', async () => {
    const user = userEvent.setup();
    const onAddNote = vi.fn();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} onAddNote={onAddNote} />);

    await user.click(screen.getByRole('button', { name: '+ Note' }));
    await user.type(screen.getByPlaceholderText('Add a note...'), '   ');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddNote).not.toHaveBeenCalled();
  });

  it('submits on Enter key', async () => {
    const user = userEvent.setup();
    const onAddNote = vi.fn();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} onAddNote={onAddNote} />);

    await user.click(screen.getByRole('button', { name: '+ Note' }));
    await user.type(screen.getByPlaceholderText('Add a note...'), 'Enter key note{Enter}');

    expect(onAddNote).toHaveBeenCalledWith('tech-1', 'Enter key note');
  });

  it('cancels on Escape key', async () => {
    const user = userEvent.setup();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: '+ Note' }));
    await user.type(screen.getByPlaceholderText('Add a note...'), 'Some text{Escape}');

    expect(screen.queryByPlaceholderText('Add a note...')).not.toBeInTheDocument();
  });

  it('closes form on Cancel button', async () => {
    const user = userEvent.setup();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: '+ Note' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByPlaceholderText('Add a note...')).not.toBeInTheDocument();
  });

  // Edit technique tests
  it('shows Edit button', () => {
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('opens edit form when Edit clicked', async () => {
    const user = userEvent.setup();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByDisplayValue('Armbar')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Control wrist, pivot hips, leg over head')).toBeInTheDocument();
  });

  it('calls onUpdateTechnique on save', async () => {
    const user = userEvent.setup();
    const onUpdateTechnique = vi.fn();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} onUpdateTechnique={onUpdateTechnique} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByDisplayValue('Armbar'));
    await user.type(screen.getByPlaceholderText('Technique name'), 'Updated Armbar');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onUpdateTechnique).toHaveBeenCalledWith('tech-1', {
      name: 'Updated Armbar',
      description: 'Control wrist, pivot hips, leg over head',
    });
  });

  it('closes edit form on cancel', async () => {
    const user = userEvent.setup();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByDisplayValue('Armbar')).not.toBeInTheDocument();
    expect(screen.getByText('Armbar')).toBeInTheDocument();
  });

  // Delete technique tests
  it('shows Delete button', () => {
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('shows confirmation when Delete clicked', async () => {
    const user = userEvent.setup();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByText('Delete "Armbar"?')).toBeInTheDocument();
  });

  it('calls onDeleteTechnique when confirmed', async () => {
    const user = userEvent.setup();
    const onDeleteTechnique = vi.fn();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} onDeleteTechnique={onDeleteTechnique} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onDeleteTechnique).toHaveBeenCalledWith('tech-1');
  });

  it('cancels delete confirmation', async () => {
    const user = userEvent.setup();
    const onDeleteTechnique = vi.fn();
    render(<TechniqueCard technique={mockTechnique} {...defaultProps} onDeleteTechnique={onDeleteTechnique} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onDeleteTechnique).not.toHaveBeenCalled();
    expect(screen.getByText('Armbar')).toBeInTheDocument();
  });
});
