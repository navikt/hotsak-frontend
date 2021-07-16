import styled from 'styled-components/macro'

import { Title, BodyShort } from '@navikt/ds-react'

import { capitalize } from '../utils/stringFormating'

import { RullestolIkon } from '../felleskomponenter/ikoner/RullestolIkon'
import { Hjelpemiddel } from '../types/types.internal'

const TittelIkon = styled(RullestolIkon)`
  padding-right: 0.5rem;
`
const Container = styled.div`
  padding-top: 1rem;
`

const HjelpemiddelContainer = styled.div`
  padding-top: 1rem;
  font-size: 1rem;
`

const Rad = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: 0.2rem;
`

interface KolonneProps {
  width?: string
}

const Kolonne = styled('div')<KolonneProps>`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  max-width: ${(props) => props.width || 'auto'};
`

const Strek = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--navds-color-gray-40);
`

const Bold = styled(BodyShort)`
  font-weight: bold;
`

const TilleggsInfo = styled(Rad)`
background-color: #FFF5E5;
padding: 0.3rem;
`

const Tilbehør = styled(Rad)`
padding: 0.3rem;
`

interface HjelpemidlerProps {
  hjelpemidler: Hjelpemiddel[]
  søknadGjelder: string
  funksjonsnedsettelse: string[]
}

export const Hjelpemidler: React.FC<HjelpemidlerProps> = ({ hjelpemidler, søknadGjelder, funksjonsnedsettelse }) => {
  return (
    <>
      <Title level="1" size="m" spacing={false}>
        <TittelIkon width={22} height={22} />
        {søknadGjelder}
      </Title>
      <BodyShort size="s" >{capitalize(funksjonsnedsettelse.join(', '))}</BodyShort>
      <Container>
        {hjelpemidler.map((hjelpemiddel) => {
          return (
            <HjelpemiddelContainer>
              <Rad>
                <Kolonne width="180px">
                  <Rad>
                    <Kolonne width="90px">Rangering: </Kolonne>
                    <Kolonne width="90px">{hjelpemiddel.rangering}</Kolonne>
                  </Rad>
                  <Rad>
                    <Kolonne>
                      <Bold size="s">Antall:</Bold>
                    </Kolonne>
                    <Kolonne> {hjelpemiddel.antall}</Kolonne>
                  </Rad>
                </Kolonne>
                <Kolonne>
                  <Rad>
                    <Bold size="s">{`${hjelpemiddel.hmsnr} ${hjelpemiddel.beskrivelse}`}</Bold>
                  </Rad>
                  <Rad>{hjelpemiddel.kategori}</Rad>
                  {hjelpemiddel.tilleggsinfo.length > 0 &&<TilleggsInfo >
                      {hjelpemiddel.tilleggsinfo.map(tilleggsinfo => {
                        return (
                            <Rad>
                            <Kolonne width="160px"><Bold size="s">{`${capitalize(tilleggsinfo.tittel)}:`}</Bold></Kolonne>
                            <Kolonne>{tilleggsinfo.innhold}</Kolonne>
                          </Rad>
                        )
                      })}
                    
                  </TilleggsInfo>}
                 
                </Kolonne>
              </Rad>
              <Strek />
            </HjelpemiddelContainer>
          )
        })}
      </Container>
    </>
  )
}
