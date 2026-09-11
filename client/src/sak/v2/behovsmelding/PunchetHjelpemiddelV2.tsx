import { PencilIcon, TrashIcon } from '@navikt/aksel-icons'
import { Button, HStack, Tag, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { type LagretPunchetHjelpemiddel } from '../../../journalføring/journalføringTypes.ts'
import { Produktbilde } from '../../../felleskomponenter/bilde/Produktbilde.tsx'
import { CompactExpandableCard } from '../../../felleskomponenter/panel/CompactExpandableCard.tsx'
import { ResponsiveStack } from '../../../felleskomponenter/ResponsiveStack.tsx'
import { EndreHjelpemiddelModal } from '../../../saksbilde/hjelpemidler/endreHjelpemiddel/EndreHjelpemiddelModal.tsx'
import { type AlternativeProduct } from '../../../saksbilde/hjelpemidler/useAlternativeProdukter.ts'
import { type Hjelpemiddel } from '../../../types/BehovsmeldingTypes.ts'
import { type Produkt } from '../../../types/types.internal.ts'
import { AntallTag } from '../AntallTag.tsx'
import { ProduktV2 } from './ProduktV2.tsx'

interface PunchetHjelpemiddelV2Props {
  hjelpemiddel: LagretPunchetHjelpemiddel
  produkt?: Produkt
  alternativeProdukter: AlternativeProduct[]
  minmaxStyrt: boolean
  onEndre(hjelpemiddel: LagretPunchetHjelpemiddel): Promise<void>
  onSlett(hjelpemiddelId: string): Promise<void>
}

export function PunchetHjelpemiddelV2({
  hjelpemiddel,
  produkt,
  alternativeProdukter,
  minmaxStyrt,
  onEndre,
  onSlett,
}: PunchetHjelpemiddelV2Props) {
  const [visEndreModal, setVisEndreModal] = useState(false)
  const [sletter, setSletter] = useState(false)
  const harAlternativeProdukter = alternativeProdukter.length > 0
  const adaptertHjelpemiddel = lagHjelpemiddelForModal(hjelpemiddel, produkt)

  return (
    <>
      <CompactExpandableCard
        tittel={
          <>
            {produkt?.isotittel || 'Mangler kategori'}
            <span className="sr-only">: {produkt?.artikkelnavn ?? hjelpemiddel.hmsnummer}</span>
          </>
        }
      >
        <ResponsiveStack>
          <VStack gap="space-12">
            <VStack justify="start" gap="space-8">
              <ProduktV2 hmsnr={hjelpemiddel.hmsnummer} navn={produkt?.artikkelnavn ?? 'Ukjent produkt'} />
              <HStack gap="space-4" align="center">
                <Tag data-color={besteRangering(produkt) === 1 ? 'neutral' : 'warning'} size="small" variant="moderate">
                  {besteRangering(produkt) ? `Rangering ${besteRangering(produkt)}` : 'Ingen rangering'}
                </Tag>
                <AntallTag antall={hjelpemiddel.antall} />
                {minmaxStyrt && (
                  <Tag data-color="neutral" size="small" variant="moderate">
                    Min/max lagervare
                  </Tag>
                )}
                {harAlternativeProdukter && (
                  <Tag data-color="neutral" size="small" variant="moderate">
                    Har alternativliste
                  </Tag>
                )}
                <Button
                  type="button"
                  variant="tertiary"
                  size="xsmall"
                  icon={<PencilIcon aria-hidden="true" />}
                  onClick={() => setVisEndreModal(true)}
                >
                  Endre
                </Button>
                <Button
                  type="button"
                  variant="tertiary"
                  data-color="danger"
                  size="xsmall"
                  loading={sletter}
                  icon={<TrashIcon aria-hidden="true" />}
                  onClick={async () => {
                    setSletter(true)
                    try {
                      await onSlett(hjelpemiddel.id)
                    } finally {
                      setSletter(false)
                    }
                  }}
                >
                  Slett
                </Button>
              </HStack>
            </VStack>
          </VStack>
          {produkt && <Produktbilde src={produkt.produktbildeUri} alt={produkt.artikkelnavn} size="small" />}
        </ResponsiveStack>
      </CompactExpandableCard>
      <EndreHjelpemiddelModal
        åpen={visEndreModal}
        hjelpemiddel={adaptertHjelpemiddel}
        grunndataProdukt={produkt}
        nåværendeHmsnr={hjelpemiddel.hmsnummer}
        alternativeProdukter={alternativeProdukter}
        harAlternativeProdukter={harAlternativeProdukter}
        harOppdatertLagerstatus
        onLagre={async (endring) => {
          await onEndre({
            ...hjelpemiddel,
            hmsnummer: endring.hmsArtNr,
          })
        }}
        onLukk={() => setVisEndreModal(false)}
      />
    </>
  )
}

function besteRangering(produkt?: Produkt): number | undefined {
  return produkt?.delkontrakter
    .map((delkontrakt) => delkontrakt.rangering)
    .filter((rangering) => rangering > 0)
    .sort((a, b) => a - b)[0]
}

function lagHjelpemiddelForModal(hjelpemiddel: LagretPunchetHjelpemiddel, produkt?: Produkt): Hjelpemiddel {
  return {
    hjelpemiddelId: hjelpemiddel.id,
    antall: hjelpemiddel.antall,
    produkt: {
      hmsArtNr: hjelpemiddel.hmsnummer,
      artikkelnavn: produkt?.artikkelnavn ?? hjelpemiddel.hmsnummer,
      iso8: '',
      iso8Tittel: produkt?.isotittel ?? '',
      rangering: besteRangering(produkt),
      delkontrakttittel: produkt?.delkontrakter[0]?.posttittel ?? '',
      sortimentkategori: '',
    },
    tilbehør: [],
    bytter: [],
    bruksarenaer: [],
    utlevertinfo: { alleredeUtlevertFraHjelpemiddelsentralen: false },
    opplysninger: [],
    varsler: [],
  }
}
