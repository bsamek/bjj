import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EditableItem } from '../../components/EditableItem';

describe('EditableItem', () => {
  const defaultProps = {
    value: 'Test item',
    onUpdate: vi.fn(),
    onDelete: vi.fn(),
  };

  describe('default rendering (bullet style)', () => {
    it('renders the value with default bullet', () => {
      render(<EditableItem {...defaultProps} />);
      expect(screen.getByText('Test item')).toBeInTheDocument();
      expect(screen.getByText('•')).toBeInTheDocument();
    });

    it('renders custom bullet character and color', () => {
      render(<EditableItem {...defaultProps} bulletChar="→" bulletColor="text-green-500" />);
      expect(screen.getByText('→')).toBeInTheDocument();
    });

    it('shows Edit and Delete buttons on hover', () => {
      render(<EditableItem {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });
  });

  describe('border style rendering', () => {
    it('renders with border style when borderStyle prop is true', () => {
      render(<EditableItem {...defaultProps} borderStyle />);
      expect(screen.getByText('Test item')).toBeInTheDocument();
      // Should not have bullet
      expect(screen.queryByText('•')).not.toBeInTheDocument();
    });

    it('shows Edit and Delete buttons in border style', () => {
      render(<EditableItem {...defaultProps} borderStyle />);
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });
  });

  describe('editing mode', () => {
    it('enters editing mode when Edit clicked', async () => {
      const user = userEvent.setup();
      render(<EditableItem {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: 'Edit' }));

      expect(screen.getByDisplayValue('Test item')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('focuses and selects input on edit', async () => {
      const user = userEvent.setup();
      render(<EditableItem {...defaultProps} />);

      await user.click(screen.getByRole('button', { name: 'Edit' }));

      const input = screen.getByDisplayValue('Test item');
      expect(document.activeElement).toBe(input);
    });

    it('calls onUpdate with new value on Save', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('button', { name: 'Edit' }));
      await user.clear(screen.getByDisplayValue('Test item'));
      await user.type(screen.getByRole('textbox'), 'Updated item');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onUpdate).toHaveBeenCalledWith('Updated item');
    });

    it('does not call onUpdate when value unchanged', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('button', { name: 'Edit' }));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onUpdate).not.toHaveBeenCalled();
    });

    it('does not call onUpdate when value is empty', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('button', { name: 'Edit' }));
      await user.clear(screen.getByDisplayValue('Test item'));
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onUpdate).not.toHaveBeenCalled();
    });

    it('trims whitespace from updated value', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('button', { name: 'Edit' }));
      await user.clear(screen.getByDisplayValue('Test item'));
      await user.type(screen.getByRole('textbox'), '  Updated item  ');
      await user.click(screen.getByRole('button', { name: 'Save' }));

      expect(onUpdate).toHaveBeenCalledWith('Updated item');
    });

    it('exits editing mode on Cancel without calling onUpdate', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('button', { name: 'Edit' }));
      await user.clear(screen.getByDisplayValue('Test item'));
      await user.type(screen.getByRole('textbox'), 'New value');
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onUpdate).not.toHaveBeenCalled();
      expect(screen.getByText('Test item')).toBeInTheDocument();
    });

    it('saves on Enter key', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('button', { name: 'Edit' }));
      await user.clear(screen.getByDisplayValue('Test item'));
      await user.type(screen.getByRole('textbox'), 'Enter saved{Enter}');

      expect(onUpdate).toHaveBeenCalledWith('Enter saved');
    });

    it('cancels on Escape key', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();
      render(<EditableItem {...defaultProps} onUpdate={onUpdate} />);

      await user.click(screen.getByRole('button', { name: 'Edit' }));
      await user.clear(screen.getByDisplayValue('Test item'));
      await user.type(screen.getByRole('textbox'), 'New value{Escape}');

      expect(onUpdate).not.toHaveBeenCalled();
      expect(screen.getByText('Test item')).toBeInTheDocument();
    });
  });

  describe('delete functionality', () => {
    it('calls onDelete when Delete button clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(<EditableItem {...defaultProps} onDelete={onDelete} />);

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      expect(onDelete).toHaveBeenCalled();
    });

    it('calls onDelete in border style', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(<EditableItem {...defaultProps} onDelete={onDelete} borderStyle />);

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      expect(onDelete).toHaveBeenCalled();
    });
  });
});
