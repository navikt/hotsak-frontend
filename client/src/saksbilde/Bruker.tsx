import styled from 'styled-components/macro'
import { Title, BodyShort } from '@navikt/ds-react'
import { Bosituasjon, Levering, Personinfo, PersonInfoKilde, Formidler } from '../types/types.internal'
import { Personikon } from '../felleskomponenter/ikoner/Personikon'
import { capitalizeName, capitalize } from '../utils/stringFormating'
import { LeveringsMåte } from './venstremeny/Leveringsmåte'
import { Kontaktperson } from './venstremeny/Kontaktperson'

interface BrukerProps {
  person: Personinfo
  levering: Levering
  formidler: Formidler
}



const TittelIkon = styled(Personikon)`
  padding-right: 0.5rem;
`

const Container = styled.div`
  padding-top: 1rem;
  font-size: 1rem !important;
  padding-bottom: 2rem;
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


export const Bruker: React.FC<BrukerProps> = ({ person, levering, formidler }) => {
  return (
    <>
      <Title level="1" size="m" spacing={false}>
        <TittelIkon width={22} height={22} />
        Hjelpemiddelbruker
      </Title>
      <Container>
        <Grid>
          <Label size="s">Navn</Label>
          <BodyShort size="s">
            {capitalizeName(
              `${person.etternavn}, ${person.fornavn} ${person.mellomnavn ? `${person.mellomnavn} ` : ''}`
            )}
          </BodyShort>
          <Label size="s">Fødselsnummer</Label>
          <BodyShort size="s">{person.fnr}</BodyShort>
          <Label size="s">{person.kilde === PersonInfoKilde.PDL ? 'Folkeregistert adresse' : 'Adresse'}</Label>
          <BodyShort size="s">{`${capitalize(person.adresse)}, ${person.postnummer} ${capitalize(person.poststed)}`}</BodyShort>
          <Label size="s">Telefon</Label>
          <BodyShort size="s">{person.telefon}</BodyShort>
          <Label size="s">Boform</Label>
          <BodyShort size="s">
            {person.bosituasjon === Bosituasjon.HJEMME
              ? 'Hjemme (egen bolig, omsorgsbolig eller bofelleskap)'
              : 'Institusjon'}
          </BodyShort>
          <Label size="s">Bruksarena</Label>
          <BodyShort size="s">{capitalize(person.bruksarena)}</BodyShort>
          <Label size="s">Funksjonsnedsettelse</Label>
          <BodyShort size="s">{capitalize(person.funksjonsnedsettelse.join(', '))}</BodyShort>
        </Grid>
      </Container>
      <Strek />

      <Title level="1" size="m" spacing={true}>
        Utlevering
      </Title>
      <Container>
        <Grid>
          <Label size="s">Leveringadresse</Label>
          <BodyShort size="s">
            <LeveringsMåte levering={levering} />
          </BodyShort>
          <Label size="s">Kontaktperson</Label>
          <Kontaktperson formidler={formidler} kontaktperson={levering.kontaktPerson}/>
          <Label size="s">Merknad til utlevering</Label>
          <BodyShort size="s">{levering.merknad}</BodyShort>
        </Grid>
      </Container>

      <Strek />

      <Title level="1" size="m" spacing={true}>
        Vilkår for å motta hjelpemidler
      </Title>
      <ul>
        {person.oppfylteVilkår.map(vilkår => <li>{vilkår}</li>)}
      </ul>
    </>
  )
}
