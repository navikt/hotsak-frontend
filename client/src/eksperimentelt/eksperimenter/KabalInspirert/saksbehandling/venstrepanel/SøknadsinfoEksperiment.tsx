import { HStack, VStack } from '@navikt/ds-react'
import { memo } from 'react'
import { Brødtekst } from '../../../../../felleskomponenter/typografi'
import { lagKontaktpersonTekst } from '../../../../../saksbilde/bruker/Kontaktperson'
import { SakLoader } from '../../../../../saksbilde/SakLoader'
import { useBehovsmelding } from '../../../../../saksbilde/useBehovsmelding'
import { useSak } from '../../../../../saksbilde/useSak'
import { lagLeveringsmåteTekst } from '../../../../../saksbilde/venstremeny/LeveringCard'
import { VenstremenyCard } from '../../../../../saksbilde/venstremeny/VenstremenyCard'
import { formaterAdresse } from '../../../../../utils/formater'

export const SøknadsinfoEksperiment = memo(() => {
  const { sak, isLoading: isSakLoading } = useSak()
  const { behovsmelding, isLoading: isBehovsmeldingLoading } = useBehovsmelding()

  // TODO: Teste ut suspense mode i swr
  if (isSakLoading || isBehovsmeldingLoading) {
    return <SakLoader />
  }

  if (!sak || !behovsmelding) return <div>Fant ikke sak</div>

  const levering = behovsmelding.levering
  const adresseBruker = formaterAdresse(behovsmelding.bruker.veiadresse)
  const leveringsmåte = lagLeveringsmåteTekst(levering, adresseBruker)
  const kontaktpersonTekst = lagKontaktpersonTekst(levering)

  return (
    <VStack gap="space-16">
      <VenstremenyCard heading="Levering" spacing={false}>
        <VStack>
          <Brødtekst textColor="subtle">
            {leveringsmåte.label}: {formaterAdresse(behovsmelding.bruker.veiadresse)}
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
