import '@mdxeditor/editor/style.css'
import { TrashIcon } from '@navikt/aksel-icons'
import { Alert, Button, Checkbox, CheckboxGroup, HStack, TextField, VStack } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { Brødtekst } from '../../../felleskomponenter/typografi.tsx'
import { ferdigstillNotat, slettNotatUtkast } from '../../../io/http.ts'
import { Brevtype, FerdigstillNotatRequest, MålformType, NotatType } from '../../../types/types.internal.ts'
import { useBrev } from '../../barnebriller/steg/vedtak/brev/useBrev.ts'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal.tsx'
import { InfoModal } from '../../komponenter/InfoModal.tsx'
import { ForhåndsvisningsModal } from '../brevutsending/ForhåndsvisningModal.tsx'
import { MarkdownTextArea } from './markdown/MarkdownTextArea.tsx'
import { useNotater } from './useNotater.tsx'
import { useUtkastEndret } from './useUtkastEndret.ts'
import { useSak } from '../../useSak.ts'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}

export function JournalførtNotatForm({ sakId, lesevisning }: NotaterProps) {
  const [sletter, setSletter] = useState(false)
  const { sak } = useSak()

  const { mutate: mutateNotatTeller } = useNotater(sakId)
  const [journalførerNotat, setJournalførerNotat] = useState(false)
  const { utkast: aktiveUtkast, isLoading: notaterLaster, mutate: mutateNotater } = useNotater(sakId)
  const [visSlettUtkastModal, setVisSlettUtkastModal] = useState(false)
  const [visSlettetUtkastToast, setVisSlettetUtkastToast] = useState(false)
  const [visJournalførNotatModal, setVisJournalførNotatModal] = useState(false)
  const [visUtkastManglerModal, setVisUtkastManglerModal] = useState(false)
  const [visNotatJournalførtToast, setVisNotatJournalførtToast] = useState(false)
  const [visForhåndsvisningsmodal, setVisForhåndsvisningsmodal] = useState(false)
  const { hentForhåndsvisning } = useBrev()
  const [confirmationAttempt, setConfirmationAttempt] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [valideringsfeil, setValideringsfeil] = useState<NotatValideringError>({})
  const [klarForFerdigstilling, setKlarForFerdigstilling] = useState(false)

  const aktivtUtkast = aktiveUtkast.find((u) => u.type === NotatType.JOURNALFØRT)

  const [tittel, setTittel] = useState(aktivtUtkast?.tittel || '')
  const [tekst, setTekst] = useState(aktivtUtkast?.tekst || '')
  const { lagrerUtkast } = useUtkastEndret(NotatType.JOURNALFØRT, sakId, tittel, tekst, mutateNotater, aktivtUtkast)

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
    if (confirmationAttempt) {
      valider()
    }
  }, [klarForFerdigstilling, tittel, tekst, confirmationAttempt])

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

  const journalførNotat = async () => {
    setJournalførerNotat(true)
    await ferdigstillNotat(lagPayload())
    setTittel('')
    setTekst('')
    setValideringsfeil({})
    setConfirmationAttempt(false)
    setSubmitAttempt(false)
    mutateNotater()
    setKlarForFerdigstilling(false)
    setVisNotatJournalførtToast(true)
    setJournalførerNotat(false)
    mutateNotatTeller()
    setVisJournalførNotatModal(false)
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
      setConfirmationAttempt(false)
      setValideringsfeil({})
      setKlarForFerdigstilling(false)
      setSletter(false)
    } else {
      setVisSlettUtkastModal(false)
    }
  }

  const readOnly = lesevisning || journalførerNotat

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {!notaterLaster && (
        <VStack gap="4" paddingBlock="6 0">
          <Alert variant="info" size="small">
            Notatet blir journalført og tilgjengelig for bruker på nav.no virkedagen etter at det er ferdigstilt.
          </Alert>
          <TextField
            size="small"
            label="Tittel"
            error={valideringsfeil.tittel}
            readOnly={readOnly}
            value={tittel}
            onChange={(e) => setTittel(e.target.value)}
          />
          <MarkdownTextArea
            label="Notat"
            tekst={tekst}
            onChange={setTekst}
            readOnly={readOnly}
            lagrer={lagrerUtkast}
            valideringsfeil={valideringsfeil.tekst}
          />
        </VStack>
      )}

      {!lesevisning && (
        <HStack justify="space-between" paddingBlock={'1-alt 0'}>
          <Button
            type="submit"
            size="xsmall"
            variant="tertiary"
            onClick={() => {
              if (aktivtUtkast?.id) {
                hentForhåndsvisning(sakId, Brevtype.JOURNALFØRT_NOTAT, aktivtUtkast?.id)
                setVisForhåndsvisningsmodal(true)
              } else {
                setVisUtkastManglerModal(true)
              }
            }}
          >
            Forhåndsvis dokument
          </Button>

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
          <div>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                setConfirmationAttempt(true)
                if (valider()) {
                  setVisJournalførNotatModal(true)
                }
              }}
            >
              Journalfør notat
            </Button>
          </div>
        </VStack>
      )}

      {visNotatJournalførtToast && <InfoToast bottomPosition="10px">Notatet er journalført.</InfoToast>}
      {visSlettetUtkastToast && <InfoToast bottomPosition="10px">Utkast slettet</InfoToast>}

      <BekreftelseModal
        heading="Er du sikker på at du vil slette utkastet?"
        bekreftButtonLabel="Ja, slett utkastet"
        avbrytButtonLabel="Nei, behold utkastet"
        bekreftButtonVariant="secondary"
        avbrytButtonVariant="primary"
        reverserKnapperekkefølge={true}
        open={visSlettUtkastModal}
        loading={sletter}
        onClose={() => setVisSlettUtkastModal(false)}
        onBekreft={() => {
          return slettUtkast()
        }}
      >
        <Brødtekst>Utkastet til notat vil forsvinne, og kan ikke gjenopprettes.</Brødtekst>
      </BekreftelseModal>

      <BekreftelseModal
        heading="Er du sikker på at du vil journalføre notatet?"
        bekreftButtonLabel="Ja, journalfør notatet"
        reverserKnapperekkefølge={true}
        bekreftButtonVariant="secondary"
        avbrytButtonVariant="primary"
        width={'660px'}
        open={visJournalførNotatModal}
        loading={journalførerNotat}
        onClose={() => setVisJournalførNotatModal(false)}
        onBekreft={() => {
          setSubmitAttempt(true)
          if (klarForFerdigstilling) {
            return journalførNotat()
          }
        }}
      >
        <CheckboxGroup
          size="small"
          hideLegend={true}
          value={klarForFerdigstilling ? ['bekreft'] : []}
          legend="Bekreft synlighet"
          error={
            submitAttempt &&
            !klarForFerdigstilling &&
            `Du må bekrefte at du er klar over at notatet blir synlig for bruker`
          }
        >
          <Checkbox
            value="bekreft"
            size="small"
            error={!!valideringsfeil.bekreftSynlighet}
            onChange={(e) => setKlarForFerdigstilling(e.target.checked)}
          >
            <Brødtekst>
              Jeg er klar over at notatet blir synlig for
              {sak?.data.bruker.fulltNavn ? <strong>{` ${sak?.data.bruker.fulltNavn} `}</strong> : 'bruker'}
              på nav.no neste virkedag
            </Brødtekst>
          </Checkbox>
        </CheckboxGroup>
      </BekreftelseModal>

      <InfoModal heading="Ingen utkast" open={visUtkastManglerModal} onClose={() => setVisUtkastManglerModal(false)}>
        <Brødtekst>Notatet kan ikke forhåndsvises før det er opprettet et utkast</Brødtekst>
      </InfoModal>
      <ForhåndsvisningsModal
        open={visForhåndsvisningsmodal}
        sakId={sakId}
        brevtype={Brevtype.JOURNALFØRT_NOTAT}
        onClose={() => {
          setVisForhåndsvisningsmodal(false)
        }}
      />
    </form>
  )
}

type NotatValideringError = {
  [key in 'tittel' | 'tekst' | 'bekreftSynlighet']?: string
}
