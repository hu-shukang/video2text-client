import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 複数のクラス名を結合し、Tailwind CSSのクラスをマージします。
 * `clsx`と`tailwind-merge`のラッパーです。
 *
 * @param inputs - 結合するクラス名のリスト。
 * @returns マージされたクラス文字列。
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 指定された時間（ミリ秒）だけ処理を遅延させるPromiseを返します。
 *
 * @param ms - 遅延させる時間（ミリ秒）。
 * @returns 指定時間後に解決されるPromise。
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
