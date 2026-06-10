import { TrashIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { useState } from 'react'

import { type SWRMutationResponse } from 'swr/mutation'
import { Tekst } from '../../felleskomponenter/typografi.tsx'
import { type HttpError } from '../../io/HttpError.ts'
import { BekreftelsesDialog } from '../../saksbilde/komponenter/BekreftelsesDialog.tsx'
import { type NotatKey } from './useNotat.ts'

export interface NotaterProps {
  slettNotatutkast: SWRMutationResponse<void, HttpError, NotatKey | null, never>
  onReset(): void
}

export function SlettUtkast({ slettNotatutkast, onReset }: NotaterProps) {
  const [visSlettUtkastModal, setVisSlettUtkastModal] = useState(false)
  const handleSlettNotatUtkast = async () => {
    await slettNotatutkast.trigger()
    setVisSlettUtkastModal(false)
    onReset()
  }

  return (
    <>
      <div>
        <Button
          icon={<TrashIcon />}
          type="button"
          variant="tertiary"
          size="xsmall"
          onClick={() => {
            setVisSlettUtkastModal(true)
          }}
        >
          Slett utkast
        </Button>
      </div>

      <BekreftelsesDialog
        heading="Er du sikker på at du vil slette utkastet?"
        bekreftButtonLabel="Ja, slett utkastet"
        avbrytButtonLabel="Nei, behold utkastet"
        bekreftButtonVariant="secondary"
        avbrytButtonVariant="primary"
        reverserKnapperekkefølge={true}
        open={visSlettUtkastModal}
        loading={slettNotatutkast.isMutating}
        onClose={() => setVisSlettUtkastModal(false)}
        onBekreft={handleSlettNotatUtkast}
      >
        <Tekst>Utkastet til notat vil forsvinne, og kan ikke gjenopprettes.</Tekst>
      </BekreftelsesDialog>
    </>
  )
}
