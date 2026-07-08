/* eslint-disable @typescript-eslint/no-explicit-any */

type AsyncFn<T = void> = (...args: any[]) => Promise<T>;

export const catchAsync =
  <T>(fn: AsyncFn<T>, onError?: (err: unknown) => void): AsyncFn<T> =>
  async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (err) {
      if (onError) onError(err);
      throw err; // ⬅️ ensures return type is still Promise<T>
    }
  };
