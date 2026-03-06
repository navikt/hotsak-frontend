import { Box, HStack, VStack } from '@navikt/ds-react'
import { CompactExpandableCard } from '../../felleskomponenter/panel/CompactExpandableCard.tsx'
import { PanelTittel } from '../../felleskomponenter/panel/PanelTittel.tsx'
import { ScrollablePanel } from '../../felleskomponenter/ScrollablePanel.tsx'
import { Skillelinje } from '../../felleskomponenter/Strek.tsx'
import { Tekst } from '../../felleskomponenter/typografi.tsx'
import { Leveringinfo } from '../../saksbilde/bruker/Leveringinfo.tsx'
import { Innsenderbehovsmelding } from '../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../types/types.internal.ts'
import { formaterTidsstempel } from '../../utils/dato.ts'
import { storForbokstavIAlleOrd } from '../../utils/formater.ts'
import { BrukerV2 } from './behovsmelding/BrukerV2.tsx'
import { FormidlerV2, OppfølgingsansvarligV2 } from './behovsmelding/FormidlerV2.tsx'
import { FunksjonsbeskrivelseV2 } from './behovsmelding/FunksjonsbeksrivelseV2.tsx'
import Hjelpemidler from './behovsmelding/Hjelpemidler.tsx'
import { SignaturV2 } from './behovsmelding/signatur/SignaturV2.tsx'
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
      <ScrollablePanel paddingInline="space-0 space-4">
        <HStack gap="space-20">
          <Tekst textColor="subtle">Mottatt: {formaterTidsstempel(sak.opprettet)}</Tekst>
          <Tekst textColor="subtle">
            Område: {storForbokstavIAlleOrd(behovsmelding.brukersituasjon.funksjonsnedsettelser.join(', '))}
          </Tekst>
        </HStack>

        <VStack gap="space-16" paddingInline="space-4">
          <section className={classes.søknadContainer}>
            <Hjelpemidler sak={sak} behovsmelding={behovsmelding} />
          </section>

          <section>
            <CompactExpandableCard tittel="Bruker">
              {funksjonsbeskrivelse && (
                <>
                  <FunksjonsbeskrivelseV2 funksjonsbeskrivelse={funksjonsbeskrivelse} skjulHeading={true} />
                  <Skillelinje />
                </>
              )}
              <BrukerV2
                bruker={sak.bruker}
                behovsmeldingsbruker={behovsmelding.bruker}
                brukerSituasjon={behovsmelding.brukersituasjon}
                vilkår={behovsmelding.brukersituasjon.vilkår}
                skjulHeading={true}
              />
            </CompactExpandableCard>
          </section>

          <section>
            <CompactExpandableCard tittel="Levering">
              <Leveringinfo behovsmeldingsbruker={behovsmelding.bruker} levering={behovsmelding.levering} />
            </CompactExpandableCard>
          </section>
          <section>
            <CompactExpandableCard tittel="Formidler">
              <FormidlerV2 levering={behovsmelding.levering} />
            </CompactExpandableCard>
          </section>
          <section>
            <CompactExpandableCard tittel="Oppfølgings- og opplæringsansvarlig">
              <OppfølgingsansvarligV2 levering={behovsmelding.levering} />
            </CompactExpandableCard>
          </section>
          <section>
            <CompactExpandableCard tittel="Signatur">
              <SignaturV2 bruker={sak.bruker} signaturType={behovsmelding.bruker.signaturtype} />
            </CompactExpandableCard>
          </section>
        </VStack>
      </ScrollablePanel>
    </Box>
  )
}
