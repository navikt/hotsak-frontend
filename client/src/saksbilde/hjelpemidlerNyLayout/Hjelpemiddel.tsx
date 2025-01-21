import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationmarkTriangleFillIcon,
  InformationSquareFillIcon,
  PersonFillIcon,
} from '@navikt/aksel-icons'
import { Bleed, Box, Button, Detail, Heading, HStack, List, VStack } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'
import { useState } from 'react'
import { Strek } from '../../felleskomponenter/Strek.tsx'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Hjelpemiddel as Hjelpemiddeltype, Varseltype } from '../../types/BehovsmeldingTypes.ts'
import {
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  OppgaveStatusType,
  Sak,
  Sakstype,
} from '../../types/types.internal'
import { storForbokstavIOrd } from '../../utils/formater'
import { useFinnHjelpemiddel } from '../hjelpemidler/useFinnHjelpemiddel.ts'
import { Utlevert } from '../hjelpemidler/Utlevert.tsx'
import { useVarselsregler } from '../varsler/useVarselsregler'
import Bytter from './Bytter.tsx'
import { EndreHjelpemiddel } from './EndreHjelpemiddel.tsx'
import { Produkt } from './Produkt.tsx'
import { TilbehørListe } from './TilbehørListe.tsx'
import { useEndreHjelpemiddel } from './useEndreHjelpemiddel.tsx'

interface HjelpemiddelProps {
  hjelpemiddel: Hjelpemiddeltype
  sak: Sak
}

export function Hjelpemiddel({ hjelpemiddel, sak }: HjelpemiddelProps) {
  const { status, sakId, sakstype } = sak

  const [visEndreProdukt, setVisEndreProdukt] = useState(false)
  const { harTilbakeleveringsVarsel, harAlleredeLevertVarsel } = useVarselsregler()

  const produkt = useFinnHjelpemiddel(hjelpemiddel.produkt.hmsArtNr)
  const { endreHjelpemiddel, nåværendeHmsnr, endretHjelpemiddelNavn, endretHjelpemiddel } = useEndreHjelpemiddel(
    sakId,
    hjelpemiddel
  )

  const erBestilling = sakstype === Sakstype.BESTILLING

  return (
    <VStack key={hjelpemiddel.produkt.hmsArtNr} gap="4">
      <Box>
        <Etikett>{produkt?.isotittel}</Etikett>

        <VStack gap="1">
          {produkt?.posttitler?.map((posttittel) => <Brødtekst key={posttittel}>Delkontrakt {posttittel}</Brødtekst>)}
        </VStack>
      </Box>
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
            <div>
              <Detail>{`Rangering: ${hjelpemiddel.produkt.rangering}`}</Detail>
            </div>
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
        <VStack gap="1" paddingInline="11 0">
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
          {erBestilling && visEndreProdukt && (
            <EndreHjelpemiddel
              hjelpemiddelId={hjelpemiddel.hjelpemiddelId}
              hmsNr={hjelpemiddel.produkt.hmsArtNr}
              nåværendeHmsNr={nåværendeHmsnr}
              onLagre={endreHjelpemiddel}
              onAvbryt={() => setVisEndreProdukt(false)}
            />
          )}

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
          {/*  TODO Egen Opplysning komponent som også kan brukes for tilbehør.  Legge på keys der det mangler  */}
          {hjelpemiddel.opplysninger.map((opplysning) => {
            return (
              <List size="small" key={opplysning.ledetekst.nb}>
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
              <TilbehørListe tilbehør={hjelpemiddel.tilbehør} />
            </>
          </VStack>
        )}
      </>
      <Bleed marginInline="2">
        <Strek />
      </Bleed>
    </VStack>
  )
}
