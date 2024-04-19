export interface IBesvarelse extends Record<string | 'svar', string | string[] | IBesvarelse> {}

export function join(...segments: Array<string | undefined>): string {
  return segments.filter((segment) => !!segment).join('.')
}
