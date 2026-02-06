import { Box } from '@navikt/ds-react'
import type { ReactNode } from 'react'
import type { BoxProps } from '@navikt/ds-react'
import { Mellomtittel, Tekst } from '../../../felleskomponenter/typografi.tsx'

export interface SidebarPanelProps {
  tittel: string
  error?: false | string
  spacing?: boolean
  loading?: false | string
  paddingInline?: BoxProps['paddingInline']
  paddingBlock?: BoxProps['paddingBlock']
  children: ReactNode
}

/**
 * @see {@link VenstremenyCard}
 */
export function SidebarPanel(props: SidebarPanelProps) {
  const {
    tittel,
    loading,
    error,
    spacing = true,
    paddingInline = 'space-16',
    paddingBlock = 'space-16',
    children,
  } = props
  return (
    <Box as="aside" paddingInline={paddingInline} paddingBlock={paddingBlock}>
      <Mellomtittel spacing={spacing}>{tittel}</Mellomtittel>
      {error && <Tekst>{error}</Tekst>}
      {loading && <Tekst>{loading}</Tekst>}
      {!loading && !error && children}
    </Box>
  )
}
