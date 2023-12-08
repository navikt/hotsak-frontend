import { Alert, BodyLong } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { Brødtekst, Etikett } from '../../../../../felleskomponenter/typografi'
import { beløp } from '../../../../../formaters/beløp'
import { SatsType } from '../../../../../types/types.internal'
import { useBeregning } from '../useBeregning'
import { Øye } from './Øye'

export function BrillestyrkeForm() {
  const beregning = useBeregning()

  return (
    <>
      <Avstand paddingTop={10}>
        <Øye type="høyre" />
      </Avstand>
      <Avstand paddingTop={8}>
        <Øye type="venstre" />
      </Avstand>

      {beregning && (
        <Avstand paddingBottom={1} paddingTop={3}>
          {beregning.sats === SatsType.INGEN ? (
            <Alert variant="warning">
              <BodyLong>Vilkår om brillestyrke og/eller sylinderstyrke er ikke oppfylt</BodyLong>
            </Alert>
          ) : (
            <Alert variant="info" role="alert">
              <Etikett>{`Brillestøtte på opp til ${beløp.formater(beregning.satsBeløp)} kroner`}</Etikett>
              <Brødtekst>
                {`Barnet kan få støtte fra sats ${beregning.sats.replace('SATS_', '')}: ${beregning.satsBeskrivelse}`}
              </Brødtekst>
            </Alert>
          )}
        </Avstand>
      )}
    </>
  )
}
