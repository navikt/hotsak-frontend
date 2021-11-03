import { BodyShort, Label, Detail } from '@navikt/ds-react'

export const Tekst: React.FC = ({ children }) => {
  return <BodyShort size="small">{children}</BodyShort>
}

export const Etikett: React.FC = ({ children }) => {
  return <Label size="small">{children}</Label>
}

export const Undertittel: React.FC = ({ children }) => {
  return <Detail size="small">{children}</Detail>
}
