import { Alert, BodyLong, Heading } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { beløp } from '../../../../../formaters/beløp'
import { SatsType } from '../../../../../types/types.internal'
import { useBeregning } from '../useBeregning'
import { Øye } from './Øye'

export function BrillestyrkeForm() {
  const beregning = useBeregning()

  return (
    <>
      <Avstand paddingTop={4}>
        <Heading level="2" size="xsmall" spacing>
          § 2 Brillestyrke
        </Heading>
        <Øye type="høyre" />
        <Øye type="venstre" />
      </Avstand>

      {beregning && (
        <Avstand paddingBottom={5} paddingTop={5}>
          {beregning.sats === SatsType.INGEN ? (
            <Alert variant="warning">
              <BodyLong>Vilkår om brillestyrke og/eller sylinderstyrke er ikke oppfylt</BodyLong>
            </Alert>
          ) : (
            <Alert variant="info" role="alert">
              <Heading level="2" spacing size="small">
                {`Brillestøtte på opp til ${beløp.formater(beregning.satsBeløp)} kroner`}
              </Heading>
              <BodyLong>
                {`Barnet kan få støtte fra sats ${beregning.sats.replace('SATS_', '')}: ${beregning.satsBeskrivelse}`}
              </BodyLong>
            </Alert>
          )}
        </Avstand>
      )}
    </>
  )
}
