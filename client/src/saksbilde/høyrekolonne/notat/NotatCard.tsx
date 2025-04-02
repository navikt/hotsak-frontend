import { listsPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons'
import { ActionMenu, Box, Button, Heading, HStack, Spacer, Tag, Tooltip, VStack } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { Brødtekst, Undertittel } from '../../../felleskomponenter/typografi.tsx'
import { feilregistrerNotat } from '../../../io/http.ts'
import { Notat, NotatType } from '../../../types/types.internal.ts'
import { formaterTidsstempelLesevennlig } from '../../../utils/dato.ts'
import { storForbokstavIOrd } from '../../../utils/formater.ts'
import { useIsClamped } from '../../../utils/useIsClamped.ts'
import { MardownEditorPreviewStyling } from '../../journalførteNotater/MarkdownEditor.tsx'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal.tsx'

export interface NotaterProps {
  notat: Notat
  mutate: () => void
}

export function NotatCard({ notat, mutate: mutateNotater }: NotaterProps) {
  const [visFeilregistrerInfoModal, setVisFeilregistrerInfoModal] = useState(false)
  const [visFeilregistrerInterntInfoModal, setVisFeilregistrerInterntInfoModal] = useState(false)
  const [visFulltNotat, setVisFulltNotat] = useState(false)
  const [visFeilregistrertToast, setVisFeilregistrertToast] = useState(false)
  const [feilregistrerer, setFeilregistrerer] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const isClamped = useIsClamped(notat.tekst, textRef)

  const feilregistrer = async (notat: Notat) => {
    setFeilregistrerer(true)

    await feilregistrerNotat(notat)
    if (notat.type === NotatType.JOURNALFØRT) {
      setVisFeilregistrerInfoModal(false)
    } else {
      setVisFeilregistrerInterntInfoModal(false)
    }

    setVisFeilregistrertToast(true)

    setTimeout(() => {
      setVisFeilregistrertToast(false)
    }, 5000)
    mutateNotater()
    setFeilregistrerer(false)
  }

  return (
    <>
      <Box key={notat.id} background="surface-subtle" padding="3" borderRadius="xlarge">
        <VStack gap="3">
          <HStack gap="2" wrap={false} align="center">
            <Tag variant={notat.type === NotatType.JOURNALFØRT ? 'alt3-filled' : 'neutral-moderate'} size="small">
              {storForbokstavIOrd(notat.type)}
            </Tag>

            <>
              <Spacer />
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
                  {notat.type === NotatType.JOURNALFØRT ? (
                    <ActionMenu.Item
                      disabled={!notat.journalpostId || !notat.dokumentId}
                      onClick={() => setVisFeilregistrerInfoModal(true)}
                    >
                      Feilregistrer
                    </ActionMenu.Item>
                  ) : (
                    <ActionMenu.Item onClick={() => setVisFeilregistrerInterntInfoModal(true)}>
                      Feilregistrer
                    </ActionMenu.Item>
                  )}
                </ActionMenu.Content>
              </ActionMenu>
            </>
          </HStack>
          <HStack gap="2">
            <Heading level="3" size="xsmall" style={{ fontSize: '1em' }}>
              {notat.tittel}
            </Heading>
          </HStack>
          <VStack>
            <Brødtekst>{formaterTidsstempelLesevennlig(notat.opprettet)}</Brødtekst>
            <Undertittel>{notat.saksbehandler.navn}</Undertittel>
          </VStack>
        </VStack>

        {notat.tekst && (
          <VStack gap="3">
            <MardownEditorPreviewStyling ref={textRef} truncate={!visFulltNotat}>
              <MDXEditor
                markdown={notat.tekst}
                readOnly={true}
                contentEditableClassName="mdxEditorRemoveMargin"
                plugins={[listsPlugin(), quotePlugin(), thematicBreakPlugin()]}
              />
            </MardownEditorPreviewStyling>
            {isClamped && !visFulltNotat && (
              <div>
                <Button
                  variant="tertiary"
                  size="small"
                  icon={<ChevronDownIcon />}
                  iconPosition="right"
                  onClick={() => setVisFulltNotat(true)}
                >
                  Vis mer
                </Button>
              </div>
            )}
            {visFulltNotat && (
              <div>
                <Button
                  variant="tertiary"
                  size="small"
                  icon={<ChevronUpIcon />}
                  iconPosition="right"
                  onClick={() => setVisFulltNotat(false)}
                >
                  Vis mindre
                </Button>
              </div>
            )}
          </VStack>
        )}

        {!notat.tekst && (
          <Box paddingBlock={'3 0'}>
            <Brødtekst>Dette notatet ble sendt inn igjennom Gosys, les PDF filen for å se innholdet.</Brødtekst>
          </Box>
        )}
      </Box>

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
        <Brødtekst>Notatet feilregistres, saken og blir ikke synlig for bruker på nav.no lenger.</Brødtekst>
      </BekreftelseModal>

      <BekreftelseModal
        bekreftButtonLabel="Ja, feilregistrer"
        bekreftButtonVariant="secondary"
        avbrytButtonLabel="Nei, behold notatet"
        avbrytButtonVariant="primary"
        reverserKnapperekkefølge={true}
        heading="Er du sikker på at du vil feilregistrere notatet?"
        open={visFeilregistrerInterntInfoModal}
        width="600px"
        loading={feilregistrerer}
        onBekreft={() => {
          feilregistrer(notat)
        }}
        onClose={() => setVisFeilregistrerInterntInfoModal(false)}
      >
        <Brødtekst>Notatet fjernes fra saken. Dette kan ikke angres.</Brødtekst>
      </BekreftelseModal>
      {visFeilregistrertToast && <InfoToast bottomPosition="10px">Notat feilregistrert</InfoToast>}
    </>
  )
}
