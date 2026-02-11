import { Alert, BodyLong, Box, VStack } from '@navikt/ds-react'

import { Etikett, Tekst } from '../../../../../felleskomponenter/typografi'
import { SatsType } from '../../../../../types/types.internal'
import { formaterBeløp } from '../../../../../utils/formater'
import { useBeregning } from '../useBeregning'
import { Øye } from './Øye'

export function BrillestyrkeForm() {
  const beregning = useBeregning()

  return (
    <div>
      <VStack gap="8">
        <Øye type="høyre" />
        <Øye type="venstre" />
      </VStack>

      {beregning && (
        <Box paddingBlock="3 1">
          {beregning.sats === SatsType.INGEN ? (
            <Alert variant="warning">
              <BodyLong>Vilkår om brillestyrke og/eller sylinderstyrke er ikke oppfylt</BodyLong>
            </Alert>
          ) : (
            <Alert variant="info" role="alert">
              <Etikett>{`Brillestøtte på opp til ${formaterBeløp(beregning.satsBeløp)} kroner`}</Etikett>
              <Tekst>
                {`Barnet kan få tilskudd fra sats ${beregning.sats.replace('SATS_', '')}: ${beregning.satsBeskrivelse}`}
              </Tekst>
            </Alert>
          )}
        </Box>
      )}
    </div>
  )
}
