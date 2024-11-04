import { ChevronDownIcon, ChevronUpIcon, ExclamationmarkTriangleFillIcon, PersonFillIcon } from '@navikt/aksel-icons'
import { Button, HStack, Link, VStack } from '@navikt/ds-react'
import { Fragment, useState } from 'react'
import styled from 'styled-components'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp.tsx'
import { Strek } from '../../felleskomponenter/Strek'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { putEndreHjelpemiddel } from '../../io/http'
import { FritakFraBegrunnelseÅrsak, Hjelpemiddel as Hjelpemiddeltype } from '../../types/BehovsmeldingTypes.ts'
import {
  EndreHjelpemiddelRequest,
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  OppgaveStatusType,
  Sak,
} from '../../types/types.internal'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { storForbokstavIOrd } from '../../utils/formater'
import { useVarselsregler } from '../varsler/useVarselsregler'
import Bytter from './Bytter.tsx'
import { Fremhevet } from './Fremhevet.tsx'
import { HjelpemiddelGrid } from './HjelpemiddelGrid.tsx'
import { useFinnHjelpemiddel } from './useFinnHjelpemiddel'
import { useHjelpemiddel } from './useHjelpemiddel'
import { Utlevert } from './Utlevert'
import { EndreHjelpemiddel } from './EndreHjelpemiddel.tsx'
import { useSWRConfig } from 'swr'

interface HjelpemiddelProps {
  hjelpemiddel: Hjelpemiddeltype
  forenkletVisning: boolean
  sak: Sak
}

export function Hjelpemiddel({ hjelpemiddel, forenkletVisning, sak }: HjelpemiddelProps) {
  const { status, sakId } = sak

  const [visEndreProdukt, setVisEndreProdukt] = useState(false)
  const { mutate } = useSWRConfig()
  const { harTilbakeleveringsVarsel, harAlleredeLevertVarsel } = useVarselsregler()

  const produkt = useFinnHjelpemiddel(hjelpemiddel.produkt.hmsArtNr)

  // Må midlertidig hente endretHjelpemiddel fra sak siden dette ikke er en del av behovsmeldingen
  const hjelpemiddelFraSak = sak.hjelpemidler.find((hjlp) => hjelpemiddel.produkt.hmsArtNr === hjlp.hmsnr)!
  const endretHjelpemiddel = hjelpemiddelFraSak.endretHjelpemiddel

  const { hjelpemiddel: endretHjelpemiddelNavn } = useHjelpemiddel(
    endretHjelpemiddel ? endretHjelpemiddel.hmsNr : undefined
  )

  const endreHjelpemiddel = async (endreHjelpemiddel: EndreHjelpemiddelRequest) => {
    await putEndreHjelpemiddel(sakId, endreHjelpemiddel)
      .catch(() => console.error('error endre hjelpemiddel'))
      .then(() => {
        mutate(`api/sak/${sakId}`)
        mutate(`api/sak/${sakId}/historikk`)
      })
    setVisEndreProdukt(false)
  }

  const nåværendeHmsnr = endretHjelpemiddel ? endretHjelpemiddel.hmsNr : hjelpemiddel.produkt.hmsArtNr

  return (
    <VStack key={hjelpemiddel.produkt.hmsArtNr} gap="2">
      <HjelpemiddelGrid>
        <VStack gap="2">
          {!forenkletVisning && (
            <Rangering $rank={hjelpemiddel.produkt.rangering}>
              <Tekst>Rangering:</Tekst>
              <Tekst>{hjelpemiddel.produkt.rangering}</Tekst>
            </Rangering>
          )}
          <div>{hjelpemiddel.antall} stk</div>
        </VStack>
        <VStack gap="2">
          <Etikett>{produkt?.isotittel}</Etikett>
          {produkt?.posttitler?.map((posttittel) => <div key={posttittel}>{posttittel}</div>)}
          {endretHjelpemiddel && (
            <HStack gap="1" align="center">
              <strong>{endretHjelpemiddel.hmsNr}</strong>
              <Kopiknapp tooltip="Kopier hmsnr" copyText={endretHjelpemiddel.hmsNr} />
              {endretHjelpemiddelNavn?.navn}
            </HStack>
          )}
          {/*TODO:  Se videre her på hva vi får fra behovsmelding og hva vi henter fra finn hjelpemiddel*/}
          <HStack gap={endretHjelpemiddel ? '3' : '1'} align="center">
            <strong style={{ textDecoration: endretHjelpemiddel ? 'line-through' : '' }}>
              {hjelpemiddel.produkt.hmsArtNr}
            </strong>
            {!endretHjelpemiddel && <Kopiknapp tooltip="Kopier hmsnr" copyText={hjelpemiddel.produkt.hmsArtNr} />}
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
                <div style={{ textDecoration: endretHjelpemiddel ? 'line-through' : '' }}>
                  {hjelpemiddel.produkt.artikkelnavn}
                </div>
              </Link>
            ) : (
              hjelpemiddel.produkt.artikkelnavn
            )}
          </HStack>
          {endretHjelpemiddel && (
            <HStack gap="2">
              <PersonFillIcon />
              <div>
                <Etikett>Byttet ut av saksbehandler, begrunnelse:</Etikett>
                <div>
                  {endretHjelpemiddel.begrunnelse === EndretHjelpemiddelBegrunnelse.ANNET
                    ? endretHjelpemiddel.begrunnelseFritekst
                    : EndretHjelpemiddelBegrunnelseLabel.get(endretHjelpemiddel.begrunnelse)}
                </div>
              </div>
            </HStack>
          )}
          <div>
            {hjelpemiddel.opplysninger.length > 0 && (
              <Fremhevet>
                <VStack gap="4">
                  {hjelpemiddel.opplysninger.map((opplysning) => {
                    return (
                      <div key={opplysning.ledetekst.nb}>
                        <Etikett spacing={false}>{`${storForbokstavIOrd(opplysning.ledetekst.nb)}:`}</Etikett>
                        {opplysning.innhold.map((element, idx) => (
                          <div key={idx}>
                            {element.forhåndsdefinertTekst ? element.forhåndsdefinertTekst.nb : element.fritekst}
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </VStack>
              </Fremhevet>
            )}
          </div>
          <div>
            {hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen && (
              <HStack gap="2">
                {harAlleredeLevertVarsel() && (
                  <ExclamationmarkTriangleFillIcon color="var(--a-icon-warning)" fontSize="1.25rem" />
                )}
                <Etikett>Utlevert</Etikett>
                <Utlevert
                  alleredeUtlevert={hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen}
                  utlevertInfo={hjelpemiddel.utlevertinfo}
                />
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
            <Fragment key={tilbehør.hmsArtNr}>
              <HjelpemiddelGrid>
                <div style={{ paddingTop: 5 }}>{tilbehør.antall} stk</div>
                <VStack>
                  <HStack gap="1" align="center">
                    <strong>{tilbehør.hmsArtNr}</strong>
                    <Kopiknapp tooltip="Kopier hmsnr" copyText={tilbehør.hmsArtNr} />
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
      {forenkletVisning && visEndreProdukt ? (
        <EndreHjelpemiddel
          hjelpemiddelId={hjelpemiddelFraSak.id}
          hmsNr={hjelpemiddel.produkt.hmsArtNr}
          hmsBeskrivelse={hjelpemiddel.produkt.artikkelnavn}
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
