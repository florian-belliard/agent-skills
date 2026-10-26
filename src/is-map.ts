// A YAML or JSON map: an object, not null, not an array.
export const isMap = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
