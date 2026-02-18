import { Alert, Button, HelpText, HGrid, HGridProps, HStack, HStackProps, Loader, VStack } from '@navikt/ds-react'

import { Dokumenter } from '../../../../dokument/Dokumenter'
import { Feilmelding } from '../../../../felleskomponenter/feil/Feilmelding'
import { Etikett, Tekst } from '../../../../felleskomponenter/typografi'
import { SatsType, StegType, StepType, VilkårsResultat } from '../../../../types/types.internal'
import { formaterDato } from '../../../../utils/dato'
import { formaterBeløp, storForbokstavIAlleOrd } from '../../../../utils/formater'
import { useBarnebrillesak } from '../../../useBarnebrillesak'
import { useJournalposter } from '../../../useJournalposter'
import { useSakId } from '../../../useSak.ts'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { FormatertStyrke } from './FormatertStyrke'

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
    <VStack gap="space-20">
      <div>
        <Dokumenter dokumenter={dokumenter} />
      </div>
      <div>
        <Etikett>Målform</Etikett>
        <Tekst>{storForbokstavIAlleOrd(vilkårsgrunnlag?.målform)}</Tekst>
      </div>
      <HGrid {...hGridProps}>
        <Etikett>Høyre sfære (SPH)</Etikett>
        <Etikett>Høyre sylinder (CYL)</Etikett>
        <Tekst>
          <FormatertStyrke verdi={vilkårsgrunnlag?.data?.brilleseddel?.høyreSfære} />
        </Tekst>
        <Tekst>
          <FormatertStyrke verdi={vilkårsgrunnlag?.data?.brilleseddel?.høyreSylinder} />
        </Tekst>
      </HGrid>
      <HGrid {...hGridProps}>
        <Etikett>Venstre sfære (SPH)</Etikett>
        <Etikett>Venstre sylinder (CYL)</Etikett>
        <Tekst>
          <FormatertStyrke verdi={vilkårsgrunnlag?.data?.brilleseddel?.venstreSfære} />
        </Tekst>
        <Tekst>
          <FormatertStyrke verdi={vilkårsgrunnlag?.data?.brilleseddel?.venstreSylinder} />
        </Tekst>
      </HGrid>
      {vilkårsvurdering && vilkårsgrunnlag?.data.brilleseddel && (
        <Alert variant="info" role="alert">
          <Tekst>
            {vilkårsvurdering?.data?.sats === SatsType.INGEN
              ? 'Vilkår om brillestyrke og/eller sylinderstyrke er ikke oppfylt'
              : `Brillestyrke gir sats ${vilkårsvurdering?.data?.sats.replace(
                  'SATS_',
                  ''
                )} - inntil ${formaterBeløp(vilkårsvurdering?.data?.satsBeløp)} kroner. `}
          </Tekst>
          {Number(vilkårsvurdering?.data?.beløp) < Number(vilkårsvurdering?.data?.satsBeløp) && (
            <Tekst>
              {`Basert på brilleprisen, kan barnet få `}
              <strong>{`${formaterBeløp(vilkårsvurdering?.data?.beløp)} kr i støtte`}</strong>{' '}
            </Tekst>
          )}
        </Alert>
      )}
      <div>
        <Etikett>Brillens bestillingsdato</Etikett>
        <Tekst>{formaterDato(vilkårsgrunnlag?.data?.bestillingsdato?.toString() || '')}</Tekst>
      </div>
      <div>
        <HStack {...hStackProps}>
          <Etikett>Er det snakk om kjøp av briller? (§2)</Etikett>
          <HelpText>
            Det gis kun tilskudd til kjøp av brille. Briller som er del av et abonnement støttes ikke (§2).
          </HelpText>
        </HStack>
        <Tekst>{storForbokstavIAlleOrd(vilkårsgrunnlag?.data?.kjøptBrille?.vilkårOppfylt).replace('_', ' ')}</Tekst>
      </div>
      <div>
        <HStack {...hStackProps}>
          <Etikett>Pris på brillen</Etikett>
          <HelpText>
            Skal bare inkludere glass, slip av glass og innfatning, inkl moms, og brilletilpasning. Eventuell
            synsundersøkelse skal ikke inkluderes i prisen.
          </HelpText>
        </HStack>
        <Tekst>{formaterBeløp(vilkårsgrunnlag?.data?.brillepris) || '-'}</Tekst>
      </div>
      <div>
        <HStack {...hStackProps}>
          <Etikett>Inneholder bestillingen glass? (§2)</Etikett>
          <HelpText>Bestillingen må inneholde glass, det gis ikke tilskudd til kun innfatning (§2)</HelpText>
        </HStack>
        <Tekst>{storForbokstavIAlleOrd(vilkårsgrunnlag?.data?.komplettBrille.vilkårOppfylt).replace('_', ' ')}</Tekst>
        {vilkårsgrunnlag?.data?.komplettBrille.vilkårOppfylt === VilkårsResultat.NEI && (
          <Tekst>{vilkårsgrunnlag?.data?.komplettBrille.begrunnelse}</Tekst>
        )}
      </div>
      <div>
        <HStack {...hStackProps}>
          <Etikett>Er brillen bestilt hos optiker? (§2)</Etikett>
          <HelpText>
            For at en virksomhet/nettbutikk skal kunne godkjennes, må det være optiker tilknyttet denne (§2).
          </HelpText>
        </HStack>
        <Tekst>
          {storForbokstavIAlleOrd(vilkårsgrunnlag?.data?.bestiltHosOptiker.vilkårOppfylt).replace('_', ' ')}
        </Tekst>
        {vilkårsgrunnlag?.data?.bestiltHosOptiker.vilkårOppfylt === VilkårsResultat.NEI && (
          <Tekst>{vilkårsgrunnlag?.data?.bestiltHosOptiker.begrunnelse}</Tekst>
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
