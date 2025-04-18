import '@mdxeditor/editor/style.css'
import { TrashIcon } from '@navikt/aksel-icons'
import { Alert, Button, HStack, TextField, VStack } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { Brødtekst } from '../../../felleskomponenter/typografi.tsx'
import { ferdigstillNotat, slettNotatUtkast } from '../../../io/http.ts'
import { FerdigstillNotatRequest, MålformType, NotatType } from '../../../types/types.internal.ts'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal.tsx'
import { MarkdownTextArea } from './markdown/MarkdownTextArea.tsx'
import { useNotater } from './useNotater.tsx'
import { useUtkastEndret } from './useUtkastEndret.ts'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}

export function InterntNotatForm({ sakId, lesevisning }: NotaterProps) {
  const [sletter, setSletter] = useState(false)

  const { utkast: aktiveUtkast, isLoading: notaterLaster, mutate: mutateNotater } = useNotater(sakId)
  const { mutate: mutateNotatTeller } = useNotater(sakId)
  const [ferdigstillerNotat, setFerdigstillerNotat] = useState(false)
  const [visSlettUtkastModal, setVisSlettUtkastModal] = useState(false)
  const [visSlettetUtkastToast, setVisSlettetUtkastToast] = useState(false)
  const [visNotatFerdigstiltToast, setVisFerdigstillerNotatToast] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [valideringsfeil, setValideringsfeil] = useState<NotatValideringError>({})

  const aktivtUtkast = aktiveUtkast.find((u) => u.type === NotatType.INTERNT)

  const [tittel, setTittel] = useState(aktivtUtkast?.tittel || '')
  const [tekst, setTekst] = useState(aktivtUtkast?.tekst || '')
  const { lagrerUtkast } = useUtkastEndret(NotatType.INTERNT, sakId, tittel, tekst, mutateNotater, aktivtUtkast)

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
      type: NotatType.INTERNT,
      tittel: tittel,
      tekst: tekst,
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
    } else {
      setVisSlettUtkastModal(false)
    }
  }

  const readOnly = lesevisning || ferdigstillerNotat

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
        <ResponsivHStack justify={'space-between'}>
          <div>
            <Alert variant="info" size="small" inline>
              Notatet kan bli utlevert til innbygger ved forespørsel om innsyn
            </Alert>
          </div>
          <div>
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
          </div>
        </ResponsivHStack>
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

      {visSlettetUtkastToast && <InfoToast bottomPosition="10px">Utkast slettet</InfoToast>}
    </form>
  )
}

const ResponsivHStack = styled(HStack)`
  // Foreløpig hardkodet px verdi for brekkpunkt. Dette er minste bredde før knappen brekker til ny linje
  // På sikt bør vi lage hele sideoppsett i Hotsak for de ulike brekkpunktene fra Aksel
  @media (max-width: 1730px) {
    order: reverse;
    flex-direction: column;
    gap: var(--a-spacing-4);
  }
`

type NotatValideringError = {
  [key in 'tittel' | 'tekst' | 'bekreftSynlighet']?: string
}
