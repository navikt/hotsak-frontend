import { Alert, Button, HelpText, HGrid, HGridProps, HStack, HStackProps, Loader, VStack } from '@navikt/ds-react'

import { Dokumenter } from '../../../../dokument/Dokumenter'
import { Feilmelding } from '../../../../felleskomponenter/feil/Feilmelding'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { SatsType, StegType, StepType, VilkårsResultat } from '../../../../types/types.internal'
import { formaterDato } from '../../../../utils/dato'
import { formaterBeløp, storForbokstavIAlleOrd } from '../../../../utils/formater'
import { useBarnebrillesak } from '../../../useBarnebrillesak'
import { useJournalposter } from '../../../useJournalposter'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { FormatertStyrke } from './FormatertStyrke'
import { useSakId } from '../../../useSak.ts'

export function RegistrerSøknadLesevisning() {
  const sakId = useSakId()
  const { sak, isLoading } = useBarnebrillesak()
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
      <div>
        <Feilmelding>{`Fant ikke sak med saksnummer ${sakId}`}</Feilmelding>
      </div>
    )
  }

  const { vilkårsgrunnlag, vilkårsvurdering } = sak.data

  return (
    <VStack gap="5">
      <div>
        <Dokumenter dokumenter={dokumenter} />
      </div>
      <div>
        <Etikett>Målform</Etikett>
        <Brødtekst>{storForbokstavIAlleOrd(vilkårsgrunnlag?.målform)}</Brødtekst>
      </div>
      <HGrid {...hGridProps}>
        <Etikett>Høyre sfære (SPH)</Etikett>
        <Etikett>Høyre sylinder (CYL)</Etikett>
        <Brødtekst>
          <FormatertStyrke verdi={vilkårsgrunnlag?.data?.brilleseddel?.høyreSfære} />
        </Brødtekst>
        <Brødtekst>
          <FormatertStyrke verdi={vilkårsgrunnlag?.data?.brilleseddel?.høyreSylinder} />
        </Brødtekst>
      </HGrid>
      <HGrid {...hGridProps}>
        <Etikett>Venstre sfære (SPH)</Etikett>
        <Etikett>Venstre sylinder (CYL)</Etikett>
        <Brødtekst>
          <FormatertStyrke verdi={vilkårsgrunnlag?.data?.brilleseddel?.venstreSfære} />
        </Brødtekst>
        <Brødtekst>
          <FormatertStyrke verdi={vilkårsgrunnlag?.data?.brilleseddel?.venstreSylinder} />
        </Brødtekst>
      </HGrid>
      {vilkårsvurdering && vilkårsgrunnlag?.data.brilleseddel && (
        <Alert variant="info" role="alert">
          <Brødtekst>
            {vilkårsvurdering?.data?.sats === SatsType.INGEN
              ? 'Vilkår om brillestyrke og/eller sylinderstyrke er ikke oppfylt'
              : `Brillestyrke gir sats ${vilkårsvurdering?.data?.sats.replace(
                  'SATS_',
                  ''
                )} - inntil ${formaterBeløp(vilkårsvurdering?.data?.satsBeløp)} kroner. `}
          </Brødtekst>
          {Number(vilkårsvurdering?.data?.beløp) < Number(vilkårsvurdering?.data?.satsBeløp) && (
            <Brødtekst>
              {`Basert på brilleprisen, kan barnet få `}
              <strong>{`${formaterBeløp(vilkårsvurdering?.data?.beløp)} kr i støtte`}</strong>{' '}
            </Brødtekst>
          )}
        </Alert>
      )}
      <div>
        <Etikett>Brillens bestillingsdato</Etikett>
        <Brødtekst>{formaterDato(vilkårsgrunnlag?.data?.bestillingsdato?.toString() || '')}</Brødtekst>
      </div>
      <div>
        <HStack {...hStackProps}>
          <Etikett>Er det snakk om kjøp av briller? (§2)</Etikett>
          <HelpText>
            Det gis kun tilskudd til kjøp av brille. Briller som er del av et abonnement støttes ikke (§2).
          </HelpText>
        </HStack>
        <Brødtekst>
          {storForbokstavIAlleOrd(vilkårsgrunnlag?.data?.kjøptBrille?.vilkårOppfylt).replace('_', ' ')}
        </Brødtekst>
      </div>
      <div>
        <HStack {...hStackProps}>
          <Etikett>Pris på brillen</Etikett>
          <HelpText>
            Skal bare inkludere glass, slip av glass og innfatning, inkl moms, og brilletilpasning. Eventuell
            synsundersøkelse skal ikke inkluderes i prisen.
          </HelpText>
        </HStack>
        <Brødtekst>{vilkårsgrunnlag?.data?.brillepris || '-'}</Brødtekst>
      </div>
      <div>
        <HStack {...hStackProps}>
          <Etikett>Inneholder bestillingen glass? (§2)</Etikett>
          <HelpText>Bestillingen må inneholde glass, det gis ikke tilskudd til kun innfatning (§2)</HelpText>
        </HStack>
        <Brødtekst>
          {storForbokstavIAlleOrd(vilkårsgrunnlag?.data?.komplettBrille.vilkårOppfylt).replace('_', ' ')}
        </Brødtekst>
        {vilkårsgrunnlag?.data?.komplettBrille.vilkårOppfylt === VilkårsResultat.NEI && (
          <Brødtekst>{vilkårsgrunnlag?.data?.komplettBrille.begrunnelse}</Brødtekst>
        )}
      </div>
      <div>
        <HStack {...hStackProps}>
          <Etikett>Er brillen bestilt hos optiker? (§2)</Etikett>
          <HelpText>
            For at en virksomhet/nettbutikk skal kunne godkjennes, må det være optiker tilknyttet denne (§2).
          </HelpText>
        </HStack>
        <Brødtekst>
          {storForbokstavIAlleOrd(vilkårsgrunnlag?.data?.bestiltHosOptiker.vilkårOppfylt).replace('_', ' ')}
        </Brødtekst>
        {vilkårsgrunnlag?.data?.bestiltHosOptiker.vilkårOppfylt === VilkårsResultat.NEI && (
          <Brødtekst>{vilkårsgrunnlag?.data?.bestiltHosOptiker.begrunnelse}</Brødtekst>
        )}
      </div>
      {sak.data.steg !== StegType.INNHENTE_FAKTA && (
        <div>
          <Button
            variant="primary"
            size="small"
            onClick={() => {
              setStep(StepType.VILKÅR)
            }}
          >
            Neste
          </Button>
        </div>
      )}
    </VStack>
  )
}

const hGridProps: Pick<HGridProps, 'columns'> = { columns: '150px 150px' }
const hStackProps: Pick<HStackProps, 'wrap' | 'gap' | 'align'> = { wrap: false, gap: '2', align: 'center' }
