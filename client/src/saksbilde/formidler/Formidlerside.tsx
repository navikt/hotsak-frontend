import styled from 'styled-components'

import { Heading } from '@navikt/ds-react'

import { capitalize, capitalizeName } from '../../utils/stringFormating'

import { Merknad } from '../../felleskomponenter/Merknad'
import { Strek } from '../../felleskomponenter/Strek'
import { Personikon } from '../../felleskomponenter/ikoner/Personikon'
import { BrytbarBrødtekst, Brødtekst, Etikett } from '../../felleskomponenter/typografi'
import { Formidler, Oppfølgingsansvarlig } from '../../types/types.internal'

interface FormidlerProps {
  formidler: Formidler
  oppfølgingsansvarling: Oppfølgingsansvarlig
}

const TittelIkon = styled(Personikon)`
  padding-right: 0.5rem;
`

const Container = styled.div`
  padding-top: 1rem;
  font-size: 1rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(min-content, 12rem) auto;
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.125rem;
`

export const Formidlerside: React.FC<FormidlerProps> = ({ formidler, oppfølgingsansvarling }) => {
  const Formidlerinfo = () => {
    return (
      <Grid>
        <Etikett>Navn</Etikett>
        <Brødtekst>{capitalizeName(formidler.navn)}</Brødtekst>
        <Etikett>Arbeidssted</Etikett>
        <Brødtekst>{`${capitalize(formidler.arbeidssted)}`}</Brødtekst>
        <Etikett>Stilling</Etikett>
        <Brødtekst>{`${capitalize(formidler.stilling)}`}</Brødtekst>
        <Etikett>Postadresse</Etikett>
        <Brødtekst>{`${capitalize(formidler.postadresse)}`}</Brødtekst>
        <Etikett>Telefon</Etikett>
        <Brødtekst>{formidler.telefon}</Brødtekst>
        <Etikett>Treffest enklest</Etikett>
        <Brødtekst>{capitalize(formidler.treffestEnklest)}</Brødtekst>
        <Etikett>E-postadresse</Etikett>
        <BrytbarBrødtekst>{formidler.epost}</BrytbarBrødtekst>
      </Grid>
    )
  }

  const OppfølgingsasvarligInfo = () => {
    return (
      <Container>
        <Merknad>
          <Grid>
            <Etikett>Navn</Etikett>
            <Brødtekst>{capitalizeName(oppfølgingsansvarling.navn)}</Brødtekst>
            <Etikett>Arbeidssted</Etikett>
            <Brødtekst>{`${capitalize(oppfølgingsansvarling.arbeidssted)}`}</Brødtekst>
            <Etikett>Stilling</Etikett>
            <Brødtekst>{`${capitalize(oppfølgingsansvarling.stilling)}`}</Brødtekst>
            <Etikett>Telefon</Etikett>
            <Brødtekst>{oppfølgingsansvarling.telefon}</Brødtekst>
            <Etikett>Ansvar</Etikett>
            <Brødtekst>{capitalize(oppfølgingsansvarling.ansvarFor)}</Brødtekst>
          </Grid>
        </Merknad>
      </Container>
    )
  }

  return (
    <>
      <Heading level="1" size="medium" spacing={false}>
        <TittelIkon width={22} height={22} />
        Formidler og opplæringsansvarlig
      </Heading>
      <Container>
        <Heading level="1" size="small" spacing={false}>
          Hjelpemiddelformidler
        </Heading>
        <Container>
          <Formidlerinfo />
        </Container>
        {oppfølgingsansvarling && (
          <>
            <Strek />
            <Container>
              <Heading level="1" size="small" spacing={false}>
                Oppfølgings- og opplæringsansvarlig
              </Heading>
              <OppfølgingsasvarligInfo />
            </Container>
          </>
        )}
      </Container>
    </>
  )
}
