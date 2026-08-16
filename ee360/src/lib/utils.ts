import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string, currency = '₦') {
  const num = Number(amount) || 0;
  if (num >= 1_000_000) return `${currency}${(num / 1_000_000).toFixed(3)}M`;
  if (num >= 1_000) return `${currency}${(num / 1_000).toFixed(3)}K`;
  return `${currency}${num.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getImageUrl(path: string | undefined | null) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // If no scheme, append to backend URL. In production, adjust if frontend serves it differently.
  return `https://api.eefarm360.com/storage/${path}`;
}
