import { PlusCircleIcon } from '@navikt/aksel-icons'
import { Box, Button, Heading, HStack, Select, Tag, VStack } from '@navikt/ds-react'
import { memo } from 'react'
import { Skillelinje } from '../../../../../felleskomponenter/Strek'
import { Brødtekst } from '../../../../../felleskomponenter/typografi'
import { useOppgave } from '../../../../../oppgave/useOppgave'
import { Innsenderbehovsmelding } from '../../../../../types/BehovsmeldingTypes'
import { OppgaveStatusLabel, Sak } from '../../../../../types/types.internal'
import { formaterDato } from '../../../../../utils/dato'
import { storForbokstavIAlleOrd } from '../../../../../utils/formater'
import { useSaksbehandlingEksperimentContext } from '../SaksbehandlingEksperimentProvider'

interface BehandlingEksperimentPanelProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function BehandlingEksperimentPanel({ sak, behovsmelding }: BehandlingEksperimentPanelProps) {
  const hjelpemidler = behovsmelding.hjelpemidler.hjelpemidler
  const { setBrevKolonne } = useSaksbehandlingEksperimentContext()
  const { oppgave } = useOppgave()

  return (
    <Box.New
      background="default"
      borderRadius="large"
      padding={'space-16'}
      style={{ height: '100%', overflowY: 'auto' }}
    >
      <VStack gap="4">
        {hjelpemidler.length > 0 && (
          <Heading level="2" size="medium">
            Behandling
          </Heading>
        )}

        <Brødtekst data-tip="Saksnummer" data-for="sak" textColor="subtle">{`Sak: ${sak.sakId}`}</Brødtekst>
        {oppgave?.fristFerdigstillelse && (
          <Brødtekst textColor="subtle">Frist: {formaterDato(oppgave.fristFerdigstillelse)}</Brødtekst>
        )}
        <HStack gap="space-4">
          <Tag variant="info-moderate" size="small">
            {OppgaveStatusLabel.get(sak.saksstatus)}
          </Tag>
          <Brødtekst>av {storForbokstavIAlleOrd(sak.saksbehandler?.navn)}</Brødtekst>
        </HStack>
      </VStack>
      <Skillelinje />

      <Box.New>
        <VStack gap="4">
          <Heading size="small" level="2">
            Sett resultat
          </Heading>
          <div>
            <Select size="small" label="Velg resultat" style={{ width: 'auto' }}>
              <option value="godkjent">Innvilget</option>
              <option value="avslått">Avslått</option>
              <option value="mer informasjon nødvendig">Delvis innvilget</option>
            </Select>
          </div>
          <div>
            <Button variant="secondary" size="small" icon={<PlusCircleIcon />} onClick={() => setBrevKolonne(true)}>
              Åpne brepanelet
            </Button>
          </div>
        </VStack>
      </Box.New>
    </Box.New>
  )
}

export default memo(BehandlingEksperimentPanel)
