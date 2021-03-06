import React from 'react'
import styled from 'styled-components'

import { Heading } from '@navikt/ds-react'

import { capitalize, capitalizeName } from '../../utils/stringFormating'

import { Liste } from '../../felleskomponenter/Liste'
import { Merknad } from '../../felleskomponenter/Merknad'
import { Strek } from '../../felleskomponenter/Strek'
import { Personikon } from '../../felleskomponenter/ikoner/Personikon'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Bosituasjon, Formidler, Levering, Personinfo, PersonInfoKilde } from '../../types/types.internal'
import { Kontaktperson } from './Kontaktperson'
import { LeveringsMåte } from './Leveringsmåte'
import { Signatur } from './Signatur'

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
  grid-template-columns: minmax(min-content, 12rem) auto;
  grid-column-gap: 0.7rem;
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

export const Bruker: React.VFC<BrukerProps> = ({ person, levering, formidler }) => {
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
              : 'Institusjon (sykehjem)'}
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
          <LeveringsMåte levering={levering} brukerAdresse={adresse} />
          <Kontaktperson formidler={formidler} kontaktperson={levering.kontaktperson} />
          {levering.merknad && (
            <>
              <Merknad>
                <Etikett>Merknad til utlevering</Etikett>
              </Merknad>
              <Brødtekst>{levering.merknad}</Brødtekst>
            </>
          )}
        </Grid>
      </Container>

      <Strek />
      <Signatur signaturType={person.signaturtype} navn={formatertNavn} />
      <Strek />

      <Heading level="1" size="medium" spacing={true}>
        Vilkår for å motta hjelpemidler
      </Heading>
      <Container>
        <Liste>
          {person.oppfylteVilkår.map((vilkår, i) => (
            <li key={i}>
              <Brødtekst>{vilkårsTekst(vilkår, formatertNavn)}</Brødtekst>
            </li>
          ))}
        </Liste>
      </Container>
    </>
  )
}
