import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(centimes: number) {
  return `${(centimes / 100).toFixed(2)}€`;
}

export function generateStudentCode(index: number): string {
  return `eleve_${String(index).padStart(3, '0')}`;
}