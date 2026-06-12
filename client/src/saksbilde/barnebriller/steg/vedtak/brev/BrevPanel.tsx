import { HStack, Loader } from '@navikt/ds-react'

import { useBrevPdf } from '../../../../../brev/useBrev.ts'
import { DokumentFrame } from '../../../../../felleskomponenter/dokument/DokumentFrame.tsx'
import { FeilmeldingAlert } from '../../../../../felleskomponenter/feil/FeilmeldingAlert.tsx'
import { Etikett } from '../../../../../felleskomponenter/typografi'

interface BrevPanelProps {
  brevId?: string
  fullSize: boolean
}

export function BrevPanel(props: BrevPanelProps) {
  const { brevId, fullSize } = props
  const { brev, error, isLoading } = useBrevPdf(brevId)

  if (error) {
    return <FeilmeldingAlert>Det oppstod en feil ved opprettelse av brev</FeilmeldingAlert>
  }

  if (isLoading) {
    return (
      <HStack justify="center" gap="space-16" marginBlock="space-16">
        <Loader size="medium" title="Henter brev..." />
        <Etikett>Genererer forhåndsvisning av brev...</Etikett>
      </HStack>
    )
  }

  if (!brev) {
    return null
  }

  return (
    <div>
      <DokumentFrame data={brev} fullSize={fullSize} />
    </div>
  )
}
