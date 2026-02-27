import { HStack, Loader, LocalAlert } from '@navikt/ds-react'
import { useBrev } from '../saksbilde/barnebriller/steg/vedtak/brev/useBrev'
import { Brevtype, RessursStatus } from '../types/types.internal'
import { Etikett } from '../felleskomponenter/typografi'

const BrevForhåndsvisning = ({ loaderTekst }: { loaderTekst: string }) => {
  const { hentedeBrev } = useBrev()
  const brevForhåndsvisning = hentedeBrev[Brevtype.BREVEDITOR_VEDTAKSBREV]

  switch (brevForhåndsvisning?.status) {
    case RessursStatus.HENTER:
      return (
        <HStack justify="center" gap="space-16" marginBlock="space-16">
          <Loader size="medium" title="Henter brev..." />
          <Etikett>{loaderTekst}</Etikett>
        </HStack>
      )
    case RessursStatus.SUKSESS:
      return (
        <iframe
          src={brevForhåndsvisning?.data}
          width="100%"
          height="100%"
          allow="fullscreen"
          style={{ border: 'none' }}
        />
      )
    case RessursStatus.FEILET:
      return (
        <LocalAlert status="warning">
          <LocalAlert.Title>Kunne ikke hente brev</LocalAlert.Title>
          <LocalAlert.Content>Prøv igjen senere.</LocalAlert.Content>
        </LocalAlert>
      )
    default:
      return null
  }
}

export default BrevForhåndsvisning
