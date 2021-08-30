import { Formidler } from '../types/types.internal'
import { BodyShort, Title } from '@navikt/ds-react'
import { capitalize, capitalizeName } from '../utils/stringFormating'
import styled from 'styled-components/macro'
import { Personikon } from '../felleskomponenter/ikoner/Personikon'


interface FormidlerProps {
  formidler: Formidler
}

const TittelIkon = styled(Personikon)`
  padding-right: 0.5rem;
`

const Container = styled.div`
  padding-top: 1rem;
  font-size: 1rem;
`

const Strek = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--navds-color-gray-40);
`

const Label = styled(BodyShort)`
  font-weight: bold;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: 12rem auto;
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.125rem;
`

export const Formidlerside: React.FC<FormidlerProps> = ({ formidler }) => {
  return (
    <>
      <Title level='1' size='m' spacing={false}>
        <TittelIkon width={22} height={22} />
        Formidler og opplæringsansvarlig
      </Title>
      <Container>
        <Grid>
          <Label>Navn</Label>
          <BodyShort>
            {capitalizeName(
              formidler.navn
            )}
          </BodyShort>
          <Label>Arbeidssted</Label>
          <BodyShort>{`${capitalize(formidler.arbeidssted)}`}</BodyShort>
          <Label>Stilling</Label>
          <BodyShort>{`${capitalize(formidler.stilling)}`}</BodyShort>
          <Label>Postadresse</Label>
          <BodyShort>{`${capitalize(formidler.postadresse)}`}</BodyShort>
          <Label>Telefon</Label>
          <BodyShort>{formidler.telefon}</BodyShort>
          <Label>Treffest enklest</Label>
          <BodyShort>{capitalize(formidler.treffestEnklest)}</BodyShort>
          <Label>E-postadresse</Label>
          <BodyShort>{capitalize(formidler.epost)}</BodyShort>
        </Grid>
      </Container>
      <Strek />
    </>
  )

}
