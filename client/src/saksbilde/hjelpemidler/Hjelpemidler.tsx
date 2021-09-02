import styled from 'styled-components/macro'

import { Title } from '@navikt/ds-react'

import { capitalize } from '../../utils/stringFormating'

import { RullestolIkon } from '../../felleskomponenter/ikoner/RullestolIkon'
import { LevertIkon } from '../../felleskomponenter/ikoner/LevertIkon'
import { Hjelpemiddel } from '../../types/types.internal'
import { Utlevert } from './Utlevert'
import { Normaltekst } from 'nav-frontend-typografi'
import { Strek } from '../../felleskomponenter/Strek'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'

const TittelIkon = styled(RullestolIkon)`
  padding-right: 0.5rem;
`
const Container = styled.div`
  padding-top: 1rem;
`

const HjelpemiddelContainer = styled.div`
  padding-top: 1rem;
  font-size: 1rem;
`

const Rad = styled('div')<RadProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding-top: ${(props) => props.paddingTop || '0.1rem'};
  padding-bottom: 0.2rem;
`

interface KolonneProps {
  width?: string
  textAlign?: string
}

interface RadProps {
  paddingTop?: string
}

interface RangeringProps {
    rank?: number
}


//
const Kolonne = styled('div')<KolonneProps>`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  text-align: ${(props) => props.textAlign || 'left'};
  max-width: ${(props) => props.width || 'auto'};
`
const Rangering = styled('div')<RangeringProps>`
display: flex; 

> p.typo-normal:last-child {
    min-width: 24px;
  min-height: 24px;
  text-align: center;
  margin-left: 0.5rem;
  padding: 1px;
  border-radius: 50%;
  background-color: ${(props) => Number(props.rank) === 1 ? 'var(--navds-color-green-20)' : 'var(--navds-color-gray-20)'};
  color: inherit;
  font-weight: inherit;
}
`
const TilleggsInfo = styled(Rad)`
  background-color: #fff5e5;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
`

interface HjelpemidlerProps {
  hjelpemidler: Hjelpemiddel[]
  søknadGjelder: string
  funksjonsnedsettelse: string[]
}

const UtlevertContainer = styled.div`
  display: grid;
  grid-template-columns: 1.25rem auto;
  grid-column-gap: 0.75rem;
`

const Totaler = styled.div`
    text-align: right;
`

const summerAntall = (hjelpemidler: Hjelpemiddel[]) => {
  const summarize = (accumulator: number, currentValue: number) => Number(accumulator) + Number(currentValue)

  return hjelpemidler
    .map((hjelpemiddel) => {
      const antallTilbehør = hjelpemiddel.tilbehør.map((tilbehør) => tilbehør.antall).reduce(summarize, 0)
      return Number(hjelpemiddel.antall) + antallTilbehør
    })
    .reduce(summarize, 0)
}

export const Hjelpemidler: React.FC<HjelpemidlerProps> = ({ hjelpemidler, søknadGjelder, funksjonsnedsettelse }) => {
  return (
    <>
      <Title level="1" size="m" spacing={false}>
        <TittelIkon width={22} height={22} />
        {søknadGjelder}
      </Title>
      <Tekst>{capitalize(funksjonsnedsettelse.join(', '))}</Tekst>
      <Container>
        {hjelpemidler.map((hjelpemiddel) => {
          return (
            <HjelpemiddelContainer key={hjelpemiddel.hmsnr}>
              <Rad>
                <Kolonne>
                  <Rad>
                    <Kolonne>
                      <Etikett>{`${hjelpemiddel.hmsnr} ${hjelpemiddel.beskrivelse}`}</Etikett>
                    </Kolonne>
                    <Kolonne textAlign="right"><Rangering rank={hjelpemiddel.rangering}><Normaltekst>Rangering:</Normaltekst><Normaltekst>{hjelpemiddel.rangering}</Normaltekst></Rangering></Kolonne>
                  </Rad>
                  <Rad>{hjelpemiddel.kategori}</Rad>
                  {hjelpemiddel.utlevertFraHjelpemiddelsentralen && (
                    <Rad>
                      <Kolonne width="160px">
                        <Etikett>
                          <UtlevertContainer>
                            <LevertIkon />
                            <Normaltekst>Utlevert:</Normaltekst>
                          </UtlevertContainer>
                        </Etikett>
                      </Kolonne>
                      <Kolonne>
                        <Utlevert
                          alleredeUtlevert={hjelpemiddel.utlevertFraHjelpemiddelsentralen}
                          utlevertInfo={hjelpemiddel.utlevertInfo}
                        />
                      </Kolonne>
                    </Rad>
                  )}

                  {hjelpemiddel.tilleggsinfo.length > 0 && (
                    <TilleggsInfo>
                      {hjelpemiddel.tilleggsinfo.map((tilleggsinfo) => {
                        return (
                          <Rad key={tilleggsinfo.innhold}>
                            <Kolonne width="160px">
                              <Etikett>{`${capitalize(tilleggsinfo.tittel)}:`}</Etikett>
                            </Kolonne>
                            <Kolonne>{tilleggsinfo.innhold}</Kolonne>
                          </Rad>
                        )
                      })}
                    </TilleggsInfo>
                  )}
                </Kolonne>
                <Kolonne width="180px">
                  <Rad>
                    <Kolonne width="100px" textAlign="right"></Kolonne>
                    <Kolonne textAlign="right"> {hjelpemiddel.antall} stk</Kolonne>
                  </Rad>
                </Kolonne>
                {hjelpemiddel.tilbehør.length > 0 && (
                  <>
                    <Rad paddingTop="0.8rem">
                      <Kolonne width="160px">
                        <Etikett>Tilbehør:</Etikett>
                      </Kolonne>
                      <Kolonne>
                        {hjelpemiddel.tilbehør.map((tilbehør) => (
                          <Rad key={tilbehør.hmsnr}>
                            <Kolonne>
                              {tilbehør.hmsnr} {tilbehør.navn}
                            </Kolonne>
                            <Kolonne>
                              <Rad>
                                <Kolonne textAlign="right">{tilbehør.antall} stk</Kolonne>
                              </Rad>
                            </Kolonne>
                          </Rad>
                        ))}
                      </Kolonne>
                    </Rad>
                  </>
                )}
              </Rad>
              <Strek />
            </HjelpemiddelContainer>
          )
        })}
        <Totaler>
          <Normaltekst>
            <Etikett>Totalt {summerAntall(hjelpemidler.filter((it) => !it.utlevertFraHjelpemiddelsentralen))} stk. inkl. tilbehør</Etikett>
            Totalt. {summerAntall(hjelpemidler.filter((it) => it.utlevertFraHjelpemiddelsentralen))} stk. allerede utlevert
          </Normaltekst>{' '}
        </Totaler>
      </Container>
    </>
  )
}
