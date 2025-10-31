import { Box } from '@navikt/ds-react'
import type { ReactNode } from 'react'
import { Mellomtittel, Tekst } from '../../felleskomponenter/typografi.tsx'

export interface HøyrekolonnePanelProps {
  tittel: string
  error?: false | string
  spacing?: boolean
  loading?: false | string
  children: ReactNode
}

/**
 * @see {@link VenstremenyCard}
 */
export function HøyrekolonnePanel(props: HøyrekolonnePanelProps) {
  const { tittel, loading, error, spacing = true, children } = props
  return (
    <Box as="aside" padding="4">
      <Mellomtittel spacing={spacing}>{tittel}</Mellomtittel>
      {error && <Tekst>{error}</Tekst>}
      {loading && <Tekst>{loading}</Tekst>}
      {!loading && !error && children}
    </Box>
  )
}
