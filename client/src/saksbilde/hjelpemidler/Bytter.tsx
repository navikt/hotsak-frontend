import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons'
import { HStack, VStack } from '@navikt/ds-react'
import { Fragment } from 'react'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Bytte, BytteÅrsak } from '../../types/BehovsmeldingTypes'
import { Fremhevet } from './Fremhevet'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'

interface Props {
  bytter: Bytte[]
  harVarsel: boolean
}

const Bytter = ({ bytter, harVarsel }: Props) => {
  return (
    <HStack gap="2">
      {bytter.map((bytte, i) => (
        <Fragment key={i}>
          <VStack gap="2">
            <HStack gap="2">
              {harVarsel && <ExclamationmarkTriangleFillIcon color="var(--a-icon-warning)" fontSize="1.25rem" />}
              <Etikett>{bytte.erTilsvarende ? 'Skal byttes inn' : 'Skal leveres tilbake'}</Etikett>
            </HStack>
            <HStack align={'center'}>
              <strong>{bytte.hmsnr}</strong>
              <Kopiknapp tooltip="Kopier hmsnr" copyText={bytte.hmsnr} />{' '}
              <Tekst>{`${bytte.hjmNavn}${bytte.serienr ? ' Serienr: ' + bytte.serienr : ''}`}</Tekst>
            </HStack>
            {bytte.årsak && (
              <Fremhevet>
                <VStack gap="2" key={i}>
                  <Etikett>Begrunnelse for bytte</Etikett>
                  <div>Hjelpemiddelet skal byttes fordi det er {tekstByBytteårsak[bytte.årsak]}</div>
                </VStack>
              </Fremhevet>
            )}
          </VStack>
        </Fragment>
      ))}
    </HStack>
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
