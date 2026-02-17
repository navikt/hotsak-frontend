import { Box, HStack, VStack } from '@navikt/ds-react'
import { PanelTittel } from '../../felleskomponenter/panel/PanelTittel.tsx'
import { Tekst } from '../../felleskomponenter/typografi.tsx'
import { Bruker } from '../../saksbilde/bruker/Bruker.tsx'
import { Formidler } from '../../saksbilde/formidler/Formidler.tsx'
import { Innsenderbehovsmelding } from '../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../types/types.internal.ts'
import { formaterTidsstempel } from '../../utils/dato.ts'
import { storForbokstavIAlleOrd } from '../../utils/formater.ts'
import Hjelpemidler from './behovsmelding/Hjelpemidler.tsx'
import classes from './BehovsmeldingsPanel.module.css'
import { useSakContext } from './SakProvider.tsx'
import { ScrollablePanel } from '../../felleskomponenter/ScrollablePanel.tsx'

export function BehovsmeldingsPanel({ sak, behovsmelding }: { sak: Sak; behovsmelding: Innsenderbehovsmelding }) {
  const { setSøknadPanel } = useSakContext()
  return (
    <Box.New background="default" paddingBlock="0 space-48" style={{ height: '100%' }}>
      <PanelTittel
        tittel="Søknad om hjelpemidler"
        lukkPanel={() => {
          setSøknadPanel(false)
        }}
      />
      <ScrollablePanel paddingInline={'space-16'}>
        <HStack gap="space-20">
          <Tekst textColor="subtle">Mottatt: {formaterTidsstempel(sak.opprettet)}</Tekst>
          <Tekst textColor="subtle">
            Område:
            {storForbokstavIAlleOrd(behovsmelding.brukersituasjon.funksjonsnedsettelser.join(', '))}
          </Tekst>
        </HStack>

        <section className={classes.søknadContainer}>
          <Hjelpemidler sak={sak} behovsmelding={behovsmelding} />
        </section>
        <section>
          <Box.New paddingBlock="space-24 0" paddingInline="space-28 0">
            <Bruker
              bruker={sak.bruker}
              behovsmeldingsbruker={behovsmelding.bruker}
              brukerSituasjon={behovsmelding.brukersituasjon}
              levering={behovsmelding.levering}
              vilkår={behovsmelding.brukersituasjon.vilkår}
            />
          </Box.New>
          <Formidler levering={behovsmelding.levering} />
        </section>
      </ScrollablePanel>
    </Box.New>
  )
}
