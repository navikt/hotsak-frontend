import styled from 'styled-components/macro'
import { Title } from '@navikt/ds-react'
import { Bosituasjon, Levering, Personinfo, PersonInfoKilde, Formidler, SignaturType } from '../../types/types.internal'
import { Personikon } from '../../felleskomponenter/ikoner/Personikon'
import { capitalizeName, capitalize } from '../../utils/stringFormating'
import { LeveringsMåte } from './Leveringsmåte'
import { Kontaktperson } from './Kontaktperson'
import { Liste } from '../../felleskomponenter/Liste'
import { Fullmakt } from './Fullmakt'
import { BrukerBekreftet } from './BrukerBekreftet'
import { Strek } from '../../felleskomponenter/Strek'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'


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
  padding-bottom: 2rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 12rem auto;
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.125rem;
`

const formaterNavn = (person : Personinfo) => {
    return capitalizeName(
        `${person.etternavn}, ${person.fornavn} ${person.mellomnavn ? `${person.mellomnavn} ` : ''}`
      )
}


export const Bruker: React.FC<BrukerProps> = ({ person, levering, formidler }) => {
  return (
    <>
      <Title level="1" size="m" spacing={false}>
        <TittelIkon width={22} height={22} />
        Hjelpemiddelbruker
      </Title>
      <Container>
        <Grid>
          <Etikett>Navn</Etikett>
          <Tekst>
            {formaterNavn(person) }
          </Tekst>
          <Etikett>Fødselsnummer</Etikett>
          <Tekst>{person.fnr}</Tekst>
          <Etikett>{person.kilde === PersonInfoKilde.PDL ? 'Folkeregistert adresse' : 'Adresse'}</Etikett>
          <Tekst>{`${capitalize(person.adresse)}, ${person.postnummer} ${capitalize(person.poststed)}`}</Tekst>
          <Etikett>Telefon</Etikett>
          <Tekst>{person.telefon}</Tekst>
          <Etikett>Boform</Etikett>
          <Tekst>
            {person.bosituasjon === Bosituasjon.HJEMME
              ? 'Hjemme (egen bolig, omsorgsbolig eller bofelleskap)'
              : 'Institusjon'}
          </Tekst>
          <Etikett>Bruksarena</Etikett>
          <Tekst>{capitalize(person.bruksarena)}</Tekst>
          <Etikett>Funksjonsnedsettelse</Etikett>
          <Tekst>{capitalize(person.funksjonsnedsettelse.join(', '))}</Tekst>
        </Grid>
      </Container>
      <Strek />

      <Title level="1" size="m" spacing={true}>
        Utlevering
      </Title>
      <Container>
        <Grid>
          <Etikett>Leveringadresse</Etikett>
          <Tekst>
            <LeveringsMåte levering={levering} />
          </Tekst>
          <Etikett>Kontaktperson</Etikett>
          <Kontaktperson formidler={formidler} kontaktperson={levering.kontaktPerson}/>
          <Etikett>Merknad til utlevering</Etikett>
          <Tekst>{levering.merknad}</Tekst>
        </Grid>
      </Container>

<Strek/>
    {person.signaturType === SignaturType.SIGNATUR ? <Fullmakt navn={formaterNavn(person)}/> : <BrukerBekreftet navn={formaterNavn(person)}/>}

      <Strek />

      <Title level="1" size="m" spacing={true}>
        Vilkår for å motta hjelpemidler
      </Title>
      <Container>
      <Liste>
        {person.oppfylteVilkår.map(vilkår => <li>{vilkår}</li>)}
      </Liste>
      </Container>
    </>
  )
}
