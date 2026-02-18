import '@mdxeditor/editor/style.css'

import { ExternalLinkIcon, MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button, Tooltip } from '@navikt/ds-react'

import { Tekst } from '../../../felleskomponenter/typografi.tsx'
import { SpørreundersøkelseModal } from '../../../innsikt/SpørreundersøkelseModal.tsx'
import { useSaksregler } from '../../../saksregler/useSaksregler.ts'
import { Notat, NotatKlassifisering, NotatType } from '../../../types/types.internal.ts'
import {
  FeilregistrerJournalførtNotatModalProps,
  useFeilregistrerJournalførtNotat,
} from './feilregistering/useFeilregistrerJournalførtNotat.ts'

export interface NotaterProps {
  notat: Notat
  mutate: () => void
}

export function NotatActions({ notat }: NotaterProps) {
  const { kanBehandleSak } = useSaksregler()
  const { onOpen: visFeilregistrerNotat, ...feilregistrerJournalførtNotat } = useFeilregistrerJournalførtNotat(notat)

  // Skjuler interne notater actions for brukere uten tilgang
  const skjulActionMenu = notat.type === NotatType.INTERNT && !kanBehandleSak

  return (
    <>
      {!skjulActionMenu && (
        <ActionMenu>
          <ActionMenu.Trigger>
            <Button
              data-color="neutral"
              variant="tertiary"
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

            {kanBehandleSak &&
              (notat.type === NotatType.JOURNALFØRT ? (
                <ActionMenu.Item
                  disabled={!notat.journalpostId || !notat.dokumentId}
                  onClick={() => visFeilregistrerNotat()}
                >
                  Feilregistrer
                </ActionMenu.Item>
              ) : (
                <ActionMenu.Item onClick={() => visFeilregistrerNotat()}>Feilregistrer</ActionMenu.Item>
              ))}
          </ActionMenu.Content>
        </ActionMenu>
      )}
      <FeilregistrerNotatModal
        {...feilregistrerJournalførtNotat}
        onBekreft={async (tilbakemelding) => {
          await feilregistrerJournalførtNotat.onBekreft(tilbakemelding)
        }}
      />
    </>
  )
}

function FeilregistrerNotatModal({
  open,
  loading,
  spørreundersøkelseId,
  notat,
  onBekreft,
  onClose,
}: FeilregistrerJournalførtNotatModalProps) {
  return (
    <SpørreundersøkelseModal
      open={open}
      loading={loading}
      spørreundersøkelseId={spørreundersøkelseId}
      size="small"
      knappetekst={`Ja, feilregistrer ${notat.type === NotatType.JOURNALFØRT ? 'forvaltningsnotatet' : 'internt notat'}`}
      bekreftKnappVariant="secondary"
      avbrytKnappVariant="primary"
      reverserKnapperekkefølge={true}
      avbrytKnappetekst="Nei, behold notatet"
      onBesvar={onBekreft}
      onClose={onClose}
    >
      {notat.type === NotatType.INTERNT && <Tekst>Notatet fjernes fra saken. Dette kan ikke angres.</Tekst>}
      {notat.type === NotatType.JOURNALFØRT &&
        notat.klassifisering === NotatKlassifisering.EKSTERNE_SAKSOPPLYSNINGER && (
          <Tekst>Forvaltningsnotatet feilregistreres på saken og blir ikke synlig for bruker på nav.no lenger.</Tekst>
        )}

      {notat.type === NotatType.JOURNALFØRT &&
        notat.klassifisering === NotatKlassifisering.INTERNE_SAKSOPPLYSNINGER && (
          <Tekst>Forvaltningsnotatet feilregistreres på saken.</Tekst>
        )}
    </SpørreundersøkelseModal>
  )
}
