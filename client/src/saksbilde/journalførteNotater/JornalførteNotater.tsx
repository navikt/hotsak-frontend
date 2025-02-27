import {
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  Label,
  Link,
  Loader,
  ReadMore,
  TextField,
  Tooltip,
  VStack,
} from '@navikt/ds-react'
import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { MDXEditor } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useState } from 'react'
import styled from 'styled-components'
import { BrytbarBrødtekst, Brødtekst, Mellomtittel, Undertittel } from '../../felleskomponenter/typografi.tsx'
import { postBrevutkast, postBrevutsending } from '../../io/http.ts'
import { Brevtype, MålformType, Sak, SaksdokumentType } from '../../types/types.internal.ts'
import { useBrevtekst } from '../barnebriller/brevutkast/useBrevtekst.ts'
import { MarkdownEditor } from './MarkdownEditor.tsx'
import { useSaksdokumenter } from '../barnebriller/useSaksdokumenter.ts'
import { formaterTidsstempel } from '../../utils/dato.ts'
import { InfoToast } from '../../felleskomponenter/Toast.tsx'

export interface JournalførteNotaterProps {
  sak: Sak
  høyreVariant?: boolean
  lesevisning: boolean
}

export function JournalførteNotater({ sak, høyreVariant, lesevisning }: JournalførteNotaterProps) {
  const [lagrerUtkast, setLagrerUtkast] = useState(false)
  const [journalførerNotat, setJournalførerNotat] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [visNotatJournalførtToast, setVisNotatJournalførtToast] = useState(false)
  //const [klarForFerdigstilling, setKlarForFerdigstilling] = useState(false)

  const {
    data: utkast,
    isLoading: utkastLasterInn,
    mutate: utkastMutert,
  } = useBrevtekst(sak.sakId, Brevtype.JOURNALFØRT_NOTAT)

  const { data: journalførteNotater, mutate: journalførteNotaterMutert } = useSaksdokumenter(
    sak.sakId,
    true,
    SaksdokumentType.NOTAT,
    { refreshInterval: 5000 }
  )

  const dokumenttittelEndret = (dokumenttittel: string) => {
    if (utkast) {
      utkastEndret(dokumenttittel, utkast.data.brevtekst || '')
    }
  }

  const markdownEndret = (markdown: string) => {
    if (utkast) {
      utkastEndret(utkast.data.dokumenttittel || '', markdown)
    }
  }

  const lagPayload = (tittel: string, tekst: string) => {
    return {
      sakId: sak.sakId,
      målform: MålformType.BOKMÅL,
      brevtype: Brevtype.JOURNALFØRT_NOTAT,
      data: {
        dokumenttittel: tittel,
        brevtekst: tekst,
      },
    }
  }

  // Vent på at bruker endrer på utkastet, debounce repeterte endringer i 500ms, lagre utkastet og muter swr state, vis melding
  // om at vi lagrer utkastet i minimum 1s slik at bruker rekker å lese det.
  const utkastEndret = async (tittel: string, markdown: string) => {
    // Lokal oppdatering for liveness
    await utkastMutert(lagPayload(tittel, markdown), { revalidate: false })

    if (debounceTimer) clearTimeout(debounceTimer)
    setDebounceTimer(
      setTimeout(async () => {
        setLagrerUtkast(true)
        const payload = lagPayload(tittel, markdown)
        const minimumPeriodeVisLagrerUtkast = new Promise((r) => setTimeout(r, 1000))
        await postBrevutkast(payload)
        await utkastMutert()
        await minimumPeriodeVisLagrerUtkast
        setLagrerUtkast(false)
      }, 500)
    )
  }

  const journalførNotat = async () => {
    if (!utkast) return
    if (!utkast.data.dokumenttittel || utkast.data.dokumenttittel.length == 0) return
    if (!utkast.data.brevtekst || utkast.data.brevtekst.length == 0) return
    setJournalførerNotat(true)
    await postBrevutsending(lagPayload(utkast.data.dokumenttittel, utkast.data.brevtekst))
    await utkastMutert(lagPayload('', ''))
    await journalførteNotaterMutert()
    setVisNotatJournalførtToast(true)
    setJournalførerNotat(false)
    setTimeout(() => setVisNotatJournalførtToast(false), 3000)
  }

  const readOnly = lesevisning || journalførerNotat

  return (
    <>
      {!høyreVariant && (
        <Heading level="1" size="medium" spacing={false}>
          <HStack align="center" gap="1">
            Journalførte notater
          </HStack>
        </Heading>
      )}

      <VStack gap="2">
        <Brødtekst>
          Opplysninger som er relevante for saksbehandlingen skal journalføres og knyttes til saken.
        </Brødtekst>
        <ReadMore size="small" header="Dette må du vite om journalførte notater">
          <BrytbarBrødtekst>
            Hvis du har mottatt saksopplysninger som er relevant for saksbehandlingen så skal disse journalføres på
            saken. Du kan her bearbeide ditt utkast, og vi lagrer det fortløpende. Men merk at det vil journalføres og
            bli tilgjengelig for bruker når du er ferdig og klikker "Journalfør notat" for å journalføre.
          </BrytbarBrødtekst>
        </ReadMore>
      </VStack>
      {utkastLasterInn && (
        <div>
          <Loader size="large" style={{ margin: '2em auto', display: 'block' }} />
        </div>
      )}
      {!utkastLasterInn && utkast && (
        <VStack gap="4" paddingBlock="8 0">
          <TextField
            size="small"
            label="Tittel"
            readOnly={readOnly}
            value={utkast.data.dokumenttittel}
            onChange={(e) => dokumenttittelEndret(e.target.value)}
          />
          <div>
            <Label size="small">Tekst</Label>
            <MdxEditorStyling>
              <Box
                background="surface-default"
                marginBlock="0 0"
                borderRadius="medium"
                borderColor="border-default"
                borderWidth="1"
                className="mdxEditorBox"
              >
                <>
                  <MarkdownEditor tekst={utkast.data?.brevtekst || ''} onChange={markdownEndret} readOnly={readOnly} />
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        color: 'gray',
                        position: 'absolute',
                        right: '0',
                        top: '-1.5em',
                        display: lagrerUtkast ? 'block' : 'none',
                      }}
                    >
                      <HStack gap="2">
                        <Loader size="small" title="Lagrer..." />
                        <BodyShort size="small">Lagrer utkast</BodyShort>
                      </HStack>
                    </div>
                  </div>
                </>
              </Box>
            </MdxEditorStyling>
          </div>
        </VStack>
      )}
      {/*<Checkbox
        value="klar"
        size={høyreVariant ? 'small' : 'medium'}
        onChange={(e) => setKlarForFerdigstilling(e.target.checked)}
      >
        Jeg er klar over at journalførte notater er synlig for bruker på nav.no
      </Checkbox>*/}
      <Button
        variant="secondary"
        size={'small'}
        style={{ margin: '0.2em 0 0' }}
        disabled={readOnly}
        loading={journalførerNotat}
        onClick={journalførNotat}
        // disabled={!klarForFerdigstilling}
      >
        Journalfør notat
      </Button>
      {!høyreVariant && (
        <Heading level="2" size="small" style={{ marginTop: '2em' }}>
          Journalførte notater
        </Heading>
      )}
      <VStack gap="4" paddingBlock="8 0">
        {journalførteNotater && (
          <>
            {høyreVariant && <Mellomtittel spacing={false}>Notater knyttet til saken</Mellomtittel>}
            {[...journalførteNotater]
              .sort((a, b) => (a.opprettet < b.opprettet ? 1 : a.opprettet > b.opprettet ? -1 : 0))
              .map((notat) => {
                return (
                  <Box
                    key={`${notat.journalpostId}-${notat.dokumentId}`}
                    background="surface-subtle"
                    padding="2"
                    borderRadius="xlarge"
                  >
                    <HStack gap="2">
                      {!høyreVariant && (
                        <Heading level="3" size="xsmall">
                          {notat.saksbehandler.navn}
                        </Heading>
                      )}
                      {høyreVariant && (
                        <>
                          <VStack gap="2">
                            <HStack gap="2">
                              <Heading level="3" size="xsmall" style={{ fontSize: '1em' }}>
                                {notat.originalTekst?.dokumenttittel || notat.tittel}
                              </Heading>
                              <Tooltip content="Åpne i ny fane">
                                <Link
                                  href={`/api/journalpost/${notat.journalpostId}/${notat.dokumentId}`}
                                  target="_blank"
                                >
                                  <ExternalLinkIcon />
                                </Link>
                              </Tooltip>
                            </HStack>
                            <VStack>
                              <Brødtekst>{formaterTidsstempel(notat.opprettet)}</Brødtekst>
                              <Undertittel>{notat.saksbehandler.navn}</Undertittel>
                            </VStack>
                          </VStack>
                        </>
                      )}
                    </HStack>
                    <MdxPreviewStyling>
                      {notat.originalTekst && (
                        <MDXEditor
                          markdown={notat.originalTekst.brevtekst}
                          readOnly={true}
                          contentEditableClassName="mdxEditorRemoveMargin"
                        />
                      )}
                    </MdxPreviewStyling>
                    {!notat.originalTekst && (
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
      {visNotatJournalførtToast && (
        <InfoToast bottomPosition="10px">
          Notatet er journalført. Det kan ta litt tid før det dukker opp i listen over.
        </InfoToast>
      )}
    </>
  )
}

const MdxEditorStyling = styled.div`
  margin-bottom: 0.5rem;
  .mdxEditorBox:has([contenteditable='true']:focus) {
    border: 4px solid rgba(0, 52, 125, 1);
    margin: -3px;
  }
`

const MdxPreviewStyling = styled.div`
  .mdxEditorRemoveMargin {
    padding: 0;
    font-size: var(--a-font-size-medium);
    color: var(--a-text-default);
    font-family: 'Source Sans Pro';
  }
`
