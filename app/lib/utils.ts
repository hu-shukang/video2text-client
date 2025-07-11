import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 延迟指定毫秒数
 * @param ms - 延迟的毫秒数
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
