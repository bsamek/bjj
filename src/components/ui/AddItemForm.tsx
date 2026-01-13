import { useState } from 'react';
import { Button } from './Button';

interface AddItemFormProps {
  placeholder: string;
  onAdd: (value: string) => void;
  onCancel: () => void;
}

export function AddItemForm({ placeholder, onAdd, onCancel }: AddItemFormProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg mb-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-slate-300 rounded mb-2"
        autoFocus
        onKeyDown={handleKeyDown}
      />
      <div className="flex gap-2">
        <Button onClick={handleSubmit}>Add</Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
