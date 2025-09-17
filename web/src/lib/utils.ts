import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URL = import.meta.env.VITE_API_URL;
export const BASE_URL = import.meta.env.VITE_BASE_URL;
