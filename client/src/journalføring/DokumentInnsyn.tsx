import { Checkbox, CheckboxGroup, Heading, HelpText, HStack, InlineMessage, Link, VStack } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'

import { SelectController } from '../felleskomponenter/skjema/SelectController.tsx'
import { TextContainer } from '../felleskomponenter/typografi.tsx'
import { OverstyrInnsynsregler, type JournalføringV2SkjemaVerdier } from './journalføringTypes.ts'
import classes from './DokumentInnsyn.module.css'

export function DokumentInnsyn({ readOnly }: { readOnly: boolean }) {
  const { control, watch, getValues, setValue } = useFormContext<JournalføringV2SkjemaVerdier>()
  const dokumenterKontrollert = watch('dokumenterKontrollert')

  return (
    <VStack gap="space-20" paddingBlock="space-4 space-12">
      <VStack gap="space-4">
        <HStack gap="space-4" align="center">
          <Heading level="3" size="xsmall">
            Kontrollerer dokumentene
          </Heading>
          <HelpText title="Hjelp til kontroll av dokumentene">
            Du må alltid kontrollere at dokumentene ligger på riktig bruker og at det ikke ligger opplysninger om andre
            brukere der. Dersom du ikke kan bekrefte dette må du overføre saken til Gosys og følge rutinen for
            håndtering av avvik
          </HelpText>
        </HStack>

        <Controller
          control={control}
          name="dokumenterKontrollert"
          rules={{
            validate: (verdi) =>
              verdi ||
              'Dersom dokumentene er feilsendt må du overføre saken til Gosys og følge rutinen for håndtering av avvik',
          }}
          render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
            <TextContainer>
              <CheckboxGroup
                size="small"
                legend="Bekreft kontroll av dokumentene"
                hideLegend
                readOnly={readOnly}
                error={fieldState.error?.message}
                value={value ? ['kontrollert'] : []}
                onChange={(verdier: string[]) => {
                  const kontrollert = verdier.includes('kontrollert')
                  onChange(kontrollert)
                  if (kontrollert && !getValues('overstyrInnsynsregler')) {
                    setValue('overstyrInnsynsregler', OverstyrInnsynsregler.VISES_MANUELT_GODKJENT, {
                      shouldValidate: true,
                    })
                  }
                }}
              >
                <Checkbox ref={ref} value="kontrollert" onBlur={onBlur}>
                  Dokumentene ligger på riktig bruker og det ligger ingen dokumentasjon om andre brukere der
                </Checkbox>
              </CheckboxGroup>
            </TextContainer>
          )}
        />
      </VStack>

      <TextContainer>
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
          rules={{ required: 'Du må velge om bruker skal ha innsyn i dokumentene' }}
        >
          <option value="">Velg</option>
          <option value={OverstyrInnsynsregler.VISES_MANUELT_GODKJENT}>Bruker kan se dokumentene på nav.no</option>
          <option value={OverstyrInnsynsregler.SKJULES_FEILSENDT}>Skjules fordi dokumentet er feilsendt</option>
          <option value={OverstyrInnsynsregler.SKJULES_BRUKERS_ONSKE}>Skjules etter brukers ønske</option>
        </SelectController>
      </TextContainer>

      {dokumenterKontrollert && (
        <TextContainer>
          <InlineMessage status="info" size="small">
            Foreslått fordi du bekreftet at dokumentene gjelder riktig bruker og ikke inneholder dokumentasjon om andre
            brukere.
          </InlineMessage>
        </TextContainer>
      )}
    </VStack>
  )
}
