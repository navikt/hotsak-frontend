import type { History } from '@platejs/slate'
import type { Value } from 'platejs'

import type { Brevdata } from '../brevTyper.ts'
import type { PlaceholderSpesielleVerdier } from './plugins/placeholder/parseTekstMedPlaceholders.ts'

export interface BreveditorState extends Brevdata {
  value: Value
  valueAsHtml: string
  history: History
}

export interface BrevmalInitialisering extends Brevdata {
  templateValues?: PlaceholderSpesielleVerdier
}

export type BreveditorBrevdata = BreveditorState | BrevmalInitialisering

export function isBreveditorState(data: BreveditorBrevdata): data is BreveditorState {
  return Array.isArray(data.value) && typeof data.valueAsHtml === 'string' && data.history != null
}
