import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = '₦') {
  if (amount >= 1_000_000) return `${currency}${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${currency}${(amount / 1_000).toFixed(1)}K`;
  return `${currency}${amount.toLocaleString()}`;
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
