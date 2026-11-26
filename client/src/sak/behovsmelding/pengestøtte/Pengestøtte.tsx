import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons'
import { Box, InfoCard, InlineMessage, Label, LocalAlert, VStack } from '@navikt/ds-react'

import { CompactExpandableCard } from '../../../felleskomponenter/panel/CompactExpandableCard.tsx'
import { Skillelinje } from '../../../felleskomponenter/Strek.tsx'
import { Tekst } from '../../../felleskomponenter/typografi.tsx'
import { useKontonummer } from '../../../saksbilde/useKontonummer.ts'
import { type Innsenderbehovsmelding } from '../../../types/BehovsmeldingTypes.ts'
import { formaterFødselsnummer, formaterKontonummer } from '../../../utils/formater.ts'
import classes from '../../BehovsmeldingsPanel.module.css'
import { utledPengestøtte } from './pengestøtte.ts'

export function Pengestøtte({ sakId, behovsmelding }: { sakId: string; behovsmelding: Innsenderbehovsmelding }) {
  const pengestøtte = utledPengestøtte(behovsmelding)
  if (!pengestøtte) return null
  const { kategorinavn, utbetalesTil, mottaker } = pengestøtte

  return (
    <section className={classes.panel}>
      <CompactExpandableCard tittel="Pengestøtte">
        <Box paddingInline="space-12 space-8" paddingBlock="space-8">
          <VStack gap="space-16">
            <div>
              <Label size="small" as="h3">
                {kategorinavn}
              </Label>
              <Skillelinje />
            </div>
            <VStack gap="space-4">
              <Label size="small" as="h4" textColor="subtle">
                Hvem skal tilskuddet utbetales til?
              </Label>
              <Tekst>{utbetalesTil ?? '-'}</Tekst>
            </VStack>
            <VStack gap="space-4">
              <Label size="small" as="h4" textColor="subtle">
                Informasjon om den som skal motta utbetalingen
              </Label>
              <Label size="small" as="h5">
                Navn
              </Label>
              <Tekst>{mottaker.navn}</Tekst>
              <Label size="small" as="h5">
                Fødselsnummer
              </Label>
              <Tekst>{formaterFødselsnummer(mottaker.fnr)}</Tekst>
            </VStack>
            <Kontonummer sakId={sakId} navn={mottaker.navn} fnr={mottaker.fnr} />
          </VStack>
        </Box>
      </CompactExpandableCard>
    </section>
  )
}

function Kontonummer({ sakId, navn, fnr }: { sakId: string; navn: string; fnr: string }) {
  const { data, error, manglerKontonummer } = useKontonummer(sakId, fnr)

  if (error) {
    return (
      <LocalAlert status="error" size="small">
        <LocalAlert.Header>
          <LocalAlert.Title>Kunne ikke hente kontonummer</LocalAlert.Title>
        </LocalAlert.Header>
        <LocalAlert.Content>
          Det oppstod en feil ved henting av kontonummer til {navn}. Prøv igjen om noen minutter. Hvis problemet ikke
          løser seg, kontakt DigiHoT.
        </LocalAlert.Content>
      </LocalAlert>
    )
  }

  if (manglerKontonummer) {
    return (
      <InfoCard data-color="danger" size="small">
        <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
          <InfoCard.Title>Mangler kontonummer</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>
          Vi fant ikke kontonummer til {navn}. Kontakt personen og be dem legge inn kontonummer hos Nav.
        </InfoCard.Content>
      </InfoCard>
    )
  }

  if (data?.kontonummer) {
    return (
      <InlineMessage status="success" size="small">
        Vi har kontonummeret til {navn}, og utbetaler til {formaterKontonummer(data.kontonummer)}
      </InlineMessage>
    )
  }

  return null
}
