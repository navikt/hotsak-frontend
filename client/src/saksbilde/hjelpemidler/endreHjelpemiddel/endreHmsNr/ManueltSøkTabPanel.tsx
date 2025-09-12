import { Box, Heading } from '@navikt/ds-react'
import { BegrunnelseForBytte } from '../BegrunnelseForBytte'
import { EndreHjelpemiddelType } from '../endreHjelpemiddelTypes'
import { HmsNrVelger } from './HmsNrVelger'

export function ManueltSøkPanel({
  hmsArtNr,
  produktValgt,
}: {
  hjelpemiddelId: string
  hmsArtNr: string
  produktValgt: boolean
}) {
  return (
    <Box.New paddingBlock="space-24 0">
      {!produktValgt ? (
        <>
          <Heading level="1" size="small">
            Endre HMS nummer
          </Heading>
          <HmsNrVelger
            //hjelpemiddelId={hjelpemiddelId}
            hmsArtNr={hmsArtNr}
            nåværendeHmsArtNr={'TODO'}
          />
        </>
      ) : (
        <>
          <Heading level="1" size="small">
            Velg begrunnelse for å bytte hjelpemiddel
          </Heading>
          <BegrunnelseForBytte type={EndreHjelpemiddelType.ENDRE_HMS_NUMMER} />
        </>
      )}
    </Box.New>
  )
}
