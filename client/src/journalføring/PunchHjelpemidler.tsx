import { TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, HStack, Label, TextField, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { useHjelpemiddelprodukter } from '../saksbilde/hjelpemidler/useHjelpemiddelprodukter.ts'
import { type JournalføringV2SkjemaVerdier } from './journalføringTypes.ts'
import classes from './PunchHjelpemidler.module.css'

function splittHmsnumre(input: string): string[] {
  const unike = new Set(
    input
      .split(/[\s,]+/)
      .map((hmsnummer) => hmsnummer.trim())
      .filter(Boolean)
  )
  return [...unike]
}

interface PunchHjelpemidlerProps {
  kanRedigere: boolean
}

export function PunchHjelpemidler({ kanRedigere }: PunchHjelpemidlerProps) {
  const [tekst, setTekst] = useState('')
  const { control, register } = useFormContext<JournalføringV2SkjemaVerdier>()
  const { fields, replace, remove } = useFieldArray({ control, name: 'punchedeHjelpemidler' })

  const punchedeHjelpemidler = useWatch({ control, name: 'punchedeHjelpemidler' }) ?? []
  const hmsnrs = punchedeHjelpemidler.map((rad) => rad.hmsnummer).filter(Boolean)
  const { data: produkter, isLoading } = useHjelpemiddelprodukter(hmsnrs)

  function slåOpp() {
    const hmsnumre = splittHmsnumre(tekst)
    if (hmsnumre.length === 0) {
      return
    }
    replace(hmsnumre.map((hmsnummer) => ({ hmsnummer, antall: 1 })))
  }

  return (
    <VStack gap="space-8">
      <HStack gap="space-8" align="end" wrap={false}>
        <TextField
          label="HMS-nummer (skill med mellomrom eller komma)"
          size="small"
          value={tekst}
          readOnly={!kanRedigere}
          onChange={(e) => setTekst(e.target.value)}
          className={classes.hmsnummerInput}
        />
        <Button type="button" variant="secondary" size="small" disabled={!kanRedigere} onClick={slåOpp}>
          Slå opp
        </Button>
      </HStack>

      {fields.length > 0 && (
        <VStack gap="space-4">
          {fields.map((field, index) => {
            const hmsnummer = punchedeHjelpemidler[index]?.hmsnummer
            const produkt = produkter.find((p) => p.hmsArtNr === hmsnummer)
            return (
              <HStack key={field.id} gap="space-8" align="end" wrap={false}>
                <TextField
                  label="HMS-nummer"
                  hideLabel
                  size="small"
                  readOnly={!kanRedigere}
                  {...register(`punchedeHjelpemidler.${index}.hmsnummer` as const)}
                />
                <TextField
                  label="Antall"
                  hideLabel
                  type="number"
                  min={1}
                  size="small"
                  readOnly={!kanRedigere}
                  className={classes.antallInput}
                  {...register(`punchedeHjelpemidler.${index}.antall` as const, {
                    valueAsNumber: true,
                    min: 1,
                  })}
                />
                <Label size="small" className={classes.produktnavn}>
                  {isLoading ? 'Slår opp …' : (produkt?.artikkelnavn ?? 'Fant ikke produkt')}
                </Label>
                {kanRedigere && (
                  <Button
                    type="button"
                    variant="tertiary"
                    size="small"
                    icon={<TrashIcon aria-hidden="true" />}
                    onClick={() => remove(index)}
                  >
                    <BodyShort visuallyHidden>Fjern hjelpemiddel</BodyShort>
                  </Button>
                )}
              </HStack>
            )
          })}
        </VStack>
      )}
    </VStack>
  )
}
