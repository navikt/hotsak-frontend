import dayjs from 'dayjs'
import styled from 'styled-components/macro'
import { CopyToClipboard } from '@navikt/ds-react-internal'
import { ISO_TIDSPUNKTFORMAT } from '../utils/date'
import { capitalizeName, formaterFødselsnummer, formaterTelefonnummer } from '../utils/stringFormating'

import { KjønnsnøytraltIkon } from '../felleskomponenter/ikoner/KjønnsnøytraltIkon'
import { Kvinneikon } from '../felleskomponenter/ikoner/Kvinneikon'
import { Manneikon } from '../felleskomponenter/ikoner/Manneikon'
import { Personinfo, Kjønn, PersonoversiktType } from '../types/types.internal'
import { Etikett, Tekst } from '../felleskomponenter/typografi'
import { hotsakTotalMinWidth } from '../GlobalStyles'
import { Link } from '@navikt/ds-react'
import { usePersonContext } from '../personoversikt/PersonContext'
import { useHistory } from 'react-router'

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 48px;
  min-width: ${hotsakTotalMinWidth};
  box-sizing: border-box;
  padding: 0 2rem;
  background: var(--navds-semantic-color-canvas-background);
  border-bottom: 1px solid var(--navds-semantic-color-border-muted);
  color: var(--navds-semantic-color-text);

  > svg {
    margin-right: 0.5rem;
  }
`

const Clipboard = styled(CopyToClipboard)`
  color: var(--navds-semantic-color-text);
`

const Separator = styled.div`
  margin: 0 1rem 0 1rem;
`
const Kjønnsikon = ({ kjønn }: { kjønn: Kjønn }) => {
  switch (kjønn) {
    case Kjønn.KVINNE:
      return <Kvinneikon />
    case Kjønn.MANN:
      return <Manneikon />
    default:
      return <KjønnsnøytraltIkon />
  }
}

interface PersonlinjeProps {
  person?: Personinfo | PersonoversiktType | undefined
}

const LoadingText = styled.div`
  @keyframes placeHolderShimmer {
    0% {
      background-position: -468px 0;
    }
    100% {
      background-position: 468px 0;
    }
  }

  animation-duration: 1.25s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background: transparent;
  background: linear-gradient(to right, transparent 0%, #eaeaea 16%, transparent 33%);
  background-size: 800px 104px;
  border-radius: 4px;
  height: 22px;
  width: 150px;
  margin: 4px 0;
`

export const LasterPersonlinje = () => (
  <Container>
    <KjønnsnøytraltIkon />
    <LoadingText />
    <Separator>/</Separator>
    <LoadingText />
    <Separator>/</Separator>
    <LoadingText />
    <Separator>/</Separator>
    <LoadingText />
    <Separator>/</Separator>
    <LoadingText />
  </Container>
)

const beregnAlder = (fødselsdato: string) => {
  return dayjs().diff(dayjs(fødselsdato, ISO_TIDSPUNKTFORMAT), 'year')
}

const formaterNavn = (person: Personinfo | PersonoversiktType) => {
  return capitalizeName(`${person.fornavn} ${person.mellomnavn ? `${person.mellomnavn} ` : ''} ${person.etternavn}`)
}

export const Personlinje = ({ person }: PersonlinjeProps) => {
  const { setFodselsnummer } = usePersonContext()
  const history = useHistory()

  if (!person) return <Container />

  const { fnr, brukernummer, kjønn, fødselsdato, telefon } = person
  return (
    <Container>
      <Kjønnsikon kjønn={kjønn} />
      {window.appSettings.MILJO !== 'prod-gcp' ? (
        <Link
          href="#"
          onClick={() => {
            setFodselsnummer(fnr)
            history.push('/personoversikt/saker')
          }}
        >
          <Etikett>{`${formaterNavn(person)} (${fødselsdato && beregnAlder(fødselsdato)} år)`}</Etikett>
        </Link>
      ) : (
        <Etikett>{`${formaterNavn(person)} (${fødselsdato && beregnAlder(fødselsdato)} år)`}</Etikett>
      )}
      <Separator>/</Separator>
      {fnr ? (
        <>
          <Tekst>{`Fnr: ${formaterFødselsnummer(fnr)}`}</Tekst>
          <Clipboard
            popoverText="Fødselsnummer kopiert"
            variant="tertiary"
            size="small"
            copyText={fnr}
            popoverPlacement="bottom"
          />
        </>
      ) : (
        <Tekst>Fødselsnummer ikke tilgjengelig</Tekst>
      )}
      <Separator>/</Separator>
      {brukernummer ? (
        <>
          <Tekst>{`Brukernr: ${brukernummer}`}</Tekst>
          <Clipboard
            popoverText="Brukernummer kopiert"
            popoverPlacement="bottom"
            variant="tertiary"
            size="small"
            copyText={brukernummer}
          ></Clipboard>
        </>
      ) : (
        <Tekst>Brukernummer ikke tilgjengelig</Tekst>
      )}
      <Separator>/</Separator>
      {telefon ? (
        <>
          <Tekst>{`Tlf: ${formaterTelefonnummer(telefon)}`}</Tekst>
          <Clipboard
            popoverText="Telefonnummer er kopiert"
            popoverPlacement="bottom"
            variant="tertiary"
            size="small"
            copyText={telefon}
          ></Clipboard>
        </>
      ) : (
        <Tekst>Telefonnummer ikke tilgjengelig</Tekst>
      )}
    </Container>
  )
}
