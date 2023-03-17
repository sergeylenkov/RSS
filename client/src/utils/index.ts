export const debounce = <F extends (...args: unknown[]) => unknown>(
  func: F,
  waitFor: number
) => {
  let timeout = 0;

  const debounced = (...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor) as unknown as number;
  };

  return debounced as unknown as (...args: Parameters<F>) => ReturnType<F>;
};

export function isSystemDarkTheme(): boolean {
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}
