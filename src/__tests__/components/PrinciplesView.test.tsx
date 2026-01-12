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
  it('calls onDeletePrinciple when Delete clicked', async () => {
    const user = userEvent.setup();
    const onDeletePrinciple = vi.fn();
    render(<PrinciplesView {...defaultProps} onDeletePrinciple={onDeletePrinciple} />);

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);

    expect(onDeletePrinciple).toHaveBeenCalledWith('p1');
  });
});
