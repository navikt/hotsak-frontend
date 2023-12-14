import { useParams } from 'react-router'
import styled from 'styled-components'

import { Alert, Button, HStack, HelpText, Loader } from '@navikt/ds-react'

import { Dokumenter } from '../../../../oppgaveliste/manuellJournalføring/Dokumenter'
import { formaterDato } from '../../../../utils/date'
import { capitalize } from '../../../../utils/stringFormating'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../../felleskomponenter/Knappepanel'
import { Feilmelding } from '../../../../felleskomponenter/Feilmelding'
import { Kolonne, Rad } from '../../../../felleskomponenter/Flex'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { beløp } from '../../../../formaters/beløp'
import { StepType, VilkårsResultat } from '../../../../types/types.internal'
import { useJournalposter } from '../../../journalpostHook'
import { useBrillesak } from '../../../sakHook'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { FormatertStyrke } from './FormatertStyrke'

const Container = styled.div`
  overflow: auto;
`

export const RegistrerSøknadLesevisning: React.FC = () => {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { sak, isLoading } = useBrillesak()
  const { setStep } = useManuellSaksbehandlingContext()
  const { dokumenter } = useJournalposter()

  if (isLoading) {
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

  const { vilkårsgrunnlag, vilkårsvurdering } = sak.data

  return (
    <Container>
      <Avstand paddingTop={4} paddingBottom={2} />
      <Dokumenter dokumenter={dokumenter} />
      <Avstand paddingTop={10} paddingLeft={2}>
        <Etikett>Målform</Etikett>
        <Brødtekst>{capitalize(vilkårsgrunnlag?.målform)}</Brødtekst>

        <>
          <Avstand paddingTop={10}>
            <Rad>
              <Kolonne $width="150px">
                <Etikett>Høyre sfære (SPH)</Etikett>
              </Kolonne>
              <Kolonne $width="150px">
                <Etikett>Høyre sylinder (CYL)</Etikett>
              </Kolonne>
            </Rad>
            <Rad>
              <Kolonne $width="150px">
                <Brødtekst>
                  <FormatertStyrke verdi={vilkårsgrunnlag?.data?.brilleseddel?.høyreSfære} />
                </Brødtekst>
              </Kolonne>
              <Kolonne $width="150px">
                <Brødtekst>
                  <FormatertStyrke verdi={vilkårsgrunnlag?.data?.brilleseddel?.høyreSylinder} />
                </Brødtekst>
              </Kolonne>
            </Rad>
            <Avstand paddingBottom={8} />
            <Rad>
              <Kolonne $width="150px">
                <Etikett>Venstre sfære (SPH)</Etikett>
              </Kolonne>
              <Kolonne $width="150px">
                <Etikett>Venstre sylinder (CYL)</Etikett>
              </Kolonne>
            </Rad>
            <Rad>
              <Kolonne $width="150px">
                <Brødtekst>
                  <FormatertStyrke verdi={vilkårsgrunnlag?.data?.brilleseddel?.venstreSfære} />
                </Brødtekst>
              </Kolonne>
              <Kolonne $width="150px">
                <Brødtekst>
                  <FormatertStyrke verdi={vilkårsgrunnlag?.data?.brilleseddel?.venstreSylinder} />
                </Brødtekst>
              </Kolonne>
            </Rad>

            {vilkårsvurdering && vilkårsgrunnlag?.data.brilleseddel && (
              <>
                <Avstand paddingTop={2} />
                <Alert variant="info" role="alert">
                  <Brødtekst>
                    {`Brillestyrke gir sats ${vilkårsvurdering?.data?.sats.replace(
                      'SATS_',
                      ''
                    )} - inntil ${beløp.formater(vilkårsvurdering?.data?.satsBeløp)} kroner. `}
                  </Brødtekst>
                  {Number(vilkårsvurdering?.data?.beløp) < Number(vilkårsvurdering?.data?.satsBeløp) && (
                    <Brødtekst>
                      {`Basert på brilleprisen, kan barnet få `}
                      <strong>{`${beløp.formater(vilkårsvurdering?.data?.beløp)} kr i støtte`}</strong>{' '}
                    </Brødtekst>
                  )}
                </Alert>
              </>
            )}
          </Avstand>
          <Avstand paddingTop={10}>
            <Etikett>Brillens bestillingsdato</Etikett>
            <Brødtekst>{formaterDato(vilkårsgrunnlag?.data?.bestillingsdato?.toString() || '')}</Brødtekst>
          </Avstand>
          <Avstand paddingTop={10}>
            <HStack wrap={false} gap="2" align={'center'}>
              <Etikett>Pris på brillen</Etikett>
              <HelpText>
                Skal bare inkludere glass, slip av glass og innfatning, inkl moms, og brilletilpasning. Eventuell
                synsundersøkelse skal ikke inkluderes i prisen.
              </HelpText>
            </HStack>
            <Brødtekst>{vilkårsgrunnlag?.data?.brillepris}</Brødtekst>
          </Avstand>

          <Avstand paddingTop={10}>
            <HStack wrap={false} gap="2" align={'center'}>
              <Etikett>§2 Inneholder bestillingen glass?</Etikett>
              <HelpText>Bestillingen må inneholde glass, det gis ikke støtte til kun innfatning (§2)</HelpText>
            </HStack>
            <Brødtekst>{capitalize(vilkårsgrunnlag?.data?.komplettBrille.vilkårOppfylt).replace('_', ' ')}</Brødtekst>
            {vilkårsgrunnlag?.data?.komplettBrille.vilkårOppfylt === VilkårsResultat.NEI && (
              <Brødtekst>{vilkårsgrunnlag?.data?.komplettBrille.begrunnelse}</Brødtekst>
            )}
          </Avstand>

          <Avstand paddingTop={10}>
            <HStack wrap={false} gap="2" align={'center'}>
              <Etikett>§2 Er brillen bestilt hos optiker?</Etikett>
              <HelpText>
                For at en virksomhet/nettbutikk skal kunne godkjennes, må det være optiker tilknyttet denne (§2).
              </HelpText>
            </HStack>
            <Brødtekst>
              {capitalize(vilkårsgrunnlag?.data?.bestiltHosOptiker.vilkårOppfylt).replace('_', ' ')}
            </Brødtekst>
            {vilkårsgrunnlag?.data?.bestiltHosOptiker.vilkårOppfylt === VilkårsResultat.NEI && (
              <Brødtekst>{vilkårsgrunnlag?.data?.bestiltHosOptiker.begrunnelse}</Brødtekst>
            )}
          </Avstand>
        </>
        {
          <Avstand paddingLeft={2}>
            <Knappepanel>
              <Button
                variant="primary"
                size="small"
                onClick={() => {
                  setStep(StepType.VILKÅR)
                }}
              >
                Neste
              </Button>
            </Knappepanel>
          </Avstand>
        }
      </Avstand>
    </Container>
  )
}
