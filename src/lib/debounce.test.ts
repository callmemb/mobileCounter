import { debounce } from './debounce';
import { vi, describe, it, expect } from 'vitest';

vi.useFakeTimers();

describe('debounce', () => {
  it('should debounce a function', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).not.toBeCalled();

    vi.advanceTimersByTime(1000);

    expect(func).toBeCalledTimes(1);
  });

  it('should pass arguments to the debounced function', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc(1, 2, 3);

    vi.advanceTimersByTime(1000);

    expect(func).toBeCalledWith(1, 2, 3);
  });
});
