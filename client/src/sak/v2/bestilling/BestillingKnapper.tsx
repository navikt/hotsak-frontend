import { Button, HStack } from '@navikt/ds-react'
import { useState } from 'react'

import { useSaksregler } from '../../../saksregler/useSaksregler.ts'
import { AvvisBestillingModalV2 } from './AvvisBestillingModalV2'
import { GodkjennBestillingModalV2 } from './GodkjennBestillingModalV2'

export function BestillingKnapper() {
  const { kanBehandleSak } = useSaksregler()
  const [visGodkjennModal, setVisGodkjennModal] = useState(false)
  const [visAvvisModal, setVisAvvisModal] = useState(false)

  return (
    <>
      {kanBehandleSak && (
        <HStack gap="space-8">
          <Button type="button" variant="primary" size="small" onClick={() => setVisGodkjennModal(true)}>
            Godkjenn bestilling
          </Button>
          <Button type="button" variant="secondary" size="small" onClick={() => setVisAvvisModal(true)}>
            Avvis bestilling
          </Button>
        </HStack>
      )}
      <GodkjennBestillingModalV2 open={visGodkjennModal} onClose={() => setVisGodkjennModal(false)} />
      <AvvisBestillingModalV2 open={visAvvisModal} onClose={() => setVisAvvisModal(false)} />
    </>
  )
}
