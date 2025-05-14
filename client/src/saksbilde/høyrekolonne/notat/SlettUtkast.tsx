import '@mdxeditor/editor/style.css'
import { TrashIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { Brødtekst } from '../../../felleskomponenter/typografi.tsx'
import { baseUrl, del } from '../../../io/http.ts'
import { useServiceState } from '../../../service/Service.ts'
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
  const [visSlettetUtkastToast, setVisSlettetUtkastToast] = useState(false)
  const { execute, state: sletterUtkast } = useServiceState()

  const slettNotatUtkast = async (sakId: string, notatId: string) => {
    return execute(async () => {
      return del(`${baseUrl}/api/sak/${sakId}/notater/${notatId}`)
    })
  }

  const slettUtkast = async () => {
    if (aktivtUtkast) {
      await slettNotatUtkast(sakId, aktivtUtkast?.id || '')
      setVisSlettUtkastModal(false)
      setVisSlettetUtkastToast(true)
      await mutate(`/api/sak/${sakId}/notater`)
      onReset()
      setTimeout(() => {
        setVisSlettetUtkastToast(false)
      }, 5000)
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
        <Brødtekst>Utkastet til notat vil forsvinne, og kan ikke gjenopprettes.</Brødtekst>
      </BekreftelseModal>
      {visSlettetUtkastToast && <InfoToast bottomPosition="10px">Utkast slettet</InfoToast>}
    </>
  )
}
