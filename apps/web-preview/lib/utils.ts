import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatScore(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export type LeadTemperature = 'cold' | 'warm' | 'qualified' | 'hot';

export function leadTemperatureFromScore(ls: number): LeadTemperature {
  if (ls >= 0.75) return 'hot';
  if (ls >= 0.6) return 'qualified';
  if (ls >= 0.4) return 'warm';
  return 'cold';
}
