import { Box, Label, Radio, RadioGroup, Select, VStack } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'

import { useOppgaveMapper } from '../oppgave/useOppgave.ts'
import { useOppgavebehandlere } from '../oppgave/useOppgavebehandlere.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { type JournalføringV2SkjemaVerdier } from './journalføringTypes.ts'
import { TextContainer } from '../felleskomponenter/typografi.tsx'

interface TilordneOppgaveProps {
  tildeltEnhet: string
}

export function TilordneOppgave({ tildeltEnhet }: TilordneOppgaveProps) {
  const { register, control } = useFormContext<JournalføringV2SkjemaVerdier>()
  const { behandlere } = useOppgavebehandlere()
  const mapper = useOppgaveMapper()
  const { gjeldendeEnhet, navn } = useInnloggetAnsatt()

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
                    <Select label="Medarbeider" size="small" {...register('medarbeider')}>
                      <option value="">Velg medarbeider</option>
                      {behandlere.map((behandler) => (
                        <option key={behandler.id} value={behandler.id}>
                          {behandler.navn}
                        </option>
                      ))}
                    </Select>
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
