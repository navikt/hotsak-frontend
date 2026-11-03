import { Button, HStack } from '@navikt/ds-react'
import { useState } from 'react'

import { useSaksregler } from '../../saksregler/useSaksregler.ts'
import { AvvisBestillingModal } from './AvvisBestillingModal.tsx'
import { GodkjennBestillingModal } from './GodkjennBestillingModal.tsx'

export function BestillingKnapper() {
  const { kanBehandleSak } = useSaksregler()
  const [visGodkjennModal, setVisGodkjennModal] = useState(false)
  const [visAvvisModal, setVisAvvisModal] = useState(false)

  return (
    <>
      {kanBehandleSak && (
        <HStack gap="space-8">
          <Button type="button" variant="primary" size="small" onClick={() => setVisGodkjennModal(true)}>
            Godkjenn
          </Button>
          <Button type="button" variant="secondary" size="small" onClick={() => setVisAvvisModal(true)}>
            Avvis
          </Button>
        </HStack>
      )}
      <GodkjennBestillingModal open={visGodkjennModal} onClose={() => setVisGodkjennModal(false)} />
      <AvvisBestillingModal open={visAvvisModal} onClose={() => setVisAvvisModal(false)} />
    </>
  )
}
