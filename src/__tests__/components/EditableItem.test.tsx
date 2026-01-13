import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EditableItem } from '../../components/EditableItem';

describe('EditableItem', () => {
  const defaultProps = {
    value: 'Test value',
    onUpdate: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders value with default bullet style', () => {
    render(<EditableItem {...defaultProps} />);

    expect(screen.getByText('Test value')).toBeInTheDocument();
    expect(screen.getByText('•')).toBeInTheDocument();
  });

  it('renders value with custom bullet color and character', () => {
    render(<EditableItem {...defaultProps} bulletColor="text-red-500" bulletChar="→" />);

    expect(screen.getByText('Test value')).toBeInTheDocument();
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  it('renders value with border style', () => {
    render(<EditableItem {...defaultProps} borderStyle />);

    expect(screen.getByText('Test value')).toBeInTheDocument();
    // Border style doesn't show bullet
    expect(screen.queryByText('•')).not.toBeInTheDocument();
  });

  it('shows edit and delete buttons', () => {
    render(<EditableItem {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('shows edit and delete buttons in border style', () => {
    render(<EditableItem {...defaultProps} borderStyle />);

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('shows confirmation dialog when delete button clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<EditableItem {...defaultProps} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    // Should show confirmation dialog
    expect(screen.getByText('Delete this item?')).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('calls onDelete when confirmed in delete dialog', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<EditableItem {...defaultProps} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    // Now click Delete in confirmation dialog (red button)
    const confirmDialog = screen.getByText('Delete this item?').closest('li');
    const confirmDeleteBtn = confirmDialog?.querySelector('button.bg-red-600');
    await user.click(confirmDeleteBtn!);

    expect(onDelete).toHaveBeenCalled();
  });

  it('dismisses confirmation dialog when cancel clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<EditableItem {...defaultProps} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByText('Delete this item?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    // Should be back to normal display
    expect(screen.queryByText('Delete this item?')).not.toBeInTheDocument();
    expect(screen.getByText('Test value')).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('shows confirmation dialog when delete button clicked in border style', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<EditableItem {...defaultProps} onDelete={onDelete} borderStyle />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    // Should show confirmation dialog
    expect(screen.getByText('Delete this item?')).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('calls onDelete when confirmed in border style', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<EditableItem {...defaultProps} onDelete={onDelete} borderStyle />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    // Now click Delete in confirmation dialog (red button)
    const confirmDialog = screen.getByText('Delete this item?').closest('li');
    const confirmDeleteBtn = confirmDialog?.querySelector('button.bg-red-600');
    await user.click(confirmDeleteBtn!);

    expect(onDelete).toHaveBeenCalled();
  });

  it('enters edit mode when Edit clicked', async () => {
    const user = userEvent.setup();

    render(<EditableItem {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('Test value');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('enters edit mode when Edit clicked in border style', async () => {
    const user = userEvent.setup();

    render(<EditableItem {...defaultProps} borderStyle />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('Test value');
  });

  it('focuses and selects input when entering edit mode', async () => {
    const user = userEvent.setup();

    render(<EditableItem {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
  });

  it('calls onUpdate when saved with new value', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'New value');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onUpdate).toHaveBeenCalledWith('New value');
  });

  it('does not call onUpdate when saved with same value', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    // Don't change the value, just save
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('does not call onUpdate when saved with whitespace-only value', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), '   ');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('trims whitespace from saved value', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), '  New value  ');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onUpdate).toHaveBeenCalledWith('New value');
  });

  it('cancels edit and reverts value', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'Changed value');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onUpdate).not.toHaveBeenCalled();
    // Should be back to display mode
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('Test value')).toBeInTheDocument();
  });

  it('saves on Enter key', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'New value{Enter}');

    expect(onUpdate).toHaveBeenCalledWith('New value');
    // Should be back to display mode
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('cancels on Escape key', async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();

    render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'Changed value');
    await user.keyboard('{Escape}');

    expect(onUpdate).not.toHaveBeenCalled();
    // Should be back to display mode
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('Test value')).toBeInTheDocument();
  });

  it('updates input value as user types', async () => {
    const user = userEvent.setup();

    render(<EditableItem {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.clear(screen.getByRole('textbox'));
    await user.type(screen.getByRole('textbox'), 'Typing...');

    expect(screen.getByRole('textbox')).toHaveValue('Typing...');
  });
});
