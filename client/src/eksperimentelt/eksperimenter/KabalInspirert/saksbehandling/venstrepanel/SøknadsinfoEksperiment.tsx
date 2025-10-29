import { HStack, Tag, VStack } from '@navikt/ds-react'
import { memo } from 'react'
import { Oppgaveetikett } from '../../../../../felleskomponenter/Oppgaveetikett'
import { Brødtekst, Mellomtittel } from '../../../../../felleskomponenter/typografi'
import { useOppgave } from '../../../../../oppgave/useOppgave'
import { lagKontaktpersonTekst } from '../../../../../saksbilde/bruker/Kontaktperson'
import { SakLoader } from '../../../../../saksbilde/SakLoader'
import { useBehovsmelding } from '../../../../../saksbilde/useBehovsmelding'
import { useSak } from '../../../../../saksbilde/useSak'
import { lagLeveringsmåteTekst } from '../../../../../saksbilde/venstremeny/LeveringCard'
import { VenstremenyCard } from '../../../../../saksbilde/venstremeny/VenstremenyCard'
import { OppgaveStatusLabel, Sakstype } from '../../../../../types/types.internal'
import { formaterDato, formaterTidsstempel } from '../../../../../utils/dato'
import {
  formaterAdresse,
  formaterNavn,
  formaterTelefonnummer,
  storForbokstavIAlleOrd,
} from '../../../../../utils/formater'

export const SøknadsinfoEksperiment = memo(() => {
  const { sak, isLoading: isSakLoading } = useSak()
  const { behovsmelding, isLoading: isBehovsmeldingLoading } = useBehovsmelding()
  const { oppgave } = useOppgave()

  // TODO: Teste ut suspense mode i swr
  if (isSakLoading || isBehovsmeldingLoading) {
    return <SakLoader />
  }

  if (!sak || !behovsmelding) return <div>Fant ikke sak</div>

  const erBestilling = sak.data.sakstype === Sakstype.BESTILLING
  const levering = behovsmelding.levering
  const formidler = levering.hjelpemiddelformidler
  const adresseBruker = formaterAdresse(behovsmelding.bruker.veiadresse)
  const [leveringsmåteLabel] = lagLeveringsmåteTekst(levering, adresseBruker)
  const kontaktpersonTekst = lagKontaktpersonTekst(levering)

  return (
    <VStack gap="space-16">
      <VenstremenyCard>
        <VStack gap="space-4">
          <HStack gap="space-8">
            <Oppgaveetikett type={sak.data.sakstype} />
            <Mellomtittel spacing={false}>
              {sak.data.sakstype === Sakstype.BESTILLING ? 'Bestilling' : 'Søknad'}
            </Mellomtittel>
            <Brødtekst data-tip="Saksnummer" data-for="sak" textColor="subtle">{`Sak: ${sak.data.sakId}`}</Brødtekst>
          </HStack>

          <HStack gap="space-16">
            <Brødtekst textColor="subtle">Mottatt: {formaterTidsstempel(sak.data.opprettet)}</Brødtekst>
            {oppgave?.fristFerdigstillelse && (
              <Brødtekst textColor="subtle">Frist: {formaterDato(oppgave.fristFerdigstillelse)}</Brødtekst>
            )}
          </HStack>

          <HStack gap="space-4">
            <Tag variant="info-moderate" size="small">
              {OppgaveStatusLabel.get(sak.data.status)}
            </Tag>
            <Brødtekst>av {storForbokstavIAlleOrd(sak.data.saksbehandler?.navn)}</Brødtekst>
          </HStack>
        </VStack>
      </VenstremenyCard>

      <VenstremenyCard heading={erBestilling ? 'Bestiller' : 'Formidler'} spacing={false}>
        <VStack>
          <Brødtekst textColor="subtle">{`${formaterNavn(formidler.navn)}`}</Brødtekst>
          <Brødtekst textColor="subtle">{`${storForbokstavIAlleOrd(formidler.stilling)} - ${storForbokstavIAlleOrd(formidler.adresse.poststed)}`}</Brødtekst>
          <Brødtekst textColor="subtle"> {formaterTelefonnummer(formidler.telefon)}</Brødtekst>
        </VStack>
      </VenstremenyCard>

      <VenstremenyCard heading="Levering" spacing={false}>
        <VStack>
          <Brødtekst textColor="subtle">
            {leveringsmåteLabel}: {formaterAdresse(behovsmelding.bruker.veiadresse)}
          </Brødtekst>
          {behovsmelding.levering.utleveringMerknad && (
            <HStack>
              <Brødtekst textColor="subtle">Beskjed til kommunen:</Brødtekst>
              <Brødtekst>{behovsmelding.levering.utleveringMerknad}</Brødtekst>
            </HStack>
          )}
          {kontaktpersonTekst && <Brødtekst textColor="subtle">Kontaktperson: {kontaktpersonTekst}</Brødtekst>}
        </VStack>
      </VenstremenyCard>
    </VStack>
  )
})
