import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PrinciplesView } from '../../components/PrinciplesView';
import type { Principle } from '../../types';

const mockPrinciples: Principle[] = [
  { id: 'p1', content: 'Get inside position', category: 'universal' },
  { id: 'p2', content: 'Apply pressure', category: 'top' },
  { id: 'p3', content: 'Create space', category: 'bottom' },
  { id: 'p4', content: 'Keep arms close' },
];

describe('PrinciplesView', () => {
  const defaultProps = {
    principles: mockPrinciples,
    onAddPrinciple: vi.fn(),
    onUpdatePrinciple: vi.fn(),
    onDeletePrinciple: vi.fn(),
  };

  it('renders principles heading', () => {
    render(<PrinciplesView {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Principles' })).toBeInTheDocument();
  });

  it('renders principles grouped by category', () => {
    render(<PrinciplesView {...defaultProps} />);

    expect(screen.getByText('Universal')).toBeInTheDocument();
    expect(screen.getByText('When on Top')).toBeInTheDocument();
    expect(screen.getByText('When on Bottom')).toBeInTheDocument();
  });

  it('renders principle content', () => {
    render(<PrinciplesView {...defaultProps} />);

    expect(screen.getByText('Get inside position')).toBeInTheDocument();
    expect(screen.getByText('Apply pressure')).toBeInTheDocument();
    expect(screen.getByText('Create space')).toBeInTheDocument();
    expect(screen.getByText('Keep arms close')).toBeInTheDocument();
  });

  it('groups principles without category as universal', () => {
    render(<PrinciplesView {...defaultProps} />);

    // 'Keep arms close' has no category, should appear in Universal section
    const universalSection = screen.getByText('Universal').closest('section');
    expect(universalSection).toContainElement(screen.getByText('Keep arms close'));
  });

  it('shows "+ Add Principle" button', () => {
    render(<PrinciplesView {...defaultProps} />);
    expect(screen.getByRole('button', { name: '+ Add Principle' })).toBeInTheDocument();
  });

  it('opens form when add button clicked', async () => {
    const user = userEvent.setup();
    render(<PrinciplesView {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: '+ Add Principle' }));

    expect(screen.getByPlaceholderText('Enter principle...')).toBeInTheDocument();
    expect(screen.getByLabelText('Universal')).toBeInTheDocument();
    expect(screen.getByLabelText('Top')).toBeInTheDocument();
    expect(screen.getByLabelText('Bottom')).toBeInTheDocument();
  });

  it('calls onAddPrinciple with content and category on submit', async () => {
    const user = userEvent.setup();
    const onAddPrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onAddPrinciple={onAddPrinciple} />);

    await user.click(screen.getByRole('button', { name: '+ Add Principle' }));
    await user.type(screen.getByPlaceholderText('Enter principle...'), 'New principle');
    await user.click(screen.getByLabelText('Top'));
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddPrinciple).toHaveBeenCalledWith({
      content: 'New principle',
      category: 'top',
    });
  });

  it('defaults to universal category', async () => {
    const user = userEvent.setup();
    const onAddPrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onAddPrinciple={onAddPrinciple} />);

    await user.click(screen.getByRole('button', { name: '+ Add Principle' }));
    await user.type(screen.getByPlaceholderText('Enter principle...'), 'Default category');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddPrinciple).toHaveBeenCalledWith({
      content: 'Default category',
      category: 'universal',
    });
  });

  it('allows clicking Universal radio in add mode after changing category', async () => {
    const user = userEvent.setup();
    const onAddPrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onAddPrinciple={onAddPrinciple} />);

    await user.click(screen.getByRole('button', { name: '+ Add Principle' }));
    await user.type(screen.getByPlaceholderText('Enter principle...'), 'Switching category');

    // Change to Top first
    await user.click(screen.getByLabelText('Top'));
    // Then change back to Universal
    await user.click(screen.getByLabelText('Universal'));
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddPrinciple).toHaveBeenCalledWith({
      content: 'Switching category',
      category: 'universal',
    });
  });

  it('allows setting bottom category in add mode', async () => {
    const user = userEvent.setup();
    const onAddPrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onAddPrinciple={onAddPrinciple} />);

    await user.click(screen.getByRole('button', { name: '+ Add Principle' }));
    await user.type(screen.getByPlaceholderText('Enter principle...'), 'Bottom principle');
    await user.click(screen.getByLabelText('Bottom'));
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddPrinciple).toHaveBeenCalledWith({
      content: 'Bottom principle',
      category: 'bottom',
    });
  });

  it('rejects empty/whitespace input', async () => {
    const user = userEvent.setup();
    const onAddPrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onAddPrinciple={onAddPrinciple} />);

    await user.click(screen.getByRole('button', { name: '+ Add Principle' }));
    await user.type(screen.getByPlaceholderText('Enter principle...'), '   ');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddPrinciple).not.toHaveBeenCalled();
  });

  it('closes form after successful submit', async () => {
    const user = userEvent.setup();
    render(<PrinciplesView {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: '+ Add Principle' }));
    await user.type(screen.getByPlaceholderText('Enter principle...'), 'Test');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.queryByPlaceholderText('Enter principle...')).not.toBeInTheDocument();
  });

  it('closes form on cancel', async () => {
    const user = userEvent.setup();
    render(<PrinciplesView {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: '+ Add Principle' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByPlaceholderText('Enter principle...')).not.toBeInTheDocument();
  });

  it('handles empty principles array', () => {
    render(<PrinciplesView {...defaultProps} principles={[]} />);
    expect(screen.getByRole('heading', { name: 'Principles' })).toBeInTheDocument();
    expect(screen.queryByText('Universal')).not.toBeInTheDocument();
  });

  // Edit principle tests
  it('shows edit form when Edit clicked', async () => {
    const user = userEvent.setup();
    render(<PrinciplesView {...defaultProps} />);

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);

    expect(screen.getByDisplayValue('Get inside position')).toBeInTheDocument();
  });

  it('calls onUpdatePrinciple on save', async () => {
    const user = userEvent.setup();
    const onUpdatePrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onUpdatePrinciple={onUpdatePrinciple} />);

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);
    await user.clear(screen.getByDisplayValue('Get inside position'));
    await user.type(screen.getByRole('textbox'), 'Updated principle');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onUpdatePrinciple).toHaveBeenCalledWith('p1', {
      content: 'Updated principle',
      category: 'universal',
    });
  });

  it('closes edit form on cancel', async () => {
    const user = userEvent.setup();
    render(<PrinciplesView {...defaultProps} />);

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByDisplayValue('Get inside position')).not.toBeInTheDocument();
    expect(screen.getByText('Get inside position')).toBeInTheDocument();
  });

  // Delete principle tests
  it('shows confirmation dialog when Delete clicked', async () => {
    const user = userEvent.setup();
    const onDeletePrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onDeletePrinciple={onDeletePrinciple} />);

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);

    // Should show confirmation dialog
    expect(screen.getByText('Delete this principle?')).toBeInTheDocument();
    expect(onDeletePrinciple).not.toHaveBeenCalled();
  });

  it('calls onDeletePrinciple when confirmed', async () => {
    const user = userEvent.setup();
    const onDeletePrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onDeletePrinciple={onDeletePrinciple} />);

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);
    // Now click Delete in confirmation dialog (it's now the only Delete button with bg-red-600 class)
    const confirmDialog = screen.getByText('Delete this principle?').closest('li');
    const confirmDeleteBtn = confirmDialog?.querySelector('button.bg-red-600');
    await user.click(confirmDeleteBtn!);

    expect(onDeletePrinciple).toHaveBeenCalledWith('p1');
  });

  it('dismisses delete confirmation dialog when cancel clicked', async () => {
    const user = userEvent.setup();
    const onDeletePrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onDeletePrinciple={onDeletePrinciple} />);

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);
    expect(screen.getByText('Delete this principle?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    // Should be back to normal display
    expect(screen.queryByText('Delete this principle?')).not.toBeInTheDocument();
    expect(screen.getByText('Get inside position')).toBeInTheDocument();
    expect(onDeletePrinciple).not.toHaveBeenCalled();
  });

  // Edit category tests
  it('allows changing category in edit mode', async () => {
    const user = userEvent.setup();
    const onUpdatePrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onUpdatePrinciple={onUpdatePrinciple} />);

    // Edit a universal principle and change to top
    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]); // First principle is 'Get inside position' (universal)

    // Change category to Top
    await user.click(screen.getByLabelText('Top'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onUpdatePrinciple).toHaveBeenCalledWith('p1', {
      content: 'Get inside position',
      category: 'top',
    });
  });

  it('allows changing category to bottom in edit mode', async () => {
    const user = userEvent.setup();
    const onUpdatePrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onUpdatePrinciple={onUpdatePrinciple} />);

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);

    // Change category to Bottom
    await user.click(screen.getByLabelText('Bottom'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onUpdatePrinciple).toHaveBeenCalledWith('p1', {
      content: 'Get inside position',
      category: 'bottom',
    });
  });

  it('rejects empty content in edit mode', async () => {
    const user = userEvent.setup();
    const onUpdatePrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onUpdatePrinciple={onUpdatePrinciple} />);

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);
    await user.clear(screen.getByDisplayValue('Get inside position'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onUpdatePrinciple).not.toHaveBeenCalled();
  });

  it('reverts to original values on cancel', async () => {
    const user = userEvent.setup();
    const onUpdatePrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onUpdatePrinciple={onUpdatePrinciple} />);

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);

    // Make changes
    await user.clear(screen.getByDisplayValue('Get inside position'));
    await user.type(screen.getByRole('textbox'), 'Changed');
    await user.click(screen.getByLabelText('Bottom'));

    // Cancel
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    // Verify original text is back
    expect(screen.getByText('Get inside position')).toBeInTheDocument();
    expect(onUpdatePrinciple).not.toHaveBeenCalled();
  });

  it('allows clicking Universal when editing a top principle', async () => {
    const user = userEvent.setup();
    const onUpdatePrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onUpdatePrinciple={onUpdatePrinciple} />);

    // Find the 'top' principle "Apply pressure" (p2) and its edit button
    // Principles are grouped by category, so order is: Universal (p1, p4), Top (p2), Bottom (p3)
    const applyPressureItem = screen.getByText('Apply pressure').closest('li');
    const editButton = applyPressureItem?.querySelector('button');
    expect(editButton).toBeInTheDocument();
    await user.click(editButton!);

    // Change category to Universal
    await user.click(screen.getByLabelText('Universal'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onUpdatePrinciple).toHaveBeenCalledWith('p2', {
      content: 'Apply pressure',
      category: 'universal',
    });
  });

  it('handles cancel on principle without category', async () => {
    const user = userEvent.setup();
    const onUpdatePrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onUpdatePrinciple={onUpdatePrinciple} />);

    // p4 "Keep arms close" has no category - find it and click edit
    const keepArmsItem = screen.getByText('Keep arms close').closest('li');
    const editButton = keepArmsItem?.querySelector('button');
    expect(editButton).toBeInTheDocument();
    await user.click(editButton!);

    // Make a change then cancel
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'Changed text');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    // Should revert to original and not call update
    expect(screen.getByText('Keep arms close')).toBeInTheDocument();
    expect(onUpdatePrinciple).not.toHaveBeenCalled();
  });
});
