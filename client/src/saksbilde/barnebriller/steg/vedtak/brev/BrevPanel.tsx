import { HStack, Loader } from '@navikt/ds-react'

import { useBrevUrl } from '../../../../../brev/useBrev.ts'
import { FeilmeldingAlert } from '../../../../../felleskomponenter/feil/FeilmeldingAlert.tsx'
import { Etikett } from '../../../../../felleskomponenter/typografi'
import classes from './BrevPanel.module.css'

interface BrevPanelProps {
  brevId?: string
  fullSize: boolean
}

export function BrevPanel(props: BrevPanelProps) {
  const { brevId, fullSize } = props
  const { brev: brevUrl, error, isLoading } = useBrevUrl(brevId)

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

  if (!brevUrl) {
    return null
  }

  return (
    <div>
      <DokumentIFrame fullSize={fullSize} dokumentData={brevUrl} />
    </div>
  )
}

function DokumentIFrame({ fullSize, dokumentData }: { fullSize: boolean; dokumentData?: string }) {
  if (fullSize) {
    return (
      <div className={classes.dokumentDiv}>
        <iframe title="Dokument" src={dokumentData} width="100%" height="100%" />
      </div>
    )
  }
  return <iframe title="Dokument" src={dokumentData} className={classes.styledIFrame} tabIndex={0} />
}
