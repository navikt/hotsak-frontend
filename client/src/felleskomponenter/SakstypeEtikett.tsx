import { memo } from 'react'

import { Sakstype } from '../types/types.internal.ts'
import { Oppgaveetikett } from './Oppgaveetikett.tsx'

export interface SakstypeEtikettProps {
  sakstype: Sakstype
}

export const SakstypeEtikett = memo(({ sakstype }: SakstypeEtikettProps) => {
  return <Oppgaveetikett type={sakstype} showLabel={true} />
})
