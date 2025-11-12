import { Box, Heading, HStack, VStack } from '@navikt/ds-react'
import { Brødtekst } from '../../../../../felleskomponenter/typografi'
import { Innsenderbehovsmelding } from '../../../../../types/BehovsmeldingTypes'
import { Sak } from '../../../../../types/types.internal'
import { formaterTidsstempel } from '../../../../../utils/dato'
import { storForbokstavIAlleOrd } from '../../../../../utils/formater'
import { BrukerEksperiment } from './BrukerEksperiment'
import { FormidlerEksperiment } from './FormidlerEksperiment'
import SøknadEksperiment from './SøknadEksperiment'
import styles from './SøknadPanelEksperiment.module.css'

export function SøknadPanelEksperiment({ sak, behovsmelding }: { sak: Sak; behovsmelding: Innsenderbehovsmelding }) {
  return (
    <VStack gap="space-16" style={{ overflowY: 'auto', height: '100%' }}>
      <Box.New background="default" paddingBlock="0 space-48" borderRadius="large">
        <VStack gap="space-8">
          <VStack paddingBlock={'space-8 0'} paddingInline={'space-16 0'} gap="space-2">
            <Heading level="1" size="small" spacing={false}>
              Søknad om hjelpemidler
            </Heading>
            <HStack gap="space-20">
              <Brødtekst textColor="subtle">Mottatt: {formaterTidsstempel(sak.opprettet)}</Brødtekst>
              <Brødtekst textColor="subtle">
                Område:
                {storForbokstavIAlleOrd(behovsmelding.brukersituasjon.funksjonsnedsettelser.join(', '))}
              </Brødtekst>
            </HStack>
          </VStack>
        </VStack>

        <section className={styles.søknadContainer}>
          <SøknadEksperiment sak={sak} behovsmelding={behovsmelding} />
        </section>
        <section>
          <BrukerEksperiment
            bruker={sak.bruker}
            behovsmeldingsbruker={behovsmelding.bruker}
            brukerSituasjon={behovsmelding.brukersituasjon}
            levering={behovsmelding.levering}
            vilkår={behovsmelding.brukersituasjon.vilkår}
          />
          <FormidlerEksperiment levering={behovsmelding.levering} />
        </section>
      </Box.New>
    </VStack>
  )
}
