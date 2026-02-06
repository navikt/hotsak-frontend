import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons'
import { HStack, Spacer, VStack } from '@navikt/ds-react'
import { Kopiknapp } from '../../../felleskomponenter/Kopiknapp'
import { Etikett, Tekst } from '../../../felleskomponenter/typografi'
import { tekstByBytteårsak } from '../../../saksbilde/hjelpemidler/Bytter'
import { Bytte } from '../../../types/BehovsmeldingTypes'

interface Props {
  bytter: Bytte[]
  harVarsel?: boolean
}

const BytterEksperiment = ({ bytter, harVarsel = false }: Props) => {
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
            <HStack wrap={false} align="center">
              <Kopiknapp tooltip="Kopier hmsnr" copyText={bytte.hmsnr} />
              <Tekst weight="semibold" size="small">
                {bytte.hmsnr}
              </Tekst>
            </HStack>
            <VStack gap="2">
              <Tekst>{bytte.hjmNavn}</Tekst>
              {bytte.serienr && <Tekst> Serienr: {bytte.serienr}</Tekst>}
            </VStack>
          </HStack>

          {bytte.årsak && (
            <>
              <Spacer />
              <VStack gap="2">
                <Etikett>Begrunnelse for bytte</Etikett>
                <div>Hjelpemiddelet skal byttes fordi det er {tekstByBytteårsak[bytte.årsak]}</div>
              </VStack>
            </>
          )}
        </VStack>
      ))}
    </VStack>
  )
}

export default BytterEksperiment
