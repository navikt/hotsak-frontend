import styled from 'styled-components'

import { Detail, Heading, Link, Panel } from '@navikt/ds-react'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { Vilkår } from '../../../../types/types.internal'
import { SaksbehandlersVurderingForm } from './SaksbehandlersVurderingForm'
import { SaksbehandlersVurderingLesevisning } from './SaksbehandlersVurderingLesevisning'
import { grunnlagMetadata, metadataFor } from './vilkårMetada'

export function SaksbehandlersVurdering({
  sakID,
  lesevisning,
  vilkår,
  onSaved,
}: {
  sakID: string
  lesevisning: boolean
  vilkår: Vilkår
  onSaved: () => any
}) {
  const grunnlag = vilkår.grunnlag

  return (
    <Merknad>
      <SaksbehandlersVurderingPanel>
        <Container>
          <Heading level="2" size="xsmall" spacing>
            <Link href={vilkår.lovdataLenke} target="_blank">
              {`${vilkår.lovReferanse} ${vilkår.beskrivelse}`}
            </Link>
          </Heading>
          <Brødtekst>{metadataFor(vilkår.identifikator)?.beskrivelse}</Brødtekst>
          <Avstand paddingTop={6} paddingBottom={4}>
            <Detail>VURDERINGEN BASERER SEG PÅ:</Detail>
          </Avstand>
          {vilkår.resultatSaksbehandler && <Etikett>Saksbehandler sin vurdering</Etikett>}

          {Object.keys(vilkår.grunnlag).map((grunnlagKey: string) => {
            const metadata = grunnlagMetadata.get(grunnlagKey) || {
              etikett: grunnlagKey,
              beskrivelse: '',
            }
            const verdi = grunnlag[grunnlagKey]

            return (
              <Avstand paddingBottom={4} key={grunnlagKey}>
                <Etikett>{`${metadata?.etikett}: ${verdi}`}</Etikett>
                <Detail>{metadata?.beskrivelse}</Detail>
              </Avstand>
            )
          })}

          {lesevisning ? (
            <SaksbehandlersVurderingLesevisning sakID={sakID} vilkår={vilkår} />
          ) : (
            <SaksbehandlersVurderingForm sakID={sakID} vilkår={vilkår} onSaved={onSaved} />
          )}
        </Container>
      </SaksbehandlersVurderingPanel>
    </Merknad>
  )
}

const Merknad = styled.div`
  position: relative;

  &:before {
    content: '';
    position: absolute;
    background-color: var(--a-border-info);
    width: 6px;
    height: 100%;
    bottom: 0;
  }
`

const SaksbehandlersVurderingPanel = styled(Panel)`
  align-items: left;
  background-color: var(--a-gray-100);
`

const Container = styled.div`
  width: 500px;
`
