import { listsPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { Box, Heading, HStack, Link, Loader, ReadMore, Tooltip, VStack } from '@navikt/ds-react'
import { BrytbarBrødtekst, Brødtekst, Mellomtittel, Tekst, Undertittel } from '../../../felleskomponenter/typografi.tsx'
import { formaterTidsstempel } from '../../../utils/dato.ts'
import { MardownEditorPreviewStyling } from '../../journalførteNotater/MarkdownEditor.tsx'
import { NotatForm } from './NotatForm.tsx'
import { useNotater } from './useNotater.tsx'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}

export function Notater({ sakId, lesevisning }: NotaterProps) {
  const { notater, isLoading: notaterLaster } = useNotater(sakId)

  return (
    <>
      <VStack gap="2">
        <Brødtekst>
          Opplysninger som er relevante for saksbehandlingen skal journalføres og knyttes til saken.
        </Brødtekst>
        <ReadMore size="small" header="Når må du journalføre notat i saken">
          <BrytbarBrødtekst>
            Når du mottar saksopplysninger utenfra som er med på å avgjøre utfallet av en sak, skal opplysningene
            journalføres.  Når du skriver notatet nedenfor vil vi lagre utkastet fortløpende. Når du journalfører
            notatet, blir det synlig for innbygger neste virkedag på innlogget side på nav.no
          </BrytbarBrødtekst>
        </ReadMore>
      </VStack>
      {notaterLaster && (
        <div>
          <Loader size="large" style={{ margin: '2em auto', display: 'block' }} />
        </div>
      )}
      <NotatForm sakId={sakId} lesevisning={lesevisning} />
      <VStack gap="4" paddingBlock="8 0">
        <Mellomtittel spacing={false}>Notater knyttet til saken</Mellomtittel>
        {notaterLaster && (
          <div>
            <Loader size="large" style={{ margin: '2em auto', display: 'block' }} />
          </div>
        )}
        {!notaterLaster && notater && (
          <>
            {/*!visLasterNotat &&*/ notater.length === 0 && <Tekst>Ingen notater er knyttet til saken</Tekst>}
            {/*visLasterNotat && (
                <Box key="laster-notat" background="surface-subtle" padding="2" borderRadius="xlarge">
                  <Heading as={Skeleton} size="large">
                    Card-title
                  </Heading>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="80%" />
                </Box>
              )*/}
            {notater.map((notat) => {
              return (
                <Box key={notat.id} background="surface-subtle" padding="2" borderRadius="xlarge">
                  <HStack gap="2">
                    <VStack gap="2">
                      <HStack gap="2">
                        <Heading level="3" size="xsmall" style={{ fontSize: '1em' }}>
                          {notat.tittel}
                        </Heading>
                        {notat.journalpostId && notat.dokumentId && (
                          <Tooltip content="Åpne i ny fane">
                            <Link href={`/api/journalpost/${notat.journalpostId}/${notat.dokumentId}`} target="_blank">
                              <ExternalLinkIcon />
                            </Link>
                          </Tooltip>
                        )}
                      </HStack>
                      <VStack>
                        <Brødtekst>{formaterTidsstempel(notat.opprettet)}</Brødtekst>
                        <Undertittel>{notat.saksbehandler.navn}</Undertittel>
                      </VStack>
                    </VStack>
                  </HStack>

                  {notat.tekst && (
                    <MardownEditorPreviewStyling>
                      <MDXEditor
                        markdown={notat.tekst}
                        readOnly={true}
                        contentEditableClassName="mdxEditorRemoveMargin"
                        plugins={[listsPlugin(), quotePlugin(), thematicBreakPlugin()]}
                      />
                    </MardownEditorPreviewStyling>
                  )}

                  {!notat.tekst && (
                    <Box paddingBlock={'2 0'}>
                      <Brødtekst>
                        Dette notatet ble sendt inn igjennom Gosys, les PDF filen for å se innholdet.
                      </Brødtekst>
                    </Box>
                  )}
                </Box>
              )
            })}
          </>
        )}
      </VStack>
    </>
  )
}
