import { listsPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { ExternalLinkIcon, TrashIcon } from '@navikt/aksel-icons'
import {
  BodyShort,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  ErrorMessage,
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
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { BrytbarBrødtekst, Brødtekst, Mellomtittel, Tekst, Undertittel } from '../../../felleskomponenter/typografi.tsx'
import { ferdigstillNotat, opprettNotatUtkast, oppdaterNotatUtkast, slettNotatUtkast } from '../../../io/http.ts'
import { Brevtype, FerdigstillNotatRequest, MålformType, NotatType } from '../../../types/types.internal.ts'
import { formaterTidsstempel } from '../../../utils/dato.ts'
import { MarkdownEditor } from '../../journalførteNotater/MarkdownEditor.tsx'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal.tsx'
import { useNotater } from './useNotater.tsx'
import { useNotatTeller } from './useNotatTeller.ts'
import { ForhåndsvisningsModal } from '../brevutsending/ForhåndsvisningModal.tsx'
import { useBrev } from '../../barnebriller/steg/vedtak/brev/useBrev.ts'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}

export function Notater({ sakId, lesevisning }: NotaterProps) {
  const [lagrerUtkast, setLagrerUtkast] = useState(false)
  const [sletter, setSletter] = useState(false)
  const { notater, utkast: aktiveUtkast, isLoading: notaterLaster, mutate: mutateNotater } = useNotater(sakId)
  const { harUtkast, mutate: mutateNotatTeller } = useNotatTeller(sakId)
  const [journalførerNotat, setJournalførerNotat] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [visSlettUtkastModal, setVisSlettUtkastModal] = useState(false)
  const [visSlettetUtkastToast, setVisSlettetUtkastToast] = useState(false)
  const [visNotatJournalførtToast, setVisNotatJournalførtToast] = useState(false)
  const [visForhåndsvisningsmodal, setVisForhåndsvisningsmodal] = useState(false)
  //const [visLasterNotat, setVisLasterNotat] = useState<Notat[] | null>(null)
  const [visLasterNotat, setVisLasterNotat] = useState<boolean>(false)
  const { hentForhåndsvisning } = useBrev()
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [valideringsfeil, setValideringsfeil] = useState<NotatValideringError>({})
  const [klarForFerdigstilling, setKlarForFerdigstilling] = useState(false)

  const aktivtUtkast = aktiveUtkast.find((u) => u.type === NotatType.JOURNALFØRT)

  const [tittel, setTittel] = useState(aktivtUtkast?.tittel || '')
  const [tekst, setTekst] = useState(aktivtUtkast?.tekst || '')

  // Dynamisk autorefresh for å vente på journalføring

  /*const {
    data: utkast,
    isLoading: utkastLasterInn,
    mutate: utkastMutert,
  } = useBrevtekst(sak.sakId, Brevtype.JOURNALFØRT_NOTAT)*/

  /*const {
    data: journalførteNotater,
    isLoading: journalførteNotaterLaster,
    mutate: journalførteNotaterMutert,
  } = useSaksdokumenter(
    sak.sakId,
    true,
    SaksdokumentType.NOTAT,
    visLasterNotat != null ? { refreshInterval: 2000 } : null
  )*/

  useEffect(() => {
    if (aktivtUtkast) {
      setTittel(aktivtUtkast.tittel || '')
      setTekst(aktivtUtkast.tekst || '')
    }
  }, [aktivtUtkast])

  useEffect(() => {
    if (submitAttempt) {
      valider()
    }
  }, [klarForFerdigstilling, tittel, tekst, submitAttempt])

  /*useEffect(() => {
    if (visLasterNotat != null && visLasterNotat.length != journalførteNotater.length) {
      setVisLasterNotat(null)
      //oppdaterNotatTeller()
    }
  }, [journalførteNotater])*/

  function valider() {
    let valideringsfeil: NotatValideringError = {}

    if (!klarForFerdigstilling) {
      valideringsfeil.bekreftSynlighet = 'Du må bekrefte at du er   klar over at notatet blir synlig for bruker'
    }

    if (!tittel || tittel.length == 0) {
      valideringsfeil.tittel = 'Du må skrive en tittel'
    }

    if (!tekst || tekst.length == 0) {
      valideringsfeil.tekst = 'Du må skrive en tekst'
    }

    setValideringsfeil(valideringsfeil)
    return Object.keys(valideringsfeil).length == 0
  }

  useEffect(() => {
    utkastEndret(tittel, tekst)
  }, [tittel, tekst])

  const lagPayload = (): FerdigstillNotatRequest => {
    return {
      id: aktivtUtkast!.id,
      sakId,
      målform: MålformType.BOKMÅL,
      type: NotatType.JOURNALFØRT,
      tittel: tittel,
      tekst: tekst,
    }
  }

  // Vent på at bruker endrer på utkastet, debounce repeterte endringer i 500ms, lagre utkastet og muter swr state, vis melding
  // om at vi lagrer utkastet i minimum 1s slik at bruker rekker å lese det.
  const utkastEndret = async (tittel: string, tekst: string) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (tittel !== '' || tekst !== '') {
      setDebounceTimer(
        setTimeout(async () => {
          setLagrerUtkast(true)

          const minimumPeriodeVisLagrerUtkast = new Promise((r) => setTimeout(r, 1000))
          if (!aktivtUtkast?.id && !lagrerUtkast) {
            await opprettNotatUtkast(sakId, { tittel, tekst, type: NotatType.JOURNALFØRT })
          } else {
            await oppdaterNotatUtkast(sakId, {
              id: aktivtUtkast?.id,
              tittel,
              tekst,
              type: NotatType.JOURNALFØRT,
            })
          }

          await mutateNotatTeller()

          await minimumPeriodeVisLagrerUtkast
          setLagrerUtkast(false)

          if (!harUtkast) {
            mutateNotater()
          }
        }, 500)
      )
    }
  }

  const journalførNotat = async () => {
    setJournalførerNotat(true)
    //setVisLasterNotat([...notater]) // Må settes før posting av brevsending pga. race
    setVisLasterNotat(true) // Må settes før posting av brevsending pga. race
    await ferdigstillNotat(lagPayload())
    setTittel('')
    setTekst('')
    //await utkastMutert(lagPayload('', ''))
    setValideringsfeil({})
    setSubmitAttempt(false)
    mutateNotater()

    setKlarForFerdigstilling(false)
    setVisNotatJournalførtToast(true)
    setJournalførerNotat(false)
    mutateNotatTeller()
    setTimeout(() => setVisNotatJournalførtToast(false), 3000)
  }

  const slettUtkast = async () => {
    if (aktivtUtkast) {
      setSletter(true)
      await slettNotatUtkast(sakId, aktivtUtkast?.id || '')
      setVisSlettUtkastModal(false)
      setVisSlettetUtkastToast(true)

      setTimeout(() => {
        setVisSlettetUtkastToast(false)
      }, 5000)
      mutateNotater()
      mutateNotatTeller()
      setTittel('')
      setTekst('')
      setSubmitAttempt(false)
      setValideringsfeil({})
      setKlarForFerdigstilling(false)
      setSletter(false)
    }

    //oppdaterNotatTeller()
  }

  const readOnly = lesevisning || journalførerNotat

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
      {!notaterLaster /*&& utkast*/ && (
        <VStack gap="4" paddingBlock="8 0">
          <TextField
            size="small"
            label="Tittel"
            error={valideringsfeil.tittel}
            readOnly={readOnly}
            value={tittel}
            onChange={(e) => setTittel(e.target.value)}
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
                  <MarkdownEditor tekst={tekst} onChange={setTekst} readOnly={readOnly} />
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        color: 'gray',
                        position: 'absolute',
                        right: '0.5em',
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
            {valideringsfeil.tekst && (
              <ErrorMessage showIcon size="small">
                {valideringsfeil.tekst}
              </ErrorMessage>
            )}
          </div>
        </VStack>
      )}

      {!lesevisning && (
        <HStack justify="space-between" paddingBlock={'1-alt 0'}>
          {aktivtUtkast?.id ? (
            <Button
              type="submit"
              size="xsmall"
              variant="tertiary"
              onClick={() => {
                hentForhåndsvisning(sakId, Brevtype.JOURNALFØRT_NOTAT, aktivtUtkast?.id)
                setVisForhåndsvisningsmodal(true)
              }}
            >
              Forhåndsvis dokument
            </Button>
          ) : (
            <div />
          )}
          <Button
            icon={<TrashIcon />}
            variant="tertiary"
            size="xsmall"
            onClick={() => {
              setVisSlettUtkastModal(true)
            }}
          >
            Slett utkast
          </Button>
        </HStack>
      )}

      {!lesevisning && (
        <VStack gap="4" paddingBlock={'3 0'}>
          <CheckboxGroup
            size="small"
            hideLegend={true}
            value={klarForFerdigstilling ? ['bekreft'] : []}
            legend="Bekreft synlighet"
            error={valideringsfeil.bekreftSynlighet}
          >
            <Checkbox
              value="bekreft"
              size="small"
              error={!!valideringsfeil.bekreftSynlighet}
              onChange={(e) => setKlarForFerdigstilling(e.target.checked)}
            >
              Jeg er klar over at notatet blir synlig for bruker på nav.no neste virkedag
            </Checkbox>
          </CheckboxGroup>
          <div>
            <Button
              variant="secondary"
              size="small"
              loading={journalførerNotat}
              onClick={() => {
                setSubmitAttempt(true)
                if (valider()) {
                  journalførNotat()
                }
              }}
            >
              Journalfør notat
            </Button>
          </div>
        </VStack>
      )}

      <VStack gap="4" paddingBlock="8 0">
        <Mellomtittel spacing={false}>Notater knyttet til saken</Mellomtittel>
        {notaterLaster && (
          <div>
            <Loader size="large" style={{ margin: '2em auto', display: 'block' }} />
          </div>
        )}
        {!notaterLaster && notater && (
          <>
            {!visLasterNotat && notater.length === 0 && <Tekst>Ingen notater er knyttet til saken</Tekst>}
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
                <Box
                  key={`${notat.journalpostId}-${notat.dokumentId}`}
                  background="surface-subtle"
                  padding="2"
                  borderRadius="xlarge"
                >
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
                  <MdxPreviewStyling>
                    {notat.tekst && (
                      <MDXEditor
                        markdown={notat.tekst}
                        readOnly={true}
                        contentEditableClassName="mdxEditorRemoveMargin"
                        plugins={[listsPlugin(), quotePlugin(), thematicBreakPlugin()]}
                      />
                    )}
                  </MdxPreviewStyling>
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
      {visNotatJournalførtToast && (
        <InfoToast bottomPosition="10px">
          Notatet er journalført. Det kan ta litt tid før det dukker opp i listen over.
        </InfoToast>
      )}
      {visSlettetUtkastToast && <InfoToast bottomPosition="10px">Utkast slettet</InfoToast>}

      <BekreftelseModal
        heading="Vil du slette utkastet?"
        buttonLabel="Slett utkast"
        buttonVariant="danger"
        open={visSlettUtkastModal}
        loading={sletter}
        onClose={() => setVisSlettUtkastModal(false)}
        onBekreft={() => {
          return slettUtkast()
        }}
      />

      {
        <ForhåndsvisningsModal
          open={visForhåndsvisningsmodal}
          sakId={sakId}
          brevtype={Brevtype.JOURNALFØRT_NOTAT}
          onClose={() => {
            setVisForhåndsvisningsmodal(false)
          }}
        />
      }
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
type NotatValideringError = {
  [key in 'tittel' | 'tekst' | 'bekreftSynlighet']?: string
}
