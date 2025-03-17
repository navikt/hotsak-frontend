import '@mdxeditor/editor/style.css'
import { TrashIcon } from '@navikt/aksel-icons'
import {
  BodyShort,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  ErrorMessage,
  HStack,
  Label,
  Loader,
  TextField,
  VStack,
} from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { ferdigstillNotat, oppdaterNotatUtkast, opprettNotatUtkast, slettNotatUtkast } from '../../../io/http.ts'
import { Brevtype, FerdigstillNotatRequest, MålformType, NotatType } from '../../../types/types.internal.ts'
import { useBrev } from '../../barnebriller/steg/vedtak/brev/useBrev.ts'
import { MarkdownEditor, MarkdownEditorStyling } from '../../journalførteNotater/MarkdownEditor.tsx'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal.tsx'
import { ForhåndsvisningsModal } from '../brevutsending/ForhåndsvisningModal.tsx'
import { useNotater } from './useNotater.tsx'
import { useNotatTeller } from './useNotatTeller.ts'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}

export function JournalførtNotatForm({ sakId, lesevisning }: NotaterProps) {
  const [lagrerUtkast, setLagrerUtkast] = useState(false)
  const [sletter, setSletter] = useState(false)
  const [oppretterNyttUtkast, setOppretterNyttUtkast] = useState(false)
  const { utkast: aktiveUtkast, isLoading: notaterLaster, mutate: mutateNotater } = useNotater(sakId)
  const { mutate: mutateNotatTeller } = useNotatTeller(sakId)
  const [journalførerNotat, setJournalførerNotat] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [visSlettUtkastModal, setVisSlettUtkastModal] = useState(false)
  const [visSlettetUtkastToast, setVisSlettetUtkastToast] = useState(false)
  const [visNotatJournalførtToast, setVisNotatJournalførtToast] = useState(false)
  const [visForhåndsvisningsmodal, setVisForhåndsvisningsmodal] = useState(false)
  const { hentForhåndsvisning } = useBrev()
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [valideringsfeil, setValideringsfeil] = useState<NotatValideringError>({})
  const [klarForFerdigstilling, setKlarForFerdigstilling] = useState(false)

  const aktivtUtkast = aktiveUtkast.find((u) => u.type === NotatType.JOURNALFØRT)

  const [tittel, setTittel] = useState(aktivtUtkast?.tittel || '')
  const [tekst, setTekst] = useState(aktivtUtkast?.tekst || '')

  // Dynamisk autorefresh for å vente på journalføring
  // Håndtere race ved state for oppretter notat

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
      if (tittel === '') {
        setTittel(aktivtUtkast.tittel || '')
      }
      if (tekst === '') {
        setTekst(aktivtUtkast.tekst || '')
      }
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
          if (oppretterNyttUtkast) {
            console.log('Holder på å opprette nytt utkast ikke noe mer å gjøre her nå')
            return
          }

          setLagrerUtkast(true)
          const minimumPeriodeVisLagrerUtkast = new Promise((r) => setTimeout(r, 1000))

          if (aktivtUtkast?.id) {
            await oppdaterNotatUtkast(sakId, {
              id: aktivtUtkast?.id,
              tittel,
              tekst,
              type: NotatType.JOURNALFØRT,
            })
          } else {
            setOppretterNyttUtkast(true)
            await opprettNotatUtkast(sakId, { tittel, tekst, type: NotatType.JOURNALFØRT })
            await mutateNotater()
            setOppretterNyttUtkast(false)
          }
          await mutateNotatTeller()
          await minimumPeriodeVisLagrerUtkast
          setLagrerUtkast(false)
        }, 500)
      )
    }
  }

  const journalførNotat = async () => {
    setJournalførerNotat(true)
    await ferdigstillNotat(lagPayload())
    setTittel('')
    setTekst('')
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
  }

  const readOnly = lesevisning || journalførerNotat

  // Skal vi sette default til den som har utkast?
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {!notaterLaster && (
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
            <MarkdownEditorStyling>
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
            </MarkdownEditorStyling>
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
    </form>
  )
}

type NotatValideringError = {
  [key in 'tittel' | 'tekst' | 'bekreftSynlighet']?: string
}
