import { HStack, VStack } from '@navikt/ds-react'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Bytte, BytteÅrsak } from '../../types/BehovsmeldingTypes'

interface Props {
  bytter: Bytte[]
}

const Bytter = ({ bytter }: Props) => {
  return (
    <VStack gap="4">
      {bytter.map((bytte, idx) => (
        <VStack gap="2" key={idx}>
          <HStack gap="2">
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
            <VStack gap="2">
              <Etikett>Begrunnelse for bytte</Etikett>
              <Tekst>Hjelpemiddelet skal byttes fordi det er {tekstByBytteårsak[bytte.årsak]}</Tekst>
            </VStack>
          )}
        </VStack>
      ))}
    </VStack>
  )
}

export const tekstByBytteårsak: Record<keyof typeof BytteÅrsak, string> = {
  [BytteÅrsak.UTSLITT]: 'utslitt',
  [BytteÅrsak.VOKST_FRA]: 'vokst fra',
  [BytteÅrsak.ENDRINGER_I_INNBYGGERS_FUNKSJON]:
    'endringer i innbyggers funksjon slik at hjelpemidlet ikke lenger dekker behovet.',
  [BytteÅrsak.FEIL_STØRRELSE]: 'FEIL_STØRRELSE',
  [BytteÅrsak.VURDERT_SOM_ØDELAGT_AV_LOKAL_TEKNIKER]: 'ødelagt, etter vurdering av lokal tekniker.',
}

export default Bytter
