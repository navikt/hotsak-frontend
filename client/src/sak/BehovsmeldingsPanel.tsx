import { Box, HStack, VStack } from '@navikt/ds-react'
import { Oppgaveetikett } from '../felleskomponenter/Oppgaveetikett.tsx'
import { CompactExpandableCard } from '../felleskomponenter/panel/CompactExpandableCard.tsx'
import { PanelTittel } from '../felleskomponenter/panel/PanelTittel.tsx'
import { ScrollablePanel } from '../felleskomponenter/ScrollablePanel.tsx'
import { Tekst } from '../felleskomponenter/typografi.tsx'
import { Hast } from '../saksbilde/hjelpemidler/Hast.tsx'
import { Varsler } from '../saksbilde/hjelpemidler/Varsel.tsx'
import { Innsenderbehovsmelding } from '../types/BehovsmeldingTypes.ts'
import { Sak } from '../types/types.internal.ts'
import { formaterTidsstempel } from '../utils/dato.ts'
import { storForbokstavIAlleOrd } from '../utils/formater.ts'
import { Funksjonsbeskrivelse } from './behovsmelding/Funksjonsbeksrivelse.tsx'
import Hjelpemidler from './behovsmelding/Hjelpemidler.tsx'
import { Pengestøtte } from './behovsmelding/pengestøtte/Pengestøtte.tsx'
import { Signatur } from './behovsmelding/signatur/Signatur.tsx'
import { Vilkår } from './behovsmelding/Vilkår.tsx'
import classes from './BehovsmeldingsPanel.module.css'
import { useClosePanel } from './paneler/usePanelHooks.ts'

export function BehovsmeldingsPanel({ sak, behovsmelding }: { sak: Sak; behovsmelding: Innsenderbehovsmelding }) {
  const lukkPanel = useClosePanel('behovsmeldingspanel')
  const funksjonsbeskrivelse = behovsmelding.brukersituasjon.funksjonsbeskrivelse
  const sakstype = sak.sakstype
  const harHjelpemidler =
    behovsmelding.hjelpemidler.hjelpemidler.length + behovsmelding.hjelpemidler.tilbehør.length > 0

  return (
    <Box
      background="default"
      paddingBlock="space-0 space-36"
      paddingInline="space-12 space-0"
      className={classes.container}
    >
      <PanelTittel icon={<Oppgaveetikett type={sakstype} />} tittel={sak.søknadGjelder} lukkPanel={lukkPanel} />
      <ScrollablePanel paddingInline="space-0 space-4" paddingBlock="space-4 space-24" aria-label="Behovsmeldingspanel">
        <HStack gap="space-20">
          <Tekst textColor="subtle">Mottatt: {formaterTidsstempel(sak.opprettet)}</Tekst>
          <Tekst textColor="subtle" spacing>
            Område: {storForbokstavIAlleOrd(behovsmelding.brukersituasjon.funksjonsnedsettelser.join(', '))}
          </Tekst>
        </HStack>

        <VStack gap="space-16" paddingInline="space-4">
          {behovsmelding?.levering?.hast && <Hast hast={behovsmelding.levering.hast} />}
          {behovsmelding.saksbehandlingvarsel.length > 0 && <Varsler varsler={behovsmelding.saksbehandlingvarsel} />}
          <section className={classes.panel}>
            <Funksjonsbeskrivelse funksjonsbeskrivelse={funksjonsbeskrivelse} />
          </section>
          {harHjelpemidler && (
            <section className={classes.søknadContainer}>
              <Hjelpemidler sak={sak} behovsmelding={behovsmelding} />
            </section>
          )}
          <Pengestøtte sakId={sak.sakId} behovsmelding={behovsmelding} />

          <section className={classes.panel}>
            <CompactExpandableCard tittel="Formidler har vurdert at disse vilkårene er oppfylt " defaultOpen={false}>
              <Vilkår vilkår={behovsmelding.brukersituasjon.vilkår} />
            </CompactExpandableCard>
          </section>
          <section className={classes.panel}>
            <CompactExpandableCard tittel="Signatur" defaultOpen={false}>
              <Signatur bruker={sak.bruker} signaturType={behovsmelding.bruker.signaturtype} />
            </CompactExpandableCard>
          </section>
        </VStack>
      </ScrollablePanel>
    </Box>
  )
}
