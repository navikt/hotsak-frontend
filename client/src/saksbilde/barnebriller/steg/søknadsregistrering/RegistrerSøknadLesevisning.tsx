import { useParams } from 'react-router'
import styled from 'styled-components'

import { Alert, Button, Detail, Heading, Loader } from '@navikt/ds-react'

import { useDokument } from '../../../../oppgaveliste/dokumenter/dokumentHook'
import { Dokumenter } from '../../../../oppgaveliste/manuellJournalføring/Dokumenter'
import { formaterDato } from '../../../../utils/date'
import { capitalize } from '../../../../utils/stringFormating'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { ButtonContainer } from '../../../../felleskomponenter/Dialogboks'
import { Feilmelding } from '../../../../felleskomponenter/Feilmelding'
import { Kolonne, Rad } from '../../../../felleskomponenter/Flex'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { beløp } from '../../../../formaters/beløp'
import { StegType, VilkårSvar } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'

const Container = styled.div`
  overflow: auto;
  padding-top: var(--a-spacing-6);
`

export const RegistrerSøknadLesevisning: React.FC = () => {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { sak, isLoading, isError, mutate } = useBrillesak()
  const { journalpost, /*isError,*/ isLoading: henterJournalpost } = useDokument(sak?.journalposter[0])
  const { setValgtTab } = useManuellSaksbehandlingContext()

  if (isLoading || !journalpost) {
    return (
      <div>
        <Loader />
        Henter sak...
      </div>
    )
  }

  if (!sak) {
    return (
      <Feilmelding>
        <div>
          <Feilmelding>{`Fant ikke sak med saknummer ${saksnummer}`}</Feilmelding>
        </div>
      </Feilmelding>
    )
  }

  const { vilkårsgrunnlag, vilkårsvurdering } = sak

  return (
    <Container>
      <Heading level="1" size="xsmall" spacing>
        Registrer søknad
      </Heading>
      <Dokumenter journalpostID={journalpost.journalpostID} />
      <Avstand paddingTop={4} paddingLeft={2}>
        <Etikett>Målform</Etikett>
        <Brødtekst>{capitalize(vilkårsgrunnlag?.målform)}</Brødtekst>
        <Avstand paddingTop={4}>
          <Etikett>Bestillingsdato</Etikett>
          <Brødtekst>{formaterDato(vilkårsgrunnlag?.bestillingsdato.toString())}</Brødtekst>
        </Avstand>
        <Avstand paddingTop={4}>
          <Etikett>Pris på brillen</Etikett>
          <Brødtekst>{vilkårsgrunnlag?.brillepris}</Brødtekst>
          <Detail>
            Skal bare inkludere glass, slip av glass og innfatning, inkl moms, og brilletilpasning. Eventuell
            synsundersøkelse skal ikke inkluderes i prisen.
          </Detail>
        </Avstand>
        <Avstand paddingTop={10}>
          <Heading level="2" size="xsmall" spacing>
            § 2 Brillestyrke
          </Heading>

          <Detail>VENSTRE ØYE</Detail>
          <Rad>
            <Kolonne width="150px">
              <Etikett>Sfære (SPH)</Etikett>
            </Kolonne>
            <Kolonne width="150px">
              <Etikett>Sylinder (CYL)</Etikett>
            </Kolonne>
          </Rad>
          <Rad>
            <Kolonne width="150px">
              <Brødtekst>{vilkårsgrunnlag?.brilleseddel.venstreSfære}</Brødtekst>
            </Kolonne>
            <Kolonne width="150px">
              <Brødtekst>{`- ${vilkårsgrunnlag?.brilleseddel.venstreSylinder}`}</Brødtekst>
            </Kolonne>
          </Rad>
          <Avstand paddingBottom={4} />
          <Detail>HØYRE ØYE</Detail>
          <Rad>
            <Kolonne width="150px">
              <Etikett>Sfære (SPH)</Etikett>
            </Kolonne>
            <Kolonne width="150px">
              <Etikett>Sylinder (CYL)</Etikett>
            </Kolonne>
          </Rad>
          <Rad>
            <Kolonne width="150px">
              <Brødtekst>{vilkårsgrunnlag?.brilleseddel.høyreSfære}</Brødtekst>
            </Kolonne>
            <Kolonne width="150px">
              <Brødtekst>{`- ${vilkårsgrunnlag?.brilleseddel.høyreSylinder}`}</Brødtekst>
            </Kolonne>
          </Rad>
          <Avstand paddingTop={4} />
          <Alert variant="info" role="alert">
            <Brødtekst>
              {`Brillestyrke gir sats ${vilkårsvurdering?.sats.replace('SATS_', '')} - inntil ${beløp.formater(
                sak?.vilkårsvurdering?.satsBeløp
              )} kroner. `}
            </Brødtekst>
            {Number(vilkårsvurdering!.beløp) < Number(vilkårsvurdering!.satsBeløp) && (
              <Brødtekst>
                {`Basert på brilleprisen, kan barnet få `}
                <strong>{`${beløp.formater(vilkårsvurdering?.beløp)} kr i støtte`}</strong>{' '}
              </Brødtekst>
            )}
          </Alert>
        </Avstand>

        <Avstand paddingTop={6}>
          <Heading level="2" size="xsmall" spacing>
            § 2 Bestillingen må inneholde glass
          </Heading>
          <Brødtekst>Inneholder bestillingen glass?</Brødtekst>
          <Brødtekst>{capitalize(vilkårsgrunnlag?.komplettBrille.vilkårOppfylt)}</Brødtekst>
          {vilkårsgrunnlag?.komplettBrille.vilkårOppfylt === VilkårSvar.NEI && (
            <Brødtekst>{vilkårsgrunnlag?.komplettBrille.begrunnelse}</Brødtekst>
          )}
        </Avstand>

        <Avstand paddingTop={6}>
          <Heading level="2" size="xsmall" spacing>
            § 2 Brillen må være bestilt hos optiker
          </Heading>
          <Brødtekst>Er brillen bestilt hos optiker?</Brødtekst>
          <Brødtekst>{capitalize(vilkårsgrunnlag?.bestiltHosOptiker.vilkårOppfylt)}</Brødtekst>
          {vilkårsgrunnlag?.bestiltHosOptiker.vilkårOppfylt === VilkårSvar.NEI && (
            <Brødtekst>{vilkårsgrunnlag?.bestiltHosOptiker.begrunnelse}</Brødtekst>
          )}
        </Avstand>

        <Avstand paddingLeft={2}>
          <ButtonContainer>
            <Button variant="primary" size="small" onClick={() => setValgtTab(StegType.VURDERE_VILKÅR)}>
              Neste
            </Button>
          </ButtonContainer>
        </Avstand>
      </Avstand>
    </Container>
  )
}
