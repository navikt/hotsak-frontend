import { Sakstype } from '../../../types/types.internal'

export type WidthUnit = 'px' | '%' | 'rem' | 'em' | 'vw' | 'vh'

export interface PanelDefinition {
  id: string
  defaultVisible: boolean
  disabledForSakstyper?: Sakstype[]
  minWidth: number
  minWidthUnit: WidthUnit
  defaultSize: string
}

export const PANELS = [
  {
    id: 'behandlingspanel',
    defaultVisible: true,
    disabledForSakstyper: [Sakstype.BESTILLING],
    minWidth: 220,
    minWidthUnit: 'px',
    defaultSize: '290px',
  },
  {
    id: 'brevpanel',
    defaultVisible: false,
    disabledForSakstyper: [Sakstype.BESTILLING],
    minWidth: 320,
    minWidthUnit: 'px',
    defaultSize: '40%',
  },
  {
    id: 'behovsmeldingspanel',
    defaultVisible: true,
    minWidth: 300,
    minWidthUnit: 'px',
    defaultSize: '34%',
  },
  { id: 'kontaktinformasjonpanel', defaultVisible: true, minWidth: 220, minWidthUnit: 'px', defaultSize: '300px' },
  {
    id: 'sidebarpanel',
    defaultVisible: true,
    minWidth: 230,
    minWidthUnit: 'px',
    defaultSize: '20%',
  },
] as const satisfies PanelDefinition[]

export type PanelId = (typeof PANELS)[number]['id']
