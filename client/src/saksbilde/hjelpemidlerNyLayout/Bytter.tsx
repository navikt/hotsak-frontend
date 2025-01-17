import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons'
import { Box, Heading, HGrid, HStack, Spacer, VStack } from '@navikt/ds-react'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Bytte, BytteÅrsak } from '../../types/BehovsmeldingTypes'

interface Props {
  bytter: Bytte[]
  harVarsel: boolean
}

const Bytter = ({ bytter, harVarsel }: Props) => {
  return (
    <Box
      /* TODO Lage felles komponent av denne boksen hvis vi går for noe sånn */
      paddingBlock="4 2"
      paddingInline="4"
      borderRadius="medium"
      borderColor="border-subtle"
      borderWidth="1"
      background="surface-subtle"
    >
      <Heading level="3" size="xsmall" spacing>
        Bytte
      </Heading>
      <VStack gap="4">
        {bytter.map((bytte, i) => (
          <VStack gap="1">
            <HStack gap="2">
              {harVarsel && <ExclamationmarkTriangleFillIcon color="var(--a-icon-warning)" fontSize="1.25rem" />}
              <Etikett>{bytte.erTilsvarende ? 'Skal byttes inn' : 'Skal leveres tilbake'}</Etikett>
            </HStack>
            <HGrid columns="5.6em auto" align="center">
              <HStack align={'center'}>
                <Tekst weight="semibold">{bytte.hmsnr}</Tekst>
                <Kopiknapp tooltip="Kopier hmsnr" copyText={bytte.hmsnr} />
              </HStack>
              <Tekst>{bytte.hjmNavn}</Tekst>

              {bytte.serienr && (
                <>
                  <Spacer />
                  <Tekst>Serienr: {bytte.serienr}</Tekst>
                </>
              )}

              {bytte.årsak && (
                <>
                  <Spacer />
                  <VStack gap="2" key={i}>
                    <Etikett>Begrunnelse for bytte</Etikett>
                    <div>Hjelpemiddelet skal byttes fordi det er {tekstByBytteårsak[bytte.årsak]}</div>
                  </VStack>
                </>
              )}
            </HGrid>
          </VStack>
        ))}
      </VStack>
    </Box>
  )
}

const tekstByBytteårsak: Record<keyof typeof BytteÅrsak, string> = {
  [BytteÅrsak.UTSLITT]: 'utslitt',
  [BytteÅrsak.VOKST_FRA]: 'vokst fra',
  [BytteÅrsak.ENDRINGER_I_INNBYGGERS_FUNKSJON]:
    'endringer i innbyggers funksjon slik at hjelpemidlet ikke lenger dekker behovet.',
  [BytteÅrsak.FEIL_STØRRELSE]: 'FEIL_STØRRELSE',
  [BytteÅrsak.VURDERT_SOM_ØDELAGT_AV_LOKAL_TEKNIKER]: 'vurdert som ødelagt av lokal tekniker.',
}

export default Bytter
