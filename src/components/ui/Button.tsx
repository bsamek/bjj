import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'link' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700',
  secondary: 'px-3 py-1 text-slate-500 hover:text-slate-700',
  link: 'text-sm text-blue-600 hover:text-blue-800',
  danger: 'text-slate-400 hover:text-red-600 text-xs',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
