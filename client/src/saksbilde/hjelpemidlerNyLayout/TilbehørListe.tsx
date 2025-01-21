import { HStack, List, VStack } from '@navikt/ds-react'
import { FritakFraBegrunnelseÅrsak, Tilbehør as Tilbehørtype } from '../../types/BehovsmeldingTypes'
import { HjelpemiddelGrid } from './HjelpemiddelGrid'
import { BrytbarBrødtekst, Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'
import { storForbokstavIOrd } from '../../utils/formater'
import { ListItem } from '@navikt/ds-react/List'

export function TilbehørListe({ tilbehør }: { tilbehør: Tilbehørtype[] }) {
  return tilbehør.map((t, idx) => (
    <HjelpemiddelGrid key={idx}>
      <div style={{ paddingTop: 5 }}>{t.antall} stk</div>
      <VStack gap="1">
        <HStack gap="1" align="center">
          <Tekst weight="semibold">{t.hmsArtNr}</Tekst>
          <Kopiknapp tooltip="Kopier hmsnr" copyText={t.hmsArtNr} />
          <BrytbarBrødtekst>{t.navn}</BrytbarBrødtekst>
        </HStack>
        {t.begrunnelse && (
          <>
            <Etikett>Begrunnelse</Etikett>
            <Brødtekst>{t.begrunnelse}</Brødtekst>
          </>
        )}
        {(t.fritakFraBegrunnelseÅrsak === FritakFraBegrunnelseÅrsak.ER_PÅ_BESTILLINGSORDNING ||
          t.fritakFraBegrunnelseÅrsak === FritakFraBegrunnelseÅrsak.ER_SELVFORKLARENDE_TILBEHØR) && (
          <>
            <Brødtekst>Begrunnelse ikke påkrevd for dette tilbehøret.</Brødtekst>
          </>
        )}

        {t.opplysninger?.map((opplysning) => {
          return (
            <List size="small" key={opplysning.ledetekst.nb}>
              <Etikett>{`${storForbokstavIOrd(opplysning.ledetekst.nb)}`}</Etikett>
              {opplysning.innhold.map((element, idx) => (
                <ListItem key={idx}>
                  <Brødtekst>
                    {element.forhåndsdefinertTekst ? element.forhåndsdefinertTekst.nb : element.fritekst}
                  </Brødtekst>
                </ListItem>
              ))}
            </List>
          )
        })}
      </VStack>
    </HjelpemiddelGrid>
  ))
}
