import React, { useState } from 'react'
import styled from 'styled-components'
import { useSWRConfig } from 'swr'

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Button, CopyButton, HStack, Link, Tooltip } from '@navikt/ds-react'

import { putEndreHjelpemiddel } from '../../io/http'
import { capitalize } from '../../utils/stringFormating'

import { Kolonne, Rad } from '../../felleskomponenter/Flex'
import { Strek } from '../../felleskomponenter/Strek'
import { PersonikonFilled } from '../../felleskomponenter/ikoner/PersonikonFilled'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import {
  EndreHjelpemiddelRequest,
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  HjelpemiddelType,
  OppgaveStatusType,
  Sak,
} from '../../types/types.internal'
import { EndreHjelpemiddel } from './EndreHjelpemiddel'
import { Utlevert } from './Utlevert'
import { useGrunndata } from './grunndataHook'
import { useHjelpemiddel } from './hjelpemiddelHook'

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
    background-color: ${(props) => (Number(props.$rank) === 1 ? 'var(--a-gray-200)' : 'var(--a-orange-400)')};
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
    background-color: var(--a-border-info);
    width: 3px;
    height: 95%;
    bottom: 0;
    left: -1rem;
  }
`

const EtikettKolonne: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <Kolonne $width="150px">{children}</Kolonne>
}

interface RangeringProps {
  $rank?: number
}

interface HjelpemiddelProps {
  hjelpemiddel: HjelpemiddelType
  forenkletVisning: boolean
  sak: Sak
}

export const Hjelpemiddel: React.FC<HjelpemiddelProps> = ({ hjelpemiddel, forenkletVisning, sak }) => {
  const { personinformasjon, status, sakId } = sak

  const [visEndreProdukt, setVisEndreProdukt] = useState(false)
  const { mutate } = useSWRConfig()

  const produkt = useGrunndata(hjelpemiddel.hmsnr)

  const endretProdukt = hjelpemiddel.endretHjelpemiddel

  const { hjelpemiddel: endretHjelpemiddelNavn } = useHjelpemiddel(endretProdukt ? endretProdukt.hmsNr : undefined)

  const endreHjelpemiddel = async (endreHjelpemiddel: EndreHjelpemiddelRequest) => {
    await putEndreHjelpemiddel(sakId, endreHjelpemiddel)
      .catch(() => console.log('error endre hjelpemiddel'))
      .then(() => {
        mutate(`api/sak/${sakId}`)
        mutate(`api/sak/${sakId}/historikk`)
      })
    setVisEndreProdukt(false)
  }

  const nåværendeHmsnr = endretProdukt ? endretProdukt.hmsNr : hjelpemiddel.hmsnr

  return (
    <HjelpemiddelContainer key={hjelpemiddel.hmsnr}>
      <Rad>
        <EtikettKolonne>
          <Rad>
            {!forenkletVisning && (
              <Rangering $rank={hjelpemiddel.rangering}>
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
              <Etikett>{produkt?.isotittel}</Etikett>
            </Kolonne>
          </Rad>
          <Rad>{produkt?.posttittel}</Rad>
          {endretProdukt && (
            <Rad>
              <HStack align="center" gap="2">
                <Tooltip content="Kopierer hmsnr">
                  <HStack align="center">
                    <strong>{endretProdukt.hmsNr}</strong>
                    <CopyButton size="small" copyText={endretProdukt.hmsNr} />
                  </HStack>
                </Tooltip>
                <HMSTekst>{endretHjelpemiddelNavn?.navn}</HMSTekst>
              </HStack>
            </Rad>
          )}
          <Rad>
            <HStack align="center" gap="2">
              <Tooltip content="Kopierer hmsnr">
                <HStack align="center">
                  <strong style={{ textDecoration: endretProdukt ? 'line-through' : '' }}>{hjelpemiddel.hmsnr}</strong>
                  {!endretProdukt && <CopyButton size="small" copyText={hjelpemiddel.hmsnr} />}
                </HStack>
              </Tooltip>
              {produkt ? (
                <HMSLenke href={produkt.artikkelurl} target="_blank">
                  <div style={{ textDecoration: endretProdukt ? 'line-through' : '' }}>{hjelpemiddel.beskrivelse}</div>
                </HMSLenke>
              ) : (
                <HMSTekst>{hjelpemiddel.beskrivelse}</HMSTekst>
              )}
            </HStack>
          </Rad>
          {hjelpemiddel.endretHjelpemiddel && (
            <Rad style={{ marginTop: '.5rem', flexWrap: 'nowrap' }}>
              <div style={{ marginRight: '.5rem', marginTop: '.25rem' }}>
                <PersonikonFilled width={22} height={22} />
              </div>
              <div>
                <Rad>
                  <strong>Byttet ut av saksbehandler, begrunnelse:</strong>
                </Rad>
                <Rad>
                  {hjelpemiddel.endretHjelpemiddel.begrunnelse === EndretHjelpemiddelBegrunnelse.ANNET
                    ? hjelpemiddel.endretHjelpemiddel.begrunnelseFritekst
                    : EndretHjelpemiddelBegrunnelseLabel.get(hjelpemiddel.endretHjelpemiddel.begrunnelse)}
                </Rad>
              </div>
            </Rad>
          )}
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
                        <Kolonne $width="700px">
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
                      <Kolonne $width="700px">{`Setebredde ${personinformasjon.kroppsmål.setebredde} cm, legglengde ${personinformasjon.kroppsmål.legglengde} cm, lårlengde ${personinformasjon.kroppsmål.lårlengde} cm, høyde ${personinformasjon.kroppsmål.høyde} cm, kroppsvekt ${personinformasjon.kroppsmål.kroppsvekt} kg.`}</Kolonne>
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
                        <Tooltip content="Kopierer hmsnr">
                          <HStack align="center">
                            {tilbehør.hmsNr} <CopyButton size="small" copyText={tilbehør.hmsNr} /> {tilbehør.navn}
                          </HStack>
                        </Tooltip>
                      </Kolonne>
                    </Rad>
                  ))}
                </Rad>
              </>
            )}
          </Rad>
        </Rad>
        {forenkletVisning && visEndreProdukt && (
          <Rad style={{ justifyContent: 'flex-end' }}>
            <Button variant="tertiary" size="small" onClick={() => setVisEndreProdukt(false)}>
              Avbryt
              <ChevronUpIcon />
            </Button>
          </Rad>
        )}
        {status === OppgaveStatusType.TILDELT_SAKSBEHANDLER && forenkletVisning && !visEndreProdukt && (
          <Rad style={{ justifyContent: 'flex-end' }}>
            <Button variant="tertiary" size="small" onClick={() => setVisEndreProdukt(true)}>
              Endre
              <ChevronDownIcon />
            </Button>
          </Rad>
        )}
      </Rad>
      {forenkletVisning && visEndreProdukt ? (
        <EndreHjelpemiddel
          hjelpemiddelId={hjelpemiddel.id}
          hmsNr={hjelpemiddel.hmsnr}
          hmsBeskrivelse={hjelpemiddel.beskrivelse}
          nåværendeHmsNr={nåværendeHmsnr}
          onLagre={endreHjelpemiddel}
          onAvbryt={() => setVisEndreProdukt(false)}
        />
      ) : (
        <Strek />
      )}
    </HjelpemiddelContainer>
  )
}
