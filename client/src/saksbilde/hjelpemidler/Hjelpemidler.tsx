import styled from 'styled-components/macro'

import Lenke from 'nav-frontend-lenker'
import { Normaltekst } from 'nav-frontend-typografi'

import { Title } from '@navikt/ds-react'

import { capitalize } from '../../utils/stringFormating'

import { Strek } from '../../felleskomponenter/Strek'
import { LevertIkon } from '../../felleskomponenter/ikoner/LevertIkon'
import { RullestolIkon } from '../../felleskomponenter/ikoner/RullestolIkon'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Hjelpemiddel, Personinfo } from '../../types/types.internal'
import { Utlevert } from './Utlevert'

const TittelIkon = styled(RullestolIkon)`
  padding-right: 0.5rem;
`
const Container = styled.div`
  padding-top: 1rem;
`

const HjelpemiddelContainer = styled.div`
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
    background-color: ${(props) =>
      Number(props.rank) === 1 ? 'var(--navds-color-green-20)' : 'var(--navds-color-orange-40)'};
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
  personinformasjon: Personinfo
}

const UtlevertContainer = styled.div`
  display: grid;
  grid-template-columns: 1.25rem auto;
  grid-column-gap: 0.75rem;
`
const EtikettKolonne: React.FC = ({ children }) => {
  return <Kolonne width="150px">{children}</Kolonne>
}

const summerAntall = (hjelpemidler: Hjelpemiddel[]) => {
  const summarize = (accumulator: number, currentValue: number) => Number(accumulator) + Number(currentValue)

  return hjelpemidler
    .map((hjelpemiddel) => {
      const antallTilbehør = hjelpemiddel.tilbehør.map((tilbehør) => tilbehør.antall).reduce(summarize, 0)
      return Number(hjelpemiddel.antall) + antallTilbehør
    })
    .reduce(summarize, 0)
}

export const Hjelpemidler: React.FC<HjelpemidlerProps> = ({ hjelpemidler, søknadGjelder, personinformasjon }) => {
  return (
    <>
      <Title level="1" size="m" spacing={false}>
        <TittelIkon width={26} height={26} />
        Hjelpemidler
      </Title>
      <Tekst>{capitalize(personinformasjon.funksjonsnedsettelse.join(', '))}</Tekst>
      <Container>
        {hjelpemidler.map((hjelpemiddel) => {
          return (
            <HjelpemiddelContainer key={hjelpemiddel.hmsnr}>
              <Rad>
                <EtikettKolonne>
                  <Rad>
                    <Rangering rank={hjelpemiddel.rangering}>
                      <Normaltekst>Rangering:</Normaltekst>
                      <Normaltekst>{hjelpemiddel.rangering}</Normaltekst>
                    </Rangering>
                  </Rad>
                  <Rad>{hjelpemiddel.antall} stk</Rad>
                </EtikettKolonne>
                <Kolonne>
                  <Rad>
                    <Kolonne>
                      <Etikett>{hjelpemiddel.kategori}</Etikett>
                    </Kolonne>
                  </Rad>
                  <Rad>
                    <Lenke
                      href={`https://www.hjelpemiddeldatabasen.no/r6x.asp?searchterm=${hjelpemiddel.hmsnr}`}
                      target={'_blank'}
                    >{`${hjelpemiddel.hmsnr} ${hjelpemiddel.beskrivelse}`}</Lenke>
                  </Rad>
                  <Rad>
                    {hjelpemiddel.tilleggsinfo.length > 0 && (
                      <TilleggsInfo>
                        {hjelpemiddel.tilleggsinfo.map((tilleggsinfo) => {
                          return (
                            <Rad key={tilleggsinfo.innhold}>
                              <EtikettKolonne>
                                <Etikett>{`${capitalize(tilleggsinfo.tittel)}:`}</Etikett>
                              </EtikettKolonne>
                              <Kolonne>{tilleggsinfo.innhold}</Kolonne>
                            </Rad>
                          )
                        })}
                        {hjelpemiddel.kategori.includes('rullestol') && personinformasjon.kroppsmål && (
                          <Rad>
                            <EtikettKolonne>
                              <Etikett>Kroppsmål:</Etikett>
                            </EtikettKolonne>
                            <Kolonne>{`Setebredde ${personinformasjon.kroppsmål.setebredde} cm, legglengde ${personinformasjon.kroppsmål.legglengde} cm, lårlengde ${personinformasjon.kroppsmål.lårlengde} cm, høyde ${personinformasjon.kroppsmål.høyde} cm, kroppsvekt ${personinformasjon.kroppsmål.kroppsvekt} kg.`}</Kolonne>
                          </Rad>
                        )}
                      </TilleggsInfo>
                    )}
                  </Rad>
                  <Rad>
                    {hjelpemiddel.utlevertFraHjelpemiddelsentralen && (
                      <Rad>
                        <Etikett>
                          <UtlevertContainer>
                            <LevertIkon />
                          </UtlevertContainer>
                        </Etikett>

                        <Utlevert
                          alleredeUtlevert={hjelpemiddel.utlevertFraHjelpemiddelsentralen}
                          utlevertInfo={hjelpemiddel.utlevertInfo}
                        />
                      </Rad>
                    )}
                  </Rad>
                </Kolonne>
                <Rad>
                  <Rad>
                    {hjelpemiddel.tilbehør.length > 0 && (
                      <>
                        <EtikettKolonne />
                        <Kolonne>
                          <Etikett>Tilbehør:</Etikett>
                        </Kolonne>
                        <Rad>
                          {hjelpemiddel.tilbehør.map((tilbehør) => (
                            <Rad key={tilbehør.hmsnr}>
                              <EtikettKolonne>{tilbehør.antall} stk</EtikettKolonne>
                              <Kolonne>
                                {tilbehør.hmsnr} {tilbehør.navn}
                              </Kolonne>
                            </Rad>
                          ))}
                        </Rad>
                      </>
                    )}
                  </Rad>
                </Rad>
              </Rad>
              <Strek />
            </HjelpemiddelContainer>
          )
        })}
        <Rad>
          <Etikett>
            Totalt {summerAntall(hjelpemidler.filter((it) => !it.utlevertFraHjelpemiddelsentralen))} stk. inkl. tilbehør
          </Etikett>
        </Rad>
        {hjelpemidler.filter((hjelpemiddel) => hjelpemiddel.utlevertFraHjelpemiddelsentralen).length > 0 && (
          <Rad>
            Totalt. {summerAntall(hjelpemidler.filter((it) => it.utlevertFraHjelpemiddelsentralen))} stk. allerede
            utlevert
          </Rad>
        )}
      </Container>
    </>
  )
}
