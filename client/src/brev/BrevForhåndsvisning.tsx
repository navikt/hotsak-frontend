import { HStack, Loader, LocalAlert } from '@navikt/ds-react'

import { Etikett } from '../felleskomponenter/typografi'
import { useObjectUrl } from '../io/HttpClient'
import classes from './BrevForhåndsvisning.module.css'
import { useBrevPdf } from './useBrev'

export interface BrevForhåndsvisningProps {
  brevId?: string
}

export function BrevForhåndsvisning({ brevId }: BrevForhåndsvisningProps) {
  const { brev, error, isLoading } = useBrevPdf(brevId)
  const url = useObjectUrl(brev)

  if (error) {
    return (
      <LocalAlert status="warning">
        <LocalAlert.Title>Kunne ikke hente brev</LocalAlert.Title>
        <LocalAlert.Content>Prøv igjen senere.</LocalAlert.Content>
      </LocalAlert>
    )
  }

  if (isLoading) {
    return (
      <HStack justify="center" gap="space-16" marginBlock="space-16">
        <Loader size="medium" title="Henter brev..." />
        <Etikett>Genererer forhåndsvisning av brev...</Etikett>
      </HStack>
    )
  }

  // fixme -> "Henter vedtaksbrev fra Joark..."

  return <iframe src={url} width="100%" height="100%" allow="fullscreen" className={classes.root} />
}
