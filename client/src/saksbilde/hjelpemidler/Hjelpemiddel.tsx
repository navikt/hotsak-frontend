import {
  ChatIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationmarkTriangleFillIcon,
  PersonFillIcon,
} from '@navikt/aksel-icons'
import { Button, HStack, Link, VStack } from '@navikt/ds-react'
import { Fragment, useState } from 'react'
import styled from 'styled-components'
import { useSWRConfig } from 'swr'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp.tsx'
import { Strek } from '../../felleskomponenter/Strek'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { putEndreHjelpemiddel } from '../../io/http'
import {
  EndreHjelpemiddelRequest,
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  FritakFraBegrunnelseÅrsak,
  HjelpemiddelType,
  OppgaveStatusType,
  Sak,
} from '../../types/types.internal'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { storForbokstavIOrd } from '../../utils/formater'
import { InformasjonOmHjelpemiddelModal } from '../InformasjonOmHjelpemiddelModal'
import { useVarselsregler } from '../varsler/useVarselsregler'
import Bytter from './Bytter.tsx'
import { EndreHjelpemiddel } from './EndreHjelpemiddel'
import { Fremhevet } from './Fremhevet.tsx'
import { HjelpemiddelGrid } from './HjelpemiddelGrid.tsx'
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
  const { harTilbakeleveringsVarsel, harAlleredeLevertVarsel } = useVarselsregler()
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
    <VStack key={hjelpemiddel.hmsnr} gap="2">
      <HjelpemiddelGrid>
        <VStack gap="2">
          {!forenkletVisning && (
            <Rangering $rank={hjelpemiddel.rangering}>
              <Tekst>Rangering:</Tekst>
              <Tekst>{hjelpemiddel.rangering}</Tekst>
            </Rangering>
          )}
          <div>{hjelpemiddel.antall} stk</div>
        </VStack>
        <VStack gap="2">
          <Etikett>{produkt?.isotittel}</Etikett>
          {produkt?.posttitler?.map((posttittel) => <div key={posttittel}>{posttittel}</div>)}
          {endretProdukt && (
            <HStack gap="1" align="center">
              <strong>{endretProdukt.hmsNr}</strong>
              <Kopiknapp tooltip="Kopier hmsnr" copyText={endretProdukt.hmsNr} />
              {endretHjelpemiddelNavn?.navn}
            </HStack>
          )}
          <HStack gap={endretProdukt ? '3' : '1'} align="center">
            <strong style={{ textDecoration: endretProdukt ? 'line-through' : '' }}>{hjelpemiddel.hmsnr}</strong>
            {!endretProdukt && <Kopiknapp tooltip="Kopier hmsnr" copyText={hjelpemiddel.hmsnr} />}
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
            <HStack gap="2">
              <PersonFillIcon />
              <div>
                <Etikett>Byttet ut av saksbehandler, begrunnelse:</Etikett>
                <div>
                  {hjelpemiddel.endretHjelpemiddel.begrunnelse === EndretHjelpemiddelBegrunnelse.ANNET
                    ? hjelpemiddel.endretHjelpemiddel.begrunnelseFritekst
                    : EndretHjelpemiddelBegrunnelseLabel.get(hjelpemiddel.endretHjelpemiddel.begrunnelse)}
                </div>
              </div>
            </HStack>
          )}
          <div>
            {hjelpemiddel.tilleggsinfo.length > 0 && (
              <Fremhevet>
                {hjelpemiddel.tilleggsinfo.map((tilleggsinfo) => {
                  return (
                    <Fragment key={tilleggsinfo.tittel}>
                      <div>
                        <Etikett>{`${storForbokstavIOrd(tilleggsinfo.tittel)}:`}</Etikett>
                      </div>
                      <div>
                        <div>
                          {tilleggsinfo.innholdsliste.map((element) => (
                            <div key={element}>{element}</div>
                          ))}
                        </div>
                      </div>
                    </Fragment>
                  )
                })}
                {hjelpemiddel.kategori.includes('rullestol') && personinformasjon.kroppsmål && (
                  <>
                    <div>
                      <Etikett>Kroppsmål</Etikett>
                    </div>
                    <div>
                      <div>{`Setebredde ${personinformasjon.kroppsmål.setebredde} cm, legglengde ${personinformasjon.kroppsmål.legglengde} cm, lårlengde ${personinformasjon.kroppsmål.lårlengde} cm, høyde ${personinformasjon.kroppsmål.høyde} cm, kroppsvekt ${personinformasjon.kroppsmål.kroppsvekt} kg.`}</div>
                    </div>
                  </>
                )}
              </Fremhevet>
            )}
          </div>
          <div>
            {hjelpemiddel.alleredeUtlevert && (
              <HStack gap="2">
                {harAlleredeLevertVarsel() && (
                  <ExclamationmarkTriangleFillIcon color="var(--a-icon-warning)" fontSize="1.25rem" />
                )}
                <Etikett>Utlevert</Etikett>
                <Utlevert alleredeUtlevert={hjelpemiddel.alleredeUtlevert} utlevertInfo={hjelpemiddel.utlevertInfo} />
              </HStack>
            )}
          </div>
          {/* TODO: kan fjerne undefined-sjekk når API er rullet ut */}
          {hjelpemiddel.bytter && hjelpemiddel.bytter.length > 0 && (
            <HStack gap="2">
              <Bytter bytter={hjelpemiddel.bytter} harVarsel={harTilbakeleveringsVarsel()} />
            </HStack>
          )}
        </VStack>
      </HjelpemiddelGrid>
      {hjelpemiddel.tilbehør.length > 0 && (
        <>
          <HjelpemiddelGrid>
            <div />
            <div>
              <Etikett>Tilbehør</Etikett>
            </div>
          </HjelpemiddelGrid>
          {hjelpemiddel.tilbehør.map((tilbehør) => (
            <Fragment key={tilbehør.hmsNr}>
              <HjelpemiddelGrid>
                <div style={{ paddingTop: 5 }}>{tilbehør.antall} stk</div>
                <VStack>
                  <HStack gap="1" align="center">
                    <strong>{tilbehør.hmsNr}</strong>
                    <Kopiknapp tooltip="Kopier hmsnr" copyText={tilbehør.hmsNr} />
                    {tilbehør.navn}
                  </HStack>
                  {tilbehør.begrunnelse && (
                    <Fremhevet>
                      <Etikett>Begrunnelse</Etikett>
                      <Brødtekst>{tilbehør.begrunnelse}</Brødtekst>
                    </Fremhevet>
                  )}
                  {(tilbehør.fritakFraBegrunnelseÅrsak === FritakFraBegrunnelseÅrsak.ER_PÅ_BESTILLINGSORDNING ||
                    tilbehør.fritakFraBegrunnelseÅrsak === FritakFraBegrunnelseÅrsak.ER_SELVFORKLARENDE_TILBEHØR) && (
                    <Fremhevet>
                      <Brødtekst>Begrunnelse ikke påkrevd for dette tilbehøret.</Brødtekst>
                    </Fremhevet>
                  )}
                </VStack>
              </HjelpemiddelGrid>
            </Fragment>
          ))}
        </>
      )}
      {status === OppgaveStatusType.TILDELT_SAKSBEHANDLER && forenkletVisning && (
        <div style={{ textAlign: 'right' }}>
          {visEndreProdukt ? (
            <Button
              variant="tertiary"
              size="small"
              onClick={() => setVisEndreProdukt(false)}
              icon={<ChevronUpIcon />}
              iconPosition="left"
            >
              Avbryt
            </Button>
          ) : (
            <Button
              variant="tertiary"
              size="small"
              onClick={() => setVisEndreProdukt(true)}
              icon={<ChevronDownIcon />}
              iconPosition="left"
            >
              Endre
            </Button>
          )}
        </div>
      )}

      {informasjonOmHjelpemiddelEnabled && (
        <>
          <div style={{ textAlign: 'right' }}>
            <Button
              variant="tertiary"
              size="small"
              onClick={() => informasjonOmHjelpemiddel.onOpen()}
              icon={<ChatIcon />}
              iconPosition="left"
            >
              Jeg ønsker mer informasjon
            </Button>
          </div>
          <InformasjonOmHjelpemiddelModal
            {...informasjonOmHjelpemiddel}
            onBesvar={async (tilbakemelding) => {
              await informasjonOmHjelpemiddel.onBesvar(tilbakemelding)
            }}
          />
        </>
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
        <div>
          <Strek />
        </div>
      )}
    </VStack>
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
