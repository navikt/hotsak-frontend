import styled from 'styled-components/macro'
import { Title, BodyShort } from '@navikt/ds-react'
import { Bosituasjon, Levering, Personinfo, PersonInfoKilde } from '../types/types.internal'
import { Personikon } from '../felleskomponenter/ikoner/Personikon'
import { capitalizeName, capitalize } from '../utils/stringFormating'

interface BrukerProps {
  person: Personinfo
  levering: Levering
}

const TittelIkon = styled(Personikon)`
  padding-right: 0.5rem;
`

const Container = styled.div`
  padding-top: 1rem;
  font-size: 1rem;
`

const Strek = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--navds-color-gray-40);
`

const Label = styled(BodyShort)`
  font-weight: bold;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: 12rem auto;
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.125rem;
`

export const Bruker: React.FC<BrukerProps> = ({ person, levering }) => {
  return (
    <>
      <Title level="1" size="m" spacing={false}>
        <TittelIkon width={22} height={22} />
        Hjelpemiddelbruker
      </Title>
      <Container>
        <Grid>
          <Label>Navn</Label>
          <BodyShort>
            {capitalizeName(
              `${person.etternavn}, ${person.fornavn} ${person.mellomnavn ? `${person.mellomnavn} ` : ''}`
            )}
          </BodyShort>
          <Label>Fødselsnummer</Label>
          <BodyShort>{person.fnr}</BodyShort>
          <Label>{person.kilde === PersonInfoKilde.PDL ? 'Folkeregistert adresse' : 'Adresse'}</Label>
          <BodyShort>{`${capitalize(person.adresse)}, ${person.postnummer} ${capitalize(person.poststed)}`}</BodyShort>
          <Label>Telefon</Label>
          <BodyShort>{person.telefon}</BodyShort>
          <Label>Boform</Label>
          <BodyShort>
            {person.bosituasjon === Bosituasjon.HJEMME
              ? 'Hjemme (egen bolig, omsorgsbolig eller bofelleskap)'
              : 'Institusjon'}
          </BodyShort>
          <Label>Bruksarena</Label>
          <BodyShort>{capitalize(person.bruksarena)}</BodyShort>
          <Label>Funksjonsnedsettelse</Label>
          <BodyShort>{capitalize(person.funksjonsnedsettelse.join(', '))}</BodyShort>
        </Grid>
      </Container>
      <Strek />
    </>
  )
}
