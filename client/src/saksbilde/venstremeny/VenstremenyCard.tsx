import type { ReactNode } from 'react'

import { Mellomtittel } from '../../felleskomponenter/typografi.tsx'

export interface VenstremenyCardProps {
  heading?: string
  children?: ReactNode
}

/**
 * @see {@link HøyrekolonnePanel}
 */
export function VenstremenyCard(props: VenstremenyCardProps) {
  const { heading, children } = props
  return (
    <section>
      {heading && <Mellomtittel>{heading}</Mellomtittel>}
      {children}
    </section>
  )
}
