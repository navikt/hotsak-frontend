import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationmarkTriangleFillIcon,
  InformationSquareFillIcon,
  PersonFillIcon,
} from '@navikt/aksel-icons'
import { Button, Heading, HStack, List, Tag, VStack } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'
import { useState } from 'react'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp.tsx'
import { BrytbarBrødtekst, Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import {
  FritakFraBegrunnelseÅrsak,
  Hjelpemiddel as Hjelpemiddeltype,
  Varseltype,
} from '../../types/BehovsmeldingTypes.ts'
import {
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  OppgaveStatusType,
  Sak,
  Sakstype,
} from '../../types/types.internal'
import { storForbokstavIOrd } from '../../utils/formater'
import { useBestilling } from '../hjelpemidler/endreHjelpemiddel/useBestilling.tsx'
import { useFinnHjelpemiddel } from '../hjelpemidler/useFinnHjelpemiddel.ts'
import { useHjelpemiddel } from '../hjelpemidler/useHjelpemiddel.ts'
import { Utlevert } from '../hjelpemidler/Utlevert.tsx'
import { useVarselsregler } from '../varsler/useVarselsregler'
import Bytter from './Bytter.tsx'
import { HjelpemiddelGrid } from './HjelpemiddelGrid.tsx'
import { Produkt } from './Produkt.tsx'

interface HjelpemiddelProps {
  hjelpemiddel: Hjelpemiddeltype
  //forenkletVisning: boolean
  sak: Sak
}

export function Hjelpemiddel({ hjelpemiddel, sak }: HjelpemiddelProps) {
  const { status /*, sakId*/, sakstype } = sak

  const [visEndreProdukt, setVisEndreProdukt] = useState(false)
  //const { mutate } = useSWRConfig()
  const { harTilbakeleveringsVarsel, harAlleredeLevertVarsel } = useVarselsregler()
  const { bestilling /*, mutate: mutateBestilling*/ } = useBestilling()

  const produkt = useFinnHjelpemiddel(hjelpemiddel.produkt.hmsArtNr)

  const erBestilling = sakstype === Sakstype.BESTILLING

  const endretHjelpemiddel = bestilling?.endredeHjelpemidler.find(
    (hjlpm) => hjlpm.hjelpemiddelId === hjelpemiddel.hjelpemiddelId
  )

  const { hjelpemiddel: endretHjelpemiddelNavn } = useHjelpemiddel(
    endretHjelpemiddel ? endretHjelpemiddel.hmsArtNr : undefined
  )

  /*const endreHjelpemiddel = async (endreHjelpemiddel: EndretHjelpemiddel) => {
    await putEndreHjelpemiddel(sakId, endreHjelpemiddel)
      .catch(() => console.error('error endre hjelpemiddel'))
      .then(() => {
        mutate(`api/sak/${sakId}`)
        mutateBestilling()
        mutate(`api/sak/${sakId}/historikk`)
      })
    setVisEndreProdukt(false)
  }

  const nåværendeHmsnr = endretHjelpemiddel ? endretHjelpemiddel.hmsArtNr : hjelpemiddel.produkt.hmsArtNr*/

  return (
    <VStack key={hjelpemiddel.produkt.hmsArtNr} gap="4">
      <Etikett>{produkt?.isotittel}</Etikett>

      <VStack gap="1">
        {produkt?.posttitler?.map((posttittel) => <Brødtekst key={posttittel}>Delkontrakt {posttittel}</Brødtekst>)}
      </VStack>

      <>
        <HStack gap={endretHjelpemiddel ? '3' : '3'} wrap={false} align={'baseline'}>
          <Tekst>{hjelpemiddel.antall} stk</Tekst>
          <VStack justify="start" gap="2">
            {endretHjelpemiddel && (
              <Produkt
                hmsnr={endretHjelpemiddel.hmsArtNr}
                navn={endretHjelpemiddelNavn?.navn || '-'}
                gjennomstrek={false}
              />
            )}
            <Produkt
              hmsnr={hjelpemiddel.produkt.hmsArtNr}
              navn={hjelpemiddel.produkt.artikkelnavn}
              gjennomstrek={erBestilling && endretHjelpemiddel !== undefined}
              skjulKopiknapp={endretHjelpemiddel !== undefined}
              linkTo={produkt?.produkturl}
            />
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
          </VStack>
        </HStack>
        {/* TODO: HjelpemiddelGrid her også!! */}
        <VStack gap="4" paddingInline="11 0">
          <div style={{ paddingBottom: '1rem' }}>
            <Tag variant={hjelpemiddel.produkt.rangering === 1 ? 'neutral' : 'warning-moderate'} size="xsmall">
              {`Rangering: ${hjelpemiddel.produkt.rangering}`}
            </Tag>
          </div>
          {/* TODO trekk ut dette i egen info komponent eller noe? */}
          {hjelpemiddel.varsler.map((varsel) => {
            return (
              <HStack gap="2" key={varsel.tekst.nb} wrap={false}>
                <div>
                  {varsel.type === Varseltype.WARNING ? (
                    <ExclamationmarkTriangleFillIcon color="var(--a-icon-warning)" fontSize="1.25rem" />
                  ) : (
                    <InformationSquareFillIcon color="var(--a-icon-info)" fontSize="1.25rem" />
                  )}
                </div>
                <Brødtekst>{varsel.tekst.nb}</Brødtekst>
              </HStack>
            )
          })}
          {hjelpemiddel.opplysninger.map((opplysning) => {
            return (
              <List size="small">
                <Etikett>{`${storForbokstavIOrd(opplysning.ledetekst.nb)}`}</Etikett>
                {opplysning.innhold.map((element, idx) => (
                  <ListItem key={idx}>
                    <Brødtekst>
                      {element.forhåndsdefinertTekst ? element.forhåndsdefinertTekst.nb : element.fritekst}
                    </Brødtekst>
                  </ListItem>
                ))}
              </List>
            )
          })}
          {hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen && (
            <Utlevert
              alleredeUtlevert={hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen}
              utlevertInfo={hjelpemiddel.utlevertinfo}
              harVarsel={harAlleredeLevertVarsel()}
            />
          )}

          {hjelpemiddel.bytter && hjelpemiddel.bytter.length > 0 && (
            <Bytter bytter={hjelpemiddel.bytter} harVarsel={harTilbakeleveringsVarsel()} />
          )}
        </VStack>
        {/* TODO: Tilbehør som egen komponent som kan brukes på både her og for standalone tilbehør */}
        {hjelpemiddel.tilbehør.length > 0 && (
          <VStack gap="4" paddingBlock={'4 0'}>
            <>
              <Heading level="2" size="small">
                Tilbehør
              </Heading>

              {hjelpemiddel.tilbehør.map((tilbehør) => (
                <HjelpemiddelGrid>
                  <div style={{ paddingTop: 5 }}>{tilbehør.antall} stk</div>
                  <VStack gap="1">
                    <HStack gap="1" align="center">
                      <Tekst weight="semibold">{tilbehør.hmsArtNr}</Tekst>
                      <Kopiknapp tooltip="Kopier hmsnr" copyText={tilbehør.hmsArtNr} />
                      <BrytbarBrødtekst>{tilbehør.navn}</BrytbarBrødtekst>
                    </HStack>
                    {tilbehør.begrunnelse && (
                      <>
                        <Etikett>Begrunnelse</Etikett>
                        <Brødtekst>{tilbehør.begrunnelse}</Brødtekst>
                      </>
                    )}
                    {(tilbehør.fritakFraBegrunnelseÅrsak === FritakFraBegrunnelseÅrsak.ER_PÅ_BESTILLINGSORDNING ||
                      tilbehør.fritakFraBegrunnelseÅrsak === FritakFraBegrunnelseÅrsak.ER_SELVFORKLARENDE_TILBEHØR) && (
                      <>
                        <Brødtekst>Begrunnelse ikke påkrevd for dette tilbehøret.</Brødtekst>
                      </>
                    )}
                  </VStack>
                </HjelpemiddelGrid>
              ))}
            </>
          </VStack>
        )}
      </>

      {status === OppgaveStatusType.TILDELT_SAKSBEHANDLER && erBestilling && (
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
      {/*erBestilling && visEndreProdukt ? (
        {/*<EndreHjelpemiddel
          hjelpemiddelId={hjelpemiddel.hjelpemiddelId}
          hmsNr={hjelpemiddel.produkt.hmsArtNr}
          //hmsBeskrivelse={hjelpemiddel.produkt.artikkelnavn}
          nåværendeHmsNr={nåværendeHmsnr}
          onLagre={endreHjelpemiddel}
          onAvbryt={() => setVisEndreProdukt(false)}
        />
        
      ) : (
        <div>
          <Strek />
        </div>
      )*/}
    </VStack>
  )
}
