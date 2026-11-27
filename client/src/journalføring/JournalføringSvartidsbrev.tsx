import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Dialog,
  HelpText,
  HStack,
  InlineMessage,
  Label,
  Link,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Textarea,
  VStack,
} from '@navikt/ds-react'
import {
  BoldPlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  H4Plugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react'
import { LinkPlugin } from '@platejs/link/react'
import { ListPlugin } from '@platejs/list-classic/react'
import { MarkdownPlugin, remarkMdx } from '@platejs/markdown'
import { KEYS } from 'platejs'
import { createPlateEditor } from 'platejs/react'
import { Suspense, useEffect, useState } from 'react'
import { type Metadata } from '../brev/breveditor/Breveditor'
import { byggFullHtml, GJELDENDE_STILARK_VERSJON } from '../brev/breveditor/html/byggDokument'
import { transformerPlaceholders } from '../brev/breveditor/transformerPlaceholders'
import { useBrevmal } from '../brev/brevmaler/useBrevmal'
import { Målform } from '../brev/brevTyper'
import { type Journalføringsoppgave } from '../oppgave/oppgaveTypes'
import { usePersonContext } from '../personoversikt/PersonContext'
import { usePerson } from '../personoversikt/usePerson'
import type { Person } from '../types/types.internal'
import { formaterDatoLang } from '../utils/dato'
import { formaterNavn } from '../utils/formater'
import classes from './JournalføringSvartidsbrev.module.css'
import { type SvartidsbrevValg } from './journalføringTypes'
import { byggSvartidsbrev, svartidsbrevKreverÅrsak } from './journalføringValg'

const ÅRSAK_MAKSLENGDE = 500

function formaterMottattDato(dato?: string): string {
  if (!dato) return ''
  return new Date(dato).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface JournalføringSvartidsbrevProps {
  oppgave: Journalføringsoppgave
  mottattDato?: string
  visÅrsakFeil?: boolean
  onChange?: (valg: SvartidsbrevValg | null) => void
}

export function JournalføringSvartidsbrev({
  oppgave,
  mottattDato,
  visÅrsakFeil,
  onChange,
}: JournalføringSvartidsbrevProps) {
  const [målform, setMålform] = useState<Målform>(Målform.BOKMÅL)
  const [antallUker, setAntallUker] = useState(4)
  const [årsak, setÅrsak] = useState('')
  const [sendSvartidsbrev, setSendSvartidsbrev] = useState(false)
  const [visForhåndsvisning, setVisForhåndsvisning] = useState(false)
  const [brevOpprettet] = useState(() => formaterDatoLang(new Date().toISOString()))
  const { fodselsnummer } = usePersonContext()
  const { personInfo } = usePerson(fodselsnummer)
  const kreverÅrsak = svartidsbrevKreverÅrsak(antallUker)

  useEffect(() => {
    onChange?.(sendSvartidsbrev ? { antallUker, målform, årsak } : null)
  }, [onChange, sendSvartidsbrev, antallUker, målform, årsak])

  return (
    <VStack gap="space-12">
      <Label size="small">Vil du sende brev om forventet saksbehandlingstid til bruker?</Label>
      <CheckboxGroup
        hideLegend
        legend="Send svartidsbrev?"
        onChange={(value) => setSendSvartidsbrev(value.includes('Ja'))}
        size="small"
      >
        <Checkbox value="Ja">Ja, opprett brev</Checkbox>
      </CheckboxGroup>
      {sendSvartidsbrev && (
        <Box background="accent-soft" padding="space-8" borderRadius="12" borderWidth="1" borderColor="neutral-subtle">
          <VStack gap="space-12">
            <RadioGroup legend="Målform" size="small" value={målform} onChange={(value: Målform) => setMålform(value)}>
              <Stack gap="space-0 space-24" direction={{ xs: 'column', sm: 'row' }} wrap={false}>
                <Radio value={Målform.BOKMÅL}>Bokmål</Radio>
                <Radio value={Målform.NYNORSK}>Nynorsk</Radio>
              </Stack>
            </RadioGroup>
            <Select
              size="small"
              label="Forventet behandlingstid"
              value={antallUker}
              onChange={(event) => setAntallUker(Number(event.target.value))}
            >
              <option value={4}>4 uker</option>
              <option value={8}>8 uker</option>
              <option value={12}>12 uker</option>
              <option value={18}>18 uker</option>
            </Select>
            {kreverÅrsak && (
              <Textarea
                size="small"
                label={
                  <HStack wrap={false} gap="space-8" align="center">
                    <span>Forklar hvorfor saken ikke kan behandles i løpet av 1 måned</span>
                    <HelpText title="Forklaring for hvorfor årsak kreves">
                      “I svaret til bruker må du forklare hvorfor det vil ta lengre tid enn 1 månedå behandle
                      henvendelsen. Dette følger av{' '}
                      <Link
                        inlineText
                        href="https://lovdata.no/dokument/NL/lov/1967-02-10/KAPITTEL_3#%C2%A711a"
                        target="_blank"
                        rel="noreferrer"
                      >
                        forvaltningsloven § 11 a
                      </Link>
                      .”
                    </HelpText>
                  </HStack>
                }
                description="Begrunnelsen blir en del av brevet."
                maxLength={ÅRSAK_MAKSLENGDE}
                value={årsak}
                onChange={(event) => setÅrsak(event.target.value)}
                error={
                  visÅrsakFeil && !årsak.trim()
                    ? 'Du må forklare hvorfor saken ikke kan behandles i løpet av 1 måned'
                    : undefined
                }
              />
            )}
            <div>
              <Button type="button" size="xsmall" variant="tertiary" onClick={() => setVisForhåndsvisning(true)}>
                Forhåndsvis brev
              </Button>
            </div>
            <InlineMessage status="info" size="small">
              Brevet legges til utsending når du journalfører saken.
            </InlineMessage>
          </VStack>
        </Box>
      )}
      <ForhåndsvisBrevDialog
        open={visForhåndsvisning}
        onOpenChange={setVisForhåndsvisning}
        antallUker={antallUker}
        årsak={årsak}
        mottattDato={mottattDato}
        personInfo={personInfo}
        målform={målform}
        metadata={{
          brukersNavn: formaterNavn(personInfo),
          brukersFødselsnummer: fodselsnummer,
          saksnummer: 0,
          brevOpprettet,
          saksbehandlerNavn: oppgave.tildeltSaksbehandler?.navn ?? '',
          hjelpemiddelsentral: oppgave.tildeltEnhet?.navn ?? 'Nav hjelpemiddelsentral',
        }}
      />
    </VStack>
  )
}

interface SvartidsbrevForhåndsvisningProps {
  antallUker: number
  årsak: string
  mottattDato?: string
  målform: Målform
  personInfo: Person | undefined
  metadata: Metadata
}

export function SvartidsbrevForhåndsvisning({
  antallUker,
  årsak,
  mottattDato,
  målform,
  personInfo,
  metadata,
}: SvartidsbrevForhåndsvisningProps) {
  const kreverÅrsak = svartidsbrevKreverÅrsak(antallUker)
  const mal = useBrevmal(kreverÅrsak ? 'svartidsbrev-journalføring' : 'svartidsbrev-journalføring-enkel', målform)
  const vergemål = personInfo?.vergemål || []
  const vergeNavn = vergemål
    .map((it) => it.navn)
    .filter((navn): navn is NonNullable<typeof navn> => !!navn)
    .map((navn) => formaterNavn(navn))
    .join(', ')

  if (!mal) return <p role="status">Brevmalen er ikke tilgjengelig på valgt målform.</p>

  const editor = createPlateEditor({
    plugins: [
      MarkdownPlugin.configure({ options: { remarkPlugins: [remarkMdx] } }),
      H1Plugin,
      H2Plugin,
      H3Plugin,
      H4Plugin,
      ItalicPlugin,
      UnderlinePlugin,
      BoldPlugin,
      LinkPlugin,
      ListPlugin.configure({ inject: { targetPlugins: [KEYS.p] } }),
    ],
  })
  const innhold = transformerPlaceholders(editor.getApi(MarkdownPlugin).markdown.deserialize(mal), {
    auto_antall_uker_svartid: byggSvartidsbrev({ antallUker, målform, årsak }).antallUker,
    auto_dato_soknad_mottatt: formaterMottattDato(mottattDato),
    auto_årsak: årsak.trim(),
  })
  const html = byggFullHtml(metadata, innhold, GJELDENDE_STILARK_VERSJON, vergeNavn, målform)
  const dokument = new DOMParser().parseFromString(html, 'text/html')
  const skjermstil = dokument.createElement('style')
  skjermstil.textContent = `
    @media screen {
      html { background: #e8e8e8; }
      body {
        box-sizing: border-box;
        width: 210mm;
        min-height: 297mm;
        margin: 16px auto;
        padding: 64pt 56pt 74pt;
        background: white;
        zoom: min(1, calc((100vw - 32px) / 210mm));
      }
    }
  `
  dokument.head.append(skjermstil)

  return (
    <iframe
      title="Forhåndsvisning av svartidsbrev"
      srcDoc={dokument.documentElement.outerHTML}
      sandbox=""
      className={classes.forhåndsvisning}
    />
  )
}

interface ForhåndsvisBrevDialogProps extends SvartidsbrevForhåndsvisningProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ForhåndsvisBrevDialog({
  open,
  onOpenChange,
  antallUker,
  årsak,
  mottattDato,
  målform,
  personInfo,
  metadata,
}: ForhåndsvisBrevDialogProps) {
  return (
    <Dialog size="small" open={open} onOpenChange={onOpenChange}>
      <Dialog.Popup closeOnOutsideClick={true} height="100%" width="80%">
        <Dialog.Header>
          <Dialog.Title>Forhåndsvisning av svartidsbrev</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Suspense fallback={<p role="status">Laster brevmal...</p>}>
            <SvartidsbrevForhåndsvisning
              antallUker={antallUker}
              årsak={årsak}
              mottattDato={mottattDato}
              målform={målform}
              personInfo={personInfo}
              metadata={metadata}
            />
          </Suspense>
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  )
}
