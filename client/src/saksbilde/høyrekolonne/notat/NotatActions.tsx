import '@mdxeditor/editor/style.css'
import { ExternalLinkIcon, MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button, Tooltip } from '@navikt/ds-react'
import { useState } from 'react'
import { useIsProd } from '../../../felleskomponenter/Eksperiment.tsx'
import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { Brødtekst } from '../../../felleskomponenter/typografi.tsx'
import { feilregistrerNotat } from '../../../io/http.ts'
import { useSaksregler } from '../../../saksregler/useSaksregler.ts'
import { Notat, NotatType } from '../../../types/types.internal.ts'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal.tsx'

export interface NotaterProps {
  notat: Notat
  mutate: () => void
}

export function NotatActions({ notat, mutate: mutateNotater }: NotaterProps) {
  const { kanBehandleSak } = useSaksregler()
  const [visFeilregistrerInfoModal, setVisFeilregistrerInfoModal] = useState(false)
  const [visFeilregistrertToast, setVisFeilregistrertToast] = useState(false)
  const [feilregistrerer, setFeilregistrerer] = useState(false)
  const isProd = useIsProd()

  const feilregistrer = async (notat: Notat) => {
    setFeilregistrerer(true)

    await feilregistrerNotat(notat)
    setVisFeilregistrerInfoModal(false)
    setVisFeilregistrertToast(true)

    setTimeout(() => {
      setVisFeilregistrertToast(false)
    }, 5000)
    mutateNotater()
    setFeilregistrerer(false)
  }

  // Skjuler interne notater for brukere uten tilgang eller i prod
  const skjulActionMenu = notat.type === NotatType.INTERNT && (!kanBehandleSak || isProd)

  return (
    <>
      {!skjulActionMenu && (
        <ActionMenu>
          <ActionMenu.Trigger>
            <Button
              variant="tertiary-neutral"
              icon={<MenuElipsisHorizontalCircleIcon title="Notatmeny" />}
              size="small"
            />
          </ActionMenu.Trigger>

          <ActionMenu.Content>
            {notat.type === NotatType.JOURNALFØRT && (
              <Tooltip content="Åpne i ny fane">
                <ActionMenu.Item
                  disabled={!notat.journalpostId || !notat.dokumentId}
                  as="a"
                  href={`/api/journalpost/${notat.journalpostId}/${notat.dokumentId}`}
                  target="_blank"
                >
                  Åpne som dokument <ExternalLinkIcon />
                </ActionMenu.Item>
              </Tooltip>
            )}
            {!isProd &&
              kanBehandleSak &&
              (notat.type === NotatType.JOURNALFØRT ? (
                <ActionMenu.Item
                  disabled={!notat.journalpostId || !notat.dokumentId}
                  onClick={() => setVisFeilregistrerInfoModal(true)}
                >
                  Feilregistrer
                </ActionMenu.Item>
              ) : (
                <ActionMenu.Item onClick={() => setVisFeilregistrerInfoModal(true)}>Feilregistrer</ActionMenu.Item>
              ))}
          </ActionMenu.Content>
        </ActionMenu>
      )}

      <BekreftelseModal
        bekreftButtonLabel="Ja, feilregistrer"
        bekreftButtonVariant="secondary"
        avbrytButtonLabel="Nei, behold notatet"
        avbrytButtonVariant="primary"
        reverserKnapperekkefølge={true}
        heading="Er du sikker på at du vil feilregistrere notatet?"
        open={visFeilregistrerInfoModal}
        width="600px"
        loading={feilregistrerer}
        onBekreft={() => {
          feilregistrer(notat)
        }}
        onClose={() => setVisFeilregistrerInfoModal(false)}
      >
        <Brødtekst>
          {notat.type === NotatType.JOURNALFØRT
            ? 'Notatet feilregistreres på saken og blir ikke synlig for bruker på nav.no lenger.'
            : 'Notatet fjernes fra saken. Dette kan ikke angres.'}
        </Brødtekst>
      </BekreftelseModal>

      {visFeilregistrertToast && <InfoToast bottomPosition="10px">Notat feilregistrert</InfoToast>}
    </>
  )
}
