import { Link } from '@navikt/ds-react'
import { Tekst } from '../../felleskomponenter/typografi'
import { InfoModal } from '../../saksbilde/komponenter/InfoModal'

export function BrukerManglerIOebsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <InfoModal heading="Bruker ikke funnet i OeBS" open={open} width="500px" onClose={onClose}>
      <Tekst spacing>
        Brukeren ikke funnet i OeBS. Du må melde en{' '}
        <Link href="https://jira.adeo.no/plugins/servlet/desk/portal/541/create/1521" target="_blank">
          sak i porten
        </Link>{' '}
        slik at bruker opprettes i OeBS før du kan fatte vedtak. Hvis saken skal henlegges eller avslås, er det ikke
        nødvendig å gjøre dette.
      </Tekst>
    </InfoModal>
  )
}
