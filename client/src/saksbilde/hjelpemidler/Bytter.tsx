import { HStack } from '@navikt/ds-react'
import { Bytte } from '../../types/types.internal'
import { Etikett } from '../../felleskomponenter/typografi'

interface Props {
  bytter: Bytte[]
}

const Bytter = ({ bytter }: Props) => {
  return (
    <>
      {bytter.map((bytte, i) => (
        <HStack gap="2" key={i}>
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
      ))}
    </>
  )
}

export default Bytter
