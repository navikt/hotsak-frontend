import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons'
import { Bleed, HStack, Spacer, VStack } from '@navikt/ds-react'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Bytte, BytteÅrsak } from '../../types/BehovsmeldingTypes'

interface Props {
  bytter: Bytte[]
  harVarsel?: boolean
}

const Bytter = ({ bytter, harVarsel = false }: Props) => {
  return (
    <VStack gap="4">
      {bytter.map((bytte, idx) => (
        <VStack gap="2" key={idx}>
          <HStack gap="2">
            {harVarsel && <ExclamationmarkTriangleFillIcon color="var(--a-icon-warning)" fontSize="1.25rem" />}
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

const tekstByBytteårsak: Record<keyof typeof BytteÅrsak, string> = {
  [BytteÅrsak.UTSLITT]: 'utslitt',
  [BytteÅrsak.VOKST_FRA]: 'vokst fra',
  [BytteÅrsak.ENDRINGER_I_INNBYGGERS_FUNKSJON]:
    'endringer i innbyggers funksjon slik at hjelpemidlet ikke lenger dekker behovet.',
  [BytteÅrsak.FEIL_STØRRELSE]: 'FEIL_STØRRELSE',
  [BytteÅrsak.VURDERT_SOM_ØDELAGT_AV_LOKAL_TEKNIKER]: 'vurdert som ødelagt av lokal tekniker.',
}

export default Bytter
