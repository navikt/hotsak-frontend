import type { Barnebrillesak } from '../types/types.internal'
import { useSak } from './useSak.ts'

export function useBarnebrillesak() {
  return useSak<Barnebrillesak>()
}
