import { Box, Button, Heading, InlineMessage, Radio, RadioGroup, Select, VStack } from '@navikt/ds-react'
import { type FormEvent, useState } from 'react'

import { RadioCard, RadioCardGroup } from '@navikt/ds-react/PREVIEW'
import { HttpError } from '../io/HttpError.ts'
import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { type BrevmalInitialisering } from './breveditor/breveditorTyper.ts'
import { GJELDENDE_STILARK_VERSJON } from './breveditor/html/byggDokument.ts'
import {
  type Brev,
  type BreveditorbrevUtenVedtak,
  Brevmal,
  BrevmalTekst,
  BrevmalTekstBeskrivelse,
  isBreveditorbrevUtenVedtak,
  Målform,
} from './brevTyper.ts'
import { useBrevActions } from './useBrevActions.ts'

interface NyttBrevProps {
  oppgave: Saksbehandlingsoppgave
  tilgjengeligeBrevmaler: readonly BreveditorbrevUtenVedtak[]
  onOpprettet: (brev: Brev) => void
}

export function NyttBrev({ oppgave, tilgjengeligeBrevmaler, onOpprettet }: NyttBrevProps) {
  const [valgtBrevmal, setValgtBrevmal] = useState<BreveditorbrevUtenVedtak>()
  const [antallUker, setAntallUker] = useState(4)
  const { opprettBrevutkast } = useBrevActions<BrevmalInitialisering>(oppgave)
  const [målform, setMålform] = useState<Målform>(Målform.BOKMÅL)
  const { oppgaveErAvsluttet, oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const kanOppretteBrev =
    !!oppgave && !oppgaveErAvsluttet && oppgaveErUnderBehandlingAvInnloggetAnsatt && tilgjengeligeBrevmaler.length > 0

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!valgtBrevmal) return
    event.preventDefault()
    try {
      const brev = await opprettBrevutkast.trigger({
        brevutkast: {
          brevmal: valgtBrevmal,
          brevmalVersjon: GJELDENDE_STILARK_VERSJON,
          målform: målform,
          data:
            valgtBrevmal === Brevmal.BREVEDITOR_SVARTIDSBREV
              ? { templateValues: { auto_antall_uker_svartid: `${antallUker} uker` } }
              : {},
        },
      })
      onOpprettet(brev)
    } catch (error) {
      if (HttpError.isHttpError(error) && error.isConflict()) return
      throw error
    }
  }

  return (
    <Box paddingInline="space-20" paddingBlock="space-20">
      <form onSubmit={handleSubmit}>
        <VStack gap="space-12">
          {!kanOppretteBrev ? (
            <InlineMessage status="info">Du kan ikke opprette brev for denne oppgaven.</InlineMessage>
          ) : (
            <>
              <Heading level="2" size="xsmall">
                Opprett nytt utkast
              </Heading>
              <RadioCardGroup
                legend="Velg en brevmal"
                onChange={(val: string) => {
                  if (isBreveditorbrevUtenVedtak(val)) setValgtBrevmal(val)
                }}
              >
                {tilgjengeligeBrevmaler.map((brevmal) => (
                  <RadioCard key={brevmal} value={brevmal} description={BrevmalTekstBeskrivelse[brevmal]}>
                    {BrevmalTekst[brevmal]}
                  </RadioCard>
                ))}
              </RadioCardGroup>
              {valgtBrevmal === Brevmal.BREVEDITOR_SVARTIDSBREV && (
                <Select
                  label="Forventet behandlingstid"
                  value={antallUker}
                  onChange={(event) => setAntallUker(Number(event.target.value))}
                >
                  <option value={4}>4 uker</option>
                  <option value={12}>12 uker</option>
                  <option value={18}>18 uker</option>
                </Select>
              )}
              {valgtBrevmal && (
                <RadioGroup
                  legend="Målform"
                  size="small"
                  value={målform}
                  onChange={(value: Målform) => setMålform(value)}
                >
                  <Radio value={Målform.BOKMÅL}>Bokmål</Radio>
                  <Radio value={Målform.NYNORSK}>Nynorsk</Radio>
                </RadioGroup>
              )}
              <Box>
                <Button type="submit" variant="primary" size="small" disabled={!valgtBrevmal}>
                  Opprett utkast
                </Button>
              </Box>
            </>
          )}
        </VStack>
      </form>
    </Box>
  )
}
