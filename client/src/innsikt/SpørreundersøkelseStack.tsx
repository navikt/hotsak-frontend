import { ReadMore, VStack } from '@navikt/ds-react'

import type { ISpørreundersøkelse } from './spørreundersøkelser'
import { Spørsmål } from './Spørsmål'

export interface SpørreundersøkelseStackProps {
  spørreundersøkelse: ISpørreundersøkelse
  size?: 'medium' | 'small'
  navn?: string
}

export function SpørreundersøkelseStack(props: SpørreundersøkelseStackProps) {
  const { spørreundersøkelse, size, navn } = props
  const { spørsmål } = spørreundersøkelse

  return (
    <VStack gap="5">
      {spørreundersøkelse.beskrivelse && (
        <ReadMore header={spørreundersøkelse.beskrivelse.header} size={size}>
          {spørreundersøkelse.beskrivelse.body}
        </ReadMore>
      )}
      {spørsmål.map((spørsmål) => (
        <Spørsmål key={spørsmål.tekst} spørsmål={spørsmål} navn={navn} nivå={0} size={size} />
      ))}
    </VStack>
  )
}
