import { memo, useEffect, useState } from 'react'

import { Button, Heading, Panel, Radio, RadioGroup, Select, Skeleton } from '@navikt/ds-react'

import { deleteBrevutkast, postBrevutkast, postBrevutsending } from '../../../io/http'

import { TrashIcon } from '@navikt/aksel-icons'
import { Avstand } from '../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../felleskomponenter/Knappepanel'
import { InfoToast } from '../../../felleskomponenter/Toast'
import { Fritekst } from '../../../felleskomponenter/brev/Fritekst'
import { Brødtekst, Mellomtittel } from '../../../felleskomponenter/typografi'
import { BrevTekst, Brevtype, MålformType } from '../../../types/types.internal'
import { useBrevtekst } from '../../barnebriller/brevutkast/useBrevtekst'
import { useBrev } from '../../barnebriller/steg/vedtak/brev/useBrev'
import { useSaksdokumenter } from '../../barnebriller/useSaksdokumenter'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal'
import { useBarnebrillesak } from '../../useBarnebrillesak'
import { ForhåndsvisningsModal } from './ForhåndsvisningModal'
import { UtgåendeBrev } from './UtgåendeBrev'

export interface SendBrevProps {
  sakId: string
  lesevisning: boolean
}

export const SendBrevPanel = memo((props: SendBrevProps) => {
  const { sakId, lesevisning } = props
  const { data, mutate: hentBrevtekst } = useBrevtekst(sakId, Brevtype.BARNEBRILLER_INNHENTE_OPPLYSNINGER)
  const brevtekst = data?.data.brevtekst
  const [lagrer, setLagrer] = useState(false)
  const [sletter, setSletter] = useState(false)
  const [senderBrev, setSenderBrev] = useState(false)
  const [visSendBrevModal, setVisSendBrevModal] = useState(false)
  const [visForhåndsvisningsModal, setVisForhåndsvisningsModal] = useState(false)
  const [visSlettUtkastModal, setVisSlettUtkastModal] = useState(false)
  const [målform, setMålform] = useState(MålformType.BOKMÅL)
  const [fritekst, setFritekst] = useState(brevtekst || '')
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [visSendtBrevToast, setVisSendtBrevToast] = useState(false)
  const [visSlettetUtkastToast, setVisSlettetUtkastToast] = useState(false)
  const [valideringsfeil, setValideringsfeil] = useState<string | undefined>(undefined)
  const { mutate: hentBrillesak } = useBarnebrillesak()
  const { mutate: hentSaksdokumenter } = useSaksdokumenter(sakId)
  const { hentForhåndsvisning } = useBrev()
  const brevtype = Brevtype.BARNEBRILLER_INNHENTE_OPPLYSNINGER

  useEffect(() => {
    if (brevtekst) {
      setFritekst(brevtekst)
    }
  }, [brevtekst])

  useEffect(() => {
    if (submitAttempt) {
      valider()
    }
  }, [fritekst, submitAttempt])

  const valider = () => {
    if (fritekst === '') {
      setValideringsfeil('Du kan ikke sende brevet uten å ha lagt til tekst')
      return false
    } else {
      setValideringsfeil(undefined)
      return true
    }
  }

  if (!data) {
    return (
      <Avstand paddingTop={6} paddingLeft={4}>
        <Heading level="2" as={Skeleton} size="small" spacing>
          Placeholder
        </Heading>
        <Skeleton variant="rectangle" width="80%" height={30} />
        <Avstand paddingTop={6} />
        <Skeleton variant="rectangle" width="80%" height={90} />
      </Avstand>
    )
  }

  function byggBrevPayload(tekst?: string, valgtMålform?: MålformType): BrevTekst {
    return {
      sakId: sakId,
      målform: valgtMålform || målform,
      brevtype,
      data: {
        brevtekst: tekst != undefined ? tekst : fritekst,
      },
    }
  }

  const sendBrev = async () => {
    setSenderBrev(true)
    await postBrevutsending(byggBrevPayload())

    setSenderBrev(false)
    setVisSendBrevModal(false)
    setSubmitAttempt(false)
    setFritekst('')
    setVisSendtBrevToast(true)
    hentBrillesak()
    hentSaksdokumenter()

    setTimeout(() => {
      setVisSendtBrevToast(false)
      hentBrillesak()
      hentSaksdokumenter()
    }, 3000)
  }

  const slettUtkast = async () => {
    setSletter(true)
    await deleteBrevutkast(sakId, Brevtype.BARNEBRILLER_INNHENTE_OPPLYSNINGER)
    setFritekst('')
    setVisSlettUtkastModal(false)
    setVisSlettetUtkastToast(true)
    setTimeout(() => {
      setVisSlettetUtkastToast(false)
    }, 3000)
    hentBrevtekst()

    setSletter(false)
  }

  const lagreUtkast = async (tekst: string, valgtMålform?: MålformType) => {
    setLagrer(true)
    await postBrevutkast(byggBrevPayload(tekst, valgtMålform))
    setLagrer(false)
  }

  return (
    <>
      <Panel as="aside">
        <Mellomtittel>Send brev</Mellomtittel>
        {lesevisning ? (
          <Brødtekst>Saken må være under behandling og du må være tildelt saken for å kunne sende brev.</Brødtekst>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            <Select size="small" label="Velg brevmal">
              <option value={brevtype}>Innhente opplysninger</option>
            </Select>
            <Avstand paddingTop={6} />
            <RadioGroup
              legend="Målform"
              size="small"
              value={målform}
              onChange={(value: MålformType) => {
                setMålform(value)
                lagreUtkast(fritekst, value)
              }}
            >
              <Radio value={MålformType.BOKMÅL}>Bokmål</Radio>
              <Radio value={MålformType.NYNORSK}>Nynorsk</Radio>
            </RadioGroup>
            <Avstand paddingTop={6} />
            <Fritekst
              label="Fritekst"
              beskrivelse="Beskriv hva som mangler av dokumentasjon"
              fritekst={fritekst}
              valideringsfeil={valideringsfeil}
              onLagre={lagreUtkast}
              lagrer={lagrer}
              onTextChange={setFritekst}
            />
            <Knappepanel>
              <Button
                type="submit"
                size="small"
                variant="tertiary"
                onClick={() => {
                  hentForhåndsvisning(sakId, brevtype)
                  setVisForhåndsvisningsModal(true)
                }}
              >
                Forhåndsvis
              </Button>
              <Button
                type="submit"
                size="small"
                variant="primary"
                onClick={() => {
                  setSubmitAttempt(true)
                  if (valider()) {
                    setVisSendBrevModal(true)
                  }
                }}
              >
                Send brev
              </Button>
              <Button
                icon={<TrashIcon />}
                variant="danger"
                size="small"
                onClick={() => {
                  setVisSlettUtkastModal(true)
                }}
              />
            </Knappepanel>
          </form>
        )}
        <UtgåendeBrev sakId={sakId} />
      </Panel>
      <ForhåndsvisningsModal
        open={visForhåndsvisningsModal}
        sakId={sakId}
        brevtype={brevtype}
        onClose={() => {
          setVisForhåndsvisningsModal(false)
        }}
      />
      <BekreftelseModal
        heading="Vil du sende brevet?"
        buttonLabel="Send brev"
        open={visSendBrevModal}
        loading={senderBrev}
        onClose={() => setVisSendBrevModal(false)}
        onBekreft={() => {
          sendBrev()
        }}
      >
        <Brødtekst>Brevet sendes til adressen til barnet, og saken settes på vent.</Brødtekst>
      </BekreftelseModal>
      <BekreftelseModal
        heading="Vil du slette utkastet?"
        buttonLabel="Slett utkast"
        buttonVariant="danger"
        open={visSlettUtkastModal}
        loading={sletter}
        onClose={() => setVisSlettUtkastModal(false)}
        onBekreft={() => {
          slettUtkast()
        }}
      />
      {visSendtBrevToast && (
        <InfoToast bottomPosition="300px">
          Brevet er sendt. Det kan ta litt tid før det dukker opp i listen over.
        </InfoToast>
      )}
      {visSlettetUtkastToast && <InfoToast bottomPosition="400px">Utkast slettet</InfoToast>}
    </>
  )
})
