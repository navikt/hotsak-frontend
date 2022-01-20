import styled from 'styled-components/macro'

import { Heading } from '@navikt/ds-react'

import { capitalize, capitalizeName } from '../../utils/stringFormating'

import { Strek } from '../../felleskomponenter/Strek'
import { Personikon } from '../../felleskomponenter/ikoner/Personikon'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Formidler, Oppfølgingsansvarlig } from '../../types/types.internal'
import { Merknad } from '../../felleskomponenter/Merknad'

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
  grid-template-columns: 12rem auto;
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.125rem;
`

export const Formidlerside: React.FC<FormidlerProps> = ({ formidler, oppfølgingsansvarling }) => {
  const Formidlerinfo = () => {
    return (
      <Grid>
        <Etikett>Navn</Etikett>
        <Tekst>{capitalizeName(formidler.navn)}</Tekst>
        <Etikett>Arbeidssted</Etikett>
        <Tekst>{`${capitalize(formidler.arbeidssted)}`}</Tekst>
        <Etikett>Stilling</Etikett>
        <Tekst>{`${capitalize(formidler.stilling)}`}</Tekst>
        <Etikett>Postadresse</Etikett>
        <Tekst>{`${capitalize(formidler.postadresse)}`}</Tekst>
        <Etikett>Telefon</Etikett>
        <Tekst>{formidler.telefon}</Tekst>
        <Etikett>Treffest enklest</Etikett>
        <Tekst>{capitalize(formidler.treffestEnklest)}</Tekst>
        <Etikett>E-postadresse</Etikett>
        <Tekst>{formidler.epost}</Tekst>
      </Grid>
    )
  }

  const OppfølgingsasvarligInfo = () => {
    return (
      <Container>
        <Merknad>
          <Grid>
            <Etikett>Navn</Etikett>
            <Tekst>{capitalizeName(oppfølgingsansvarling.navn)}</Tekst>
            <Etikett>Arbeidssted</Etikett>
            <Tekst>{`${capitalize(oppfølgingsansvarling.arbeidssted)}`}</Tekst>
            <Etikett>Stilling</Etikett>
            <Tekst>{`${capitalize(oppfølgingsansvarling.stilling)}`}</Tekst>
            <Etikett>Telefon</Etikett>
            <Tekst>{oppfølgingsansvarling.telefon}</Tekst>
            <Etikett>Ansvar</Etikett>
            <Tekst>{capitalize(oppfølgingsansvarling.ansvarFor)}</Tekst>
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
