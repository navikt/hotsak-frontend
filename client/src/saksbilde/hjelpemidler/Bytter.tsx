import { HStack } from '@navikt/ds-react'
import { Fragment } from 'react'
import { Etikett } from '../../felleskomponenter/typografi'
import { Bytte, BytteÅrsak } from '../../types/types.internal'
import { Fremhevet } from './Fremhevet'

interface Props {
  bytter: Bytte[]
}

const Bytter = ({ bytter }: Props) => {
  return (
    <>
      {bytter.map((bytte, i) => (
        <Fragment key={i}>
          <HStack gap="2">
            <Etikett>{bytte.erTilsvarende ? 'Skal byttes inn' : 'Skal leveres tilbake'}</Etikett>
            <div>
              {bytte.hmsnr} {bytte.hjmNavn}
              {bytte.serienr && (
                <>
                  <br />
                  Serienr: {bytte.serienr}
                </>
              )}
            </div>
          </HStack>
          {bytte.årsak && (
            <Fremhevet>
              <HStack gap="2" key={i}>
                <Etikett>Begrunnelse for bytte</Etikett>
                <div>Hjelpemiddelet skal byttes fordi det er {tekstByBytteårsak[bytte.årsak]}</div>
              </HStack>
            </Fremhevet>
          )}
        </Fragment>
      ))}
    </>
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
