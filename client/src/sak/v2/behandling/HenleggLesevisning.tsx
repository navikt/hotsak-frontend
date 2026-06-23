import { VStack } from '@navikt/ds-react'
import { Etikett, Tekst } from '../../../felleskomponenter/typografi'
import { BehandlingsutfallHenleggelse, Henleggelsesårsak } from './behandlingTyper'

interface HenleggLesevisningProps {
  utfall: BehandlingsutfallHenleggelse
}

const årsakLabels: Record<Henleggelsesårsak, string> = {
  [Henleggelsesårsak.SØKNAD_TRUKKET]: 'Bruker ønsker å trekke søknaden',
  [Henleggelsesårsak.FEIL_HJELPEMIDDEL]:
    'Begrunner ønsker å trekke søknaden fordi det er søkt om feil hjelpemiddel/tilbehør',
  [Henleggelsesårsak.TRUKKET_AV_BEGRUNNER]: 'Begrunner ønsker å trekke søknaden',
  [Henleggelsesårsak.FLERE_SØKNADER_SAMME_BEHOV]: 'Det er sendt inn flere søknader på brukeren om samme behov',
  [Henleggelsesårsak.BRUKER_ER_DØD]: 'Bruker er død',
  [Henleggelsesårsak.DUPLIKAT]: 'Duplikat',
  [Henleggelsesårsak.FEIL_BRUKER]: 'Feil bruker',
  [Henleggelsesårsak.ANNET]: 'Annet',
}

export function HenleggLesevisning({ utfall }: HenleggLesevisningProps) {
  return (
    <VStack gap="space-8" marginBlock="space-16 space-0">
      {utfall.utfall && (
        <div>
          <Etikett>Årsak</Etikett>
          <Tekst>{årsakLabels[utfall.utfall]}</Tekst>
        </div>
      )}
      {utfall.begrunnelse && (
        <div>
          <Etikett>Begrunnelse</Etikett>
          <Tekst>{utfall.begrunnelse}</Tekst>
        </div>
      )}
    </VStack>
  )
}
