import { Box, HStack, VStack } from '@navikt/ds-react'
import { CompactExpandableCard } from '../../felleskomponenter/panel/CompactExpandableCard.tsx'
import { PanelTittel } from '../../felleskomponenter/panel/PanelTittel.tsx'
import { ScrollablePanel } from '../../felleskomponenter/ScrollablePanel.tsx'
import { Tekst } from '../../felleskomponenter/typografi.tsx'
import { Hast } from '../../saksbilde/hjelpemidler/Hast.tsx'
import { Innsenderbehovsmelding } from '../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../types/types.internal.ts'
import { formaterTidsstempel } from '../../utils/dato.ts'
import { storForbokstavIAlleOrd } from '../../utils/formater.ts'
import { FunksjonsbeskrivelseV2 } from './behovsmelding/FunksjonsbeksrivelseV2.tsx'
import Hjelpemidler from './behovsmelding/Hjelpemidler.tsx'
import { SignaturV2 } from './behovsmelding/signatur/SignaturV2.tsx'
import { VilkårV2 } from './behovsmelding/VilkårV2.tsx'
import classes from './BehovsmeldingsPanel.module.css'
import { useClosePanel } from './paneler/usePanelHooks.ts'

export function BehovsmeldingsPanel({ sak, behovsmelding }: { sak: Sak; behovsmelding: Innsenderbehovsmelding }) {
  const lukkPanel = useClosePanel('behovsmeldingspanel')
  const funksjonsbeskrivelse = behovsmelding.brukersituasjon.funksjonsbeskrivelse

  return (
    <Box
      background="default"
      paddingBlock="space-0 space-36"
      paddingInline="space-12 space-0"
      style={{ height: '100%' }}
    >
      <PanelTittel tittel="Søknad om hjelpemidler" lukkPanel={lukkPanel} />
      <ScrollablePanel paddingInline="space-0 space-4" paddingBlock="space-0 space-24">
        <HStack gap="space-20">
          <Tekst textColor="subtle">Mottatt: {formaterTidsstempel(sak.opprettet)}</Tekst>
          <Tekst textColor="subtle" spacing>
            Område: {storForbokstavIAlleOrd(behovsmelding.brukersituasjon.funksjonsnedsettelser.join(', '))}
          </Tekst>
        </HStack>

        <VStack gap="space-16" paddingInline="space-4">
          {behovsmelding.levering.hast && <Hast hast={behovsmelding.levering.hast} />}
          <section className={classes.panel}>
            <CompactExpandableCard tittel="Om brukeren">
              <FunksjonsbeskrivelseV2 funksjonsbeskrivelse={funksjonsbeskrivelse} skjulHeading={true} />
            </CompactExpandableCard>
          </section>
          <section className={classes.søknadContainer}>
            <Hjelpemidler sak={sak} behovsmelding={behovsmelding} />
          </section>

          <section className={classes.panel}>
            <CompactExpandableCard tittel="Formidler har vurdert at disse vilkårene er oppfylt " defaultOpen={false}>
              <VilkårV2 vilkår={behovsmelding.brukersituasjon.vilkår} />
            </CompactExpandableCard>
          </section>
          <section className={classes.panel}>
            <CompactExpandableCard tittel="Signatur" defaultOpen={false}>
              <SignaturV2 bruker={sak.bruker} signaturType={behovsmelding.bruker.signaturtype} />
            </CompactExpandableCard>
          </section>
        </VStack>
      </ScrollablePanel>
    </Box>
  )
}
