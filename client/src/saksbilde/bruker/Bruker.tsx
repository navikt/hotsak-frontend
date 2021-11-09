import styled from 'styled-components/macro'

import { Heading } from '@navikt/ds-react'

import { capitalizeName, capitalize } from '../../utils/stringFormating'

import { Liste } from '../../felleskomponenter/Liste'
import { Strek } from '../../felleskomponenter/Strek'
import { Personikon } from '../../felleskomponenter/ikoner/Personikon'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Bosituasjon, Levering, Personinfo, PersonInfoKilde, Formidler, SignaturType } from '../../types/types.internal'
import { BrukerBekreftet } from './BrukerBekreftet'
import { Fullmakt } from './Fullmakt'
import { Kontaktperson } from './Kontaktperson'
import { LeveringsMåte } from './Leveringsmåte'

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

const formaterNavn = (person: Personinfo) => {
  return capitalizeName(`${person.fornavn} ${person.mellomnavn ? `${person.mellomnavn}` : ''} ${person.etternavn}`)
}

const vilkårsTekst = (vilkår: string, navn: string) => {
  if (vilkår === 'nedsattFunksjon') {
    return `${navn} har vesentlig og varig nedsatt funksjonsevne som følge av sykdom, skade eller lyte. Med varig menes 2 år eller livet ut.`
  }

  if (vilkår === 'praktiskeProblem') {
    return `Hjelpemiddelet(ene) er nødvendig for å avhjelpe praktiske problemer i dagliglivet eller bli pleid i hjemmet. ${navn} sitt behov kan ikke løses med enklere og rimeligere hjelpemidler eller ved andre tiltak som ikke dekkes av NAV.`
  }

  if (vilkår === 'storreBehov') {
    return `Hjelpemiddelet(ene) er egnet til å avhjelpe funksjonsnedsettelsen og ${navn} vil være i stand til å bruke det.`
  }
  
}

export const Bruker: React.FC<BrukerProps> = ({ person, levering, formidler }) => {
  const formatertNavn = formaterNavn(person)
  const adresse = `${capitalize(person.adresse)}, ${person.postnummer} ${capitalize(person.poststed)}`
  return (
    <>
      <Heading level="1" size="medium" spacing={false}>
        <TittelIkon width={22} height={22} />
        Hjelpemiddelbruker
      </Heading>
      <Container>
        <Grid>
          <Etikett>Navn</Etikett>
          <Tekst>{formatertNavn}</Tekst>
          <Etikett>Fødselsnummer</Etikett>
          <Tekst>{person.fnr}</Tekst>
          <Etikett>{person.kilde === PersonInfoKilde.PDL ? 'Folkeregistert adresse' : 'Adresse'}</Etikett>
          <Tekst>{adresse}</Tekst>
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

      <Heading level="1" size="medium" spacing={true}>
        Utlevering
      </Heading>
      <Container>
        <Grid>
          <Etikett>Leveringadresse</Etikett>
          <Tekst>
            <LeveringsMåte levering={levering} brukerAdresse={adresse} />
          </Tekst>
          <Etikett>Kontaktperson</Etikett>
          <Kontaktperson formidler={formidler} kontaktperson={levering.kontaktPerson} />
          <Etikett>Merknad til utlevering</Etikett>
          <Tekst>{levering.merknad}</Tekst>
        </Grid>
      </Container>

      <Strek />
      {person.signaturType === SignaturType.SIGNATUR ? (
        <Fullmakt navn={formatertNavn} />
      ) : (
        <BrukerBekreftet navn={formatertNavn} />
      )}

      <Strek />

      <Heading level="1" size="medium" spacing={true}>
        Vilkår for å motta hjelpemidler
      </Heading>
      <Container>
        <Liste>
          {person.oppfylteVilkår.map((vilkår, i) => (
            <li key={i}>{vilkårsTekst(vilkår, formatertNavn)}</li>
          ))}
        </Liste>
      </Container>
    </>
  )
}
