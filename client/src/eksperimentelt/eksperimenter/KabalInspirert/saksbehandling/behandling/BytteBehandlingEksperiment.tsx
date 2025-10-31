import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons'
import { Bleed, HStack, VStack } from '@navikt/ds-react'
import { Etikett, Tekst } from '../../../../../felleskomponenter/typografi'
import { Kopiknapp } from '../../../../../felleskomponenter/Kopiknapp'
import { Bytte } from '../../../../../types/BehovsmeldingTypes'

interface Props {
  bytter: Bytte[]
  harVarsel?: boolean
}

const BytteBehandlingEksperiment = ({ bytter, harVarsel = false }: Props) => {
  return (
    <VStack gap="4">
      {bytter.map((bytte, idx) => (
        <VStack gap="2" key={idx}>
          <HStack gap="2">
            {harVarsel && (
              <ExclamationmarkTriangleFillIcon color="var(--ax-text-warning-decoration)" fontSize="1.25rem" />
            )}
            <Etikett>{bytte.erTilsvarende ? 'Skal byttes inn' : 'Skal leveres tilbake'}</Etikett>
          </HStack>

          <HStack align={'start'} wrap={false} gap="2">
            <HStack wrap={false}>
              <Tekst weight="semibold">{bytte.hmsnr}</Tekst>
              <Bleed marginBlock="1 0">
                <Kopiknapp tooltip="Kopier hmsnr" copyText={bytte.hmsnr} />
              </Bleed>
            </HStack>
            <VStack gap="2">
              <Tekst>{bytte.hjmNavn}</Tekst>
              {bytte.serienr && <Tekst> Serienr: {bytte.serienr}</Tekst>}
            </VStack>
          </HStack>
        </VStack>
      ))}
    </VStack>
  )
}

export default BytteBehandlingEksperiment
