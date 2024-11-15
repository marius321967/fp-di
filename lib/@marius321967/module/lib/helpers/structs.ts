/** Use in filter() */
export const excludeNull = <T>(value: T | null): value is T => value !== null;

/** Use in filter() */
export const excludeUndefined = <T>(value: T | undefined): value is T =>
  value !== undefined;

export const unique = <T>(values: T[]): T[] => {
  return Array.from(new Set(values));
};
