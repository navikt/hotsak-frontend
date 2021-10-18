import Lenke from 'nav-frontend-lenker'
import { Normaltekst } from 'nav-frontend-typografi'
import styled from 'styled-components/macro'


import { capitalize } from '../../utils/stringFormating'

import { Strek } from '../../felleskomponenter/Strek'
import { LevertIkon } from '../../felleskomponenter/ikoner/LevertIkon'
import { Etikett } from '../../felleskomponenter/typografi'
import { HjelpemiddelType, Personinfo } from '../../types/types.internal'
import { Utlevert } from './Utlevert'
import { Rad, Kolonne } from '../../felleskomponenter/Flex'

const HjelpemiddelContainer = styled.div`
  font-size: 1rem;
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
    produkt: HjelpemiddelType
    personinformasjon: Personinfo
}

export const Hjelpemiddel: React.FC<HjelpemiddelProps>  =  ({produkt, personinformasjon}) => {
    return (
        <HjelpemiddelContainer key={produkt.hmsnr}>
              <Rad>
                <EtikettKolonne>
                  <Rad>
                    <Rangering rank={produkt.rangering}>
                      <Normaltekst>Rangering:</Normaltekst>
                      <Normaltekst>{produkt.rangering}</Normaltekst>
                    </Rangering>
                  </Rad>
                  <Rad>{produkt.antall} stk</Rad>
                </EtikettKolonne>
                <Kolonne>
                  <Rad>
                    <Kolonne>
                      <Etikett>{produkt.kategori}</Etikett>
                    </Kolonne>
                  </Rad>
                  <Rad>
                    <Lenke
                      href={`https://www.hjelpemiddeldatabasen.no/r6x.asp?searchterm=${produkt.hmsnr}`}
                      target={'_blank'}
                    >{`${produkt.hmsnr} ${produkt.beskrivelse}`}</Lenke>
                  </Rad>
                  <Rad>
                    {produkt.tilleggsinfo.length > 0 && (
                      <TilleggsInfo>
                        {produkt.tilleggsinfo.map((tilleggsinfo) => {
                          return (
                            <Rad key={tilleggsinfo.innhold}>
                              <EtikettKolonne>
                                <Etikett>{`${capitalize(tilleggsinfo.tittel)}:`}</Etikett>
                              </EtikettKolonne>
                              <Kolonne>{tilleggsinfo.innhold}</Kolonne>
                            </Rad>
                          )
                        })}
                        {produkt.kategori.includes('rullestol') && personinformasjon.kroppsmål && (
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
                    {produkt.utlevertFraHjelpemiddelsentralen && (
                      <Rad>
                        <Etikett>
                          <UtlevertContainer>
                            <LevertIkon />
                          </UtlevertContainer>
                        </Etikett>

                        <Utlevert
                          alleredeUtlevert={produkt.utlevertFraHjelpemiddelsentralen}
                          utlevertInfo={produkt.utlevertInfo}
                        />
                      </Rad>
                    )}
                  </Rad>
                </Kolonne>
                <Rad>
                  <Rad>
                    {produkt.tilbehør.length > 0 && (
                      <>
                        <EtikettKolonne />
                        <Kolonne>
                          <Etikett>Tilbehør:</Etikett>
                        </Kolonne>
                        <Rad>
                          {produkt.tilbehør.map((tilbehør) => (
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