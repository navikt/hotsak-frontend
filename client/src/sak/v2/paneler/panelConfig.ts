export type WidthUnit = 'px' | '%' | 'rem' | 'em' | 'vw' | 'vh'

export interface PanelDefinition {
  id: string
  defaultVisible: boolean
  minWidth: number
  minWidthUnit: WidthUnit
  defaultSize: number
}

export const PANELS = [
  {
    id: 'behandlingspanel',
    defaultVisible: true,
    minWidth: 220,
    minWidthUnit: 'px',
    defaultSize: 15,
  },
  {
    id: 'brevpanel',
    defaultVisible: false,
    minWidth: 320,
    minWidthUnit: 'px',
    defaultSize: 40,
  },
  {
    id: 'behovsmeldingspanel',
    defaultVisible: true,
    minWidth: 300,
    minWidthUnit: 'px',
    defaultSize: 34,
  },
  { id: 'kontaktinformasjonpanel', defaultVisible: true, minWidth: 220, minWidthUnit: 'px', defaultSize: 20 },
  {
    id: 'sidebarpanel',
    defaultVisible: true,
    minWidth: 230,
    minWidthUnit: 'px',
    defaultSize: 20,
  },
] as const satisfies PanelDefinition[]

export type PanelId = (typeof PANELS)[number]['id']
