import { Box, HelpText, HStack, InlineMessage, Link, LocalAlert, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { type ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { SelectController } from '../felleskomponenter/skjema/SelectController.tsx'
import { TextContainer } from '../felleskomponenter/typografi.tsx'
import classes from './DokumentInnsyn.module.css'
import {
  type Dokumentavvik,
  type Dokumentkontroll,
  type JournalføringSkjemaVerdier,
  OverstyrInnsynsregler,
} from './journalføringTypes.ts'

export function DokumentInnsyn({ readOnly }: { readOnly: boolean }) {
  const { control, watch, getValues, setValue } = useFormContext<JournalføringSkjemaVerdier>()
  const dokumentkontroll = watch('dokumentkontroll')
  const dokumentavvik = watch('dokumentavvik')
  const innsyn = watch('overstyrInnsynsregler')
  const erOverføring = dokumentkontroll === 'nei' && dokumentavvik === 'overføring'

  function foreslåInnsyn(forslag: OverstyrInnsynsregler) {
    setValue('overstyrInnsynsregler', forslag, { shouldValidate: true })
  }

  return (
    <VStack gap="space-12" paddingBlock="space-4 space-12">
      <VStack gap="space-4">
        <Controller
          control={control}
          name="dokumentkontroll"
          rules={{ required: 'Du må svare på om du kan bekrefte at dokumentene ligger på riktig bruker' }}
          render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
            <TextContainer>
              <RadioGroup
                size="small"
                legend="Kan du bekrefte at dokumentene ligger på riktig bruker og at det ikke ligger dokumentasjon om andre brukere der?"
                readOnly={readOnly}
                error={fieldState.error?.message}
                value={value}
                onChange={(verdi: Dokumentkontroll) => {
                  onChange(verdi)
                  const gjeldendeInnsyn = getValues('overstyrInnsynsregler')
                  if (verdi === 'ja') {
                    setValue('dokumentavvik', '')
                    if (!gjeldendeInnsyn || gjeldendeInnsyn === OverstyrInnsynsregler.BRUK_STANDARDREGLER) {
                      foreslåInnsyn(OverstyrInnsynsregler.VISES_MANUELT_GODKJENT)
                    }
                  } else if (verdi === 'nei' && getValues('dokumentavvik') === 'overføring') {
                    foreslåInnsyn(OverstyrInnsynsregler.BRUK_STANDARDREGLER)
                  }
                }}
              >
                <Radio ref={ref} value="ja" onBlur={onBlur}>
                  Ja
                </Radio>
                <Radio value="nei" onBlur={onBlur}>
                  Nei - dokumentene inneholder informasjon om andre brukere
                </Radio>
              </RadioGroup>
            </TextContainer>
          )}
        />
      </VStack>

      {dokumentkontroll === 'nei' && (
        <BlåBoks>
          <VStack gap="space-12">
            <Controller
              control={control}
              name="dokumentavvik"
              rules={{
                required: 'Du må velge hva det gjelder',
                // LocalAlert forklarer hvorfor skjemaet ikke kan sendes
                validate: (verdi) => verdi !== 'annet',
              }}
              render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
                <RadioGroup
                  size="small"
                  legend="Hva gjelder det"
                  readOnly={readOnly}
                  error={fieldState.error?.message}
                  value={value}
                  onChange={(verdi: Dokumentavvik) => {
                    onChange(verdi)
                    if (verdi === 'overføring') foreslåInnsyn(OverstyrInnsynsregler.BRUK_STANDARDREGLER)
                  }}
                >
                  <Radio ref={value === 'annet' ? undefined : ref} value="overføring" onBlur={onBlur}>
                    Overføring av hjelpemiddel fra en bruker til en annen
                  </Radio>
                  <Radio ref={value === 'annet' ? ref : undefined} value="annet" onBlur={onBlur}>
                    Dokumentene er registrert på feil bruker eller inneholder informasjon om andre brukere – men gjelder
                    ikke overføring
                  </Radio>
                </RadioGroup>
              )}
            />
            {dokumentavvik === 'annet' && (
              <LocalAlert status="warning" size="small">
                <LocalAlert.Header>
                  <LocalAlert.Title as="h4">Du må overføre saken til Gosys</LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>
                  Hvis dokumentene er registrert på feil bruker eller inneholder informasjon om andre brukere som ikke
                  er relevante for saken, må du overføre saken til Gosys og følge rutinen for håndtering av avvik.
                </LocalAlert.Content>
              </LocalAlert>
            )}
          </VStack>
        </BlåBoks>
      )}

      {(dokumentkontroll === 'ja' || erOverføring) && (
        <BlåBoks>
          <VStack gap="space-12">
            <SelectController
              control={control}
              name="overstyrInnsynsregler"
              className={classes.innsynSelect}
              label={
                <HStack gap="space-4" align="center">
                  Skal bruker ha innsyn i dokumentene på nav.no?
                  <HelpText>
                    Som hovedregel har brukeren rett til innsyn i dokumentene i sin egen sak. Vurder om dokumentet skal
                    vises på nav.no etter{' '}
                    <Link
                      href="https://navno.sharepoint.com/sites/intranett-arkiv-og-dokumenthandtering/SitePages/Endre-visningen-av-dokumenter-til-bruker-p%C3%A5-nav.no.aspx"
                      target="_blank"
                    >
                      gjeldende rutine.
                    </Link>
                  </HelpText>
                </HStack>
              }
              size="small"
              readOnly={readOnly}
              rules={{
                required: 'Du må velge om bruker skal ha innsyn i dokumentene',
                // Leser skjemaverdiene, ikke render-tilstanden, som er utdatert når valget endres
                validate: (verdi, skjema) =>
                  skjema.dokumentkontroll !== 'nei' ||
                  skjema.dokumentavvik !== 'overføring' ||
                  verdi !== OverstyrInnsynsregler.VISES_MANUELT_GODKJENT ||
                  'Hvis dokumentet inneholder informasjon om andre brukere, skal dokumentet skjules for bruker',
              }}
            >
              <option value="">Velg</option>
              <option value={OverstyrInnsynsregler.VISES_MANUELT_GODKJENT}>Bruker kan se dokumentene på nav.no</option>
              <option value={OverstyrInnsynsregler.SKJULES_BRUKERS_ONSKE}>Skjules etter brukers ønske</option>
              {erOverføring && (
                <option value={OverstyrInnsynsregler.BRUK_STANDARDREGLER}>Innhold i dokumentet skjules</option>
              )}
            </SelectController>
            {dokumentkontroll === 'ja' && (
              <InlineMessage status="info" size="small">
                Foreslått fordi du bekreftet at dokumentene gjelder riktig bruker og ikke inneholder dokumentasjon om
                andre brukere.
              </InlineMessage>
            )}
            {erOverføring && innsyn === OverstyrInnsynsregler.BRUK_STANDARDREGLER && (
              <InlineMessage status="info" size="small">
                Foreslått fordi du bekreftet at dokumentene gjelder overføring. Bruker kan se dokumenttittelen, men kan
                ikke åpne dokumentet.
              </InlineMessage>
            )}
          </VStack>
        </BlåBoks>
      )}
    </VStack>
  )
}

function BlåBoks({ children }: { children: ReactNode }) {
  return (
    <TextContainer>
      <Box borderRadius="12" borderWidth="1" borderColor="neutral-subtle" padding="space-12" background="accent-soft">
        {children}
      </Box>
    </TextContainer>
  )
}
