import { HStack, List, VStack } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'
import { BrytbarBrødtekst, Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { FritakFraBegrunnelseÅrsak, Tilbehør as Tilbehørtype } from '../../types/BehovsmeldingTypes'
import { storForbokstavIOrd } from '../../utils/formater'
import { HjelpemiddelGrid } from './HjelpemiddelGrid'

export function TilbehørListe({
  tilbehør,
  frittståendeTilbehør = false,
}: {
  tilbehør: Tilbehørtype[]
  frittståendeTilbehør?: boolean
}) {
  return tilbehør.map((t, idx) => (
    <HjelpemiddelGrid key={idx}>
      <VStack gap="1">
        <HStack gap="1" align="start" wrap={false}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tekst weight="semibold">{t.hmsArtNr}</Tekst>
            <Kopiknapp tooltip="Kopier hmsnr" copyText={t.hmsArtNr} />
          </div>
          <div style={{ paddingTop: '0.25rem' }}>
            <BrytbarBrødtekst>{t.navn}</BrytbarBrødtekst>
          </div>
        </HStack>
        {!frittståendeTilbehør && <Begrunnelse tilbehør={t} />}
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
      <div style={{ paddingTop: 5 }}>{t.antall} stk</div>
    </HjelpemiddelGrid>
  ))
}

function Begrunnelse({ tilbehør }: { tilbehør: Tilbehørtype }) {
  return (
    <>
      {tilbehør.begrunnelse && (
        <>
          <Etikett>Begrunnelse</Etikett>
          <Brødtekst>{tilbehør.begrunnelse}</Brødtekst>
        </>
      )}

      {tilbehør.fritakFraBegrunnelseÅrsak === FritakFraBegrunnelseÅrsak.ER_PÅ_BESTILLINGSORDNING ||
        (tilbehør.fritakFraBegrunnelseÅrsak === FritakFraBegrunnelseÅrsak.ER_SELVFORKLARENDE_TILBEHØR && (
          <Brødtekst>Begrunnelse ikke påkrevd for dette tilbehøret.</Brødtekst>
        ))}
    </>
  )
}
