import { useState } from 'react'

import { BekreftelsesDialog } from '../../../saksbilde/komponenter/BekreftelsesDialog'
import { useBrevMetadata } from '../../../brev/useBrevMetadata'
import { InfoCard } from '@navikt/ds-react'
import { Tekst } from '../../../felleskomponenter/typografi'
import { Sak } from '../../../types/types.internal'
import { usePerson } from '../../../personoversikt/usePerson'
import { useSakContext } from '../SakV2ContextType'

export interface HenleggModalProps {
  open: boolean
  onClose(): void
  sak: Sak
}

export function HenleggModal({ open, onClose, sak }: HenleggModalProps) {
  const [loading, setLoading] = useState(false)
  const { henleggFormRef } = useSakContext()
  const { harBrevISak } = useBrevMetadata()
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
      {harBrevISak && (
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
