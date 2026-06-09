import { useState } from 'react'

import { InfoCard } from '@navikt/ds-react'

import { useBrevForSak } from '../../../brev/useBrev'
import { Tekst } from '../../../felleskomponenter/typografi'
import { usePerson } from '../../../personoversikt/usePerson'
import { BekreftelsesDialog } from '../../../saksbilde/komponenter/BekreftelsesDialog'
import { type Sak } from '../../../types/types.internal'
import { useSakContext } from '../SakV2ContextType'

export interface HenleggModalProps {
  open: boolean
  onClose(): void
  sak: Sak
}

export function HenleggModal({ open, onClose, sak }: HenleggModalProps) {
  const [loading, setLoading] = useState(false)
  const { henleggFormRef } = useSakContext()
  const { harBrev } = useBrevForSak(sak.sakId)
  const { personInfo } = usePerson(sak.bruker.fnr)
  const vergemål = personInfo?.vergemål || []

  return (
    <BekreftelsesDialog
      heading="Vil du henlegge saken?"
      loading={loading}
      open={open}
      bekreftButtonLabel="Henlegg saken"
      onBekreft={async () => {
        setLoading(true)
        const success = await henleggFormRef.current?.submit()
        setLoading(false)
        if (success) {
          onClose()
        }
      }}
      onClose={onClose}
    >
      {harBrev && (
        <InfoCard data-color="info" size="small">
          <InfoCard.Header>
            <InfoCard.Title>
              Du er i ferd med å sende ut et brev til bruker{vergemål.length > 0 ? ' og verge' : ''}
            </InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>
            <Tekst>Brevet vil bli sendt ut neste virkedag.</Tekst>
          </InfoCard.Content>
        </InfoCard>
      )}
    </BekreftelsesDialog>
  )
}
