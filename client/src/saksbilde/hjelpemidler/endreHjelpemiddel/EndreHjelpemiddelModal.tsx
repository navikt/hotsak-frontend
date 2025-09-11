import { Box, Modal, Tabs } from '@navikt/ds-react'
import { useRef, useState } from 'react'

import { useUmami } from '../../../sporing/useUmami.ts'
import { useErOmbrukPilot } from '../../../tilgang/useTilgang.ts'
import { Hjelpemiddel } from '../../../types/BehovsmeldingTypes.ts'
import {
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  Produkt,
} from '../../../types/types.internal.ts'
import {
  AlternativeProduct,
  ingenAlternativeProdukterForHmsArtNr,
  useAlternativeProdukter,
} from '../useAlternativeProdukter.ts'
import { AlternativeProdukterTabPanel } from './alternativtProdukt/AlternativeProdukterTabPanel.tsx'
import { EndreArtikkelData, EndretHjelpemiddelRequest } from './endreHjelpemiddelTypes.ts'
import { ManueltSøkPanel } from './endreHmsNr/ManueltSøkTabPanel.tsx'
import { OriginaltHjelpemiddel } from './OriginaltHjelpemiddel.tsx'

interface AlternativProduktModalProps {
  åpen: boolean
  hjelpemiddel: Hjelpemiddel
  grunndataProdukt: Produkt | undefined
  alternativeProdukter?: AlternativeProduct[]
  harAlternativeProdukter: boolean
  harOppdatertLagerstatus: boolean
  onLagre(endreHjelpemiddel: EndretHjelpemiddelRequest): void | Promise<void>
  onLukk(): void
}

export const PAGE_SIZE = 6

export function EndreHjelpemiddelModal(props: AlternativProduktModalProps) {
  const {
    åpen,
    hjelpemiddel,
    grunndataProdukt,
    alternativeProdukter: alternativeProdukterInitial = ingenAlternativeProdukterForHmsArtNr,
    harOppdatertLagerstatus,
    harAlternativeProdukter,
    onLagre,
    onLukk,
  } = props
  const [activeTab, setActiveTab] = useState('alternativer')
  const [submitting, setSubmitting] = useState(false)
  const erOmbrukPilot = useErOmbrukPilot()
  const ref = useRef<HTMLDialogElement>(null)
  const { logKnappKlikket } = useUmami()

  const {
    isLoading,
    alternativeProdukterByHmsArtNr,

    harPaginering,
    pageNumber,
    pageSize,
    totalElements,
    onPageChange,
  } = useAlternativeProdukter(åpen && !harOppdatertLagerstatus ? [hjelpemiddel.produkt.hmsArtNr] : [], PAGE_SIZE, false)

  const alternativeProdukter = harOppdatertLagerstatus
    ? alternativeProdukterInitial
    : (alternativeProdukterByHmsArtNr[hjelpemiddel.produkt.hmsArtNr] ?? ingenAlternativeProdukterForHmsArtNr)

  const handleSubmit = async (data: EndreArtikkelData) => {
    try {
      setSubmitting(true)
      const begrunnelse = data.endreBegrunnelse as EndretHjelpemiddelBegrunnelse
      const begrunnelseFritekst =
        begrunnelse === EndretHjelpemiddelBegrunnelse.ANNET ||
        begrunnelse === EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_ANNET
          ? data.endreBegrunnelseFritekst
          : EndretHjelpemiddelBegrunnelseLabel.get(begrunnelse)
      await onLagre({
        hjelpemiddelId: hjelpemiddel.hjelpemiddelId,
        hmsArtNr: data.endretProdukt[0] ?? '',
        begrunnelse,
        begrunnelseFritekst,
      })
      onLukk()
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    logKnappKlikket({
      komponent: 'AlternativeProdukterModal',
      tekst: 'Avbryt endre til alternativt produkt',
    })
    onLukk()
  }

  return (
    <Modal
      ref={ref}
      placement="top"
      closeOnBackdropClick={false}
      width="950px"
      //style={{ minHeight: '60vh' }}
      open={åpen}
      onClose={() => {
        onLukk()
      }}
      header={{ heading: 'Endre hjelpemiddel' }}
      size="small"
      aria-label={'Endre hjelpemiddel'}
    >
      <Box.New style={{ padding: 'var(--ax-space-40) var(--ax-space-40)' }}>
        <OriginaltHjelpemiddel hjelpemiddel={hjelpemiddel} grunndataProdukt={grunndataProdukt} />

        {harAlternativeProdukter && erOmbrukPilot ? (
          <Box.New paddingBlock="space-24 0">
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.List>
                <Tabs.Tab value="alternativer" label="Alternativer på lager" />
                <Tabs.Tab value="manuelt" label="Søk manuelt" />
              </Tabs.List>

              <Tabs.Panel value="alternativer">
                <AlternativeProdukterTabPanel
                  alternativeProdukter={alternativeProdukter}
                  isLoading={isLoading}
                  harPaginering={harPaginering}
                  pageNumber={pageNumber}
                  pageSize={pageSize}
                  totalElements={totalElements}
                  onPageChange={onPageChange}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  submitting={submitting}
                />
              </Tabs.Panel>
              <Tabs.Panel value="manuelt">
                <ManueltSøkPanel
                  hjelpemiddelId={hjelpemiddel.hjelpemiddelId}
                  hmsArtNr={hjelpemiddel.produkt.hmsArtNr}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  submitting={submitting}
                />
              </Tabs.Panel>
            </Tabs>
          </Box.New>
        ) : (
          <ManueltSøkPanel
            hjelpemiddelId={hjelpemiddel.hjelpemiddelId}
            hmsArtNr={hjelpemiddel.produkt.hmsArtNr}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={submitting}
          />
        )}
      </Box.New>
    </Modal>
  )
}
