import { Modal, Tabs } from '@navikt/ds-react'
import { useRef, useState } from 'react'

import { useUmami } from '../../../sporing/useUmami.ts'
import { EndretHjelpemiddelBegrunnelse, EndretHjelpemiddelBegrunnelseLabel } from '../../../types/types.internal.ts'
import {
  AlternativeProduct,
  ingenAlternativeProdukterForHmsArtNr,
  useAlternativeProdukter,
} from '../useAlternativeProdukter.ts'
import { AlternativeProdukterTabPanel } from './alternativtProdukt/AlternativeProdukterTabPanel.tsx'
import { EndreArtikkelData, EndretHjelpemiddelRequest } from './endreHjelpemiddelTypes.ts'
import { ManueltSøkTabPanel } from './endreHmsNr/ManueltSøkTabPanel.tsx'

interface AlternativProduktModalProps {
  åpen: boolean
  hjelpemiddelId: string
  hmsArtNr: string
  alternativeProdukter?: AlternativeProduct[]
  harOppdatertLagerstatus: boolean
  onLagre(endreHjelpemiddel: EndretHjelpemiddelRequest): void | Promise<void>
  onLukk(): void
}

export const PAGE_SIZE = 6

export function EndreHjelpemiddelModal(props: AlternativProduktModalProps) {
  const {
    åpen,
    hjelpemiddelId,
    hmsArtNr,
    alternativeProdukter: alternativeProdukterInitial = ingenAlternativeProdukterForHmsArtNr,
    harOppdatertLagerstatus,
    onLagre,
    onLukk,
  } = props
  const [activeTab, setActiveTab] = useState(alternativeProdukterInitial.length > 0 ? 'alternativer' : 'manuelt')
  const [submitting, setSubmitting] = useState(false)
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
  } = useAlternativeProdukter(åpen && !harOppdatertLagerstatus ? [hmsArtNr] : [], PAGE_SIZE, false)

  const alternativeProdukter = harOppdatertLagerstatus
    ? alternativeProdukterInitial
    : (alternativeProdukterByHmsArtNr[hmsArtNr] ?? ingenAlternativeProdukterForHmsArtNr)

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
        hjelpemiddelId,
        hmsArtNr: data.endretProdukt[0] ?? '',
        begrunnelse,
        begrunnelseFritekst,
      })
      onLukk()
    } finally {
      setSubmitting(false)
    }
    //}
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
      width="900px"
      open={åpen}
      onClose={() => {
        onLukk()
      }}
      size="small"
      aria-label={'Endre hjelpemiddel'}
    >
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
          <ManueltSøkTabPanel
            hjelpemiddelId={hjelpemiddelId}
            hmsArtNr={hmsArtNr}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={submitting}
          />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  )
}
