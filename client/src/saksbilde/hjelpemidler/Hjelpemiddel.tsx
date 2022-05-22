import React from 'react'
import styled from 'styled-components'

import { Link } from '@navikt/ds-react'

import { capitalize } from '../../utils/stringFormating'

import { Rad, Kolonne } from '../../felleskomponenter/Flex'
import { Strek } from '../../felleskomponenter/Strek'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { HjelpemiddelType, Personinfo } from '../../types/types.internal'
import { Utlevert } from './Utlevert'
import { useGrunndata } from './grunndataHook'

const HjelpemiddelContainer = styled.div`
  font-size: 1rem;
`

const HMSLenke = styled(Link)`
  padding-left: 0.5rem;
`
const HMSTekst = styled.span`
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
      Number(props.rank) === 1 ? 'var(--navds-global-color-gray-200)' : 'var(--navds-global-color-orange-400)'};
    color: inherit;
    font-weight: inherit;
  }
`

const TilleggsInfo = styled(Rad)`
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    background-color: var(--navds-semantic-color-feedback-info-border);
    width: 3px;
    height: 95%;
    bottom: 0;
    left: -1rem;
  }
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
  forenkletVisning: boolean
}

export const Hjelpemiddel: React.FC<HjelpemiddelProps> = ({ hjelpemiddel, personinformasjon, forenkletVisning }) => {
  const produkt = useGrunndata(hjelpemiddel.hmsnr)

  return (
    <HjelpemiddelContainer key={hjelpemiddel.hmsnr}>
      <Rad>
        <EtikettKolonne>
          <Rad>
            {!forenkletVisning && (
              <Rangering rank={hjelpemiddel.rangering}>
                <Tekst>Rangering:</Tekst>
                <Tekst>{hjelpemiddel.rangering}</Tekst>
              </Rangering>
            )}
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
            <strong>{hjelpemiddel.hmsnr}</strong>
            {produkt ? (
              <HMSLenke href={produkt.artikkelurl} target="_blank">
                {hjelpemiddel.beskrivelse}
              </HMSLenke>
            ) : (
              <HMSTekst>{hjelpemiddel.beskrivelse}</HMSTekst>
            )}
          </Rad>
          <Rad>
            {hjelpemiddel.tilleggsinfo.length > 0 && (
              <TilleggsInfo>
                {hjelpemiddel.tilleggsinfo.map((tilleggsinfo) => {
                  return (
                    <React.Fragment key={tilleggsinfo.tittel}>
                      <Rad>
                        <Etikett>{`${capitalize(tilleggsinfo.tittel)}:`}</Etikett>
                      </Rad>
                      <Rad>
                        <Kolonne width="700px">
                          {tilleggsinfo.innholdsliste.map((element) => (
                            <Rad key={element}>{element}</Rad>
                          ))}
                        </Kolonne>
                      </Rad>
                    </React.Fragment>
                  )
                })}
                {hjelpemiddel.kategori.includes('rullestol') && personinformasjon.kroppsmål && (
                  <>
                    <Rad>
                      <Etikett>Kroppsmål:</Etikett>
                    </Rad>
                    <Rad>
                      <Kolonne width="700px">{`Setebredde ${personinformasjon.kroppsmål.setebredde} cm, legglengde ${personinformasjon.kroppsmål.legglengde} cm, lårlengde ${personinformasjon.kroppsmål.lårlengde} cm, høyde ${personinformasjon.kroppsmål.høyde} cm, kroppsvekt ${personinformasjon.kroppsmål.kroppsvekt} kg.`}</Kolonne>
                    </Rad>
                  </>
                )}
              </TilleggsInfo>
            )}
          </Rad>
          <Rad>
            {hjelpemiddel.alleredeUtlevert && (
              <Rad>
                <Etikett>Utlevert:</Etikett>
                <Utlevert alleredeUtlevert={hjelpemiddel.alleredeUtlevert} utlevertInfo={hjelpemiddel.utlevertInfo} />
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
                    <Rad key={tilbehør.hmsNr}>
                      <EtikettKolonne>{tilbehør.antall} stk</EtikettKolonne>
                      <Kolonne>
                        {tilbehør.hmsNr} {tilbehør.navn}
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
