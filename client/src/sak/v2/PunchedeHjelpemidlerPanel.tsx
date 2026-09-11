import { Box, Button, HStack, InlineMessage, TextField, VStack } from '@navikt/ds-react'
import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { PanelTittel } from '../../felleskomponenter/panel/PanelTittel.tsx'
import { ScrollablePanel } from '../../felleskomponenter/ScrollablePanel.tsx'
import { HmsNrVelger } from '../../saksbilde/hjelpemidler/endreHjelpemiddel/endreHmsNr/HmsNrVelger.tsx'
import { useHjelpemiddel } from '../../saksbilde/hjelpemidler/endreHjelpemiddel/useHjelpemiddel.ts'
import { useAlternativeProdukter } from '../../saksbilde/hjelpemidler/useAlternativeProdukter.ts'
import { useHjelpemiddelprodukter } from '../../saksbilde/hjelpemidler/useHjelpemiddelprodukter.ts'
import { useProduktLagerInfo } from '../../saksbilde/hjelpemidler/useAlternativeProdukter.ts'
import { type Sak } from '../../types/types.internal.ts'
import { PunchetHjelpemiddelV2 } from './behovsmelding/PunchetHjelpemiddelV2.tsx'
import { useClosePanel } from './paneler/usePanelHooks.ts'
import { usePunchedeHjelpemidler } from '../../saksbilde/hjelpemidler/usePunchedeHjelpemidler.ts'

interface LeggTilForm {
  endretProdukt: string
  antall: number
}

export function PunchedeHjelpemidlerPanel({ sak }: { sak: Sak }) {
  const lukkPanel = useClosePanel('hjelpemidlerpanel')
  const { punchedeHjelpemidler, erPunchetPapirsøknad, lagreHjelpemiddel, slettHjelpemiddel } = usePunchedeHjelpemidler(
    sak.sakId
  )
  const [visLeggTil, setVisLeggTil] = useState(false)
  const [feil, setFeil] = useState<string>()
  const form = useForm<LeggTilForm>({
    defaultValues: { endretProdukt: '', antall: 1 },
  })
  const hmsnummer = form.watch('endretProdukt')
  const { hjelpemiddel: produktForLeggTil } = useHjelpemiddel(hmsnummer)

  const hmsnumre = useMemo(() => punchedeHjelpemidler.map((it) => it.hmsnummer), [punchedeHjelpemidler])
  const { data: produkter } = useHjelpemiddelprodukter(hmsnumre)
  const { alternativeProdukterByHmsArtNr } = useAlternativeProdukter(hmsnumre)
  const { produkter: lagerinfo } = useProduktLagerInfo(hmsnumre)

  async function leggTil() {
    const antall = form.getValues('antall')
    if (!produktForLeggTil || !Number.isInteger(antall) || antall < 1) {
      setFeil('Velg et gyldig hjelpemiddel og oppgi et helt antall på minst 1.')
      return
    }

    setFeil(undefined)
    try {
      await lagreHjelpemiddel({ hmsnummer, antall })
      form.reset({ endretProdukt: '', antall: 1 })
      setVisLeggTil(false)
    } catch {
      setFeil('Kunne ikke lagre hjelpemiddelet. Prøv igjen.')
    }
  }

  return (
    <FormProvider {...form}>
      <Box
        as="section"
        aria-label="Hjelpemidler"
        background="default"
        paddingBlock="space-0 space-36"
        paddingInline="space-12 space-0"
        height="100%"
      >
        <PanelTittel tittel="Hjelpemidler" lukkPanel={lukkPanel} />
        <ScrollablePanel paddingInline="space-0 space-4" paddingBlock="space-4 space-24" aria-label="Hjelpemidlerpanel">
          <VStack gap="space-8" paddingInline="space-4">
            {!visLeggTil && (
              <Button type="button" variant="secondary" size="small" onClick={() => setVisLeggTil(true)}>
                Legg til hjelpemiddel
              </Button>
            )}
            {visLeggTil && (
              <VStack gap="space-8">
                <HmsNrVelger />
                <TextField
                  label="Antall"
                  type="number"
                  min={1}
                  size="small"
                  {...form.register('antall', { valueAsNumber: true, min: 1 })}
                />
                {feil && <InlineMessage status="error">{feil}</InlineMessage>}
                <HStack gap="space-8">
                  <Button type="button" size="small" onClick={leggTil}>
                    Legg til
                  </Button>
                  <Button
                    type="button"
                    variant="tertiary"
                    size="small"
                    onClick={() => {
                      form.reset({ endretProdukt: '', antall: 1 })
                      setFeil(undefined)
                      setVisLeggTil(false)
                    }}
                  >
                    Avbryt
                  </Button>
                </HStack>
              </VStack>
            )}
            {erPunchetPapirsøknad && punchedeHjelpemidler.length === 0 && (
              <InlineMessage status="info">
                Ingen hjelpemidler er lagt inn. Trykk «Legg til hjelpemiddel» for å legge til hjelpemidler.
              </InlineMessage>
            )}
            {feil && !visLeggTil && <InlineMessage status="error">{feil}</InlineMessage>}
            {punchedeHjelpemidler.map((hjelpemiddel) => {
              const produkt = produkter.find((it) => it.hmsArtNr === hjelpemiddel.hmsnummer)
              return (
                <PunchetHjelpemiddelV2
                  key={hjelpemiddel.id}
                  hjelpemiddel={hjelpemiddel}
                  produkt={produkt}
                  alternativeProdukter={alternativeProdukterByHmsArtNr[hjelpemiddel.hmsnummer] ?? []}
                  minmaxStyrt={
                    lagerinfo[hjelpemiddel.hmsnummer]?.wareHouseStock?.some((it) => it?.minmax === true) ?? false
                  }
                  onEndre={async (endretHjelpemiddel) => {
                    try {
                      await lagreHjelpemiddel(endretHjelpemiddel)
                    } catch {
                      setFeil('Kunne ikke endre hjelpemiddelet. Prøv igjen.')
                    }
                  }}
                  onSlett={async (hjelpemiddelId) => {
                    try {
                      await slettHjelpemiddel(hjelpemiddelId)
                    } catch {
                      setFeil('Kunne ikke slette hjelpemiddelet. Prøv igjen.')
                    }
                  }}
                />
              )
            })}
          </VStack>
        </ScrollablePanel>
      </Box>
    </FormProvider>
  )
}
