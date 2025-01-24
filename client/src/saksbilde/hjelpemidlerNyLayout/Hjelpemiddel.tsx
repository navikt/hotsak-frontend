import {
  ExclamationmarkTriangleFillIcon,
  InformationSquareFillIcon,
  PencilIcon,
  PersonFillIcon,
} from '@navikt/aksel-icons'
import { Box, Button, Detail, Heading, HGrid, HStack, List, VStack } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'
import { useState } from 'react'
import { Skillelinje } from '../../felleskomponenter/Strek.tsx'
import { Brødtekst, Etikett, Tekst, TextContainer } from '../../felleskomponenter/typografi'
import { textcontainerBredde } from '../../GlobalStyles.tsx'
import { Hjelpemiddel as Hjelpemiddeltype, Varseltype } from '../../types/BehovsmeldingTypes.ts'
import {
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  Produkt as ProduktType,
  Sak,
  Sakstype,
} from '../../types/types.internal'
import { storForbokstavIOrd } from '../../utils/formater'
import { Utlevert } from '../hjelpemidler/Utlevert.tsx'
import { useVarselsregler } from '../varsler/useVarselsregler'
import Bytter from './Bytter.tsx'
import { EndreHjelpemiddelModal } from './EndreHjelpemiddel.tsx'
import { HjelpemiddelGrid } from './HjelpemiddelGrid.tsx'
import { Produkt } from './Produkt.tsx'
import { TilbehørListe } from './TilbehørListe.tsx'
import { useEndreHjelpemiddel } from './useEndreHjelpemiddel.tsx'

interface HjelpemiddelProps {
  hjelpemiddel: Hjelpemiddeltype
  sak: Sak
  produkter: ProduktType[]
}

export function Hjelpemiddel({ hjelpemiddel, sak, produkter }: HjelpemiddelProps) {
  const { sakId, sakstype } = sak

  const [visEndreHjelpemiddelModal, setVisEndreHjelpemiddelModal] = useState(false)
  const { harTilbakeleveringsVarsel, harAlleredeLevertVarsel } = useVarselsregler()

  const produkt = produkter.find((p) => p.hmsnr === hjelpemiddel.produkt.hmsArtNr)
  const { endreHjelpemiddel, nåværendeHmsnr, endretHjelpemiddelNavn, endretHjelpemiddel } = useEndreHjelpemiddel(
    sakId,
    hjelpemiddel
  )

  const erBestilling = sakstype === Sakstype.BESTILLING

  return (
    <VStack key={hjelpemiddel.produkt.hmsArtNr} gap="4">
      <Box>
        <Heading level="2" size="xsmall">
          {produkt?.isotittel}
        </Heading>

        <VStack gap="1">
          {produkt?.posttitler?.map((posttittel) => <Detail key={posttittel}>Delkontrakt {posttittel}</Detail>)}
        </VStack>
      </Box>

      <HjelpemiddelGrid>
        <HGrid columns={`${textcontainerBredde} 6rem`} align="start" marginInline="auto">
          <TextContainer>
            <VStack justify="start" gap="2">
              {endretHjelpemiddel && (
                <Produkt
                  hmsnr={endretHjelpemiddel.hmsArtNr}
                  navn={endretHjelpemiddelNavn?.navn || '-'}
                  gjennomstrek={false}
                  linkTo={produkt?.produkturl}
                />
              )}
              <Box>
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
              </Box>
              {endretHjelpemiddel && (
                <HStack gap="2">
                  <PersonFillIcon />
                  <div>
                    <Etikett>Endret av saksbehandler, begrunnelse:</Etikett>
                    <div>
                      {endretHjelpemiddel.begrunnelse === EndretHjelpemiddelBegrunnelse.ANNET
                        ? endretHjelpemiddel.begrunnelseFritekst
                        : EndretHjelpemiddelBegrunnelseLabel.get(endretHjelpemiddel.begrunnelse)}
                    </div>
                  </div>
                </HStack>
              )}
            </VStack>
            <VStack gap="4">
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
          </TextContainer>

          <div>
            {erBestilling && (
              <Button
                variant="tertiary"
                size="small"
                icon={<PencilIcon />}
                onClick={() => setVisEndreHjelpemiddelModal(true)}
              >
                Endre
              </Button>
            )}
          </div>
        </HGrid>

        <div style={{ paddingTop: '0.3rem' }}>
          <Tekst>{hjelpemiddel.antall} stk</Tekst>
        </div>
      </HjelpemiddelGrid>
      <>
        {erBestilling && (
          <EndreHjelpemiddelModal
            hjelpemiddelId={hjelpemiddel.hjelpemiddelId}
            hmsNr={hjelpemiddel.produkt.hmsArtNr}
            nåværendeHmsNr={nåværendeHmsnr}
            åpen={visEndreHjelpemiddelModal}
            onLagre={endreHjelpemiddel}
            onLukk={() => setVisEndreHjelpemiddelModal(false)}
          />
        )}

        {hjelpemiddel.tilbehør.length > 0 && (
          <>
            <Heading level="2" size="small">
              Tilbehør
            </Heading>
            <TilbehørListe tilbehør={hjelpemiddel.tilbehør} produkter={produkter} />
          </>
        )}
      </>
      <Skillelinje />
    </VStack>
  )
}
