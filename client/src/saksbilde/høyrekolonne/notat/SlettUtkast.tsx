import '@mdxeditor/editor/style.css'
import { TrashIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { useSWRConfig } from 'swr'

import { useActionState } from '../../../action/Actions.ts'
import { useToast } from '../../../felleskomponenter/toast/ToastContext.tsx'
import { Tekst } from '../../../felleskomponenter/typografi.tsx'
import { http } from '../../../io/HttpClient.ts'
import { Notat } from '../../../types/types.internal.ts'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal.tsx'

export interface NotaterProps {
  sakId: string
  aktivtUtkast?: Notat
  onReset: () => void
}

export function SlettUtkast({ sakId, aktivtUtkast, onReset }: NotaterProps) {
  const { mutate } = useSWRConfig()
  const [visSlettUtkastModal, setVisSlettUtkastModal] = useState(false)
  const { showSuccessToast } = useToast()
  const { execute, state: sletterUtkast } = useActionState()
  showSuccessToast

  const slettNotatUtkast = (sakId: string, notatId: string) =>
    execute(() => http.delete(`/api/sak/${sakId}/notater/${notatId}`))

  const slettUtkast = async () => {
    if (aktivtUtkast) {
      await slettNotatUtkast(sakId, aktivtUtkast?.id || '')
      setVisSlettUtkastModal(false)
      showSuccessToast('Utkast slettet')
      await mutate(`/api/sak/${sakId}/notater`)
      // TODO usikker på om det gir mening å oppdatere behandling her,er det bedre å sjekke dette på notater enn gjenstående på behandling?
      await mutate(`/api/sak/${sakId}/behandling`)
      onReset()
    } else {
      setVisSlettUtkastModal(false)
    }
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

      <BekreftelseModal
        heading="Er du sikker på at du vil slette utkastet?"
        bekreftButtonLabel="Ja, slett utkastet"
        avbrytButtonLabel="Nei, behold utkastet"
        bekreftButtonVariant="secondary"
        avbrytButtonVariant="primary"
        reverserKnapperekkefølge={true}
        open={visSlettUtkastModal}
        loading={sletterUtkast.loading}
        onClose={() => setVisSlettUtkastModal(false)}
        onBekreft={slettUtkast}
      >
        <Tekst>Utkastet til notat vil forsvinne, og kan ikke gjenopprettes.</Tekst>
      </BekreftelseModal>
    </>
  )
}
