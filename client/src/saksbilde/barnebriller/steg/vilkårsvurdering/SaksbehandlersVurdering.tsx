import styled from 'styled-components'

import { Detail, Heading, Label, Link, Panel } from '@navikt/ds-react'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { StegType, Vilkår } from '../../../../types/types.internal'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { SaksbehandlersVurderingForm } from './SaksbehandlersVurderingForm'
import { SaksbehandlersVurderingLesevisning } from './SaksbehandlersVurderingLesevisning'
import { grunnlagMetadata, metadataFor } from './vilkårMetada'

export function SaksbehandlersVurdering({
  sakId,
  lesevisning,
  vilkår,
  onSaved,
}: {
  sakId: string
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
              {`${vilkår.lovReferanse}`}
            </Link>
          </Heading>
          <Brødtekst>{metadataFor(vilkår.identifikator)?.beskrivelse}</Brødtekst>
          <Avstand paddingTop={6} paddingBottom={4}>
            <Detail>VURDERINGEN ER BASERERT PÅ:</Detail>
          </Avstand>
          {vilkår.resultatSaksbehandler && (
            <>
              <Etikett>Saksbehandler sin vurdering</Etikett>
              <RedigerGrunnlagLink />
            </>
          )}
          {Object.keys(vilkår.grunnlag)
            .filter((grunnlagKey: string) => {
              return grunnlagMetadata.get(grunnlagKey) !== undefined
            })
            .map((grunnlagKey: string) => {
              const metadata = grunnlagMetadata.get(grunnlagKey)
              const verdi = grunnlag[grunnlagKey]

              return (
                <Avstand paddingBottom={4} key={grunnlagKey}>
                  <Label as="p" size="small">
                    {metadata?.etikett}
                  </Label>
                  <Label as="p" size="small">
                    {verdi}
                  </Label>
                  <Detail>{metadata?.beskrivelse}</Detail>
                  {metadata?.lagtInnAvSaksbehandler && (
                    <>
                      <Detail>Lagt inn av saksbehandler.</Detail>
                      <RedigerGrunnlagLink />
                    </>
                  )}
                </Avstand>
              )
            })}
          {lesevisning ? (
            <SaksbehandlersVurderingLesevisning sakId={sakId} vilkår={vilkår} />
          ) : (
            <SaksbehandlersVurderingForm sakId={sakId} vilkår={vilkår} onSaved={onSaved} />
          )}
        </Container>
      </SaksbehandlersVurderingPanel>
    </Merknad>
  )
}

const RedigerGrunnlagLink = () => {
  const { setValgtTab } = useManuellSaksbehandlingContext()
  return (
    <Avstand paddingTop={4}>
      <Detail>
        Hvis informasjonen som er lagt inn er feil, må du legge inn riktig informasjon under
        <Link href="#" onClick={() => setValgtTab(StegType.INNHENTE_FAKTA)}>
          Registrer søknad
        </Link>
      </Detail>
    </Avstand>
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
