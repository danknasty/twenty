export const isDefined = (value: unknown): value is NonNullable<typeof value> =>
  value !== null && value !== undefined;
