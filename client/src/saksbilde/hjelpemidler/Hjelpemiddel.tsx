import React, { useState } from 'react'
import styled from 'styled-components'

import { Collapse, Expand, People, PeopleFilled, SaveFile } from '@navikt/ds-icons'
import { Button, Link, Radio, RadioGroup, TextField } from '@navikt/ds-react'

import { capitalize } from '../../utils/stringFormating'

import { Rad, Kolonne } from '../../felleskomponenter/Flex'
import { Strek } from '../../felleskomponenter/Strek'
import { Kvinneikon } from '../../felleskomponenter/ikoner/Kvinneikon'
import { Personikon } from '../../felleskomponenter/ikoner/Personikon'
import { PersonikonFilled } from '../../felleskomponenter/ikoner/PersonikonFilled'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { HjelpemiddelType, Personinfo, Produkt } from '../../types/types.internal'
import { Utlevert } from './Utlevert'
import { useGrunndata } from './grunndataHook'

const HjelpemiddelContainer = styled.div`
  font-size: 1rem;
`

const HMSLenke = styled(Link)`
  padding-left: 0.5rem;
`
const HMSTekst = styled.span`
  padding-left: 0.5rem;
`

const Rangering = styled('div')<RangeringProps>`
  display: flex;

  > p.navds-body-short:last-child {
    min-width: 24px;
    min-height: 24px;
    text-align: center;
    margin-left: 0.5rem;
    padding: 1px;
    border-radius: 50%;
    background-color: ${(props) =>
      Number(props.rank) === 1 ? 'var(--navds-global-color-gray-200)' : 'var(--navds-global-color-orange-400)'};
    color: inherit;
    font-weight: inherit;
  }
`

const TilleggsInfo = styled(Rad)`
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    background-color: var(--navds-semantic-color-feedback-info-border);
    width: 3px;
    height: 95%;
    bottom: 0;
    left: -1rem;
  }
`

const EtikettKolonne: React.FC = ({ children }) => {
  return <Kolonne width="150px">{children}</Kolonne>
}

interface RangeringProps {
  rank?: number
}

interface HjelpemiddelProps {
  hjelpemiddel: HjelpemiddelType
  personinformasjon: Personinfo
  forenkletVisning: boolean
}

