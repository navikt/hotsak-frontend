import { Brødtekst } from '../../felleskomponenter/typografi'
import { BekreftelseModal } from '../komponenter/BekreftelseModal'

export interface OrdreModalProps {
  loading?: boolean
  open?: boolean
  onBekreft(): any | Promise<any>
  onClose(): void | Promise<void>
}

export function BekreftAutomatiskOrdre({ open, onBekreft, loading, onClose }: OrdreModalProps) {
  return (
    <BekreftelseModal
      width="600px"
      open={open}
      heading="Vil du godkjenne bestillingen?"
      buttonLabel="Godkjenn"
      onBekreft={onBekreft}
      loading={loading}
      onClose={onClose}
    >
      <Brødtekst spacing>
        Når du godkjenner bestillingen blir det automatisk opprettet og klargjort en ordre i OEBS. Alle hjelpemidler og
        tilbehør i bestillingen vil legges inn som ordrelinjer.
      </Brødtekst>
      <Brødtekst>
        Merk at det kan gå noen minutter før ordren er klargjort. Du trenger ikke gjøre noe mer med saken.
      </Brødtekst>
    </BekreftelseModal>
  )
}

export function BekreftManuellOrdre({ open, onBekreft, loading, onClose }: OrdreModalProps) {
  return (
    <BekreftelseModal
      width="600px"
      open={open}
      heading="Opprett ordre i OeBS"
      buttonLabel="Opprett ordre i OeBS"
      onBekreft={onBekreft}
      loading={loading}
      onClose={onClose}
    >
      <Brødtekst spacing>
        Når du oppretter ordre i Oebs må du etterpå gå til Oebs for å fullføre den. Husk å utføre de nødvendige
        oppgavene i Oebs før du fullfører ordren. Ordrenummeret vil vises under Historikk i løpet av kort tid.
      </Brødtekst>
    </BekreftelseModal>
  )
}
