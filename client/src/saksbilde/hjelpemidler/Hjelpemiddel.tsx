import { ChatIcon, ChevronDownIcon, ChevronUpIcon, PersonFillIcon } from '@navikt/aksel-icons'
import { Button, CopyButton, HStack, Link, Tooltip } from '@navikt/ds-react'
import { Fragment, ReactNode, useState } from 'react'
import styled from 'styled-components'
import { useSWRConfig } from 'swr'

import { Avstand } from '../../felleskomponenter/Avstand'
import { Kolonne, Rad } from '../../felleskomponenter/Flex'
import { Strek } from '../../felleskomponenter/Strek'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { putEndreHjelpemiddel } from '../../io/http'
import {
  EndreHjelpemiddelRequest,
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  HjelpemiddelType,
  OppgaveStatusType,
  Sak,
} from '../../types/types.internal'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { storForbokstavIAlleOrd } from '../../utils/formater'
import { InformasjonOmHjelpemiddelModal } from '../InformasjonOmHjelpemiddelModal'
import { EndreHjelpemiddel } from './EndreHjelpemiddel'
import { useFinnHjelpemiddel } from './useFinnHjelpemiddel'
import { useHjelpemiddel } from './useHjelpemiddel'
import { useInformasjonOmHjelpemiddel } from './useInformasjonOmHjelpemiddel'
import { Utlevert } from './Utlevert'

interface HjelpemiddelProps {
  hjelpemiddel: HjelpemiddelType
  forenkletVisning: boolean
  sak: Sak
}

export function Hjelpemiddel({ hjelpemiddel, forenkletVisning, sak }: HjelpemiddelProps) {
  const { personinformasjon, status, sakId } = sak

  const [visEndreProdukt, setVisEndreProdukt] = useState(false)
  const { mutate } = useSWRConfig()
  const informasjonOmHjelpemiddel = useInformasjonOmHjelpemiddel(sakId, 'informasjon_om_hjelpemiddel_v1', hjelpemiddel)
  const informasjonOmHjelpemiddelEnabled = false // sakstype === Sakstype.SØKNAD && status === OppgaveStatusType.TILDELT_SAKSBEHANDLER

  const produkt = useFinnHjelpemiddel(hjelpemiddel.hmsnr)
  const endretProdukt = hjelpemiddel.endretHjelpemiddel

  const { hjelpemiddel: endretHjelpemiddelNavn } = useHjelpemiddel(endretProdukt ? endretProdukt.hmsNr : undefined)

  const endreHjelpemiddel = async (endreHjelpemiddel: EndreHjelpemiddelRequest) => {
    await putEndreHjelpemiddel(sakId, endreHjelpemiddel)
      .catch(() => console.error('error endre hjelpemiddel'))
      .then(() => {
        mutate(`api/sak/${sakId}`)
        mutate(`api/sak/${sakId}/historikk`)
      })
    setVisEndreProdukt(false)
  }

  const nåværendeHmsnr = endretProdukt ? endretProdukt.hmsNr : hjelpemiddel.hmsnr

  return (
    <Fragment key={hjelpemiddel.hmsnr}>
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
          {produkt?.posttitler?.map((posttittel) => <Rad key={posttittel}>{posttittel}</Rad>)}
          {endretProdukt && (
            <HStack align="center" gap="2">
              <Tooltip content="Kopierer hmsnr">
                <HStack align="center">
                  <strong>{endretProdukt.hmsNr}</strong>
                  <CopyButton size="small" copyText={endretProdukt.hmsNr} />
                </HStack>
              </Tooltip>
              {endretHjelpemiddelNavn?.navn}
            </HStack>
          )}
          <HStack align="center" gap="2">
            <Tooltip content="Kopierer hmsnr">
              <HStack align="center">
                <strong style={{ textDecoration: endretProdukt ? 'line-through' : '' }}>{hjelpemiddel.hmsnr}</strong>
                {!endretProdukt && <CopyButton size="small" copyText={hjelpemiddel.hmsnr} />}
              </HStack>
            </Tooltip>
            {produkt ? (
              <Link
                href={produkt.produkturl}
                onClick={() => {
                  logAmplitudeEvent(amplitude_taxonomy.FINN_HJELPEMIDDEL_LINK_BESØKT, {
                    hmsnummer: produkt.hmsnr,
                    artikkelnavn: produkt.artikkelnavn,
                  })
                }}
                target="_blank"
              >
                <div style={{ textDecoration: endretProdukt ? 'line-through' : '' }}>{hjelpemiddel.beskrivelse}</div>
              </Link>
            ) : (
              hjelpemiddel.beskrivelse
            )}
          </HStack>
          {hjelpemiddel.endretHjelpemiddel && (
            <Rad style={{ marginTop: '.5rem', flexWrap: 'nowrap' }}>
              <div style={{ marginRight: '.5rem', marginTop: '.25rem' }}>
                <PersonFillIcon />
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
                    <Fragment key={tilleggsinfo.tittel}>
                      <Rad>
                        <Etikett>{`${storForbokstavIAlleOrd(tilleggsinfo.tittel)}:`}</Etikett>
                      </Rad>
                      <Rad>
                        <Kolonne $width="700px">
                          {tilleggsinfo.innholdsliste.map((element) => (
                            <Rad key={element}>{element}</Rad>
                          ))}
                        </Kolonne>
                      </Rad>
                    </Fragment>
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
                        <HStack align="center">
                          {tilbehør.hmsNr}{' '}
                          <Tooltip content="Kopierer hmsnr">
                            <CopyButton size="small" copyText={tilbehør.hmsNr} />
                          </Tooltip>
                          {tilbehør.navn}
                        </HStack>
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

      {informasjonOmHjelpemiddelEnabled && (
        <Avstand marginTop={2}>
          <Rad>
            <EtikettKolonne />
            <Kolonne>
              <div>
                <Button
                  variant="tertiary"
                  size="small"
                  icon={<ChatIcon />}
                  iconPosition="left"
                  onClick={() => informasjonOmHjelpemiddel.onOpen()}
                >
                  Jeg ønsker mer informasjon
                </Button>
              </div>
            </Kolonne>
          </Rad>
        </Avstand>
      )}

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

      {informasjonOmHjelpemiddelEnabled && (
        <InformasjonOmHjelpemiddelModal
          {...informasjonOmHjelpemiddel}
          onBesvar={async (spørreundersøkelse, besvarelse, svar) => {
            await informasjonOmHjelpemiddel.onBesvar(spørreundersøkelse, besvarelse, svar)
          }}
        />
      )}
    </Fragment>
  )
}

const Rangering = styled('div')<{
  $rank?: number
}>`
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
    width: 0.1875rem;
    height: 95%;
    bottom: 0;
    left: -1rem;
  }
`

function EtikettKolonne({ children }: { children?: ReactNode }) {
  return <Kolonne $width="150px">{children}</Kolonne>
}
