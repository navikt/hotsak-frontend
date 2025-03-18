import '@mdxeditor/editor/style.css'
import { TrashIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Box, Button, ErrorMessage, HStack, Label, Loader, TextField, VStack } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { ferdigstillNotat, oppdaterNotatUtkast, opprettNotatUtkast, slettNotatUtkast } from '../../../io/http.ts'
import { FerdigstillNotatRequest, MålformType, NotatType } from '../../../types/types.internal.ts'
import { MarkdownEditor, MarkdownEditorStyling } from '../../journalførteNotater/MarkdownEditor.tsx'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal.tsx'
import { useNotater } from './useNotater.tsx'
import { useNotatTeller } from './useNotatTeller.ts'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}

export function InterntNotatForm({ sakId, lesevisning }: NotaterProps) {
  const [lagrerUtkast, setLagrerUtkast] = useState(false)
  const [sletter, setSletter] = useState(false)

  const { utkast: aktiveUtkast, isLoading: notaterLaster, mutate: mutateNotater } = useNotater(sakId)
  const { mutate: mutateNotatTeller } = useNotatTeller(sakId)
  const [ferdigstillerNotat, setFerdigstillerNotat] = useState(false)
  const [oppretterNyttUtkast, setOppretterNyttUtkast] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [visSlettUtkastModal, setVisSlettUtkastModal] = useState(false)
  const [visSlettetUtkastToast, setVisSlettetUtkastToast] = useState(false)
  const [visNotatFerdigstiltToast, setVisFerdigstillerNotatToast] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [valideringsfeil, setValideringsfeil] = useState<NotatValideringError>({})

  const aktivtUtkast = aktiveUtkast.find((u) => u.type === NotatType.INTERNT)

  const [tittel, setTittel] = useState(aktivtUtkast?.tittel || '')
  const [tekst, setTekst] = useState(aktivtUtkast?.tekst || '')

  // Dynamisk autorefresh for å vente på journalføring
  // Håndtere race ved state for oppretter notat
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
  }, [tittel, tekst, submitAttempt])

  /*useEffect(() => {
    if (visLasterNotat != null && visLasterNotat.length != journalførteNotater.length) {
      setVisLasterNotat(null)
      //oppdaterNotatTeller()
    }
  }, [journalførteNotater])*/

  function valider() {
    let valideringsfeil: NotatValideringError = {}

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
      type: NotatType.INTERNT,
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
            await opprettNotatUtkast(sakId, { tittel, tekst, type: NotatType.INTERNT })
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

  const ferdigstillInterntNotat = async () => {
    setFerdigstillerNotat(true)
    await ferdigstillNotat(lagPayload())
    setTittel('')
    setTekst('')
    setValideringsfeil({})
    setSubmitAttempt(false)
    mutateNotater()

    setVisFerdigstillerNotatToast(true)
    setFerdigstillerNotat(false)
    mutateNotatTeller()
    setTimeout(() => setVisFerdigstillerNotatToast(false), 3000)
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
      setSletter(false)
    }
  }

  const readOnly = lesevisning || ferdigstillerNotat

  // Skal vi sette default til den som har utkast?

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {!notaterLaster && (
        <VStack gap="4" paddingBlock="6 0">
          <TextField
            size="small"
            label="Tittel"
            error={valideringsfeil.tittel}
            readOnly={readOnly}
            value={tittel}
            onChange={(e) => setTittel(e.target.value)}
          />
          <div>
            <Label size="small">Notat</Label>
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
          <Alert variant="info" size="small" inline>
            Notatet kan bli utlevert til innbygger ved forespørsel om innsyn
          </Alert>
          <Button
            icon={<TrashIcon />}
            variant="tertiary"
            hidden={!aktivtUtkast?.id}
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
          <div>
            <Button
              variant="secondary"
              size="small"
              loading={ferdigstillerNotat}
              onClick={() => {
                setSubmitAttempt(true)
                if (valider()) {
                  ferdigstillInterntNotat()
                }
              }}
            >
              Opprett internt notat
            </Button>
          </div>
        </VStack>
      )}

      {visNotatFerdigstiltToast && (
        <InfoToast bottomPosition="10px">
          Notatet er opprettet. Det kan ta litt tid før det dukker opp i listen over.
        </InfoToast>
      )}

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

      {visSlettetUtkastToast && <InfoToast bottomPosition="10px">Utkast slettet</InfoToast>}
    </form>
  )
}

type NotatValideringError = {
  [key in 'tittel' | 'tekst' | 'bekreftSynlighet']?: string
}
