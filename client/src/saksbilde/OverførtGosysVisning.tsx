import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Sidetittel } from '../felleskomponenter/Sidetittel'
import { InfoModal } from './komponenter/InfoModal'

export function OverførtGosysVisning() {
  const navigate = useNavigate()
  const [visModal, setVisModal] = useState(true)

  return (
    <div>
      <Sidetittel tittel="Sak" />
      {visModal && (
        <InfoModal
          heading="Saken er overført til Gosys"
          open={visModal}
          onClose={() => {
            setVisModal(false)
            navigate('/oppgaver/mine')
          }}
          width="500px"
        >
          Oppgaven er ikke lenger tilgjengelig, og du kan ikke gjøre endringer i saken her. Du kan se saken i Gosys.
        </InfoModal>
      )}
    </div>
  )
}
