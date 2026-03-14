"use client";

import { useCallback, useEffect, useRef } from "react";

type AnyFn = (...args: any[]) => void;

export const useDebouncedCallback = <T extends AnyFn>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => clear, []);

  return useCallback(
    (...args: Parameters<T>) => {
      clear();
      timeoutRef.current = setTimeout(() => {
        fn(...args);
      }, delay);
    },
    [fn, delay],
  );
};

