import React from 'react'
import styled from 'styled-components/macro'
import { capitalize } from '../../utils/stringFormating'
import { Strek } from '../../felleskomponenter/Strek'
import { LevertIkon } from '../../felleskomponenter/ikoner/LevertIkon'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { HjelpemiddelType, Personinfo } from '../../types/types.internal'
import { Utlevert } from './Utlevert'
import { Rad, Kolonne } from '../../felleskomponenter/Flex'
import { useGrunndata } from './grunndataHook'
import { Link } from '@navikt/ds-react'

const HjelpemiddelContainer = styled.div`
  font-size: 1rem;
`

const HMSLenke = styled(Link)`
padding-left: 0.5rem;
`

const Rangering = styled('div')<RangeringProps>`
  display: flex;

  > p.navds-body-short:last-child {
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
const UtlevertContainer = styled.div`
  display: grid;
  grid-template-columns: 1.25rem auto;
  grid-column-gap: 0.75rem;
`
const EtikettKolonne: React.FC = ({ children }) => {
  return <Kolonne width="150px">{children}</Kolonne>
}


interface RangeringProps {
  rank?: number
}

interface HjelpemiddelProps {
    hjelpemiddel: HjelpemiddelType
    personinformasjon: Personinfo
}

export const Hjelpemiddel: React.FC<HjelpemiddelProps>  =  ({hjelpemiddel, personinformasjon}) => {
    const { produkt } = useGrunndata(hjelpemiddel.hmsnr)



    return (
        <HjelpemiddelContainer key={hjelpemiddel.hmsnr}>
              <Rad>
                <EtikettKolonne>
                  <Rad>
                    <Rangering rank={hjelpemiddel.rangering}>
                      <Tekst>Rangering:</Tekst>
                      <Tekst>{hjelpemiddel.rangering}</Tekst>
                    </Rangering>
                  </Rad>
                  <Rad>{hjelpemiddel.antall} stk</Rad>
                </EtikettKolonne>
                <Kolonne>
                  <Rad>
                    <Kolonne>
                      <Etikett>{produkt ? produkt?.isotittel : hjelpemiddel.kategori}</Etikett>
                    </Kolonne>
                  </Rad>
                  <Rad>{produkt && produkt.posttittel}</Rad>
                  <Rad>
                  {hjelpemiddel.hmsnr}
                    <HMSLenke
                      href={`https://www.hjelpemiddeldatabasen.no/r11x.asp?linkinfo=${produkt?.produktid}`}
                      target={'_blank'}
                    >{` ${hjelpemiddel.beskrivelse}`}</HMSLenke>
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
}