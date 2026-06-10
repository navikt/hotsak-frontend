import '@mdxeditor/editor/style.css'
import { ExternalLinkIcon, MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button, Tooltip } from '@navikt/ds-react'

import { Tekst } from '../../felleskomponenter/typografi.tsx'
import { SpørreundersøkelseModal, type SpørreundersøkelseModalProps } from '../../innsikt/SpørreundersøkelseModal.tsx'
import { useSaksregler } from '../../saksregler/useSaksregler.ts'
import { useToggle } from '../../state/useToggle.ts'
import { type Notat, NotatKlassifisering, NotatType } from './notatTyper.ts'
import { useNotat } from './useNotat.ts'

export interface NotatActionsProps {
  notat: Notat
}

export function NotatActions({ notat }: NotatActionsProps) {
  const { kanBehandleSak } = useSaksregler()
  const [visFeilregistrerNotat, toggleVisFeilregistrerNotat] = useToggle()
  const { feilregistrerNotat } = useNotat(notat.sakId, notat.id)

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
                  onClick={toggleVisFeilregistrerNotat}
                >
                  Feilregistrer
                </ActionMenu.Item>
              ) : (
                <ActionMenu.Item onClick={toggleVisFeilregistrerNotat}>Feilregistrer</ActionMenu.Item>
              ))}
          </ActionMenu.Content>
        </ActionMenu>
      )}
      <FeilregistrerNotatModal
        notat={notat}
        open={visFeilregistrerNotat}
        loading={feilregistrerNotat.isMutating}
        onBesvar={async (tilbakemelding) => {
          await feilregistrerNotat.trigger({ tilbakemelding: tilbakemelding?.svar })
        }}
        onClose={toggleVisFeilregistrerNotat}
      />
    </>
  )
}

interface FeilregistrerNotatModalProps extends Pick<
  SpørreundersøkelseModalProps,
  'open' | 'loading' | 'onBesvar' | 'onClose'
> {
  notat: Notat
}

function FeilregistrerNotatModal({ open, loading, notat, onBesvar, onClose }: FeilregistrerNotatModalProps) {
  return (
    <SpørreundersøkelseModal
      open={open}
      loading={loading}
      spørreundersøkelseId={
        notat.type === NotatType.JOURNALFØRT ? 'journalført_notat_feilregistrert_v1' : 'internt_notat_feilregistrert_v1'
      }
      size="small"
      knappetekst={`Ja, feilregistrer ${notat.type === NotatType.JOURNALFØRT ? 'forvaltningsnotatet' : 'internt notat'}`}
      bekreftKnappVariant="secondary"
      avbrytKnappVariant="primary"
      reverserKnapperekkefølge={true}
      avbrytKnappetekst="Nei, behold notatet"
      onBesvar={onBesvar}
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
