import { Sakstype } from '../types/types.internal.ts'
import { useSak } from './useSak.ts'

export function useSkjulUIElementer() {
  const { data: sak } = useSak()?.sak ?? { data: undefined }

  return {
    skjulKopiknapp: !!(sak?.sakstype === Sakstype.BESTILLING),
  }
}
