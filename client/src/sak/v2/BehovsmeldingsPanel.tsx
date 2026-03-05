import { Box, HStack, VStack } from '@navikt/ds-react'
import { PanelTittel } from '../../felleskomponenter/panel/PanelTittel.tsx'
import { ScrollablePanel } from '../../felleskomponenter/ScrollablePanel.tsx'
import { Tekst } from '../../felleskomponenter/typografi.tsx'
import { Bruker } from '../../saksbilde/bruker/Bruker.tsx'
import { Formidler } from '../../saksbilde/formidler/Formidler.tsx'
import { Innsenderbehovsmelding } from '../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../types/types.internal.ts'
import { formaterTidsstempel } from '../../utils/dato.ts'
import { storForbokstavIAlleOrd } from '../../utils/formater.ts'
import classes from './BehovsmeldingsPanel.module.css'
import { useClosePanel } from './paneler/usePanelHooks.ts'
import { BrukersFunksjon } from '../../saksbilde/hjelpemidler/BrukersFunksjon.tsx'
import { CollapsiblePanel } from '../../felleskomponenter/panel/CollapsiblePanel.tsx'
import { Leveringinfo } from '../../saksbilde/bruker/Leveringinfo.tsx'
import { Signatur } from '../../saksbilde/bruker/Signatur.tsx'
import HjelpemidlerBoxTest from './behovsmelding/HjelpemidlerBoxTest.tsx'

export function BehovsmeldingsPanel({ sak, behovsmelding }: { sak: Sak; behovsmelding: Innsenderbehovsmelding }) {
  const lukkPanel = useClosePanel('behovsmeldingspanel')
  const funksjonsbeskrivelse = behovsmelding.brukersituasjon.funksjonsbeskrivelse

  return (
    <Box
      background="default"
      paddingBlock="space-0 space-36"
      paddingInline="space-16 space-0"
      style={{ height: '100%' }}
    >
      <PanelTittel tittel="Søknad om hjelpemidler" lukkPanel={lukkPanel} />
      <ScrollablePanel paddingInline="space-0 space-4">
        <HStack gap="space-20">
          <Tekst textColor="subtle">Mottatt: {formaterTidsstempel(sak.opprettet)}</Tekst>
          <Tekst textColor="subtle">
            Område: {storForbokstavIAlleOrd(behovsmelding.brukersituasjon.funksjonsnedsettelser.join(', '))}
          </Tekst>
        </HStack>

        <VStack gap="space-16">
          <section className={classes.søknadContainer}>
            <HjelpemidlerBoxTest sak={sak} behovsmelding={behovsmelding} />
          </section>

          <section>
            {funksjonsbeskrivelse && (
              <CollapsiblePanel label="FUNKSJONSBESKRIVELSE">
                <BrukersFunksjon funksjonsbeskrivelse={funksjonsbeskrivelse} skjulHeading={true} />
              </CollapsiblePanel>
            )}
          </section>
          <section>
            <CollapsiblePanel label="HJELPEMIDDELBRUKER">
              <Bruker
                bruker={sak.bruker}
                behovsmeldingsbruker={behovsmelding.bruker}
                brukerSituasjon={behovsmelding.brukersituasjon}
                levering={behovsmelding.levering}
                vilkår={behovsmelding.brukersituasjon.vilkår}
                skjulHeading={true}
              />
            </CollapsiblePanel>
          </section>
          <section>
            <CollapsiblePanel label="LEVERING">
              <Leveringinfo behovsmeldingsbruker={behovsmelding.bruker} levering={behovsmelding.levering} />
            </CollapsiblePanel>
          </section>
          <section>
            <CollapsiblePanel label="FORMIDLER">
              <Formidler levering={behovsmelding.levering} skjulHeading={true} />
            </CollapsiblePanel>
          </section>
          <section>
            <CollapsiblePanel label="SIGNATUR">
              <Signatur bruker={sak.bruker} signaturType={behovsmelding.bruker.signaturtype} />
            </CollapsiblePanel>
          </section>
        </VStack>
      </ScrollablePanel>
    </Box>
  )
}
