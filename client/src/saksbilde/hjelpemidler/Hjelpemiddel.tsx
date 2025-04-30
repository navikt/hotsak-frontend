import { PencilIcon } from '@navikt/aksel-icons'
import { Bleed, Button, Tag, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { BrytbarBrødtekst, Brødtekst, Etikett, Tekst, TextContainer } from '../../felleskomponenter/typografi.tsx'
import { useSaksregler } from '../../saksregler/useSaksregler.ts'
import { Hjelpemiddel as Hjelpemiddeltype } from '../../types/BehovsmeldingTypes.ts'
import {
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  Produkt as ProduktType,
  Sak,
  Sakstype,
} from '../../types/types.internal.ts'
import Bytter from './Bytter.tsx'
import { EndreHjelpemiddelModal } from './endreHjelpemiddel/EndreHjelpemiddelModal.tsx'
import { useEndreHjelpemiddel } from './endreHjelpemiddel/useEndreHjelpemiddel.tsx'
import { HjelpemiddelGrid } from './HjelpemiddelGrid.tsx'
import { Opplysninger } from './Opplysninger.tsx'
import { Produkt } from './Produkt.tsx'
import { TilbehørListe } from './TilbehørListe.tsx'
import { Utlevert } from './Utlevert.tsx'
import { Varsler } from './Varsel.tsx'

interface HjelpemiddelProps {
  hjelpemiddel: Hjelpemiddeltype
  sak: Sak
  produkter: ProduktType[]
}

export function Hjelpemiddel({ hjelpemiddel, sak, produkter }: HjelpemiddelProps) {
  const { sakId, sakstype } = sak
  const { kanEndreHmsnr } = useSaksregler()
  const [visEndreHjelpemiddelModal, setVisEndreHjelpemiddelModal] = useState(false)
  //const [visEndreGjenbruksproduktModal, setVisEndreGjenbruksproduktModal] = useState(false)
  const produkt = produkter.find((p) => p.hmsnr === hjelpemiddel.produkt.hmsArtNr)
  const { endreHjelpemiddel, nåværendeHmsnr, endretHjelpemiddelNavn, endretHjelpemiddel } = useEndreHjelpemiddel(
    sakId,
    hjelpemiddel
  )

  const erBestilling = sakstype === Sakstype.BESTILLING

  //const harAlternativ = window.appSettings.MILJO === 'local' && hjelpemiddel.produkt.hmsArtNr === '177946'

  return (
    <VStack key={hjelpemiddel.produkt.hmsArtNr} gap="4">
      <TextContainer>
        <Etikett size="medium">{produkt?.isotittel}</Etikett>
      </TextContainer>
      <VStack gap="1">
        {produkt?.posttitler?.map((posttittel) => (
          <TextContainer key={posttittel}>
            <BrytbarBrødtekst>Delkontrakt {posttittel}</BrytbarBrødtekst>
          </TextContainer>
        ))}
      </VStack>
      {/* Eksperiment for å teste konseptet om integrasjons med Finn Gjenbruksprodukt
      <Box>
        <Alert variant="info" size="small">
          <VStack gap="3">
            <Brødtekst>2 alternative produkter tilgjengelig</Brødtekst>
            <div>
              <Button variant="secondary-neutral" size="xsmall" onClick={() => setVisEndreGjenbruksproduktModal(true)}>
                Alternativer
              </Button>
            </div>
          </VStack>
        </Alert>
      </Box>*/}
      <HjelpemiddelGrid>
        <TextContainer>
          <VStack justify="start" gap="2">
            {endretHjelpemiddel && (
              <Produkt
                hmsnr={endretHjelpemiddel.hmsArtNr}
                navn={endretHjelpemiddelNavn?.navn || '-'}
                gjennomstrek={false}
                // TODO Fiks at vi får tak i url til det nye hjelpemidlet
                //linkTo={produkt?.produkturl}
              />
            )}

            <Produkt
              hmsnr={hjelpemiddel.produkt.hmsArtNr}
              navn={hjelpemiddel.produkt.artikkelnavn}
              gjennomstrek={erBestilling && endretHjelpemiddel !== undefined}
              linkTo={produkt?.produkturl}
            />
            <VStack>
              <div>
                <Tag size="xsmall" variant="neutral-moderate">{`Rangering: ${hjelpemiddel.produkt.rangering}`}</Tag>
              </div>
            </VStack>
          </VStack>
          <VStack gap="3" paddingBlock="4 0" paddingInline="4 0">
            {endretHjelpemiddel && (
              <div>
                <Etikett>Endret av saksbehandler, begrunnelse:</Etikett>
                <Brødtekst>
                  {endretHjelpemiddel.begrunnelse === EndretHjelpemiddelBegrunnelse.ANNET
                    ? endretHjelpemiddel.begrunnelseFritekst
                    : EndretHjelpemiddelBegrunnelseLabel.get(endretHjelpemiddel.begrunnelse)}
                </Brødtekst>
              </div>
            )}
            <Varsler varsler={hjelpemiddel.varsler} />
            <Opplysninger opplysninger={hjelpemiddel.opplysninger} />

            {hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen && (
              <Utlevert
                alleredeUtlevert={hjelpemiddel.utlevertinfo.alleredeUtlevertFraHjelpemiddelsentralen}
                utlevertInfo={hjelpemiddel.utlevertinfo}
              />
            )}
            {hjelpemiddel.bytter && hjelpemiddel.bytter.length > 0 && <Bytter bytter={hjelpemiddel.bytter} />}
          </VStack>
        </TextContainer>

        <div>
          <Tekst>{hjelpemiddel.antall} stk</Tekst>
        </div>
        <div>
          {kanEndreHmsnr && (
            <Bleed marginBlock="1 0">
              <Button
                variant="tertiary"
                size="xsmall"
                icon={<PencilIcon />}
                onClick={() => setVisEndreHjelpemiddelModal(true)}
              >
                Endre
              </Button>
            </Bleed>
          )}
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

        {/* Eksperiment for å teste konseptet om integrasjons med Finn Gjenbruksprodukt 
        harAlternativ && (
          <EndreGjenbruksproduktModal
            åpen={visEndreGjenbruksproduktModal}
            onLukk={() => setVisEndreGjenbruksproduktModal(false)}
          />
        )*/}

        {hjelpemiddel.tilbehør.length > 0 && (
          <VStack gap="3">
            <Etikett size="medium">Tilbehør</Etikett>
            <TilbehørListe tilbehør={hjelpemiddel.tilbehør} produkter={produkter} />
          </VStack>
        )}
      </>
    </VStack>
  )
}
