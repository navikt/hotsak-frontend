import type { ReactNode } from 'react'

import { Mellomtittel } from '../../felleskomponenter/typografi.tsx'

export interface VenstremenyCardProps {
  heading?: string
  children?: ReactNode
  spacing?: boolean
}

/**
 * @see {@link HøyrekolonnePanel}
 */
export function VenstremenyCard(props: VenstremenyCardProps) {
  const { heading, spacing, children } = props
  return (
    <section>
      {heading && <Mellomtittel spacing={spacing}>{heading}</Mellomtittel>}
      {children}
    </section>
  )
}
