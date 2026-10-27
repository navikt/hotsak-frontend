import { Box, Label, Radio, RadioGroup, Select, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { ComboboxController } from '../felleskomponenter/skjema/ComboboxController.tsx'
import { useOppgaveMapper } from '../oppgave/useOppgave.ts'
import { useOppgavebehandlere } from '../oppgave/useOppgavebehandlere.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { type JournalføringV2SkjemaVerdier } from './journalføringTypes.ts'
import { TextContainer } from '../felleskomponenter/typografi.tsx'

interface TilordneOppgaveProps {
  tildeltEnhet: string
}

export function TilordneOppgave({ tildeltEnhet }: TilordneOppgaveProps) {
  const [medarbeiderSøk, setMedarbeiderSøk] = useState('')
  const { register, control } = useFormContext<JournalføringV2SkjemaVerdier>()
  const { behandlere } = useOppgavebehandlere()
  const mapper = useOppgaveMapper()
  const { gjeldendeEnhet, navn } = useInnloggetAnsatt()
  const medarbeiderOptions = behandlere.map((behandler) => ({ label: behandler.navn, value: behandler.id }))
  const søkeord = medarbeiderSøk.trim().toLocaleLowerCase('nb-NO').split(/\s+/)
  const filtrerteMedarbeidere =
    søkeord.length > 1
      ? medarbeiderOptions.filter((option) => {
          const navnedeler = option.label.toLocaleLowerCase('nb-NO').split(/\s+/)
          let nesteNavnedel = 0
          return søkeord.every((ord) => {
            const indeks = navnedeler.findIndex((navnedel, i) => i >= nesteNavnedel && navnedel.includes(ord))
            nesteNavnedel = indeks + 1
            return indeks !== -1
          })
        })
      : undefined

  return (
    <TextContainer>
      <VStack gap="space-20" paddingBlock="space-20 space-48">
        <VStack gap="space-4">
          <Label size="small">Tilordne oppgave</Label>

          <Controller
            name="tilordnetEnhet"
            control={control}
            render={({ field }) => (
              <RadioGroup
                legend="Tilordne oppgave"
                hideLegend
                size="small"
                value={field.value}
                onChange={field.onChange}
              >
                <Radio value="minOppgaveliste">
                  Min oppgaveliste: {gjeldendeEnhet.nummer} | {navn}
                </Radio>
                <Radio value="medarbeidersOppgaveliste">Medarbeider sin oppgaveliste</Radio>
                {field.value === 'medarbeidersOppgaveliste' && (
                  <Box paddingInline="space-32 space-0">
                    <ComboboxController
                      name="medarbeider"
                      control={control}
                      label="Medarbeider"
                      size="small"
                      options={medarbeiderOptions}
                      filteredOptions={filtrerteMedarbeidere}
                      onChange={setMedarbeiderSøk}
                    />
                  </Box>
                )}
                <Radio value="enhetensOppgaveliste">Min enhet: {tildeltEnhet}</Radio>
              </RadioGroup>
            )}
          />
        </VStack>

        <Select
          label="Legg i mappe (frivillig)"
          size="small"
          {...register('mappeId', { setValueAs: (value) => value || undefined })}
        >
          <option value="">Enhetens liste</option>
          {mapper.map((mappe) => (
            <option key={mappe.id} value={mappe.id.toString()}>
              {mappe.navn}
            </option>
          ))}
        </Select>
      </VStack>
    </TextContainer>
  )
}