export const Hjelpemiddel: React.FC<HjelpemiddelProps> = ({ hjelpemiddel, personinformasjon, forenkletVisning }) => {
  const [visEndreProdukt, setVisEndreProdukt] = useState(false)
  const [endreBegrunnelse, setEndreBegrunnelse] = useState('')
  const [endreBegrunnelseFritekst, setEndreBegrunnelseFritekst] = useState('')
  const [endreProduktHmsnr, setEndreProduktHmsnr] = useState('')

  const [isProduktendringLagret, setIsProduktendringLagret] = useState(false)
  const [lagretProduktendringBegrunnelse, setLagretProduktendringBegrunnelse] = useState('')
  const [lagretEndreProdukt, setLagretEndreProdukt] = useState<Produkt | null>(null)

  const produkt = useGrunndata(hjelpemiddel.hmsnr)
  const endreProdukt = useGrunndata(endreProduktHmsnr)

  return (
    <HjelpemiddelContainer key={hjelpemiddel.hmsnr}>
      <Rad>
        <EtikettKolonne>
          <Rad>
            {!forenkletVisning && (
              <Rangering rank={hjelpemiddel.rangering}>
                <Tekst>Rangering:</Tekst>
                <Tekst>{hjelpemiddel.rangering}</Tekst>
              </Rangering>
            )}
          </Rad>
          <Rad>{hjelpemiddel.antall} stk</Rad>
        </EtikettKolonne>
        <Kolonne>
          <Rad>
            <Kolonne>
              <Etikett>{produkt ? produkt?.isotittel : hjelpemiddel.kategori}</Etikett>
            </Kolonne>
          </Rad>
          <Rad>{produkt && produkt.posttittel}</Rad>
          {isProduktendringLagret && lagretEndreProdukt && (
            <Rad>
              <strong>{lagretEndreProdukt.hmsnr}</strong>
              <HMSLenke href={lagretEndreProdukt.artikkelurl} target="_blank">
                {lagretEndreProdukt.artikkelnavn}
              </HMSLenke>
            </Rad>
          )}
          <Rad>
            <strong style={{ textDecoration: isProduktendringLagret ? 'line-through' : '' }}>
              {hjelpemiddel.hmsnr}
            </strong>
            {produkt ? (
              <HMSLenke href={produkt.artikkelurl} target="_blank">
                <div style={{ textDecoration: isProduktendringLagret ? 'line-through' : '' }}>
                  {hjelpemiddel.beskrivelse}
                </div>
              </HMSLenke>
            ) : (
              <HMSTekst>{hjelpemiddel.beskrivelse}</HMSTekst>
            )}
          </Rad>
          {isProduktendringLagret && (
            <Rad style={{ marginTop: '.5rem' }}>
              <div style={{ marginRight: '.5rem', marginTop: '.25rem' }}>
                <PersonikonFilled width={22} height={22} />
              </div>
              <div>
                <Rad>
                  <strong>Byttet ut av saksbehandler, begrunnelse:</strong>
                </Rad>
                <Rad>{`"${lagretProduktendringBegrunnelse}"`}</Rad>
              </div>
            </Rad>
          )}
          <Rad>
            {hjelpemiddel.tilleggsinfo.length > 0 && (
              <TilleggsInfo>
                {hjelpemiddel.tilleggsinfo.map((tilleggsinfo) => {
                  return (
                    <React.Fragment key={tilleggsinfo.tittel}>
                      <Rad>
                        <Etikett>{`${capitalize(tilleggsinfo.tittel)}:`}</Etikett>
                      </Rad>
                      <Rad>
                        <Kolonne width="700px">
                          {tilleggsinfo.innholdsliste.map((element) => (
                            <Rad key={element}>{element}</Rad>
                          ))}
                        </Kolonne>
                      </Rad>
                    </React.Fragment>
                  )
                })}
                {hjelpemiddel.kategori.includes('rullestol') && personinformasjon.kroppsmål && (
                  <>
                    <Rad>
                      <Etikett>Kroppsmål:</Etikett>
                    </Rad>
                    <Rad>
                      <Kolonne width="700px">{`Setebredde ${personinformasjon.kroppsmål.setebredde} cm, legglengde ${personinformasjon.kroppsmål.legglengde} cm, lårlengde ${personinformasjon.kroppsmål.lårlengde} cm, høyde ${personinformasjon.kroppsmål.høyde} cm, kroppsvekt ${personinformasjon.kroppsmål.kroppsvekt} kg.`}</Kolonne>
                    </Rad>
                  </>
                )}
              </TilleggsInfo>
            )}
          </Rad>
          <Rad>
            {hjelpemiddel.alleredeUtlevert && (
              <Rad>
                <Etikett>Utlevert:</Etikett>
                <Utlevert alleredeUtlevert={hjelpemiddel.alleredeUtlevert} utlevertInfo={hjelpemiddel.utlevertInfo} />
              </Rad>
            )}
          </Rad>
        </Kolonne>
        <Rad>
          <Rad>
            {hjelpemiddel.tilbehør.length > 0 && (
              <>
                <EtikettKolonne />
                <Kolonne>
                  <Etikett>Tilbehør:</Etikett>
                </Kolonne>
                <Rad>
                  {hjelpemiddel.tilbehør.map((tilbehør) => (
                    <Rad key={tilbehør.hmsNr}>
                      <EtikettKolonne>{tilbehør.antall} stk</EtikettKolonne>
                      <Kolonne>
                        {tilbehør.hmsNr} {tilbehør.navn}
                      </Kolonne>
                    </Rad>
                  ))}
                </Rad>
              </>
            )}
          </Rad>
        </Rad>
        {forenkletVisning && visEndreProdukt && (
          <Rad style={{ justifyContent: 'flex-end' }}>
            <Button variant="tertiary" size="small" onClick={() => setVisEndreProdukt(false)}>
              Avbryt
              <Collapse />
            </Button>
          </Rad>
        )}
        {forenkletVisning && !visEndreProdukt && (
          <Rad style={{ justifyContent: 'flex-end' }}>
            <Button variant="tertiary" size="small" onClick={() => setVisEndreProdukt(true)}>
              Endre
              <Expand />
            </Button>
          </Rad>
        )}
      </Rad>
      {forenkletVisning && visEndreProdukt ? (
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
                      onChange={(event) => setEndreProduktHmsnr(event.target.value)}
                      value={endreProduktHmsnr}
                    />
                  </Rad>
                </Kolonne>
                <Kolonne>
                  <Rad>
                    <Etikett>Beskrivelse</Etikett>
                  </Rad>
                  <Rad style={{ flexGrow: '1', alignContent: 'center' }}>{endreProdukt?.artikkelnavn ?? ''}</Rad>
                </Kolonne>
              </Rad>
              <Rad style={{ marginTop: '1rem' }}>
                <RadioGroup
                  size="small"
                  legend="Begrunnelse for å endre hjelpemiddel:"
                  onChange={(val) => setEndreBegrunnelse(val)}
                  value={endreBegrunnelse}
                >
                  <Radio value="Endring i rammeavtale">Endring i rammeavtale</Radio>
                  <Radio value="Gjenbruk">Gjenbruk</Radio>
                  <Radio value="ANNET">Annet (begrunn)</Radio>
                </RadioGroup>
              </Rad>
              {endreBegrunnelse == 'ANNET' && (
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
                    if (endreProdukt != null && endreBegrunnelse) {
                      setIsProduktendringLagret(true)
                      setVisEndreProdukt(false)
                      setLagretProduktendringBegrunnelse(
                        endreBegrunnelse === 'ANNET' ? endreBegrunnelseFritekst : endreBegrunnelse
                      )
                      setLagretEndreProdukt(endreProdukt)
                    }
                  }}
                >
                  <SaveFile />
                  Lagre
                </Button>
                <Button variant="tertiary" size="small" onClick={() => setVisEndreProdukt(false)}>
                  Avbryt
                </Button>
              </Rad>
            </Kolonne>
          </Rad>
        </div>
      ) : (
        <Strek />
      )}
    </HjelpemiddelContainer>
  )
}
