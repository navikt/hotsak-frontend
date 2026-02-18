import { PencilIcon } from '@navikt/aksel-icons'
import { Bleed, Button, HStack, Tag, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { BrytbarBrødtekst, Etikett, Tekst, TextContainer } from '../../felleskomponenter/typografi.tsx'
import { EndretArtikkelBegrunnelse, EndretArtikkelBegrunnelseLabel } from '../../sak/sakTypes.ts'
import { useSaksregler } from '../../saksregler/useSaksregler.ts'
import { useUmami } from '../../sporing/useUmami.ts'
import { type Hjelpemiddel as Hjelpemiddeltype } from '../../types/BehovsmeldingTypes.ts'
import { type Produkt as ProduktType, Sak } from '../../types/types.internal.ts'
import Bytter from './Bytter.tsx'
import { EndreHjelpemiddelModal } from './endreHjelpemiddel/EndreHjelpemiddelModal.tsx'
import { useEndreHjelpemiddel } from './endreHjelpemiddel/useEndreHjelpemiddel.tsx'
import { HjelpemiddelGrid } from './HjelpemiddelGrid.tsx'
import { Opplysninger } from './Opplysninger.tsx'
import { Produkt } from './Produkt.tsx'
import { Tilbehørliste } from './TilbehørListe.tsx'
import { type AlternativeProduct } from './useAlternativeProdukter.ts'
import { Utlevert } from './Utlevert.tsx'
import { Varsler } from './Varsel.tsx'

interface HjelpemiddelProps {
  sak: Sak
  hjelpemiddel: Hjelpemiddeltype
  produkter: ProduktType[]
  alternativeProdukter: AlternativeProduct[]
  harOppdatertLagerstatus: boolean
  minmaxStyrt: boolean
}

export function Hjelpemiddel({
  sak,
  hjelpemiddel,
  produkter,
  alternativeProdukter,
  harOppdatertLagerstatus,
  minmaxStyrt,
}: HjelpemiddelProps) {
  const { sakId } = sak
  const { kanEndreHmsnr } = useSaksregler()
  const [visAlternativerModal, setVisAlternativerModal] = useState(false)
  const { logModalÅpnet } = useUmami()
  const produkt = produkter.find((it) => it.hmsArtNr === hjelpemiddel.produkt.hmsArtNr)
  const {
    endreHjelpemiddel,
    nåværendeHmsnr,
    endretHjelpemiddelProdukt,
    endretHjelpemiddel: endretHjelpemiddelResponse,
  } = useEndreHjelpemiddel(sakId, {
    id: hjelpemiddel.hjelpemiddelId,
    hmsArtNr: hjelpemiddel.produkt.hmsArtNr,
    navn: hjelpemiddel.produkt.artikkelnavn,
  })

  const endretHjelpemiddel = endretHjelpemiddelResponse?.endretArtikkel
  const harEndretHjelpemiddel =
    endretHjelpemiddel && hjelpemiddel.produkt.hmsArtNr !== endretHjelpemiddelResponse.hmsArtNr
  const harAlternativeProdukter = alternativeProdukter.length > 0

  return (
    <VStack key={hjelpemiddel.produkt.hmsArtNr} gap="space-16">
      <TextContainer>
        <Etikett size="medium">{produkt?.isotittel}</Etikett>
      </TextContainer>
      <VStack gap="space-4">
        <TextContainer>
          <BrytbarBrødtekst>Delkontrakt {hjelpemiddel.produkt.delkontrakttittel}</BrytbarBrødtekst>
        </TextContainer>
      </VStack>
      <HjelpemiddelGrid>
        <TextContainer>
          <VStack justify="start" gap="space-8">
            {harEndretHjelpemiddel && (
              <Produkt
                hmsnr={endretHjelpemiddelResponse.hmsArtNr}
                navn={endretHjelpemiddelProdukt?.artikkelnavn || '-'}
                showLink={endretHjelpemiddelProdukt?.kilde !== 'OeBS'}
              />
            )}

            <Produkt
              hmsnr={hjelpemiddel.produkt.hmsArtNr}
              navn={hjelpemiddel.produkt.artikkelnavn}
              gjennomstrek={harEndretHjelpemiddel}
            />
            <HStack gap="space-8">
              {hjelpemiddel.produkt.rangering && hjelpemiddel.produkt.rangering > 1 ? (
                <Tag
                  data-color="warning"
                  size="xsmall"
                  variant="outline"
                >{`Rangering ${hjelpemiddel.produkt.rangering}`}</Tag>
              ) : (
                <Tag
                  data-color="neutral"
                  size="small"
                  variant="outline"
                >{`Rangering: ${hjelpemiddel.produkt.rangering}`}</Tag>
              )}
              {minmaxStyrt && (
                <Tag data-color="neutral" variant="outline" size="small">
                  Min/max lagervare
                </Tag>
              )}
              {harAlternativeProdukter && (
                <Tag data-color="info" size="small" variant="outline">
                  {harOppdatertLagerstatus
                    ? `${alternativeProdukter.length} alternativer på lager`
                    : 'Har alternativliste'}
                </Tag>
              )}
            </HStack>
          </VStack>
          {/* TODO fjerne VStack her */}
          <VStack gap="space-12" paddingBlock="space-16 space-0" paddingInline="space-16 space-0">
            {harEndretHjelpemiddel && (
              <div>
                <Etikett>Endret av saksbehandler, begrunnelse:</Etikett>
                <BrytbarBrødtekst>
                  {endretHjelpemiddel?.begrunnelse === EndretArtikkelBegrunnelse.ANNET ||
                  endretHjelpemiddel?.begrunnelse === EndretArtikkelBegrunnelse.ALTERNATIV_PRODUKT_ANNET
                    ? endretHjelpemiddel.begrunnelseFritekst
                    : EndretArtikkelBegrunnelseLabel[endretHjelpemiddel?.begrunnelse]}
                </BrytbarBrødtekst>
              </div>
            )}
            <Varsler varsler={hjelpemiddel.varsler} />

            {hjelpemiddel.saksbehandlingvarsel && hjelpemiddel.saksbehandlingvarsel.length > 0 && (
              <Varsler varsler={hjelpemiddel.saksbehandlingvarsel} />
            )}

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
        {kanEndreHmsnr && (
          <div>
            <Bleed marginBlock="space-4 space-0">
              <Button
                variant="tertiary"
                size="xsmall"
                icon={<PencilIcon />}
                onClick={() => {
                  logModalÅpnet({
                    tekst: 'alterrnative-produkter-modal',
                    alternativerTilgjengelig: alternativeProdukter.length,
                    alternativer: alternativeProdukter.map((p) => {
                      return (p.hmsArtNr, p.articleName, p.wareHouseStock, p.alternativeFor)
                    }),
                  })
                  setVisAlternativerModal(true)
                }}
              >
                Endre
              </Button>
            </Bleed>
          </div>
        )}
      </HjelpemiddelGrid>
      <>
        <EndreHjelpemiddelModal
          åpen={visAlternativerModal}
          hjelpemiddel={hjelpemiddel}
          grunndataProdukt={produkt}
          nåværendeHmsnr={nåværendeHmsnr}
          harOppdatertLagerstatus={harOppdatertLagerstatus}
          alternativeProdukter={alternativeProdukter}
          harAlternativeProdukter={harAlternativeProdukter}
          onLagre={endreHjelpemiddel}
          onLukk={() => setVisAlternativerModal(false)}
        />

        {hjelpemiddel.tilbehør.length > 0 && (
          <VStack gap="space-12">
            <Etikett size="medium">Tilbehør</Etikett>
            <Tilbehørliste sakId={sakId} tilbehør={hjelpemiddel.tilbehør} produkter={produkter} />
          </VStack>
        )}
      </>
    </VStack>
  )
}
