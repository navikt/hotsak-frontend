import { BodyShort, Heading, Link, Panel } from '@navikt/ds-react'

export const PageNotFound = () => {
  return (
    <Panel>
        <Heading size="large">Feilkode: 404</Heading>
        <BodyShort>Oooops!</BodyShort>
        <BodyShort>En teknisk feil har oppstått</BodyShort>
        <Link href="/">Til oppgavelista</Link>
    </Panel>
  )
}
