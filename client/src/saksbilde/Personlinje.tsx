import styled from 'styled-components/macro'
import dayjs from 'dayjs';
import { Element, Normaltekst } from 'nav-frontend-typografi'
import { ISO_TIDSPUNKTFORMAT } from '../utils/date';
import { capitalizeName, formaterFødselsnummer } from '../utils/stringFormating'

import { Clipboard } from '../felleskomponenter/clipboard'
import { KjønnsnøytraltIkon } from '../felleskomponenter/ikoner/KjønnsnøytraltIkon'
import { Kvinneikon } from '../felleskomponenter/ikoner/Kvinneikon'
import { Manneikon } from '../felleskomponenter/ikoner/Manneikon'
import { Personinfo, Kjønn } from '../types/types.internal'

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 48px;
  min-width: var(--speil-total-min-width);
  box-sizing: border-box;
  padding: 0 2rem;
  background: var(--speil-background-secondary);
  border-bottom: 1px solid var(--navds-color-border);
  color: var(--navds-color-text-primary);

  > svg {
    margin-right: 0.5rem;
  }
`

const Separator = styled(Normaltekst)`
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
  person?: Personinfo
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

export const Personlinje = ({ person }: PersonlinjeProps) => {
  if (!person) return <Container />

  const { fnr, brukernummer, fornavn, mellomnavn, etternavn, kjønn, fødselsdato } = person
  return (
    <Container>
      <Kjønnsikon kjønn={kjønn} />
      <Element>{capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn} ` : ''} (${fødselsdato && beregnAlder(fødselsdato)} år)`)}</Element>
      <Separator>/</Separator>
      {fnr ? (
        <Clipboard preserveWhitespace={false} copyMessage="Fødselsnummer er kopiert">
          <Normaltekst>{formaterFødselsnummer(fnr)}</Normaltekst>
        </Clipboard>
      ) : (
        <Normaltekst>Fødselsnummer ikke tilgjengelig</Normaltekst>
      )}
      <Separator>/</Separator>
      {brukernummer ? (
        <Clipboard preserveWhitespace={false} copyMessage="Brukernummer er kopiert">
          <Normaltekst>{`Brukernummer: ${brukernummer}`}</Normaltekst>
        </Clipboard>
      ) : (
        <Normaltekst>Brukernummer ikke tilgjengelig</Normaltekst>
      )}
    </Container>
  )
}
