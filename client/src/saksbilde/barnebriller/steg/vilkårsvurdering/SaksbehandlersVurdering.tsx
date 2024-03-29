import styled from 'styled-components'

import { BodyShort, Detail, Heading, Label, Link, Panel } from '@navikt/ds-react'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { StepType, Vilkår } from '../../../../types/types.internal'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { SaksbehandlersVurderingForm } from './SaksbehandlersVurderingForm'
import { SaksbehandlersVurderingLesevisning } from './SaksbehandlersVurderingLesevisning'
import { grunnlagMetadata, metadataFor } from './vilkårMetada'

export function SaksbehandlersVurdering({
  sakId,
  lesevisning,
  vilkår,
  onSaved,
  onCanceled,
}: {
  sakId: string
  lesevisning: boolean
  vilkår: Vilkår
  onSaved: () => any
  onCanceled: () => any
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
          <Brødtekst>{metadataFor(vilkår.vilkårId)?.beskrivelse}</Brødtekst>
          <Avstand paddingTop={6} paddingBottom={4}>
            <Detail>VURDERINGEN ER BASERT PÅ:</Detail>
          </Avstand>
          {vilkår.manuellVurdering && (
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
              const transform = metadata?.transform
              const verdi = transform ? transform(grunnlag[grunnlagKey]) : grunnlag[grunnlagKey]

              return (
                <Avstand paddingBottom={4} key={grunnlagKey}>
                  <Label as="p" size="small">
                    {metadata?.etikett}
                  </Label>
                  <BodyShort as="p" size="small">
                    {verdi}
                  </BodyShort>
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
            <SaksbehandlersVurderingForm sakId={sakId} vilkår={vilkår} onSaved={onSaved} onCanceled={onCanceled} />
          )}
        </Container>
      </SaksbehandlersVurderingPanel>
    </Merknad>
  )
}

const RedigerGrunnlagLink = () => {
  const { setStep } = useManuellSaksbehandlingContext()
  return (
    <Avstand paddingTop={4}>
      <Detail>
        Hvis informasjonen som er lagt inn er feil, må du legge inn riktig informasjon under
        <Link href="#" onClick={() => setStep(StepType.REGISTRER)}>
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
