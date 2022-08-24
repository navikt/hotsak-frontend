import { useState } from 'react'

import { SaveFile } from '@navikt/ds-icons'
import { Button, Radio, RadioGroup, TextField } from '@navikt/ds-react'

import { Kolonne, Rad } from '../../felleskomponenter/Flex'
import { Strek } from '../../felleskomponenter/Strek'
import { Etikett } from '../../felleskomponenter/typografi'
import {
  EndreHjelpemiddelRequest,
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
} from '../../types/types.internal'
import { useGrunndata } from './grunndataHook'

interface EndreHjelpemiddelProps {
  hmsnr: string
  onLagre: (endreHjelpemiddel: EndreHjelpemiddelRequest) => void // Todo, fix type
  onAvbryt: () => void
}

const EtikettKolonne: React.FC = ({ children }) => {
  return <Kolonne width="150px">{children}</Kolonne>
}

export const EndreHjelpemiddel: React.FC<EndreHjelpemiddelProps> = ({ hmsnr, onLagre, onAvbryt }) => {
  const [endreBegrunnelse, setEndreBegrunnelse] = useState<EndretHjelpemiddelBegrunnelse | undefined>(undefined)
  const [endreBegrunnelseFritekst, setEndreBegrunnelseFritekst] = useState('')
  const [endreProduktHmsnr, setEndreProduktHmsnr] = useState('')

  const endretProdukt = useGrunndata(endreProduktHmsnr)

  return (
    <div style={{ background: '#F1F1F1', paddingBottom: '1rem' }}>
      <Strek />
      <Rad>
        <EtikettKolonne></EtikettKolonne>
        <Kolonne>
          <Rad>
            <Etikett>Endre hjelpemiddel</Etikett>
          </Rad>
          <Rad>Her kan du erstatte hjelpemiddelet begrunner har lagt inn med et tilsvarende produkt.</Rad>
          <Rad style={{ marginTop: '1rem' }}>
            <Kolonne style={{ width: '10rem', maxWidth: '10rem' }}>
              <Rad style={{ width: '8rem' }}>
                <TextField
                  label="Oppgi HMS-nr"
                  size="small"
                  maxLength={6}
                  onChange={(event) => {
                    setEndreProduktHmsnr(event.target.value)
                  }}
                  value={endreProduktHmsnr}
                />
              </Rad>
            </Kolonne>
            <Kolonne>
              <Rad>
                <Etikett>Beskrivelse</Etikett>
              </Rad>
              <Rad style={{ flexGrow: '1', alignContent: 'center' }}>{endretProdukt?.artikkelnavn ?? ''}</Rad>
            </Kolonne>
          </Rad>
          <Rad style={{ marginTop: '1rem' }}>
            <RadioGroup
              size="small"
              legend="Begrunnelse for å endre hjelpemiddel:"
              onChange={(val) => setEndreBegrunnelse(val)}
              value={endreBegrunnelse ?? ''}
            >
              <Radio value={EndretHjelpemiddelBegrunnelse.RAMMEAVTALE}>
                {EndretHjelpemiddelBegrunnelseLabel.get(EndretHjelpemiddelBegrunnelse.RAMMEAVTALE)}
              </Radio>
              <Radio value={EndretHjelpemiddelBegrunnelse.GJENBRUK}>
                {EndretHjelpemiddelBegrunnelseLabel.get(EndretHjelpemiddelBegrunnelse.GJENBRUK)}
              </Radio>
              <Radio value={EndretHjelpemiddelBegrunnelse.ANNET}>
                {EndretHjelpemiddelBegrunnelseLabel.get(EndretHjelpemiddelBegrunnelse.ANNET)} (begrunn)
              </Radio>
            </RadioGroup>
          </Rad>
          {endreBegrunnelse == EndretHjelpemiddelBegrunnelse.ANNET && (
            <Rad style={{ marginTop: '1rem', paddingRight: '1rem', maxWidth: '36rem' }}>
              <TextField
                label="Begrunn endringen"
                size="small"
                description="Begrunnelsen lagres som en del av sakshistorikken. Svarene kan også blir brukt i videreutvikling av løsningen."
                value={endreBegrunnelseFritekst}
                onChange={(event) => setEndreBegrunnelseFritekst(event.target.value)}
              />
            </Rad>
          )}
          <Rad style={{ marginTop: '1rem' }}>
            <Button
              variant="secondary"
              size="small"
              style={{ marginRight: '1rem' }}
              onClick={() => {
                if (endretProdukt != null && endreBegrunnelse) {
                  onLagre({
                    hmsnr: hmsnr,
                    endretHmsnr: endretProdukt?.hmsnr,
                    endretBeskrivelse: endretProdukt?.artikkelnavn,
                    begrunnelse: endreBegrunnelse,
                    begrunnelseFritekst: endreBegrunnelseFritekst,
                  })
                  //setVisEndreProdukt(false)
                }
              }}
            >
              <SaveFile />
              Lagre
            </Button>
            <Button variant="tertiary" size="small" onClick={() => onAvbryt()}>
              Avbryt
            </Button>
          </Rad>
        </Kolonne>
      </Rad>
    </div>
  )
}
