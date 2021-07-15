import styled from 'styled-components/macro'

import { Bosituasjon, Bruksarena } from '../../types/types.internal'
import { SøknadCard } from './SøknadCard'

//import { ArbeidsgiverCard } from './ArbeidsgiverCard';
//import { PeriodeCard } from './PeriodeCard';
//import { UtbetalingCard } from './UtbetalingCard';
//import { VilkårCard } from './VilkårCard';
//import { Utbetaling } from './utbetaling/Utbetaling';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: var(--speil-venstremeny-width);
  min-width: 19.5rem;
  padding: 2rem 1.5rem;
  border-right: 1px solid var(--navds-color-border);
`

interface VenstreMenyProps {
  søknadGjelder: string
  saksnr: string
  motattDato: string
  bruksarena: Bruksarena
  funksjonsnedsettelse: string[]
  bosituasjon: Bosituasjon
}

export const VenstreMeny = ({
  søknadGjelder,
  saksnr,
  motattDato,
  bruksarena,
  funksjonsnedsettelse,
  bosituasjon,
}: VenstreMenyProps) => {
  return (
    <Container>
      <SøknadCard
        søknadGjelder={søknadGjelder}
        saksnr={saksnr} 
        motattDato={motattDato}
        bruksarena={bruksarena}
        funksjonsnedsettelse={funksjonsnedsettelse}
        bosituasjon={bosituasjon}
      />
      {/*<PeriodeCard
                aktivPeriode={aktivPeriode}
                maksdato={maksdato?.format(NORSK_DATOFORMAT_KORT) ?? 'Ukjent maksdato'}
                skjæringstidspunkt={skjæringstidspunkt?.format(NORSK_DATOFORMAT) ?? 'Ukjent skjæringstidspunkt'}
                gjenståendeDager={gjenståendeDager}
                over67år={over67År}
            />
            <ArbeidsgiverCard
                arbeidsgivernavn={arbeidsgivernavn}
                organisasjonsnummer={organisasjonsnummer}
                arbeidsforhold={arbeidsforhold}
                anonymiseringEnabled={anonymiseringEnabled}
                månedsbeløp={månedsbeløp}
            />
            <VilkårCard aktivPeriode={aktivPeriode} />
            <UtbetalingCard
                beregningId={aktivPeriode.beregningId}
                ikkeUtbetaltEnda={ikkeUtbetaltEnda}
                utbetalingsdagerTotalt={utbetalingsdagerTotalt}
                nettobeløp={nettobeløp}
                simulering={simulering}
                anonymiseringEnabled={anonymiseringEnabled}
            />
            <Utbetaling aktivPeriode={aktivPeriode} />*/}
    </Container>
  )
}
